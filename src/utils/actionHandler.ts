import Long from 'long';

import { ChainData } from '@/store/demeris/state';
import * as Actions from '@/types/actions';
import { Balance, Balances, Denom, IbcInfo } from '@/types/api';
import * as API from '@/types/api';
import { Amount, ChainAmount } from '@/types/base';

import { store, useAllStores } from '../store/index';
import {
  generateDenomHash,
  getChannel,
  getDenomHash,
  getOwnAddress,
  isNative,
  keyHashfromAddress,
  parseCoins,
} from './basic';

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
        { subscribe: false, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }

  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel =
      store.getters['demeris/getPrimaryChannel']({
        chain_name: chain_name,
        destination_chain_name: verifyTrace.trace[0].counterparty_name,
      }) ??
      (await store.dispatch(
        'demeris/GET_PRIMARY_CHANNEL',
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
      if (verifyTrace.trace[0].counterparty_name == destination_chain_name) {
        result.steps.push({
          name: 'ibc_backward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            to_chain: verifyTrace.trace[0].counterparty_name,
            to_address,
            through: verifyTrace.trace[0].channel,
          },
        });
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
      }
      if (verifyTrace.trace[0].counterparty_name != destination_chain_name) {
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

        const invPrimaryChannel =
          store.getters['demeris/getPrimaryChannel']({
            chain_name: destination_chain_name,
            destination_chain_name: chain_name,
          }) ??
          (await store.dispatch(
            'demeris/GET_PRIMARY_CHANNEL',
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
      store.getters['demeris/getVerifyTrace']({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await store.dispatch(
        'demeris/GET_VERIFY_TRACE',
        { subscribe: false, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }
  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel =
      store.getters['demeris/getPrimaryChannel']({
        chain_name: chain_name,
        destination_chain_name: verifyTrace.trace[0].counterparty_name,
      }) ??
      (await store.dispatch(
        'demeris/GET_PRIMARY_CHANNEL',
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

      const invPrimaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: destination_chain_name,
          destination_chain_name: chain_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
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

      if (verifyTrace.trace[0].counterparty_name !== destination_chain_name) {
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
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: verifyTrace.base_denom },
            from_chain: verifyTrace.trace[0].counterparty_name,
            to_chain: destination_chain_name,
            through: primaryChannel,
          },
        });

        const invPrimaryChannel =
          store.getters['demeris/getPrimaryChannel']({
            chain_name: destination_chain_name,
            destination_chain_name: verifyTrace.trace[0].counterparty_name,
          }) ??
          (await store.dispatch(
            'demeris/GET_PRIMARY_CHANNEL',
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
          destination_chain_name: store.getters['demeris/getDexChain'],
        });
        if (transferToHubStep.steps.length > 0) {
          steps.push({
            name: 'transfer',
            description: 'Assets Must be transferred to hub first', //TODO
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
        steps.push({ name: 'swap', description: 'Assets Swapped', transactions: [...swapStep.steps] }); //TODO
        break;
      case 'createpool':
        params = (action as Actions.CreatePoolAction).params;
        const transferCoinAtoHubCreate = await move({
          amount: {
            amount: params.coinA.amount.amount,
            denom: params.coinA.amount.denom,
          },
          chain_name: params.coinA.chain_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        });

        if (transferCoinAtoHubCreate.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetA must be transferred to hub', //TODO
            transactions: [...transferCoinAtoHubCreate.steps],
          });
        }

        const transferCoinBtoHubCreate = await move({
          amount: {
            amount: params.coinB.amount.amount,
            denom: params.coinB.amount.denom,
          },
          chain_name: params.coinB.chain_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        });

        if (transferCoinBtoHubCreate.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetB must be transferred to hub', //TODO
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
          destination_chain_name: store.getters['demeris/getDexChain'],
        });

        if (transferCoinAtoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetA must be transferred to hub', //TODO
            transactions: [...transferCoinAtoHub.steps],
          });
        }

        const transferCoinBtoHub = await move({
          amount: {
            amount: params.coinB.amount.amount,
            denom: params.coinB.amount.denom,
          },
          chain_name: params.coinB.chain_name,
          destination_chain_name: store.getters['demeris/getDexChain'],
        });

        if (transferCoinBtoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'AssetB must be transferred to hub', //TODO
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
        if (transferPoolCointoHub.steps.length) {
          steps.push({
            name: 'transfer',
            description: 'Pool token must be transferred to hub', //TODO
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
          transactions: [...withdrawLiquidityStep.steps],
        });
        break;
    }
  } catch (e) {
    throw new Error('Unable to create action steps: ' + e);
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
        timeoutTimestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
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
        timeoutTimestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
        token: data.amount,
      },
    });
    const registry = stores.getters['ibc.applications.transfer.v1/getRegistry'];
    return { msg, chain_name: data.from_chain, registry };
  }
  if (stepTx.name == 'addliquidity') {
    const chain_name = store.getters['demeris/getDexChain'];
    const data = stepTx.data as Actions.AddLiquidityData;
    let depositCoins;
    if (data.coinA.denom > data.coinB.denom) {
      depositCoins = [data.coinB, data.coinA];
    } else {
      depositCoins = [data.coinA, data.coinB];
    }
    const msg = await stores.dispatch('tendermint.liquidity.v1beta1/MsgDepositWithinBatch', {
      value: {
        depositorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolId: data.pool.id,
        depositCoins,
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
        poolCoin: { ...data.poolCoin },
      },
    });
    const registry = stores.getters['tendermint.liquidity.v1beta1/getRegistry'];
    return { msg, chain_name, registry };
  }
  if (stepTx.name == 'createpool') {
    const chain_name = store.getters['demeris/getDexChain'];
    const data = stepTx.data as Actions.CreatePoolData;
    let depositCoins;
    if (data.coinA.denom > data.coinB.denom) {
      depositCoins = [data.coinB, data.coinA];
    } else {
      depositCoins = [data.coinA, data.coinB];
    }
    const msg = await stores.dispatch('tendermint.liquidity.v1beta1/MsgCreatePool', {
      value: {
        poolCreatorAddress: await getOwnAddress({ chain_name }), // TODO: change to liq module chain
        poolTypeId: 1,
        depositCoins: depositCoins,
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
        poolId: parseInt(data.pool.id),
        swapTypeId: data.pool.type_id,
        offerCoin: { amount: data.from.amount, denom: data.from.denom },
        demandCoinDenom: data.to.denom,
        offerCoinFee: { amount: '0', denom: data.from.denom },
        orderPrice: (parseInt(price[0].amount) / parseInt(price[1].amount))
          .toFixed(18)
          .replace('.', '')
          .replace(/(^0+)/, ''),
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
export async function getBaseDenom(denom: string, chainName = null): Promise<string> {
  const chain_name = chainName || store.getters['demeris/getDexChain'];
  const verifiedDenoms = store.getters['demeris/getVerifiedDenoms'];

  if (verifiedDenoms.find((item) => item.name === denom)) {
    return denom;
  }

  const hash = denom.split('/')[1];

  if (!hash) {
    return denom;
  }

  let trace = store.getters['demeris/getVerifyTrace']({ chain_name, hash });

  if (!trace) {
    trace = await store.dispatch(
      'demeris/GET_VERIFY_TRACE',
      { subscribe: false, params: { chain_name, hash } },
      { root: true },
    );
  }

  if (trace) {
    return trace.base_denom;
  }

  return denom;
}
export async function getDisplayName(name, chain_name = null) {
  if (isNative(name)) {
    const displayName = store.getters['demeris/getVerifiedDenoms']?.find((x) => x.name == name)?.display_name ?? null;
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
          { subscribe: false, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
    } catch (e) {
      console.error(e);
      return name + '(unverified)';
    }

    return await getDisplayName(verifyTrace.base_denom);
  }
}
export async function getTicker(name, chain_name = null) {
  if (isNative(name)) {
    const ticker = store.getters['demeris/getVerifiedDenoms']?.find((x) => x.name == name)?.ticker ?? null;
    if (ticker) {
      return ticker;
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
          { subscribe: false, params: { chain_name, hash: name.split('/')[1] } },
          { root: true },
        ));
      return await getDisplayName(verifyTrace.base_denom);
    } catch (e) {
      console.log(e);
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
    console.log(used);
    feeTotals[used.chain_name][used.amount.denom]
      ? (feeTotals[used.chain_name][used.amount.denom] =
          feeTotals[used.chain_name][used.amount.denom] + parseFloat(used.amount.amount))
      : (feeTotals[used.chain_name][used.amount.denom] = parseFloat(used.amount.amount));
    console.log('here');
    console.log(feeTotals);
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
  const feeOption = fees[0];
  console.log(gasPriceLevel);
  const used = {
    amount: {
      amount: (parseFloat(feeOption.amount[gasPriceLevel]) * store.getters['demeris/getGasLimit']).toString(),
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
          chain_name: balance.on_chain,
          destination_chain_name: verifyTrace.trace[0].counterparty_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
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
  const validBalances = [];
  const verifiedDenoms = store.getters['demeris/getVerifiedDenoms'];

  for (const balance of balances) {
    const ownAddress = await getOwnAddress({ chain_name: balance.on_chain });
    const hashAddress = keyHashfromAddress(ownAddress);

    if (balance.address !== hashAddress) {
      continue;
    }

    if (Object.keys(balance.ibc).length == 0) {
      if (verifiedDenoms.find((item) => item.name === balance.base_denom)) {
        validBalances.push(balance);
      }
    } else {
      if (balance.ibc.path.split('/').length > 2) {
        continue;
      }
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

      if (!verifyTrace.verified) {
        continue;
      }

      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: balance.on_chain,
          destination_chain_name: verifyTrace.trace[0].counterparty_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
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
  const validPools = [];
  const verifiedDenoms = store.getters['demeris/getVerifiedDenoms'];
  const dexChain = store.getters['demeris/getDexChain'];

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

export async function validateStepFeeBalances(
  step: Actions.Step,
  balances: Balances,
  fees: Actions.FeeTotals,
): Promise<Actions.FeeWarning> {
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
        if (amount.denom == data.coinA.denom && x.on_chain == store.getters['demeris/getDexChain']) {
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
        if (amount.denom == data.coinB.denom && x.on_chain == store.getters['demeris/getDexChain']) {
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
      const creationFee = store.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee;
      const feeBalance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == creationFee.denom && x.on_chain == store.getters['demeris/getDexChain']) {
          return true;
        } else {
          return false;
        }
      });

      const balanceA = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.coinA.denom && x.on_chain == store.getters['demeris/getDexChain']) {
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
        if (amount.denom == data.coinB.denom && x.on_chain == store.getters['demeris/getDexChain']) {
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
            chain_name: store.getters['demeris/getDexChain'],
            denom: creationFee.denom,
          });
        }
      } else {
        feeWarning.feeWarning = false;
        feeWarning.missingFees.push({
          amount: '' + creationFee.amount,
          chain_name: store.getters['demeris/getDexChain'],
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
            if (rcptBalance) {
              const newIbcAmount = parseInt(parseCoins(rcptBalance.amount)[0].amount) + parseInt(data.amount.amount);
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
      const chain = store.getters['demeris/getChain']({ chain_name: data.to_chain });
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
        feeWarning.ibcDetails.chain_name = store.getters['demeris/getDisplayChain']({ name: data.to_chain });
        feeWarning.ibcDetails.ibcDenom = await getDisplayName(ibcBalance.base_denom);
        feeWarning.ibcDetails.denom = store.getters['demeris/getChain']({
          chain_name: data.to_chain,
        }).denoms.find((x) => x.fee_token == true).display_name;
      }
    }
    if (stepTx.name == 'swap') {
      const data = stepTx.data as Actions.SwapData;
      const balance = balances.find((x) => {
        const amount = parseCoins(x.amount)[0];
        if (amount.denom == data.from.denom && x.on_chain == store.getters['demeris/getDexChain']) {
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
      const swapFeeRate = store.getters['tendermint.liquidity.v1beta1/getParams']().params.swap_fee_rate;
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
          chain_name: store.getters['demeris/getDexChain'],
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
        if (amount.denom == data.poolCoin.denom && x.on_chain == store.getters['demeris/getDexChain']) {
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

export async function isValidIBCReserveDenom(
  denom: string,
  dexChain: string,
  verifiedDenoms: API.VerifiedDenoms,
): Promise<boolean> {
  let verifyTrace;

  try {
    verifyTrace =
      store.getters['demeris/getVerifyTrace']({ chain_name: dexChain, hash: denom.split('/')[1] }) ??
      (await store.dispatch(
        'demeris/GET_VERIFY_TRACE',
        { subscribe: true, params: { chain_name: dexChain, hash: denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    return false;
  }

  if (verifyTrace.path.split('/').length > 2) {
    return false;
  }

  if (!verifiedDenoms.find((item) => item.name === verifyTrace.base_denom)) {
    return false;
  }

  const primaryChannel =
    store.getters['demeris/getPrimaryChannel']({
      chain_name: dexChain,
      destination_chain_name: verifyTrace.trace[0].counterparty_name,
    }) ??
    (await store.dispatch(
      'demeris/GET_PRIMARY_CHANNEL',
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
