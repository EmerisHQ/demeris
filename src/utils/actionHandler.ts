import { MsgSwapWithinBatch } from '@starport/tendermint-liquidity-js/gravity-devs/liquidity/tendermint.liquidity.v1beta1/module/types/tendermint/liquidity/v1beta1/tx';
import { bech32 } from 'bech32';
import Long from 'long';

import {
  GlobalDemerisActionTypes,
  GlobalDemerisGetterTypes,
  RootStoreType,
  TypedAPIStore,
  TypedUSERStore,
} from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import * as Actions from '@/types/actions';
import * as API from '@/types/api';
import { Balance, Balances, Denom, IbcInfo } from '@/types/api';
import { Amount, ChainAmount } from '@/types/base';
import { useStore } from '@/utils/useStore';

import {
  generateDenomHash,
  getChannel,
  getDenomHash,
  getOwnAddress,
  isNative,
  keyHashfromAddress,
  parseCoins,
} from './basic';

// Basic step-building blocks
export async function redeem({ amount, chain_name }: ChainAmount) {
  const apistore = useStore() as TypedAPIStore;
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: '0',
      },
      chain_name: '',
    },
  };

  if (isNative(amount.denom)) {
    // If NOT an IBC denom, nothing to do
    result.output = { amount, chain_name };
    return result;
  } else {
    // else we get the trace for this IBC denom
    let verifyTrace;
    try {
      verifyTrace =
        apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
          chain_name,
          hash: amount.denom.split('/')[1],
        }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
          {
            subscribe: false,
            params: {
              chain_name,
              hash: amount.denom.split('/')[1],
            },
          },
          { root: true },
        ));
    } catch (e) {
      throw new Error('Trace not verified');
    }
    // We have a verified trace we can follow. add redemption steps
    let i = 0;
    while (i < verifyTrace.trace.length - 1) {
      const hop = verifyTrace.trace[i];
      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: { amount: amount.amount, denom: getDenomHash(verifyTrace.path, verifyTrace.base_denom, i) },
          base_denom: await getBaseDenom(getDenomHash(verifyTrace.path, verifyTrace.base_denom, i), hop.chain_name),
          from_chain: hop.chain_name,
          to_chain: hop.counterparty_name,
          through: hop.channel,
        },
      });
      i++;
    }
    result.output = {
      amount: {
        amount: amount.amount,
        denom: verifyTrace.base_denom,
      },
      chain_name: verifyTrace.trace[verifyTrace.trace.length - 1].counterparty_name,
    };

    return result;
  }
}
export async function memoTransfer({
  amount,
  chain_name,
  destination_chain_name,
  to_address,
}: {
  amount: Amount;
  chain_name: string;
  destination_chain_name: string;
  to_address: string;
}) {
  const apistore = useStore() as TypedAPIStore;
  const result = {
    steps: [],
    mustAddFee: false,
    output: {
      amount: {
        denom: '',
        amount: '0',
      },
      chain_name: '',
    },
  };

  if (isNative(amount.denom)) {
    if (chain_name == destination_chain_name) {
      result.steps.push({
        name: 'transfer',
        status: 'pending',
        data: {
          amount,
          chain_name,
          to_address,
        },
      });
      return result;
    } else {
      if (apistore.getters[GlobalDemerisGetterTypes.API.isVerified]({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the destination_chain_name
        const primaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: chain_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: { chain_name: chain_name, destination_chain_name: destination_chain_name },
            },
            { root: true },
          ));
        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            chain_fee: await getFeeForChain(chain_name),
            to_chain: destination_chain_name,
            through: primaryChannel,
          },
        });
        result.steps.push({
          name: 'transfer',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: generateDenomHash(primaryChannel, amount.denom) },
            chain_name: destination_chain_name,
            to_address,
          },
        });
        return result;
      }
    }
  }
  let verifyTrace;
  try {
    verifyTrace =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
        { subscribe: false, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }

  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel =
      apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
        chain_name: chain_name,
        destination_chain_name: verifyTrace.trace[0].counterparty_name,
      }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
        {
          subscribe: true,
          params: {
            chain_name: chain_name,
            destination_chain_name: verifyTrace.trace[0].counterparty_name,
          },
        },
        { root: true },
      ));
    if (primaryChannel == getChannel(verifyTrace.path, 0)) {
      result.steps.push({
        name: 'transfer',
        status: 'pending',
        data: {
          amount,
          chain_name,
          to_address,
        },
      });
      return result;
    } else {
      result.mustAddFee = true;

      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        addFee: true,
        feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
        data: {
          amount: amount,
          from_chain: chain_name,
          base_denom: await getBaseDenom(amount.denom, chain_name),
          to_chain: verifyTrace.trace[0].counterparty_name,
          through: verifyTrace.trace[0].channel,
        },
      });
      result.steps.push({
        name: 'ibc_forward',
        status: 'pending',
        data: {
          amount: { amount: amount.amount, denom: verifyTrace.base_denom },
          from_chain: verifyTrace.trace[0].counterparty_name,
          chain_fee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          to_chain: destination_chain_name,
          through: primaryChannel,
        },
      });

      result.steps.push({
        name: 'transfer',
        status: 'pending',
        data: {
          amount: { amount: amount.amount, denom: generateDenomHash(primaryChannel, verifyTrace.base_denom) },
          chain_name: destination_chain_name,
          to_address,
        },
      });
      return result;
    }
  } else {
    if (verifyTrace.trace.length > 1) {
      // If trace is longer than 1-hop, throw error because user must redeem the denom first (should never reach this part of the code
      // as the UI should not allow selection of such a token but leaving it here for consistency)
      throw new Error('Denom must be redeemed first');
    } else {
      if (verifyTrace.trace[0].counterparty_name == destination_chain_name) {
        result.steps.push({
          name: 'ibc_backward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            base_denom: await getBaseDenom(amount.denom, chain_name),
            to_chain: verifyTrace.trace[0].counterparty_name,
            through: verifyTrace.trace[0].channel,
          },
        });
        result.steps.push({
          name: 'transfer',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: await getBaseDenom(amount.denom, chain_name) },
            chain_name: verifyTrace.trace[0].counterparty_name,
            to_address,
          },
        });
      } else {
        result.mustAddFee = true;
        result.steps.push({
          name: 'ibc_backward',
          status: 'pending',
          feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          addFee: true,
          data: {
            amount: amount,
            from_chain: chain_name,
            base_denom: await getBaseDenom(amount.denom, chain_name),
            to_chain: verifyTrace.trace[0].counterparty_name,
            through: verifyTrace.trace[0].channel,
          },
        });
      }
      if (verifyTrace.trace[0].counterparty_name != destination_chain_name) {
        const primaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: verifyTrace.trace[0].counterparty_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: {
                chain_name: verifyTrace.trace[0].counterparty_name,
                destination_chain_name: destination_chain_name,
              },
            },
            { root: true },
          ));
        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: verifyTrace.base_denom },
            from_chain: verifyTrace.trace[0].counterparty_name,
            chain_fee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
            to_chain: destination_chain_name,
            through: primaryChannel,
          },
        });

        result.steps.push({
          name: 'transfer',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: generateDenomHash(primaryChannel, verifyTrace.base_denom) },
            chain_name: destination_chain_name,
            to_address,
          },
        });
      }

      return result;
    }
  }
}
export async function transfer({
  amount,
  chain_name,
  destination_chain_name,
  to_address,
}: {
  amount: Amount;
  chain_name: string;
  destination_chain_name: string;
  to_address: string;
}) {
  const apistore = useStore() as TypedAPIStore;
  const result = {
    steps: [],
    mustAddFee: false,
    output: {
      amount: {
        denom: '',
        amount: '0',
      },
      chain_name: '',
    },
  };

  if (isNative(amount.denom)) {
    if (chain_name == destination_chain_name) {
      result.steps.push({
        name: 'transfer',
        status: 'pending',
        data: {
          amount,
          chain_name,
          to_address,
        },
      });
      return result;
    } else {
      if (apistore.getters[GlobalDemerisGetterTypes.API.isVerified]({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the destination_chain_name
        const primaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: chain_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: { chain_name: chain_name, destination_chain_name: destination_chain_name },
            },
            { root: true },
          ));
        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            chain_fee: await getFeeForChain(chain_name),
            to_chain: destination_chain_name,
            to_address,
            through: primaryChannel,
          },
        });
        return result;
      }
    }
  }
  let verifyTrace;
  try {
    verifyTrace =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
        { subscribe: false, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }

  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel =
      apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
        chain_name: chain_name,
        destination_chain_name: verifyTrace.trace[0].counterparty_name,
      }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
        {
          subscribe: true,
          params: {
            chain_name: chain_name,
            destination_chain_name: verifyTrace.trace[0].counterparty_name,
          },
        },
        { root: true },
      ));
    if (primaryChannel == getChannel(verifyTrace.path, 0)) {
      result.steps.push({
        name: 'transfer',
        status: 'pending',
        data: {
          amount,
          chain_name,
          to_address,
        },
      });
      return result;
    } else {
      result.mustAddFee = true;

      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        addFee: true,
        feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
        data: {
          amount: amount,
          from_chain: chain_name,
          base_denom: await getBaseDenom(amount.denom, chain_name),
          to_chain: verifyTrace.trace[0].counterparty_name,
          through: verifyTrace.trace[0].channel,
        },
      });
      result.steps.push({
        name: 'ibc_forward',
        status: 'pending',
        data: {
          amount: { amount: amount.amount, denom: verifyTrace.base_denom },
          from_chain: verifyTrace.trace[0].counterparty_name,
          chain_fee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          to_chain: destination_chain_name,
          to_address,
          through: primaryChannel,
        },
      });
      return result;
    }
  } else {
    if (verifyTrace.trace.length > 1) {
      // If trace is longer than 1-hop, throw error because user must redeem the denom first (should never reach this part of the code
      // as the UI should not allow selection of such a token but leaving it here for consistency)
      throw new Error('Denom must be redeemed first');
    } else {
      if (verifyTrace.trace[0].counterparty_name == destination_chain_name) {
        result.steps.push({
          name: 'ibc_backward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            base_denom: await getBaseDenom(amount.denom, chain_name),
            to_chain: verifyTrace.trace[0].counterparty_name,
            to_address,
            through: verifyTrace.trace[0].channel,
          },
        });
      } else {
        result.mustAddFee = true;
        result.steps.push({
          name: 'ibc_backward',
          status: 'pending',
          feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          addFee: true,
          data: {
            amount: amount,
            from_chain: chain_name,
            base_denom: await getBaseDenom(amount.denom, chain_name),
            to_chain: verifyTrace.trace[0].counterparty_name,
            through: verifyTrace.trace[0].channel,
          },
        });
      }
      if (verifyTrace.trace[0].counterparty_name != destination_chain_name) {
        const primaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: verifyTrace.trace[0].counterparty_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: {
                chain_name: verifyTrace.trace[0].counterparty_name,
                destination_chain_name: destination_chain_name,
              },
            },
            { root: true },
          ));
        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: verifyTrace.base_denom },
            from_chain: verifyTrace.trace[0].counterparty_name,
            chain_fee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
            to_chain: destination_chain_name,
            to_address,
            through: primaryChannel,
          },
        });
      }

      return result;
    }
  }
}
export async function move({
  amount,
  chain_name,
  destination_chain_name,
}: {
  amount: Amount;
  chain_name: string;
  destination_chain_name: string;
}) {
  const apistore = useStore() as TypedAPIStore;
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: '0',
      },
      chain_name: '',
    },
    mustAddFee: false,
  };
  if (isNative(amount.denom)) {
    // If NOT an IBC denom
    if (chain_name == destination_chain_name) {
      result.output = { amount, chain_name };
      return result;
    } else {
      if (apistore.getters[GlobalDemerisGetterTypes.API.isVerified]({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the destination_chain_name
        const primaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: chain_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: { chain_name: chain_name, destination_chain_name: destination_chain_name },
            },
            { root: true },
          ));

        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            chain_fee: await getFeeForChain(chain_name),
            to_chain: destination_chain_name,
            through: primaryChannel,
          },
        });

        const invPrimaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: destination_chain_name,
            destination_chain_name: chain_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: { chain_name: destination_chain_name, destination_chain_name: chain_name },
            },
            { root: true },
          ));

        result.output = {
          amount: {
            amount: amount.amount,
            denom: generateDenomHash(invPrimaryChannel, amount.denom),
          },
          chain_name: destination_chain_name,
        };
        return result;
      }
    }
  }
  let verifyTrace;
  try {
    verifyTrace =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
        { subscribe: false, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }
  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel =
      apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
        chain_name: chain_name,
        destination_chain_name: verifyTrace.trace[0].counterparty_name,
      }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
        {
          subscribe: true,
          params: {
            chain_name: chain_name,
            destination_chain_name: verifyTrace.trace[0].counterparty_name,
          },
        },
        { root: true },
      ));
    if (primaryChannel == getChannel(verifyTrace.path, 0)) {
      result.output = { amount, chain_name };
      return result;
    } else {
      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        addFee: true,
        feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
        data: {
          amount: amount,
          from_chain: chain_name,
          base_denom: await getBaseDenom(amount.denom, chain_name),
          to_chain: verifyTrace.trace[0].counterparty_name,
          through: verifyTrace.trace[0].channel,
        },
      });
      result.mustAddFee = true;
      result.steps.push({
        name: 'ibc_forward',
        status: 'pending',
        data: {
          amount: { amount: amount.amount, denom: verifyTrace.base_denom },
          from_chain: verifyTrace.trace[0].counterparty_name,
          chain_fee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          to_chain: destination_chain_name,
          through: primaryChannel,
        },
      });

      const invPrimaryChannel =
        apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
          chain_name: destination_chain_name,
          destination_chain_name: chain_name,
        }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
          {
            subscribe: true,
            params: { chain_name: destination_chain_name, destination_chain_name: chain_name },
          },
          { root: true },
        ));

      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(invPrimaryChannel, verifyTrace.base_denom),
        },
        chain_name: destination_chain_name,
      };
      return result;
    }
  } else {
    if (verifyTrace.trace.length > 1) {
      // If trace is longer than 1-hop, throw error because user must redeem the denom first (should never reach this part of the code
      // as the UI should not allow selection of such a token but leaving it here for consistency)
      throw new Error('Denom must be redeemed first');
    } else {
      if (verifyTrace.trace[0].counterparty_name !== destination_chain_name) {
        result.mustAddFee = true;
        result.steps.push({
          name: 'ibc_backward',
          status: 'pending',
          addFee: true,
          feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          data: {
            amount: amount,
            from_chain: chain_name,
            base_denom: await getBaseDenom(amount.denom, chain_name),
            to_chain: verifyTrace.trace[0].counterparty_name,
            through: verifyTrace.trace[0].channel,
          },
        });
        const primaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: verifyTrace.trace[0].counterparty_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: {
                chain_name: verifyTrace.trace[0].counterparty_name,
                destination_chain_name: destination_chain_name,
              },
            },
            { root: true },
          ));
        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: verifyTrace.base_denom },
            from_chain: verifyTrace.trace[0].counterparty_name,
            chain_fee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
            to_chain: destination_chain_name,
            through: primaryChannel,
          },
        });

        const invPrimaryChannel =
          apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
            chain_name: destination_chain_name,
            destination_chain_name: verifyTrace.trace[0].counterparty_name,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
            {
              subscribe: true,
              params: {
                chain_name: destination_chain_name,
                destination_chain_name: verifyTrace.trace[0].counterparty_name,
              },
            },
            { root: true },
          ));

        result.output = {
          amount: {
            amount: amount.amount,
            denom: generateDenomHash(invPrimaryChannel, verifyTrace.base_denom),
          },
          chain_name: destination_chain_name,
        };
      } else {
        result.steps.push({
          name: 'ibc_backward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            base_denom: await getBaseDenom(amount.denom, chain_name),
            to_chain: verifyTrace.trace[0].counterparty_name,
            through: verifyTrace.trace[0].channel,
          },
        });
        result.output = {
          amount: {
            amount: amount.amount,
            denom: verifyTrace.base_denom,
          },
          chain_name: destination_chain_name,
        };
      }
      return result;
    }
  }
}
export async function swap({ from, to }: { from: Amount; to: Amount }) {
  const libStore = useStore();
  const store = libStore as RootStoreType;
  // Get the list of available pools
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: 0,
      },
      chain_name: '',
    },
  };
  const liquidityPools =
    store.getters['tendermint.liquidity.v1beta1/getLiquidityPools']() ??
    (await libStore.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));

  // create our asset pair sorted alphabetically
  const assetPair = [from.denom, to.denom].sort();

  // Find the pool for that pair
  const pool =
    liquidityPools.pools.find((x) => JSON.stringify(x.reserve_coin_denoms) == JSON.stringify(assetPair)) ?? null;
  if (pool) {
    //Pool exists, proceed with swap
    result.steps.push({
      name: 'swap',
      status: 'pending',
      data: {
        from,
        to,
        pool,
      },
    });
    result.output = {
      amount: {
        amount: 0,
        denom: to.denom,
      },
      chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
    };
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
export async function addLiquidity({ pool_id, coinA, coinB }: { pool_id: bigint; coinA: Amount; coinB: Amount }) {
  const libStore = useStore();
  const store = libStore as RootStoreType;
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: 0,
      },
      chain_name: '',
    },
  };
  const liquidityPools =
    store.getters['tendermint.liquidity.v1beta1/getLiquidityPools']() ??
    (await libStore.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));
  // Find the pool for that pair by base denoms
  const pool = liquidityPools.pools.find((item) => item.id == pool_id);
  if (pool) {
    result.steps.push({
      name: 'addliquidity',
      status: 'pending',
      data: {
        coinA,
        coinB,
        pool,
      },
    });
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
export async function withdrawLiquidity({ pool_id, poolCoin }: { pool_id: bigint; poolCoin: Amount }) {
  const libStore = useStore();
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: 0,
      },
      chain_name: '',
    },
  };
  const liquidityPools =
    libStore.getters['tendermint.liquidity.v1beta1/getLiquidityPools']() ??
    (await libStore.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));
  const pool = liquidityPools.pools.find((x) => x.pool_coin_denom == poolCoin.denom) ?? null;
  if (pool && pool.id == pool_id) {
    result.steps.push({
      name: 'withdrawliquidity',
      status: 'pending',
      data: {
        poolCoin,
        pool,
      },
    });
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}

export async function stake({ validatorAddress, amount }: { validatorAddress: string; amount: Amount }) {
  const apistore = useStore() as TypedAPIStore;
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: 0,
      },
      chain_name: '',
    },
  };
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];
  const verified = verifiedDenoms.find((x) => x.name == amount.denom && x.stakable == true);
  if (!verified) {
    throw new Error('Token is not stakable');
  }
  const chain_name = verified.chain_name;
  result.steps.push({
    name: 'stake',
    status: 'pending',
    data: [
      {
        validatorAddress,
        amount,
        chain_name,
      },
    ],
  });
  return result;
}
export async function createPool({ coinA, coinB }: { coinA: Amount; coinB: Amount }) {
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: 0,
      },
      chain_name: '',
    },
  };
  result.steps.push({
    name: 'createpool',
    status: 'pending',
    data: {
      coinA,
      coinB,
    },
  });
  return result;
}
// Action-handler / action composing using the blocks above
export async function actionHandler(action: Actions.Any): Promise<Array<Actions.Step>> {
  const libStore = useStore();
  const store = libStore as RootStoreType;

  const steps = [];
  try {
    let params;
    switch (action.name) {
      case 'redeem':
        params = (action as Actions.RedeemAction).params;
        params.forEach(async (denom) => {
          const redeemStep = await redeem(denom);
          steps.push({
            name: 'redeem',
            memo: action.memo,
            description: 'Redeeming Assets',
            output: redeemStep.output,
            transactions: [...redeemStep.steps],
          }); //TODO
        });
        break;
      case 'move':
        params = (action as Actions.MoveAction).params;
        const moveStep = await move({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          chain_name: params.from.chain_name,
          destination_chain_name: params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Moved',
          memo: action.memo,
          transactions: [...moveStep.steps],
        }); //TODO

        break;
      case 'transfer':
        params = (action as Actions.TransferAction).params;

        const transferStep = await transfer({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          to_address: params.to.address,
          chain_name: params.from.chain_name,
          destination_chain_name: params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Transferred',
          memo: action.memo,
          transactions: [...transferStep.steps],
        }); //TODO
        break;
      case 'memo-transfer':
        params = (action as Actions.MemoTransferAction).params;

        const memoTransferStep = await memoTransfer({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          to_address: params.to.address,
          chain_name: params.from.chain_name,
          destination_chain_name: params.to.chain_name,
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Transferred',
          memo: action.memo,
          transactions: [...memoTransferStep.steps],
        }); //TODO
        break;
      case 'swap':
        params = (action as Actions.SwapAction).params;

        const swapFeeRate = store.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
        const swapFee = {
          amount: Math.ceil((parseInt(params.from.amount.amount) * parseFloat(swapFeeRate)) / 2) + '',
          denom: params.from.amount.denom,
        };
        const transferToHubStep = await move({
          amount: {
            amount: '' + (parseInt(params.from.amount.amount) + parseInt(swapFee.amount)),
            denom: params.from.amount.denom,
          },
          chain_name: params.from.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        });
        if (transferToHubStep.steps.length > 0) {
          steps.push({
            name: 'transfer',
            description: 'Assets Must be transferred to hub first', //TODO
            memo: action.memo,
            transactions: [...transferToHubStep.steps],
          });
        }
        const swapStep = await swap({
          from: {
            amount: params.from.amount.amount,
            denom: transferToHubStep.output.amount.denom,
          },
          to: {
            amount: params.to.amount.amount,
            denom: params.to.amount.denom,
          },
        });
        steps.push({
          name: 'swap',
          description: 'Assets Swapped',
          memo: action.memo,
          transactions: [...swapStep.steps],
        }); //TODO
        break;
      case 'createpool':
        params = (action as Actions.CreatePoolAction).params;
        const transferCoinAtoHubCreate = await move({
          amount: {
            amount: params.coinA.amount.amount,
            denom: params.coinA.amount.denom,
          },
          chain_name: params.coinA.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        });

        if (transferCoinAtoHubCreate.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetA must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinAtoHubCreate.steps],
          });
        }

        const transferCoinBtoHubCreate = await move({
          amount: {
            amount: params.coinB.amount.amount,
            denom: params.coinB.amount.denom,
          },
          chain_name: params.coinB.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        });

        if (transferCoinBtoHubCreate.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetB must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinBtoHubCreate.steps],
          });
        }

        const createPoolStep = await createPool({
          coinA: transferCoinAtoHubCreate.output.amount,
          coinB: transferCoinBtoHubCreate.output.amount,
        });
        steps.push({
          name: 'createpool',
          description: 'Creating Pool', //TODO
          memo: action.memo,
          transactions: [...createPoolStep.steps],
        });
        break;
      case 'addliquidity':
        params = (action as Actions.AddLiquidityAction).params;
        const transferCoinAtoHub = await move({
          amount: {
            amount: params.coinA.amount.amount,
            denom: params.coinA.amount.denom,
          },
          chain_name: params.coinA.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        });

        if (transferCoinAtoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetA must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinAtoHub.steps],
          });
        }

        const transferCoinBtoHub = await move({
          amount: {
            amount: params.coinB.amount.amount,
            denom: params.coinB.amount.denom,
          },
          chain_name: params.coinB.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        });

        if (transferCoinBtoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetB must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferCoinBtoHub.steps],
          });
        }

        const addLiquidityStep = await addLiquidity({
          pool_id: params.pool_id,
          coinA: transferCoinAtoHub.output.amount,
          coinB: transferCoinBtoHub.output.amount,
        });
        steps.push({
          name: 'addliquidity',
          description: 'Adding Liquidity', //TODO
          memo: action.memo,
          transactions: [...addLiquidityStep.steps],
        });
        break;
      case 'withdrawliquidity':
        params = (action as Actions.WithdrawLiquidityAction).params;
        const transferPoolCointoHub = await move({
          amount: {
            amount: params.poolCoin.amount.amount,
            denom: params.poolCoin.amount.denom,
          },
          chain_name: params.poolCoin.chain_name,
          destination_chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        });
        if (transferPoolCointoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'Pool token must be transferred to hub', //TODO
            memo: action.memo,
            transactions: [...transferPoolCointoHub.steps],
          });
        }
        const withdrawLiquidityStep = await withdrawLiquidity({
          pool_id: params.pool_id,
          poolCoin: transferPoolCointoHub.output.amount,
        });
        steps.push({
          name: 'withdrawliquidity',
          description: 'Withdrawing liquidity', //TODO
          memo: action.memo,
          transactions: [...withdrawLiquidityStep.steps],
        });
        break;
      case 'claim':
        params = (action as Actions.ClaimRewardsAction).params;
        steps.push({
          name: 'claim',
          description: 'claim rewards',
          memo: '',
          transactions: [{ name: 'claim', status: 'pending', data: params }],
        });
        break;
      case 'unstake':
        params = (action as Actions.UndelegateAction).params;
        steps.push({
          name: 'unstake',
          description: 'Unstake',
          memo: '',
          transactions: [
            {
              name: 'unstake',
              status: 'pending',
              data: {
                validatorAddress: params.validatorAddress,
                amount: { amount: params.amount.amount.amount, denom: params.amount.amount.denom },
                chain_name: params.amount.chain_name,
              },
            },
          ],
        });
        break;
      case 'switch':
        params = (action as Actions.RedelegateAction).params;
        steps.push({
          name: 'switch',
          description: 'Redelegate',
          memo: '',
          transactions: [
            {
              name: 'switch',
              status: 'pending',
              data: {
                validatorSrcAddress: params.validatorSrcAddress,
                validatorDstAddress: params.validatorDstAddress,
                amount: {
                  amount: (params as Actions.RedelegateParams).amount.amount.amount,
                  denom: params.amount.amount.denom,
                },
                chain_name: params.amount.chain_name,
              },
            },
          ],
        });
        break;
      case 'stake':
        params = (action as Actions.DelegateAction).params;
        const transferStakingCoinToNative = await move({
          amount: {
            amount: params.amount.amount.amount,
            denom: params.amount.amount.denom,
          },
          chain_name: params.amount.chain_name,
          destination_chain_name: await getNativeChain(params.amount.amount.denom, params.amount.chain_name),
        });
        if (transferStakingCoinToNative.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'Staking token must be transferred to native chain', //TODO
            memo: '',
            transactions: [...transferStakingCoinToNative.steps],
          });
        }

        const stakingStep = await stake({
          validatorAddress: params.validatorAddress,
          amount: transferStakingCoinToNative.output.amount,
        });
        steps.push({
          name: 'stake',
          description: 'Staking', //TODO
          memo: '',
          transactions: [...stakingStep.steps],
        });
        break;
      case 'multistake':
        const mdparams = (action as Actions.MultiDelegateAction).params;
        let allsteps: Actions.Step[] = [];
        for (let i = 0; i < mdparams.length; i++) {
          const mdsteps = await actionHandler({ name: 'stake', memo: action.memo, params: mdparams[i] });

          allsteps = [...allsteps, ...mdsteps];
        }

        const stakesteps: Actions.Step[] = [];
        for (const step of allsteps) {
          if (step.name == 'transfer') {
            steps.push(step);
          } else {
            stakesteps.push(step);
          }
        }
        steps.push({
          name: 'stake',
          description: 'Staking', //TODO
          memo: '',
          transactions: [
            {
              name: 'stake',
              status: 'pending',
              data: [
                ...stakesteps
                  .map((x) => x.transactions)
                  .flat()
                  .map((x) => x.data)
                  .flat(),
              ],
            },
          ],
        });

        break;
    }
  } catch (e) {
    throw new Error('Unable to create action steps: ' + e);
  }

  return steps;
}
export async function msgFromStepTransaction(
  stepTx: Actions.StepTransaction,
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.MsgMeta> {
  const libStore = useStore();
  const apistore = useStore() as TypedAPIStore;
  const userstore = useStore() as TypedUSERStore;
  if (stepTx.name == 'transfer') {
    const data = stepTx.data as Actions.TransferData;
    const msg = await libStore.dispatch('cosmos.bank.v1beta1/MsgSend', {
      value: {
        amount: [data.amount],
        toAddress: data.to_address,
        fromAddress: await getOwnAddress({ chain_name: data.chain_name }),
      },
    });
    const registry = libStore.getters['cosmos.bank.v1beta1/getRegistry'];
    return { msg: [msg], chain_name: data.chain_name, registry };
  }

  if (stepTx.name == 'ibc_forward') {
    const data = stepTx.data as Actions.IBCForwardsData;
    let receiver;
    if (data.to_address) {
      receiver = data.to_address;
    } else {
      receiver = await getOwnAddress({ chain_name: data.to_chain });
    }
    const msg = await libStore.dispatch('ibc.applications.transfer.v1/MsgTransfer', {
      value: {
        sourcePort: 'transfer',
        sourceChannel: data.through,
        sender: await getOwnAddress({ chain_name: data.from_chain }),
        receiver,
        timeoutTimestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
        //timeoutHeight: { revisionHeight: "10000000000",revisionNumber:"0"},
        token: { ...data.amount },
      },
    });
    const registry = libStore.getters['ibc.applications.transfer.v1/getRegistry'];
    return { msg: [msg], chain_name: data.from_chain, registry };
  }

  if (stepTx.name == 'ibc_backward') {
    const data = stepTx.data as Actions.IBCBackwardsData;
    let receiver;
    if (data.to_address) {
      receiver = data.to_address;
    } else {
      receiver = await getOwnAddress({ chain_name: data.to_chain });
    }
    let fromAmount = data.amount.amount;
    if (stepTx.addFee) {
      fromAmount = (
        parseInt(fromAmount) +
        parseFloat(stepTx.feeToAdd[0].amount[gasPriceLevel]) *
          userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit]
      ).toString();
    }
    const msg = await libStore.dispatch('ibc.applications.transfer.v1/MsgTransfer', {
      value: {
        sourcePort: 'transfer',
        sourceChannel: data.through,
        sender: await getOwnAddress({ chain_name: data.from_chain }),
        receiver,
        timeoutTimestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
        token: { amount: fromAmount, denom: data.amount.denom },
      },
    });
    const registry = libStore.getters['ibc.applications.transfer.v1/getRegistry'];
    return { msg: [msg], chain_name: data.from_chain, registry };
  }
  if (stepTx.name == 'addliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const data = stepTx.data as Actions.AddLiquidityData;
    let depositCoins;
    if (data.coinA.denom > data.coinB.denom) {
      depositCoins = [data.coinB, data.coinA];
    } else {
      depositCoins = [data.coinA, data.coinB];
    }
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgDepositWithinBatch', {
      value: {
        depositorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        depositCoins,
      },
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'withdrawliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const data = stepTx.data as Actions.WithdrawLiquidityData;
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgWithdrawWithinBatch', {
      value: {
        withdrawerAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        poolCoin: { ...data.poolCoin },
      },
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'createpool') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const data = stepTx.data as Actions.CreatePoolData;
    let depositCoins;
    if (data.coinA.denom > data.coinB.denom) {
      depositCoins = [data.coinB, data.coinA];
    } else {
      depositCoins = [data.coinA, data.coinB];
    }
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgCreatePool', {
      value: {
        poolCreatorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolTypeId: 1,
        depositCoins: depositCoins,
      },
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'swap') {
    const data = stepTx.data as Actions.SwapData;
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const slippage = (userstore.getters[GlobalDemerisGetterTypes.USER.getSlippagePerc] || 0.5) / 100;
    const swapFeeRate = libStore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
    let isReverse = false;
    if (data.from.denom !== data.pool.reserve_coin_denoms[0]) {
      isReverse = true;
    }
    const price = [data.from, data.to].sort((a, b) => {
      if (a.denom < b.denom) return -1;
      if (a.denom > b.denom) return 1;
      return 0;
    });
    const msg = await libStore.dispatch('tendermint.liquidity.v1beta1/MsgSwapWithinBatch', {
      value: MsgSwapWithinBatch.fromPartial({
        swapRequesterAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: parseInt(data.pool.id),
        swapTypeId: data.pool.type_id,
        offerCoin: { amount: data.from.amount, denom: data.from.denom },
        demandCoinDenom: data.to.denom,
        offerCoinFee: { amount: String(Math.ceil(+data.from.amount * (swapFeeRate / 2))), denom: data.from.denom },
        orderPrice: (
          (parseInt(price[0].amount) / parseInt(price[1].amount)) *
          (isReverse ? 1 - slippage : 1 + slippage)
        )
          .toFixed(18)
          .replace('.', '')
          .replace(/(^0+)/, ''),
      }),
    });
    const registry = libStore.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg: [msg], chain_name, registry };
  }
  if (stepTx.name == 'claim') {
    const data = stepTx.data as Actions.ClaimData;
    const delegatorAddress = await getOwnAddress({ chain_name: data.chain_name });
    const msgs = await Promise.all(
      data.rewards.map(async (rewardData) => {
        return await libStore.dispatch('cosmos.distribution.v1beta1/MsgWithdrawDelegatorReward', {
          value: {
            delegatorAddress,
            validatorAddress: rewardData.validator_address,
          },
        });
      }),
    );
    const registry = libStore.getters['cosmos.distribution.v1beta1/getRegistry'];
    return { msg: msgs, chain_name: data.chain_name, registry };
  }
  if (stepTx.name == 'stake') {
    const data = stepTx.data as Actions.DelegateData[];
    const delegatorAddress = await getOwnAddress({ chain_name: data[0].chain_name });
    const msgs = await Promise.all(
      data.map(
        async (x) =>
          await libStore.dispatch('cosmos.staking.v1beta1/MsgDelegate', {
            value: {
              delegatorAddress,
              validatorAddress: x.validatorAddress,
              amount: x.amount,
            },
          }),
      ),
    );
    const registry = libStore.getters['cosmos.staking.v1beta1/getRegistry'];
    return { msg: msgs, chain_name: data[0].chain_name, registry };
  }
  if (stepTx.name == 'unstake') {
    const data = stepTx.data as Actions.UndelegateData;
    const delegatorAddress = await getOwnAddress({ chain_name: data.chain_name });
    const msg = await libStore.dispatch('cosmos.staking.v1beta1/MsgUndelegate', {
      value: {
        delegatorAddress,
        validatorAddress: data.validatorAddress,
        amount: data.amount,
      },
    });
    const registry = libStore.getters['cosmos.staking.v1beta1/getRegistry'];
    return { msg: [msg], chain_name: data.chain_name, registry };
  }
  if (stepTx.name == 'switch') {
    const data = stepTx.data as Actions.RedelegateData;
    const delegatorAddress = await getOwnAddress({ chain_name: data.chain_name });
    const msg = await libStore.dispatch('cosmos.staking.v1beta1/MsgBeginRedelegate', {
      value: {
        delegatorAddress,
        validatorSrcAddress: data.validatorSrcAddress,
        validatorDstAddress: data.validatorDstAddress,
        amount: data.amount,
      },
    });
    const registry = libStore.getters['cosmos.staking.v1beta1/getRegistry'];
    return { msg: [msg], chain_name: data.chain_name, registry };
  }
}
export async function getFeeForChain(chain_name: string): Promise<Array<Actions.FeeWDenom>> {
  const apistore = useStore() as TypedAPIStore;
  const denoms = apistore.getters[GlobalDemerisGetterTypes.API.getFeeTokens]({
    chain_name,
  }) as Array<Denom>;
  const fees = [];
  for (const denom of denoms) {
    fees.push({ amount: denom.gas_price_levels, denom: denom.name, chain_name });
  }
  return fees;
}
export function getBaseDenomSync(denom: string) {
  const apistore = useStore() as TypedAPIStore;
  const traces = apistore.getters[GlobalDemerisGetterTypes.API.getAllVerifiedTraces];
  return traces[denom.split('/')[1]]?.base_denom ?? denom;
}
export async function getBaseDenom(denom: string, chainName = null): Promise<string> {
  const apistore = useStore() as TypedAPIStore;
  const chain_name = chainName || apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];

  if (verifiedDenoms.find((item) => item.name === denom)) {
    return denom;
  }

  const hash = denom.split('/')[1];

  if (!hash) {
    return denom;
  }

  let trace = apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash });

  if (!trace) {
    trace = await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
      { subscribe: false, params: { chain_name, hash } },
      { root: true },
    );
  }

  if (trace) {
    return trace.base_denom;
  }

  return denom;
}

export async function getNativeChain(denom: string, chainName = null): Promise<string> {
  const apistore = useStore() as TypedAPIStore;
  const chain_name = chainName || apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];

  const verified = verifiedDenoms.find((item) => item.name === denom);
  if (verified) {
    return verified.chain_name;
  }

  const hash = denom.split('/')[1];

  if (!hash) {
    throw new Error('Denom not verified');
  }

  let trace = apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash });

  if (!trace) {
    trace = await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
      { subscribe: false, params: { chain_name, hash } },
      { root: true },
    );
  }

  if (trace) {
    return await getNativeChain(trace.base_denom);
  }
  throw new Error('Denom not verified');
}
export function getStepTransactionDetailFromResponse(response: API.TransactionDetailResponse) {
  const apistore = useStore() as TypedAPIStore;
  const getChainFromAddress = (address: string): API.Chain => {
    const chains = Object.values(apistore.getters[GlobalDemerisGetterTypes.API.getChains]);
    const prefix = bech32.decode(address).prefix;
    // @ts-ignore
    return chains.find((item) => item.node_info.bech32_config.prefix_account == prefix);
  };

  for (const message of response.tx_response.tx.body.messages) {
    if (message['@type'] === '/ibc.core.channel.v1.MsgRecvPacket') {
      const packetData: {
        amount: string;
        denom: string;
        receiver: string;
        sender: string;
      } = JSON.parse(atob(message.packet.data));

      const senderChain = getChainFromAddress(packetData.sender);
      const receiverChain = getChainFromAddress(packetData.receiver);

      const counterpartySource = Object.entries(senderChain.primary_channel).find(
        (item) => item[1] === message.packet.source_channel,
      )?.[0];
      const counterpartyDestination = Object.entries(receiverChain.primary_channel).find(
        (item) => item[1] === message.packet.destination_channel,
      )?.[0];
      const denoms = packetData.denom.split('/');

      const data: Actions.IBCForwardsData = {
        amount: {
          amount: packetData.amount,
          denom: denoms[denoms.length - 1],
        },
        from_chain: counterpartyDestination,
        to_chain: counterpartySource,
        to_address: packetData.receiver,
        through: message.packet.source_channel,
      };

      return data;
    }

    if (message['@type'] === '/cosmos.bank.v1beta1.MsgSend') {
      const data: Actions.TransferData = {
        amount: Array.isArray(message.amount) ? message.amount[0] : message.amount,
        to_address: message.to_address,
        chain_name: getChainFromAddress(message.from_address).chain_name,
      };

      return data;
    }

    if (message['@type'] === '/tendermint.liquidity.v1beta1.MsgCreatePool') {
      const data: Actions.CreatePoolData = {
        coinA: message.deposit_coins[0],
        coinB: message.deposit_coins[1],
      };

      return data;
    }
  }
}

export async function ensureTraceChannel(transaction: Actions.StepTransaction) {
  const apistore = useStore() as TypedAPIStore;
  const timeout = 1000;
  const limit = 3;

  let retries = 0;
  let error: Error;

  let denoms = [];
  const chain = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];

  switch (transaction.name) {
    case 'addliquidity':
      const transferdata = transaction.data as Actions.AddLiquidityData;
      denoms = [transferdata.coinA.denom, transferdata.coinB.denom];
      break;
    case 'createpool':
      const createdata = transaction.data as Actions.CreatePoolData;
      denoms = [createdata.coinA.denom, createdata.coinB.denom];
      break;
    case 'swap':
      const swapdata = transaction.data as Actions.SwapData;
      denoms = [swapdata.from.denom, swapdata.to.denom];
      break;
    case 'withdrawliquidity':
      const withdrawdata = transaction.data as Actions.WithdrawLiquidityData;
      denoms = [withdrawdata.poolCoin.denom];
      break;
    default:
      return;
  }

  const ibcDenoms = denoms.filter((item) => !!item.split('/')[1]);

  if (!ibcDenoms.length) {
    return;
  }

  while (limit > retries) {
    try {
      for (const denom of ibcDenoms) {
        await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
          {
            subscribe: false,
            cache: false,
            params: {
              chain_name: chain,
              hash: denom.split('/')[1],
            },
          },
          { root: true },
        );
      }
      break;
    } catch (e) {
      error = e;
      retries++;
      // Sleep
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }

  if (error) {
    throw new Error(`Failed to verify path of "${ibcDenoms.join(', ')}" on "${chain}."`);
  }
}

export async function getDisplayName(name, chain_name = null) {
  const apistore = useStore() as TypedAPIStore;
  if (isNative(name)) {
    const displayName =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name == name)?.display_name ??
      null;
    if (displayName) {
      return displayName;
    }

    return name;
  } else {
    let verifyTrace;
    try {
      verifyTrace =
        apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash: name.split('/')[1] }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
          { subscribe: false, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
    } catch (e) {
      //console.error(e);
      return name + '(unverified)';
    }

    return await getDisplayName(verifyTrace.base_denom);
  }
}
export async function getTicker(name, chain_name = null) {
  const apistore = useStore() as TypedAPIStore;
  if (isNative(name)) {
    const ticker =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name == name)?.ticker ?? null;
    if (ticker) {
      return ticker;
    }
    return name;
  } else {
    let verifyTrace;
    try {
      verifyTrace =
        apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({ chain_name, hash: name.split('/')[1] }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
          { subscribe: false, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
      return await getTicker(verifyTrace.base_denom);
    } catch (e) {
      return name + '(unverified)';
    }
  }
}

export async function isLive(chain_name) {
  const apistore = useStore() as TypedAPIStore;
  const status =
    apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({
      chain_name,
    }) ??
    (await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_CHAIN_STATUS,
      {
        subscribe: false,
        params: {
          chain_name,
        },
      },
      { root: true },
    ));
  return status;
}

export async function feeForStepTransaction(stepTx: Actions.StepTransaction): Promise<Array<Actions.FeeWDenom>> {
  const apistore = useStore() as TypedAPIStore;
  if (stepTx.name == 'transfer') {
    const chain_name = (stepTx.data as Actions.TransferData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'ibc_backward') {
    const chain_name = (stepTx.data as Actions.IBCBackwardsData).from_chain;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'ibc_forward') {
    const chain_name = (stepTx.data as Actions.IBCForwardsData).from_chain;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'addliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'withdrawliquidity') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'createpool') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'swap') {
    const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'claim') {
    const chain_name = (stepTx.data as Actions.ClaimData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'stake') {
    console.log(stepTx);
    const chain_name = (stepTx.data as Actions.DelegateData[])[0].chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'unstake') {
    const chain_name = (stepTx.data as Actions.UndelegateData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'switch') {
    const chain_name = (stepTx.data as Actions.RedelegateData).chain_name;
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
}
export async function feeForStep(step: Actions.Step, gasPriceLevel: Actions.GasPriceLevel): Promise<Actions.FeeTotals> {
  const feeTotals = {};

  let used;
  for (const stepTx of step.transactions) {
    const fees = await feeForStepTransaction(stepTx);

    if (!feeTotals[fees[0].chain_name]) {
      feeTotals[fees[0].chain_name] = {};
    }
    used = getUsedFee(fees, gasPriceLevel);
    feeTotals[used.chain_name][used.amount.denom]
      ? (feeTotals[used.chain_name][used.amount.denom] =
          feeTotals[used.chain_name][used.amount.denom] + parseFloat(used.amount.amount))
      : (feeTotals[used.chain_name][used.amount.denom] = parseFloat(used.amount.amount));
  }
  return feeTotals;
}

export async function feeForSteps(
  steps: Actions.Step[],
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.FeeTotals> {
  const feeTotals = {};

  let used;
  if (steps) {
    for (const step of steps) {
      for (const stepTx of step.transactions) {
        const fees = await feeForStepTransaction(stepTx);

        if (!feeTotals[fees[0].chain_name]) {
          feeTotals[fees[0].chain_name] = {};
        }
        used = getUsedFee(fees, gasPriceLevel);

        feeTotals[used.chain_name][used.amount.denom]
          ? (feeTotals[used.chain_name][used.amount.denom] =
              feeTotals[used.chain_name][used.amount.denom] + parseFloat(used.amount.amount))
          : (feeTotals[used.chain_name][used.amount.denom] = parseFloat(used.amount.amount));
      }
    }
  }
  return feeTotals;
}

export function getUsedFee(fees: Array<Actions.FeeWDenom>, gasPriceLevel: Actions.GasPriceLevel): ChainAmount {
  const userstore = useStore() as TypedUSERStore;
  const feeOption = fees[0];
  const used = {
    amount: {
      amount: (
        parseFloat(feeOption.amount[gasPriceLevel]) * userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit]
      ).toString(),
      denom: feeOption.denom,
    },
    chain_name: feeOption.chain_name,
  };
  return used;
}

export async function toRedeem(balances: Balances): Promise<Balances> {
  const apistore = useStore() as TypedAPIStore;
  const allValidRedeemableBalances = balances.filter((x) => x.verified && Object.keys(x.ibc).length !== 0);
  const redeemableBalances = [];
  for (const balance of allValidRedeemableBalances) {
    if (balance.ibc.path.split('/').length > 2) {
      redeemableBalances.push(balance);
    } else {
      let verifyTrace;
      try {
        verifyTrace =
          apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
            chain_name: balance.on_chain,
            hash: balance.ibc.hash,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
            { subscribe: false, params: { chain_name: balance.on_chain, hash: balance.ibc.hash } },
            { root: true },
          ));
      } catch (e) {
        continue;
      }

      const primaryChannel =
        apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
          chain_name: balance.on_chain,
          destination_chain_name: verifyTrace.trace[0].counterparty_name,
        }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
          {
            subscribe: true,
            params: { chain_name: balance.on_chain, destination_chain_name: verifyTrace.trace[0].counterparty_name },
          },
          { root: true },
        ));
      if (primaryChannel != getChannel(verifyTrace.path, 0)) {
        redeemableBalances.push(balance);
      }
    }
  }
  return redeemableBalances;
}

export async function validBalances(balances: Balances): Promise<Balances> {
  const apistore = useStore() as TypedAPIStore;
  const validBalances = [];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];

  for (const balance of balances) {
    const ownAddress = await getOwnAddress({ chain_name: balance.on_chain });
    if (!ownAddress) continue;
    const hashAddress = keyHashfromAddress(ownAddress);

    if (balance.address !== hashAddress) {
      continue;
    }

    if (Object.keys(balance.ibc).length == 0) {
      if (verifiedDenoms.find((item) => item.name === balance.base_denom)) {
        validBalances.push(balance);
      }
    } else {
      if (!balance.ibc.path || balance.ibc.path.split('/').length > 2) {
        continue;
      }
      let verifyTrace;
      try {
        verifyTrace =
          apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
            chain_name: balance.on_chain,
            hash: balance.ibc.hash,
          }) ??
          (await apistore.dispatch(
            GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
            { subscribe: false, params: { chain_name: balance.on_chain, hash: balance.ibc.hash } },
            { root: true },
          ));
      } catch (e) {
        continue;
      }

      if (!verifyTrace || !verifyTrace.verified) {
        continue;
      }

      const primaryChannel =
        apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
          chain_name: balance.on_chain,
          destination_chain_name: verifyTrace.trace[0].counterparty_name,
        }) ??
        (await apistore.dispatch(
          GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
          {
            subscribe: false,
            params: { chain_name: balance.on_chain, destination_chain_name: verifyTrace.trace[0].counterparty_name },
          },
          { root: true },
        ));
      if (primaryChannel == getChannel(verifyTrace.path, 0)) {
        validBalances.push(balance);
      }
    }
  }
  return validBalances;
}

export async function validPools(pools: Actions.Pool[]): Promise<Actions.Pool[]> {
  const apistore = useStore() as TypedAPIStore;
  const validPools = [];
  const verifiedDenoms = apistore.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms];
  const dexChain = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];

  for (const pool of pools) {
    const firstDenom = pool.reserve_coin_denoms[0];
    const secondDenom = pool.reserve_coin_denoms[1];

    if (!firstDenom.includes('ibc')) {
      if (verifiedDenoms.find((item) => item.name === firstDenom)) {
        // first denom is base denom and valid, check second denom
        if (!secondDenom.includes('ibc')) {
          if (verifiedDenoms.find((item) => item.name === secondDenom)) {
            // first denom is base denom and valid, second denom is base denom and valid

            validPools.push(pool);
          } else {
            continue;
          }
        } else {
          if (await isValidIBCReserveDenom(secondDenom, dexChain, verifiedDenoms)) {
            // first denom is base and valid, second denom is IBC and valid
            validPools.push(pool);
          } else {
            continue;
          }
        }
      } else {
        continue;
      }
    } else {
      if (await isValidIBCReserveDenom(firstDenom, dexChain, verifiedDenoms)) {
        if (!secondDenom.includes('ibc')) {
          // second denom is not IBC denom
          if (verifiedDenoms.find((item) => item.name === secondDenom)) {
            // first denom is IBC and valid, second denom is base and valid
            validPools.push(pool);
          } else {
            continue;
          }
        } else {
          // second denom is IBC denom, check if it goes through primary channel
          if (await isValidIBCReserveDenom(secondDenom, dexChain, verifiedDenoms)) {
            validPools.push(pool);
          } else {
            continue;
          }
        }
      } else {
        continue;
      }
    }
  }
  return validPools;
}
export async function chainStatusForSteps(steps: Actions.Step[]) {
  const apistore = useStore() as TypedAPIStore;
  let allClear = true;
  let relayerStatus = true;
  const failedChains = [];
  for (const step of steps) {
    for (const stepTx of step.transactions) {
      if (stepTx.name == 'transfer') {
        const chain_name = (stepTx.data as Actions.TransferData).chain_name;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'ibc_backward') {
        const chain_name = (stepTx.data as Actions.IBCBackwardsData).from_chain;
        const dest_chain_name = (stepTx.data as Actions.IBCBackwardsData).to_chain;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (!failedChains.includes(chain_name)) {
            failedChains.push(chain_name);
          }
        }
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name: dest_chain_name })) {
          allClear = false;
          if (failedChains.includes(dest_chain_name)) {
            continue;
          } else {
            failedChains.push(dest_chain_name);
          }
        }

        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_STATUS, {
          subscribe: false,
        });
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_BALANCES, {
          subscribe: false,
        });
        if (
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name }) ||
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name: dest_chain_name })
        ) {
          relayerStatus = false;
        }
      }
      if (stepTx.name == 'ibc_forward') {
        const chain_name = (stepTx.data as Actions.IBCBackwardsData).from_chain;
        const dest_chain_name = (stepTx.data as Actions.IBCBackwardsData).to_chain;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (!failedChains.includes(chain_name)) {
            failedChains.push(chain_name);
          }
        }
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name: dest_chain_name })) {
          allClear = false;
          if (failedChains.includes(dest_chain_name)) {
            continue;
          } else {
            failedChains.push(dest_chain_name);
          }
        }
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_STATUS, {
          subscribe: false,
        });
        await apistore.dispatch(GlobalDemerisActionTypes.API.GET_RELAYER_BALANCES, {
          subscribe: false,
        });
        if (
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name }) ||
          !apistore.getters[GlobalDemerisGetterTypes.API.getRelayerChainStatus]({ chain_name: dest_chain_name })
        ) {
          relayerStatus = false;
        }
      }
      if (stepTx.name == 'addliquidity') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'withdrawliquidity') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'createpool') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'swap') {
        const chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain];
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'claim' || stepTx.name == 'unstake' || stepTx.name == 'switch') {
        const chain_name = (stepTx.data as Actions.ClaimData).chain_name;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
      if (stepTx.name == 'stake') {
        const chain_name = (stepTx.data as Actions.DelegateData[])[0].chain_name;
        if (!apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name })) {
          allClear = false;
          if (failedChains.includes(chain_name)) {
            continue;
          } else {
            failedChains.push(chain_name);
          }
        }
      }
    }
  }
  return { status: allClear, failed: failedChains, relayer: relayerStatus };
}
export async function validateStepFeeBalances(
  step: Actions.Step,
  balances: Balances,
  fees: Actions.FeeTotals,
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.FeeWarning> {
  const apistore = useStore() as TypedAPIStore;
  const userstore = useStore() as TypedUSERStore;
  const feeWarning: Actions.FeeWarning = {
    missingFees: [],
    ibcWarning: false,
    feeWarning: false,
    ibcDetails: {
      ibcDenom: '',
      chain_name: '',
      denom: '',
    },
  };
  for (const stepTx of step.transactions) {
    if (stepTx.name == 'addliquidity') {
      const data = stepTx.data as Actions.AddLiquidityData;
      const balanceA = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinA.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (balanceA) {
        const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
        if (newAmount >= 0) {
          balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinA.denom);
      }
      const balanceB = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinB.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (balanceB) {
        const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
        if (newAmount >= 0) {
          balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinB.denom);
      }
    }
    if (stepTx.name == 'createpool') {
      const data = stepTx.data as Actions.CreatePoolData;
      const creationFee = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
      const feeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == creationFee.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      const balanceA = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinA.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (balanceA) {
        const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
        if (newAmount >= 0) {
          balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinA.denom);
      }
      const balanceB = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.coinB.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (balanceB) {
        const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
        if (newAmount >= 0) {
          balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.coinB.denom);
      }
      if (feeBalance) {
        const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - parseInt(creationFee.amount);
        if (newAmount >= 0) {
          feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + creationFee.amount,
            chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
            denom: creationFee.denom,
          });
        }
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + creationFee.amount,
          chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
          denom: creationFee.denom,
        });
      }
    }
    if (stepTx.name == 'ibc_backward') {
      const data = stepTx.data as Actions.IBCBackwardsData;
      const ibcBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
          return true;
        } else {
          return false;
        }
      });
      if (ibcBalance) {
        const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
        if (newAmount >= 0) {
          ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
          let newDenom;
          if (ibcBalance.ibc.path.split('/').length > 2) {
            newDenom = getDenomHash(ibcBalance.ibc.path, ibcBalance.base_denom, 1);
          } else {
            newDenom = ibcBalance.base_denom;
          }
          if (!data.to_address) {
            const rcptBalance = balances.find((x) => {
              const amount = parseCoins(x.amount)[0];
              if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                return true;
              } else {
                return false;
              }
            });
            let additionalFee = 0;
            if (stepTx.addFee) {
              additionalFee =
                parseFloat(stepTx.feeToAdd[0].amount[gasPriceLevel]) *
                userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit];
            }
            if (rcptBalance) {
              const newIbcAmount =
                parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount) + additionalFee;
              rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
            } else {
              const ibcDetails: IbcInfo = {};
              if (ibcBalance.ibc.path.split('/').length > 2) {
                ibcDetails.path = ibcBalance.ibc.path.split('/').slice(2).join('/');
                ibcDetails.hash = newDenom.replace('ibc/', '');
              }
              const newIbcBalance: Balance = {
                address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                base_denom: ibcBalance.base_denom,
                verified: ibcBalance.verified,
                on_chain: data.to_chain,
                amount: data.amount.amount + newDenom,
                ibc: ibcDetails,
              };
              balances.push(newIbcBalance);
            }
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.amount.denom);
      }
    }
    if (stepTx.name == 'ibc_forward') {
      const data = stepTx.data as Actions.IBCForwardsData;
      const ibcBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
          return true;
        } else {
          return false;
        }
      });
      if (ibcBalance) {
        const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
        if (newAmount >= 0) {
          ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
          const newDenom = generateDenomHash(data.through, ibcBalance.base_denom);

          if (!data.to_address) {
            const rcptBalance = balances.find((x) => {
              const amount = parseCoins(x.amount)[0];
              if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                return true;
              } else {
                return false;
              }
            });
            if (rcptBalance) {
              const newIbcAmount = parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount);
              rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
            } else {
              const ibcDetails: IbcInfo = {};
              if (ibcBalance.ibc.path?.split('/').length > 2) {
                ibcDetails.path = 'transfer/' + data.through;
                ibcDetails.hash = newDenom.replace('ibc/', '');
              }
              const newIbcBalance: Balance = {
                address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                base_denom: ibcBalance.base_denom,
                verified: ibcBalance.verified,
                on_chain: data.to_chain,
                amount: data.amount.amount + newDenom,
                ibc: ibcDetails,
              };
              balances.push(newIbcBalance);
            }
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.amount.denom);
      }
      const chain = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: data.to_chain });
      const chainFeeDenom = (chain as ChainData).denoms.find((x) => x.fee_token)?.name;

      const ibcFeeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == chainFeeDenom && x.on_chain == data.to_chain) {
          return true;
        } else {
          return false;
        }
      });
      if (!ibcFeeBalance || parseInt(parseCoins(ibcFeeBalance.amount)[0].amount) == 0) {
        feeWarning.feeWarning = false;
        feeWarning.ibcWarning = true;
        feeWarning.ibcDetails.chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
          name: data.to_chain,
        });
        feeWarning.ibcDetails.ibcDenom = await getDisplayName(ibcBalance.base_denom);
        feeWarning.ibcDetails.denom = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({
          chain_name: data.to_chain,
        }).denoms.find((x) => x.fee_token == true).display_name;
      }
    }
    if (stepTx.name == 'swap') {
      const data = stepTx.data as Actions.SwapData;
      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.from.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (balance) {
        const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.from.amount);
        if (newAmount >= 0) {
          balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.from.denom);
        }
      } else {
        throw new Error('Insufficient balance: ' + data.from.denom);
      }
      const swapFeeRate = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
      const swapFee = {
        amount: Math.ceil((parseInt(data.from.amount) * parseFloat(swapFeeRate)) / 2) + '',
        denom: data.from.denom,
      };
      const newSwapAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(swapFee.amount);
      if (newSwapAmount >= 0) {
        balance.amount = newSwapAmount + parseCoins(balance.amount)[0].denom;
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + swapFee.amount,
          chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
          denom: swapFee.denom,
        });
      }
    }
    if (stepTx.name == 'transfer') {
      const data = stepTx.data as Actions.TransferData;
      if (data.to_address != (await getOwnAddress({ chain_name: data.chain_name }))) {
        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.chain_name) {
            return true;
          } else {
            return false;
          }
        });
        if (balance) {
          const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.amount.amount);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      }
    }
    if (stepTx.name == 'withdrawliquidity') {
      const data = stepTx.data as Actions.WithdrawLiquidityData;

      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (
          amount.denom == data.poolCoin.denom &&
          x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (balance) {
        const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.poolCoin.amount);
        if (newAmount >= 0) {
          balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.poolCoin.denom);
        }
      }
    }
    if (stepTx.name == 'stake') {
      const data = stepTx.data as Actions.DelegateData;

      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.amount.denom && x.on_chain == data.chain_name) {
          return true;
        } else {
          return false;
        }
      });
      if (balance) {
        const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.amount.amount);
        if (newAmount >= 0) {
          balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      }
    }
  }
  for (const chain_name in fees) {
    for (const denom in fees[chain_name]) {
      const feeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];

        if (amount.denom == denom && x.on_chain == chain_name) {
          return true;
        } else {
          return false;
        }
      });
      if (feeBalance) {
        const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - fees[chain_name][denom];
        if (newAmount >= 0) {
          feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + fees[chain_name][denom],
            chain_name: chain_name,
            denom: denom,
          });
        }
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + fees[chain_name][denom],
          chain_name: chain_name,
          denom: denom,
        });
      }
    }
  }
  return feeWarning;
}

export async function validateStepsFeeBalances(
  steps: Actions.Step[],
  balances: Balances,
  allFees: Actions.FeeTotals[],
  gasPriceLevel: Actions.GasPriceLevel,
): Promise<Actions.FeeWarning> {
  const apistore = useStore() as TypedAPIStore;
  const userstore = useStore() as TypedUSERStore;
  const feeWarning: Actions.FeeWarning = {
    missingFees: [],
    ibcWarning: false,
    feeWarning: false,
    ibcDetails: {
      ibcDenom: '',
      chain_name: '',
      denom: '',
    },
  };
  let i = 0;
  for (const step of steps) {
    const fees = allFees[i];
    for (const stepTx of step.transactions) {
      if (stepTx.name == 'addliquidity') {
        const data = stepTx.data as Actions.AddLiquidityData;
        const balanceA = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinA.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (balanceA) {
          const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
          if (newAmount >= 0) {
            balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinA.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
        const balanceB = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinB.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (balanceB) {
          const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
          if (newAmount >= 0) {
            balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinB.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
      }
      if (stepTx.name == 'createpool') {
        const data = stepTx.data as Actions.CreatePoolData;
        const creationFee = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
        const feeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == creationFee.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        const balanceA = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinA.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (balanceA) {
          const newAmount = parseInt(parseCoins(balanceA.amount)[0].amount) - parseInt(data.coinA.amount);
          if (newAmount >= 0) {
            balanceA.amount = newAmount + parseCoins(balanceA.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinA.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinA.denom);
        }
        const balanceB = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.coinB.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (balanceB) {
          const newAmount = parseInt(parseCoins(balanceB.amount)[0].amount) - parseInt(data.coinB.amount);
          if (newAmount >= 0) {
            balanceB.amount = newAmount + parseCoins(balanceB.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.coinB.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.coinB.denom);
        }
        if (feeBalance) {
          const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - parseInt(creationFee.amount);
          if (newAmount >= 0) {
            feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
          } else {
            feeWarning.feeWarning = false;
            feeWarning.missingFees.push({
              amount: '' + creationFee.amount,
              chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
              denom: creationFee.denom,
            });
          }
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + creationFee.amount,
            chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
            denom: creationFee.denom,
          });
        }
      }
      if (stepTx.name == 'ibc_backward') {
        const data = stepTx.data as Actions.IBCBackwardsData;
        const ibcBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
            return true;
          } else {
            return false;
          }
        });
        if (ibcBalance) {
          const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
          if (newAmount >= 0) {
            ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
            let newDenom;
            if (ibcBalance.ibc.path.split('/').length > 2) {
              newDenom = getDenomHash(ibcBalance.ibc.path, ibcBalance.base_denom, 1);
            } else {
              newDenom = ibcBalance.base_denom;
            }
            if (!data.to_address) {
              const rcptBalance = balances.find((x) => {
                const amount = parseCoins(x.amount)[0];
                if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                  return true;
                } else {
                  return false;
                }
              });
              let additionalFee = 0;
              if (stepTx.addFee) {
                additionalFee =
                  parseFloat(stepTx.feeToAdd[0].amount[gasPriceLevel]) *
                  userstore.getters[GlobalDemerisGetterTypes.USER.getGasLimit];
              }

              if (rcptBalance) {
                const newIbcAmount =
                  parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount) + additionalFee;
                rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
              } else {
                const ibcDetails: IbcInfo = {};
                if (ibcBalance.ibc.path.split('/').length > 2) {
                  ibcDetails.path = ibcBalance.ibc.path.split('/').slice(2).join('/');
                  ibcDetails.hash = newDenom.replace('ibc/', '');
                }
                const newIbcBalance: Balance = {
                  address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                  base_denom: ibcBalance.base_denom,
                  verified: ibcBalance.verified,
                  on_chain: data.to_chain,
                  amount: parseInt(data.amount.amount) + additionalFee + newDenom,
                  ibc: ibcDetails,
                };
                balances.push(newIbcBalance);
              }
            }
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
      }
      if (stepTx.name == 'ibc_forward') {
        const data = stepTx.data as Actions.IBCForwardsData;
        const ibcBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data.amount.denom && x.on_chain == data.from_chain) {
            return true;
          } else {
            return false;
          }
        });
        if (ibcBalance) {
          const newAmount = parseInt(parseCoins(ibcBalance.amount)[0].amount) - parseInt(data.amount.amount);
          if (newAmount >= 0) {
            ibcBalance.amount = newAmount + parseCoins(ibcBalance.amount)[0].denom;
            const newDenom = generateDenomHash(data.through, ibcBalance.base_denom);

            if (!data.to_address) {
              const rcptBalance = balances.find((x) => {
                const amount = parseCoins(x.amount)[0];
                if (amount.denom == newDenom && x.on_chain == data.to_chain) {
                  return true;
                } else {
                  return false;
                }
              });
              if (rcptBalance) {
                const newIbcAmount = parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount);
                rcptBalance.amount = newIbcAmount + parseCoins(rcptBalance.amount)[0].denom;
              } else {
                const ibcDetails: IbcInfo = {};
                if (ibcBalance.ibc.path?.split('/').length > 2) {
                  ibcDetails.path = 'transfer/' + data.through;
                  ibcDetails.hash = newDenom.replace('ibc/', '');
                }
                const newIbcBalance: Balance = {
                  address: keyHashfromAddress(await getOwnAddress({ chain_name: data.to_chain })),
                  base_denom: ibcBalance.base_denom,
                  verified: ibcBalance.verified,
                  on_chain: data.to_chain,
                  amount: data.amount.amount + newDenom,
                  ibc: ibcDetails,
                };
                balances.push(newIbcBalance);
              }
            }
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.amount.denom);
        }
        const chain = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name: data.to_chain });
        const chainFeeDenom = (chain as ChainData).denoms.find((x) => x.fee_token)?.name;

        const ibcFeeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == chainFeeDenom && x.on_chain == data.to_chain) {
            return true;
          } else {
            return false;
          }
        });
        if (!ibcFeeBalance || parseInt(parseCoins(ibcFeeBalance.amount)[0].amount) == 0) {
          feeWarning.feeWarning = false;
          feeWarning.ibcWarning = true;
          feeWarning.ibcDetails.chain_name = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
            name: data.to_chain,
          });
          feeWarning.ibcDetails.ibcDenom = await getDisplayName(ibcBalance.base_denom);
          feeWarning.ibcDetails.denom = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({
            chain_name: data.to_chain,
          }).denoms.find((x) => x.fee_token == true).display_name;
        }
      }
      if (stepTx.name == 'swap') {
        const data = stepTx.data as Actions.SwapData;
        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.from.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });

        if (balance) {
          const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.from.amount);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.from.denom);
          }
        } else {
          throw new Error('Insufficient balance: ' + data.from.denom);
        }
        const swapFeeRate = apistore.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
        const swapFee = {
          amount: Math.ceil((parseInt(data.from.amount) * parseFloat(swapFeeRate)) / 2) + '',
          denom: data.from.denom,
        };
        const newSwapAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(swapFee.amount);
        if (newSwapAmount >= 0) {
          balance.amount = newSwapAmount + parseCoins(balance.amount)[0].denom;
        } else {
          feeWarning.feeWarning = false;
          feeWarning.missingFees.push({
            amount: '' + swapFee.amount,
            chain_name: apistore.getters[GlobalDemerisGetterTypes.API.getDexChain],
            denom: swapFee.denom,
          });
        }
      }
      if (stepTx.name == 'transfer') {
        const data = stepTx.data as Actions.TransferData;
        if (data.to_address != (await getOwnAddress({ chain_name: data.chain_name }))) {
          const balance = balances.find((x) => {
            const amount = parseCoins(x.amount)[0];
            if (amount.denom == data.amount.denom && x.on_chain == data.chain_name) {
              return true;
            } else {
              return false;
            }
          });
          if (balance) {
            const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.amount.amount);
            if (newAmount >= 0) {
              balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
            } else {
              throw new Error('Insufficient balance: ' + data.amount.denom);
            }
          } else {
            throw new Error('Insufficient balance: ' + data.amount.denom);
          }
        }
      }
      if (stepTx.name == 'withdrawliquidity') {
        const data = stepTx.data as Actions.WithdrawLiquidityData;

        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (
            amount.denom == data.poolCoin.denom &&
            x.on_chain == apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (balance) {
          const newAmount = parseInt(parseCoins(balance.amount)[0].amount) - parseInt(data.poolCoin.amount);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error('Insufficient balance: ' + data.poolCoin.denom);
          }
        }
      }
      if (stepTx.name == 'stake') {
        const data = stepTx.data as Actions.DelegateData[];

        const balance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];
          if (amount.denom == data[0].amount.denom && x.on_chain == data[0].chain_name) {
            return true;
          } else {
            return false;
          }
        });
        if (balance) {
          const newAmount =
            parseInt(parseCoins(balance.amount)[0].amount) -
            data.reduce((acc, txdata) => {
              return acc + parseInt(txdata.amount.amount);
            }, 0);
          if (newAmount >= 0) {
            balance.amount = newAmount + parseCoins(balance.amount)[0].denom;
          } else {
            throw new Error(
              'Insufficient balance: ' +
                data.reduce((acc, txdata) => {
                  return acc + parseInt(txdata.amount.amount);
                }, 0),
            );
          }
        }
      }
    }
    for (const chain_name in fees) {
      for (const denom in fees[chain_name]) {
        const feeBalance = balances.find((x) => {
          const amount = parseCoins(x.amount)[0];

          if (amount.denom == denom && x.on_chain == chain_name) {
            return true;
          } else {
            return false;
          }
        });
        if (feeBalance) {
          const newAmount = parseInt(parseCoins(feeBalance.amount)[0].amount) - fees[chain_name][denom];
          if (newAmount >= 0) {
            feeBalance.amount = newAmount + parseCoins(feeBalance.amount)[0].denom;
          } else {
            feeWarning.feeWarning = false;
            feeWarning.missingFees.push({
              amount: '' + fees[chain_name][denom],
              chain_name: chain_name,
              denom: denom,
            });
          }
        } else {
          if (fees[chain_name][denom] > 0) {
            feeWarning.feeWarning = false;
            feeWarning.missingFees.push({
              amount: '' + fees[chain_name][denom],
              chain_name: chain_name,
              denom: denom,
            });
          }
        }
      }
    }
    i++;
  }
  return feeWarning;
}
export async function isValidIBCReserveDenom(
  denom: string,
  dexChain: string,
  verifiedDenoms: API.VerifiedDenoms,
): Promise<boolean> {
  const apistore = useStore() as TypedAPIStore;
  let verifyTrace;

  try {
    verifyTrace =
      apistore.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
        chain_name: dexChain,
        hash: denom.split('/')[1],
      }) ??
      (await apistore.dispatch(
        GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
        { subscribe: false, params: { chain_name: dexChain, hash: denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    return false;
  }
  if (!verifyTrace) {
    return false;
  }
  if (verifyTrace.path.split('/').length > 2) {
    return false;
  }

  if (!verifiedDenoms.find((item) => item.name === verifyTrace.base_denom)) {
    return false;
  }

  const primaryChannel =
    apistore.getters[GlobalDemerisGetterTypes.API.getPrimaryChannel]({
      chain_name: dexChain,
      destination_chain_name: verifyTrace.trace[0].counterparty_name,
    }) ??
    (await apistore.dispatch(
      GlobalDemerisActionTypes.API.GET_PRIMARY_CHANNEL,
      {
        subscribe: false,
        params: { chain_name: dexChain, destination_chain_name: verifyTrace.trace[0].counterparty_name },
      },
      { root: true },
    ));

  if (primaryChannel == getChannel(verifyTrace.path, 0)) {
    return true;
  }

  return false;
}
