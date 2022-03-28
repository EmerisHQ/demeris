import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ActionStepResult } from '@/types/actions';
import { getBaseDenom, getFeeForChain } from '@/utils/actionHandler';
import { generateDenomHash, getChannel, getOwnAddress, isNative } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export async function memoTransfer({
  amount,
  chain_name,
  destination_chain_name,
  to_address,
}: {
  amount: AbstractAmount;
  chain_name: string;
  destination_chain_name: string;
  to_address: string;
}) {
  const typedstore = useStore() as RootStoreTyped;
  const result: ActionStepResult = {
    steps: [],
    mustAddFee: false,
    output: {
      denom: '',
      amount: '0',
      chain_name: '',
    },
  };
  const fromAddress = await getOwnAddress({ chain_name });
  const toOwnAddress = await getOwnAddress({ chain_name: destination_chain_name });
  if (isNative(amount.denom)) {
    if (chain_name == destination_chain_name) {
      result.steps.push({
        type: 'transfer',
        status: 'pending',
        data: {
          amount,
          chainName: chain_name,
          fromAddress,
          toAddress: to_address,
        },
      });
      return result;
    } else {
      if (typedstore.getters[GlobalGetterTypes.API.isVerified]({ denom: amount.denom, chain_name })) {
        // If verified denom on a different chain, ibc_forward through primary channel to the destination_chain_name
        const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
          chain_name: chain_name,
          destination_chain_name: destination_chain_name,
        });
        result.steps.push({
          type: 'IBCtransfer-forward',
          status: 'pending',
          chainFee: await getFeeForChain(chain_name),
          data: {
            amount: amount,
            chainName: chain_name,
            fromAddress,
            toAddress: toOwnAddress,
            toChain: destination_chain_name,
            through: primaryChannel,
          },
        });

        const counterpartyChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
          chain_name: destination_chain_name,
          destination_chain_name: chain_name,
        });
        result.steps.push({
          type: 'transfer',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: generateDenomHash(counterpartyChannel, amount.denom) },
            chainName: destination_chain_name,
            fromAddress: toOwnAddress,
            toAddress: to_address,
          },
        });
        return result;
      }
    }
  }
  let verifyTrace;
  try {
    verifyTrace =
      typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({ chain_name, hash: amount.denom.split('/')[1] }) ??
      (await typedstore.dispatch(
        GlobalActionTypes.API.GET_VERIFY_TRACE,
        { subscribe: false, params: { chain_name, hash: amount.denom.split('/')[1] } },
        { root: true },
      ));
  } catch (e) {
    //  If we cannot verify the trace, throw error
    throw new Error('Trace not verified');
  }

  if (verifyTrace.trace.length == 1 && chain_name == destination_chain_name) {
    const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
      chain_name: chain_name,
      destination_chain_name: verifyTrace.trace[0].counterparty_name,
    });
    if (primaryChannel == getChannel(verifyTrace.path, 0)) {
      result.steps.push({
        type: 'transfer',
        status: 'pending',
        data: {
          amount,
          chainName: chain_name,
          fromAddress,
          toAddress: to_address,
        },
      });
      return result;
    } else {
      result.mustAddFee = true;
      const toNativeAddress = await getOwnAddress({ chain_name: verifyTrace.trace[0].counterparty_name });
      result.steps.push({
        type: 'IBCtransfer-backward',
        status: 'pending',
        addFee: true,
        feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
        data: {
          amount: amount,
          fromAddress,
          toAddress: toNativeAddress,
          chainName: chain_name,
          // base_denom: await getBaseDenom(amount.denom, chain_name), TODO: add to AbstractAmount
          toChain: verifyTrace.trace[0].counterparty_name,
          through: verifyTrace.trace[0].channel,
        },
      });
      result.steps.push({
        type: 'IBCtransfer-forward',
        status: 'pending',
        chainFee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
        data: {
          amount: { amount: amount.amount, denom: verifyTrace.base_denom },
          chainName: verifyTrace.trace[0].counterparty_name,
          fromAddress: toNativeAddress,
          toAddress: toOwnAddress,
          toChain: destination_chain_name,
          through: primaryChannel,
        },
      });

      result.steps.push({
        type: 'transfer',
        status: 'pending',
        data: {
          amount: { amount: amount.amount, denom: generateDenomHash(primaryChannel, verifyTrace.base_denom) },
          chainName: destination_chain_name,
          fromAddress: toOwnAddress,
          toAddress: to_address,
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
      const toNativeAddress = await getOwnAddress({ chain_name: verifyTrace.trace[0].counterparty_name });
      if (verifyTrace.trace[0].counterparty_name == destination_chain_name) {
        result.steps.push({
          type: 'IBCtransfer-backward',
          status: 'pending',
          data: {
            amount: amount,
            chainName: chain_name,
            //base_denom: await getBaseDenom(amount.denom, chain_name), add to AbstractAmount
            toChain: verifyTrace.trace[0].counterparty_name,
            fromAddress,
            toAddress: toNativeAddress,
            through: verifyTrace.trace[0].channel,
          },
        });
        result.steps.push({
          type: 'transfer',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: await getBaseDenom(amount.denom, chain_name) },
            chainName: verifyTrace.trace[0].counterparty_name,
            fromAddress,
            toAddress: to_address,
          },
        });
      } else {
        result.mustAddFee = true;
        result.steps.push({
          type: 'IBCtransfer-backward',
          status: 'pending',
          feeToAdd: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          addFee: true,
          data: {
            amount: amount,
            chainName: chain_name,
            //base_denom: await getBaseDenom(amount.denom, chain_name),
            fromAddress,
            toAddress: toNativeAddress,
            toChain: verifyTrace.trace[0].counterparty_name,
            through: verifyTrace.trace[0].channel,
          },
        });
      }
      if (verifyTrace.trace[0].counterparty_name != destination_chain_name) {
        const primaryChannel = typedstore.getters[GlobalGetterTypes.API.getPrimaryChannel]({
          chain_name: verifyTrace.trace[0].counterparty_name,
          destination_chain_name: destination_chain_name,
        });
        result.steps.push({
          type: 'IBCtransfer-forward',
          status: 'pending',
          chainFee: await getFeeForChain(verifyTrace.trace[0].counterparty_name),
          data: {
            amount: { amount: amount.amount, denom: verifyTrace.base_denom },
            chainName: verifyTrace.trace[0].counterparty_name,
            fromAddress: toNativeAddress,
            toAddress: toOwnAddress,
            toChain: destination_chain_name,
            through: primaryChannel,
          },
        });

        result.steps.push({
          type: 'transfer',
          status: 'pending',
          data: {
            amount: { amount: amount.amount, denom: generateDenomHash(primaryChannel, verifyTrace.base_denom) },
            chainName: destination_chain_name,
            fromAddress: toOwnAddress,
            toAddress: to_address,
          },
        });
      }

      return result;
    }
  }
}
