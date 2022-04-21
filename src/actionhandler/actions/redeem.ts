/* eslint-disable max-lines-per-function */
import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ActionStepResult } from '@/types/actions';
import { getDenomHash, getOwnAddress, isNative } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export async function redeem({ amount, denom, chain_name }: AbstractAmount) {
  const typedstore = useStore() as RootStoreTyped;
  const result: ActionStepResult = {
    steps: [],
    output: {
      denom: '',
      amount: '0',
      chain_name: '',
    },
  };

  if (isNative(denom)) {
    // If NOT an IBC denom, nothing to do
    result.output = { amount, denom, chain_name, base_denom: denom };
    return result;
  } else {
    // else we get the trace for this IBC denom
    let verifyTrace;
    try {
      verifyTrace =
        typedstore.getters[GlobalGetterTypes.API.getVerifyTrace]({
          chain_name,
          hash: denom.split('/')[1],
        }) ??
        (await typedstore.dispatch(
          GlobalActionTypes.API.GET_VERIFY_TRACE,
          {
            subscribe: false,
            params: {
              chain_name,
              hash: denom.split('/')[1],
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
      const fromAddress = await getOwnAddress({ chain_name: hop.chain_name });
      const toAddress = await getOwnAddress({ chain_name: hop.counterparty_name });
      result.steps.push({
        type: 'IBCtransferBackward',
        status: 'pending',
        data: {
          amount: { amount: amount, denom: getDenomHash(verifyTrace.path, verifyTrace.base_denom, i) },
          fromAddress,
          toAddress,
          chainName: hop.chain_name,
          toChain: hop.counterparty_name,
          through: hop.channel,
        },
      });
      i++;
    }
    result.output = {
      amount: amount,
      denom: verifyTrace.base_denom,
      base_denom: verifyTrace.base_denom,
      chain_name: verifyTrace.trace[verifyTrace.trace.length - 1].counterparty_name,
    };

    return result;
  }
}
