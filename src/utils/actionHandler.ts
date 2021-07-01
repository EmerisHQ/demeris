import Long from 'long';

import * as Actions from '@/types/actions';
import { Balances, Denom } from '@/types/api';
import { Amount, ChainAmount } from '@/types/base';

import { store, useAllStores } from '../store/index';
import { generateDenomHash, getChannel, getDenomHash, getOwnAddress, isNative } from './basic';

const stores = useAllStores();
// Basic step-building blocks
export async function redeem({ amount, chain_name }: ChainAmount) {
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
        store.getters['demeris/getVerifyTrace']({
          chain_name,
          hash: amount.denom.split('/')[1],
        }) ??
        (await store.dispatch(
          'demeris/GET_VERIFY_TRACE',
          {
            subscribe: true,
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
      chain_name: verifyTrace.trace[verifyTrace.length - 1].counterparty,
    };
    return result;
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
      if (store.getters['demeris/isVerified']({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the destination_chain_name
        const primaryChannel =
          store.getters['demeris/getPrimaryChannel']({
            chain_name: chain_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await store.dispatch(
            'demeris/GET_PRIMARY_CHANNEL',
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
      store.getters['demeris/getVerifyTrace']({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await store.dispatch(
        'demeris/GET_VERIFY_TRACE',
        { subscribe: true, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }

  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel =
      store.getters['demeris/getPrimaryChannel']({
        chain_name: verifyTrace.trace[0].counterparty_name,
        destination_chain_name: destination_chain_name,
      }) ??
      (await store.dispatch(
        'demeris/GET_PRIMARY_CHANNEL',
        {
          subscribe: true,
          params: {
            chain_name: verifyTrace.trace[0].counterparty_name,
            destination_chain_name: destination_chain_name,
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
      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: chain_name,
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
      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: verifyTrace.trace[0].counterparty_name,
          destination_chain_name: destination_chain_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
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
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: chain_name,
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
          to_chain: destination_chain_name,
          to_address,
          through: primaryChannel,
        },
      });

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
    // If NOT an IBC denom
    if (chain_name == destination_chain_name) {
      result.output = { amount, chain_name };
      return result;
    } else {
      if (store.getters['demeris/isVerified']({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the destination_chain_name
        const primaryChannel =
          store.getters['demeris/getPrimaryChannel']({
            chain_name: chain_name,
            destination_chain_name: destination_chain_name,
          }) ??
          (await store.dispatch(
            'demeris/GET_PRIMARY_CHANNEL',
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
            to_chain: destination_chain_name,
            through: primaryChannel,
          },
        });

        result.output = {
          amount: {
            amount: amount.amount,
            denom: generateDenomHash(primaryChannel, amount.denom),
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
      store.getters['demeris/getVerifyTrace']({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await store.dispatch(
        'demeris/GET_VERIFY_TRACE',
        { subscribe: true, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }
  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel =
      store.getters['demeris/getPrimaryChannel']({
        chain_name: verifyTrace.trace[0].counterparty_name,
        destination_chain_name: destination_chain_name,
      }) ??
      (await store.dispatch(
        'demeris/GET_PRIMARY_CHANNEL',
        {
          subscribe: true,
          params: {
            chain_name: verifyTrace.trace[0].counterparty_name,
            destination_chain_name: destination_chain_name,
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
        data: {
          amount: amount,
          from_chain: chain_name,
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
          to_chain: destination_chain_name,
          through: primaryChannel,
        },
      });
      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel, verifyTrace.base_denom),
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
      console.log(verifyTrace);
      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: verifyTrace.trace[0].counterparty_name,
          destination_chain_name: destination_chain_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
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
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: chain_name,
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
          to_chain: destination_chain_name,
          through: primaryChannel,
        },
      });

      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel, verifyTrace.base_denom),
        },
        chain_name: destination_chain_name,
      };
      return result;
    }
  }
}
export async function transferToHub({ amount, chain_name }: ChainAmount) {
  /*
  This action creates the steps needed to get the chosen amount of chosen denom as a 1-hop token through the primary-channel on the hub
  */
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
    // If NOT an IBC denom
    if (chain_name == store.getters['demeris/getDexChain']) {
      // If already native to the hub, do nothing
      result.output = { amount, chain_name };
      return result;
    } else {
      if (store.getters['demeris/isVerified']({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the hub
        const primaryChannel =
          store.getters['demeris/getPrimaryChannel']({
            chain_name: chain_name,
            destination_chain_name: store.getters['demeris/getDexChain'],
          }) ??
          (await store.dispatch(
            'demeris/GET_PRIMARY_CHANNEL',
            {
              subscribe: true,
              params: { chain_name: chain_name, destination_chain_name: store.getters['demeris/getDexChain'] },
            },
            { root: true },
          ));
        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            to_chain: store.getters['demeris/getDexChain'],
            through: primaryChannel,
          },
        });

        result.output = {
          amount: {
            amount: amount.amount,
            denom: generateDenomHash(primaryChannel, amount.denom),
          },
          chain_name: store.getters['demeris/getDexChain'],
        };
        return result;
      } else {
        // If not verified denom, throw error
        throw new Error('Denom not verified');
      }
    }
  }
  // If IBC denom, first we get the trace
  let verifyTrace;
  try {
    verifyTrace =
      store.getters['demeris/getVerifyTrace']({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await store.dispatch(
        'demeris/GET_VERIFY_TRACE',
        { subscribe: true, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }
  if (verifyTrace.trace.length == 1 && chain_name == store.getters['demeris/getDexChain']) {
    // if we can verify the trace and denom is 1-hop on the hub, check what the primary channel is for the source-chain to the hub
    const primaryChannel =
      store.getters['demeris/getPrimaryChannel']({
        chain_name: verifyTrace.trace[0].counterparty_name,
        destination_chain_name: store.getters['demeris/getDexChain'],
      }) ??
      (await store.dispatch(
        'demeris/GET_PRIMARY_CHANNEL',
        {
          subscribe: true,
          params: {
            chain_name: verifyTrace.trace[0].counterparty_name,
            destination_chain_name: store.getters['demeris/getDexChain'],
          },
        },
        { root: true },
      ));
    if (primaryChannel == getChannel(verifyTrace.path, 0)) {
      // If channels match, denom is already a verified 1-hop token on the hub through the primary channel so no action needed

      result.output = { amount, chain_name };
      return result;
    } else {
      // If channels don't match we have to send the denom back through the trace channel and then forward again through the primary channel
      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: chain_name,
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
          to_chain: store.getters['demeris/getDexChain'],
          through: primaryChannel,
        },
      });
      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel, verifyTrace.base_denom),
        },
        chain_name: store.getters['demeris/getDexChain'],
      };
      return result;
    }
  } else {
    if (verifyTrace.trace.length > 1) {
      // If trace is longer than 1-hop, throw error because user must redeem the denom first (should never reach this part of the code
      // as the UI should not allow selection of such a token but leaving it here for consistency)
      throw new Error('Denom must be redeemed first');
    } else {
      // If trace is 1 hop but NOT on the hub. Send back to native chain through the channel in the trace, then forward to the hub
      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: verifyTrace.trace[0].counterparty_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
          {
            subscribe: true,
            params: {
              chain_name: verifyTrace.trace[0].counterparty_name,
              destination_chain_name: store.getters['demeris/getDexChain'],
            },
          },
          { root: true },
        ));
      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: chain_name,
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
          to_chain: store.getters['demeris/getDexChain'],
          through: primaryChannel,
        },
      });

      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel, verifyTrace.base_denom),
        },
        chain_name: store.getters['demeris/getDexChain'],
      };
      return result;
    }
  }
}
export async function transferFromHub({ amount, chain_name }: ChainAmount) {
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
    // If NOT an IBC denom
    if (chain_name == store.getters['demeris/getDexChain']) {
      // We're already on the hub, do nothing
      result.output = {
        amount,
        chain_name,
      };
      return result;
    } else {
      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: store.getters['demeris/getDexChain'],
          destination_chain_name: chain_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
          {
            subscribe: true,
            params: { chain_name: store.getters['demeris/getDexChain'], destination_chain_name: chain_name },
          },
          { root: true },
        ));
      result.steps.push({
        name: 'ibc_forward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: store.getters['demeris/getDexChain'],
          to_chain: chain_name,
          through: primaryChannel,
        },
      });
      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel, amount.denom),
        },
        chain_name,
      };
      return result;
    }
  }
  // If IBC get the trace
  let verifyTrace;
  try {
    verifyTrace =
      store.getters['demeris/getVerifyTrace']({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await store.dispatch(
        'demeris/GET_VERIFY_TRACE',
        { subscribe: true, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error. Should not happen here as transferFromHub is an action to move the tokens after an on-hub operation which has already included these tests
    throw new Error('Trace not verified');
  }
  if (verifyTrace.trace.length == 1) {
    if (verifyTrace.trace[0].counterparty_name == chain_name) {
      //if we want to transfer back to the origin chain

      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: store.getters['demeris/getDexChain'],
          to_chain: verifyTrace.trace[0].counterparty_name,
          through: verifyTrace.trace[0].channel,
        },
      });
      result.output = {
        amount: {
          amount: amount.amount,
          denom: verifyTrace.base_denom,
        },
        chain_name: verifyTrace.trace[0].counterparty_name,
      };
      return result;
    } else {
      //If we want to transfer to some other chain, need to go back to the origin chain then forwards to the target one
      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: verifyTrace.trace[0].counterparty_name,
          destination_chain_name: chain_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
          {
            subscribe: true,
            params: { chain_name: verifyTrace.trace[0].counterparty_name, destination_chain_name: chain_name },
          },
          { root: true },
        ));
      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: store.getters['demeris/getDexChain'],
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
          to_chain: chain_name,
          through: primaryChannel,
        },
      });

      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel, verifyTrace.base_denom),
        },
        chain_name,
      };
      return result;
    }
  } else {
    throw new Error('Denom must be redeemed first');
  }
}
export async function swap({ from, to }: { from: Amount; to: Amount }) {
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
    (await store.dispatch(
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
      chain_name: store.getters['demeris/getDexChain'],
    };
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
export async function addLiquidity({ pool_id, coinA, coinB }: { pool_id: bigint; coinA: Amount; coinB: Amount }) {
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
    (await store.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));
  // create our asset pair sorted alphabetically
  const assetPair = [coinA.denom, coinB.denom].sort();
  // Find the pool for that pair
  const pool =
    liquidityPools.pools.find((x) => JSON.stringify(x.reserveCoinDenoms) == JSON.stringify(assetPair)) ?? null;
  if (pool && pool.id == pool_id) {
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
    (await store.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));
  const pool = liquidityPools.pools.find((x) => x.poolCoinDenom == poolCoin.denom) ?? null;
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

// Action-handler / action composing using the blocks above
export async function actionHandler(action: Actions.Any): Promise<Array<Actions.Step>> {
  const steps = [];
  try {
    let params;
    switch (action.name) {
      case 'redeem':
        params = (action as Actions.RedeemAction).params;
        params.forEach(async (denom) => {
          const redeemStep = await redeem(denom);
          steps.push({ name: 'transfer', description: 'Redeeming Assets', transactions: [...redeemStep.steps] }); //TODO
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

        steps.push({ name: 'transfer', description: 'Assets Moved', transactions: [...moveStep.steps] }); //TODO

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

        steps.push({ name: 'transfer', description: 'Assets Transferred', transactions: [...transferStep.steps] }); //TODO
        break;
      case 'swap':
        params = (action as Actions.SwapAction).params;
        console.log(params);
        console.log({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          chain_name: params.from.chain_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        });
        const transferToHubStep = await move({
          amount: {
            amount: params.from.amount.amount,
            denom: params.from.amount.denom,
          },
          chain_name: params.from.chain_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        });

        steps.push({
          name: 'transfer',
          description: 'Assets Must be transferred to hub first', //TODO
          transactions: [...transferToHubStep.steps],
        });
        console.log(transferToHubStep);
        const swapStep = await swap({
          from: {
            amount: transferToHubStep.output.amount.amount,
            denom: transferToHubStep.output.amount.denom,
          },
          to: {
            amount: params.to.amount.amount,
            denom: params.to.amount.denom,
          },
        });
        steps.push({ name: 'swap', description: 'Assets Swapped', transactions: [...swapStep.steps] }); //TODO
        break;
      case 'addliquidity':
        params = (action as Actions.AddLiquidityAction).params;
        const transferCoinAtoHub = await move({
          amount: {
            amount: params.coinA.amount.amount,
            denom: params.coinA.amount.denom,
          },
          chain_name: params.coinA.chain_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        });
        steps.push({
          name: 'transfer',
          description: 'AssetA must be transferred to hub', //TODO
          transactions: [...transferCoinAtoHub.steps],
        });

        const transferCoinBtoHub = await move({
          amount: {
            amount: params.coinB.amount.amount,
            denom: params.coinB.amount.denom,
          },
          chain_name: params.coinB.chain_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        });
        steps.push({
          name: 'transfer',
          description: 'AssetB must be transferred to hub', //TODO
          transactions: [...transferCoinBtoHub.steps],
        });
        const addLiquidityStep = await addLiquidity({
          pool_id: params.pool_id,
          coinA: transferCoinAtoHub.output.amount,
          coinB: transferCoinBtoHub.output.amount,
        });
        steps.push({
          name: 'addliquidity',
          description: 'Adding Liquidity', //TODO
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
          destination_chain_name: store.getters['demeris/getDexChain'],
        });
        steps.push({
          name: 'transfer',
          description: 'Pool token must be transferred to hub', //TODO
          transactions: [...transferPoolCointoHub.steps],
        });
        const withdrawLiquidityStep = await withdrawLiquidity({
          pool_id: params.pool_id,
          poolCoin: transferPoolCointoHub.output.amount,
        });
        steps.push({
          name: 'withdrawliquidity',
          description: 'Withdrawing liquidity', //TODO
          transactions: [...withdrawLiquidityStep.steps],
        });
        break;
    }
  } catch (e) {
    console.log(e);
    console.log('Unable to create action steps');
  }

  return steps;
}
export async function msgFromStepTransaction(stepTx: Actions.StepTransaction): Promise<Actions.MsgMeta> {
  if (stepTx.name == 'transfer') {
    const data = stepTx.data as Actions.TransferData;
    const msg = await stores.dispatch('cosmos.bank.v1beta1/MsgSend', {
      value: {
        amount: [data.amount],
        toAddress: data.to_address,
        fromAddress: await getOwnAddress({ chain_name: data.chain_name }),
      },
    });
    const registry = stores.getters['cosmos.bank.v1beta1/getRegistry'];
    return { msg, chain_name: data.chain_name, registry };
  }

  if (stepTx.name == 'ibc_forward') {
    const data = stepTx.data as Actions.IBCForwardsData;
    let receiver;
    if (data.to_address) {
      receiver = data.to_address;
    } else {
      receiver = await getOwnAddress({ chain_name: data.to_chain });
    }
    const msg = await stores.dispatch('ibc.applications.transfer.v1/MsgTransfer', {
      value: {
        sourcePort: 'transfer',
        sourceChannel: data.through,
        sender: await getOwnAddress({ chain_name: data.from_chain }),
        receiver,
        timeoutTimestamp: Long.fromString(new Date().getTime() + 60000 + '000000'),
        token: data.amount,
      },
    });
    const registry = stores.getters['ibc.applications.transfer.v1/getRegistry'];
    return { msg, chain_name: data.from_chain, registry };
  }

  if (stepTx.name == 'ibc_backward') {
    const data = stepTx.data as Actions.IBCBackwardsData;
    let receiver;
    if (data.to_address) {
      receiver = data.to_address;
    } else {
      receiver = await getOwnAddress({ chain_name: data.to_chain });
    }
    const msg = await stores.dispatch('ibc.applications.transfer.v1/MsgTransfer', {
      value: {
        sourcePort: 'transfer',
        sourceChannel: data.through,
        sender: await getOwnAddress({ chain_name: data.from_chain }),
        receiver,
        timeoutTimestamp: Long.fromString(new Date().getTime() + 60000 + '000000'),
        token: data.amount,
      },
    });
    const registry = stores.getters['ibc.applications.transfer.v1/getRegistry'];
    return { msg, chain_name: data.from_chain, registry };
  }
  if (stepTx.name == 'addliquidity') {
    const chain_name = store.getters['demeris/getDexChain'];
    const data = stepTx.data as Actions.AddLiquidityData;
    const msg = await stores.dispatch('tendermint.liquidity.v1beta1/MsgDepositWithinBatch', {
      value: {
        depositorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        depositCoins: [data.coinA, data.coinB],
      },
    });
    const registry = stores.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg, chain_name, registry };
  }
  if (stepTx.name == 'withdrawliquidity') {
    const chain_name = store.getters['demeris/getDexChain'];
    const data = stepTx.data as Actions.WithdrawLiquidityData;
    const msg = await stores.dispatch('tendermint.liquidity.v1beta1/MsgWithdrawWithinBatch', {
      value: {
        withdrawerAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        depositCoins: [data.poolCoin],
      },
    });
    const registry = stores.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg, chain_name, registry };
  }
  if (stepTx.name == 'createpool') {
    const chain_name = store.getters['demeris/getDexChain'];
    const data = stepTx.data as Actions.CreatePoolData;
    const msg = await stores.dispatch('tendermint.liquidity.v1beta1/MsgCreatePool', {
      value: {
        poolCreatorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolTypeId: 1,
        depositCoins: [data.coinA, data.coinB],
      },
    });
    const registry = stores.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg, chain_name, registry };
  }
  if (stepTx.name == 'swap') {
    const chain_name = store.getters['demeris/getDexChain'];
    const data = stepTx.data as Actions.SwapData;
    const price = [data.from, data.to].sort((a, b) => {
      if (a.denom < b.denom) return -1;
      if (a.denom > b.denom) return 1;
      return 0;
    });
    const msg = await stores.dispatch('tendermint.liquidity.v1beta1/MsgSwapWithinBatch', {
      value: {
        swapRequesterAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        swapTypeId: data.pool.type_id,
        offerCoin: data.from.denom,
        demandCoinDenom: data.to.denom,
        offerCoinFee: 0,
        orderPrice: (BigInt(price[0].amount) / BigInt(price[1].amount)).toString(),
      },
    });
    const registry = stores.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg, chain_name, registry };
  }
}
export async function getFeeForChain(chain_name: string): Promise<Array<Actions.FeeWDenom>> {
  const denoms = store.getters['demeris/getFeeTokens']({
    chain_name,
  }) as Array<Denom>;
  const fees = [];
  for (const denom of denoms) {
    fees.push({ amount: denom.gas_price_levels, denom: denom.name, chain_name });
  }
  return fees;
}
export async function getDisplayName(name, chain_name = null) {
  if (isNative(name)) {
    const displayName = store.getters['demeris/getVerifiedDenoms'].find((x) => x.name == name)?.display_name ?? null;
    if (displayName) {
      return displayName;
    }
    const pools = store.getters['tendermint.liquidity.v1beta1/getLiquidityPools']();
    if (pools && pools.pools) {
      const pool = pools.pools.find((x) => x.pool_coin_denom == name);
      if (pool) {
        return (
          'GDEX ' +
          (await getDisplayName(pool.reserve_coin_denoms[0], chain_name)) +
          '/' +
          (await getDisplayName(pool.reserve_coin_denoms[1], chain_name)) +
          ' Pool'
        );
      } else {
        return name + '(unverified)';
      }
    }
  } else {
    let verifyTrace;
    try {
      verifyTrace =
        store.getters['demeris/getVerifyTrace']({ chain_name, hash: name.split('/')[1] }) ??
        (await store.dispatch(
          'demeris/GET_VERIFY_TRACE',
          { subscribe: true, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
      if (verifyTrace.verified) {
        return await getDisplayName(verifyTrace.base_denom);
      } else {
        return verifyTrace.base_denom + ' (unverified)';
      }
    } catch (e) {
      return name + '(unverified)';
    }
  }
}
export async function isLive(chain_name) {
  const status =
    store.getters['demeris/getChainStatus']({
      chain_name,
    }) ??
    (await store.dispatch(
      'demeris/GET_CHAIN_STATUS',
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
    const chain_name = store.getters['demeris/getDexChain'];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'withdrawliquidity') {
    const chain_name = store.getters['demeris/getDexChain'];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'createpool') {
    const chain_name = store.getters['demeris/getDexChain'];
    const fee = await getFeeForChain(chain_name);
    return fee;
  }
  if (stepTx.name == 'swap') {
    const chain_name = store.getters['demeris/getDexChain'];
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
          feeTotals[used.chain_name][used.amount.denom] + BigInt(used.amount.amount))
      : (feeTotals[used.chain_name][used.amount.denom] = BigInt(used.amount.amount));
  }
  return feeTotals;
}

export function getUsedFee(fees: Array<Actions.FeeWDenom>, gasPriceLevel: Actions.GasPriceLevel): ChainAmount {
  const feeOption = fees[0];
  const used = {
    amount: {
      amount: (parseInt(feeOption.amount[gasPriceLevel]) * store.getters['demeris/getGasLimit']).toString(),
      denom: feeOption.denom,
    },
    chain_name: feeOption.chain_name,
  };
  return used;
}

export async function toRedeem(balances: Balances): Promise<Balances> {
  const allValidRedeemableBalances = balances.filter((x) => x.verified && Object.keys(x.ibc).length !== 0);
  const redeemableBalances = [];
  for (const balance of allValidRedeemableBalances) {
    if (balance.ibc.path.split('/').length > 2) {
      redeemableBalances.push(balance);
    } else {
      let verifyTrace;
      try {
        verifyTrace =
          store.getters['demeris/getVerifyTrace']({ chain_name: balance.on_chain, hash: balance.ibc.hash }) ??
          (await store.dispatch(
            'demeris/GET_VERIFY_TRACE',
            { subscribe: false, params: { chain_name: balance.on_chain, hash: balance.ibc.hash } },
            { root: true },
          ));
      } catch (e) {
        continue;
      }

      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: verifyTrace.trace[0].counterparty_name,
          destination_chain_name: balance.on_chain,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
          {
            subscribe: true,
            params: { chain_name: verifyTrace.trace[0].counterparty_name, destination_chain_name: balance.on_chain },
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
