import * as Actions from '@/types/actions';
import { Amount } from '@/types/base';

import { store } from '../store/index';
import { generateDenomHash,getChannel, getDenomHash, isNative } from './basic';

// Basic step-building blocks
export async function redeem({ amount, chain_name }: { amount: Amount; chain_name: string }) {
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

  if (isNative(amount.denom)) {
    // If NOT an IBC denom, nothing to do
    result.output = { amount, chain_name };
    return result;
  } else {
    // else we get the trace for this IBC denom
    const verifyTrace =
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
    if (!verifyTrace.verified) {
      //  If we cannot verify the trace, throw error
      throw new Error('Trace not verified');
    } else {
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
}
export async function transferToHub({ amount, chain_name }: { amount: Amount; chain_name: string }) {
  /*
	This action creates the steps needed to get the chosen amount of chosen denom as a 1-hop token through the primary-channel on the hub
	*/
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

  if (isNative(amount.denom)) {
    // If NOT an IBC denom
    if (chain_name == 'gaia') {
      // If already native to the hub, do nothing
      result.output = { amount, chain_name };
      return result;
    } else {
      if (store.getters['demeris/isVerified']({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the hub
        const primaryChannel =
          store.getters['demeris/getPrimaryChannel']({
            chain_name: chain_name,
            destination_chain_name: 'gaia',
          }) ??
          (await store.dispatch(
            'demeris/GET_PRIMARY_CHANNEL',
            {
              subscribe: true,
              params: { chain_name: chain_name, destination_chain_name: 'gaia' },
            },
            { root: true },
          ));
        result.steps.push({
          name: 'ibc_forward',
          status: 'pending',
          data: {
            amount: amount,
            from_chain: chain_name,
            to_chain: 'gaia',
            through: primaryChannel.channel_name,
          },
        });

        result.output = {
          amount: {
            amount: amount.amount,
            denom: generateDenomHash(primaryChannel.channel_name, amount.denom),
          },
          chain_name: 'gaia',
        };
        return result;
      } else {
        // If not verified denom, throw error
        throw new Error('Denom not verified');
      }
    }
  }
  // If IBC denom, first we get the trace
  const verifyTrace =
    store.getters['demeris/getVerifyTrace']({ chain_name, hash: amount.denom.split('/')[1] }) ??
    (await store.dispatch(
      'demeris/GET_VERIFY_TRACE',
      { subscribe: true, params: { chain_name, hash: amount.denom.split('/')[1] } },
      { root: true },
    ));

  if (!verifyTrace.verified) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }
  if (verifyTrace.trace.length == 1 && chain_name == 'gaia') {
    // if we can verify the trace and denom is 1-hop on the hub, check what the primary channel is for the source-chain to the hub
    const primaryChannel =
      store.getters['demeris/getPrimaryChannel']({
        chain_name: verifyTrace.trace[0].counterparty_name,
        destination_chain_name: 'gaia',
      }) ??
      (await store.dispatch(
        'demeris/GET_PRIMARY_CHANNEL',
        {
          subscribe: true,
          params: { chain_name: verifyTrace.trace[0].counterparty_name, destination_chain_name: 'gaia' },
        },
        { root: true },
      ));
    if (primaryChannel.channel_name == getChannel(verifyTrace.path, 0)) {
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
          to_chain: 'gaia',
          through: primaryChannel.channel_name,
        },
      });
      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel.channel_name, verifyTrace.base_denom),
        },
        chain_name: 'gaia',
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
          destination_chain_name: 'gaia',
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
          {
            subscribe: true,
            params: { chain_name: verifyTrace.trace[0].counterparty_name, destination_chain_name: 'gaia' },
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
          to_chain: 'gaia',
          through: primaryChannel.channel_name,
        },
      });

      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel.channel_name, verifyTrace.base_denom),
        },
        chain_name: 'gaia',
      };
      return result;
    }
  }
}
export async function transferFromHub({ amount, chain_name }: { amount: Amount; chain_name: string }) {
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

  if (isNative(amount.denom)) {
    // If NOT an IBC denom
    if (chain_name == 'gaia') {
      // We're already on the hub, do nothing
      result.output = {
        amount,
        chain_name,
      };
      return result;
    } else {
      const primaryChannel =
        store.getters['demeris/getPrimaryChannel']({
          chain_name: 'gaia',
          destination_chain_name: chain_name,
        }) ??
        (await store.dispatch(
          'demeris/GET_PRIMARY_CHANNEL',
          {
            subscribe: true,
            params: { chain_name: 'gaia', destination_chain_name: chain_name },
          },
          { root: true },
        ));
      result.steps.push({
        name: 'ibc_forward',
        status: 'pending',
        data: {
          amount: amount,
          from_chain: 'gaia',
          to_chain: chain_name,
          through: primaryChannel.channel_name,
        },
      });
      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel.channel_name, amount.denom),
        },
        chain_name,
      };
      return result;
    }
  }
  // If IBC get the trace
  const verifyTrace =
    store.getters['demeris/getVerifyTrace']({ chain_name, hash: amount.denom.split('/')[1] }) ??
    (await store.dispatch(
      'demeris/GET_VERIFY_TRACE',
      { subscribe: true, params: { chain_name, hash: amount.denom.split('/')[1] } },
      { root: true },
    ));

  if (!verifyTrace.verified) {
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
          from_chain: 'gaia',
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
          from_chain: 'gaia',
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
          through: primaryChannel.channel_name,
        },
      });

      result.output = {
        amount: {
          amount: amount.amount,
          denom: generateDenomHash(primaryChannel.channel_name, verifyTrace.base_denom),
        },
        chain_name,
      };
      return result;
    }
  } else {
    throw new Error('Denom must be redeemed first');
  }
}
export async function swap({
  from,
  to,
}: {
  from: { denom: string; amount: number };
  to: { denom: string; amount: number };
}) {
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
    liquidityPools.pools.find(x => JSON.stringify(x.reserve_coin_denoms) == JSON.stringify(assetPair)) ?? null;
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
      chain_name: 'gaia',
    };
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
//Todo: transfer, add to liquidity pool, withdraw from liquidity pool

// Action-handler / action composing using the blocks above
export async function actionHandler(action: Actions.Any): Promise<Array<Actions.Step>> {
  const steps = [];
  try {
    switch (action.name) {
      case 'swap':
        const transferToHubStep = await transferToHub({
          amount: {
            amount: (action.params as Actions.SwapParams).from.amount,
            denom: (action.params as Actions.SwapParams).from.denom.denom,
          },
          chain_name: (action.params as Actions.SwapParams).from.denom.chain_name,
        });

        steps.push(...transferToHubStep.steps);
        const swapStep = await swap({
          from: {
            amount: transferToHubStep.output.amount.amount,
            denom: transferToHubStep.output.amount.denom,
          },
          to: {
            amount: (action.params as Actions.SwapParams).to.amount,
            denom: (action.params as Actions.SwapParams).to.denom.denom,
          },
        });
        steps.push(...swapStep.steps);
        break;
    }
  } catch (e) {
    console.log('Unable to create action steps');
  }

  return steps;
}
export async function getFeeForChain(chain_name: string): Promise<number> {
  const fee =
    store.getters['demeris/getFee']({
      chain_name,
    }) ??
    (await store.dispatch(
      'demeris/GET_FEE',
      {
        subscribe: false,
        params: {
          chain_name,
        },
      },
      { root: true },
    ));
  return fee;
}

export async function feeForStep(step: Actions.Step): Promise<number> {
  switch (step.name) {
    case 'ibc_backward':
      return await getFeeForChain((step.data as Actions.IBCBackwardsData).from_chain);
    case 'ibc_forward':
      return await getFeeForChain((step.data as Actions.IBCForwardsData).from_chain);
    case 'swap':
      return await getFeeForChain('gaia');
  }
}
