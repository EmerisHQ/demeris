import { EmerisBase } from '@emeris/types';

import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getBaseDenom } from '@/utils/actionHandler';
import { getDenomHash, isNative } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export async function redeem({ amount, denom, chain_name }: EmerisBase.ChainAmount) {
  const typedstore = useStore() as RootStoreTyped;
  const result = {
    steps: [],
    output: {
      denom: '',
      amount: '0',
      chain_name: '',
    },
  };

  if (isNative(denom)) {
    // If NOT an IBC denom, nothing to do
    result.output = { amount, denom, chain_name };
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
      result.steps.push({
        name: 'ibc_backward',
        status: 'pending',
        data: {
          amount: { amount: amount, denom: getDenomHash(verifyTrace.path, verifyTrace.base_denom, i) },
          base_denom: await getBaseDenom(getDenomHash(verifyTrace.path, verifyTrace.base_denom, i), hop.chain_name),
          from_chain: hop.chain_name,
          to_chain: hop.counterparty_name,
          through: hop.channel,
        },
      });
      i++;
    }
    result.output = {
      amount: amount,
      denom: verifyTrace.base_denom,
      chain_name: verifyTrace.trace[verifyTrace.trace.length - 1].counterparty_name,
    };

    return result;
  }
}
