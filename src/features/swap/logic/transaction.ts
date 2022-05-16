import { EmerisDEXInfo } from '@emeris/types';
import retry from 'async-retry';
import axios from 'axios';

import { GlobalGetterTypes } from '@/store';
import { getOwnAddress, parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

import { getProtocolFromChain } from './protocol';

export interface SwapTransactionResult {
  remainingInputAmount?: string;
  inputAmount: string;
  inputDenom: string;
  outputAmount: string;
  outputDenom: string;
  poolId: string;
  orderPrice: string;
}

interface EncodedEvents {
  type: string;
  attributes: {
    key: string;
    value: string;
  }[];
}

export const parseEncodedEvents = (events: EncodedEvents[]): Record<string, Record<string, string>> => {
  const result = {};

  for (const { type, attributes } of events) {
    const obj = {};

    for (const attr of attributes) {
      const key = atob(attr.key);
      const value = attr.value ? atob(attr.value) : null;
      obj[key] = value;
    }

    if (result[type] === undefined) {
      result[type] = obj;
    } else if (Array.isArray(result[type])) {
      result[type] = [...result[type], obj];
    } else {
      result[type] = [result[type], obj];
    }
  }

  return result;
};

const fetchBlockResults = async (height: string, chainName: string): Promise<Record<string, any>> => {
  const endpoint = useStore().getters[GlobalGetterTypes.API.getEndpoint];
  const rpcUrl = `${endpoint}/chain/${chainName}/rpc/block_results`;

  const { data } = await retry(
    () => {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      return axios.get(`${rpcUrl}?height=${height}`);
    },
    { retries: 10, factor: 1 },
  );

  return data.result;
};

const getOsmosisResultFromDecodedEvents = (
  txEvents: Record<string, any>,
  requester?: string,
): SwapTransactionResult => {
  let data = txEvents?.token_swapped;

  if (!data) return;
  if (!Array.isArray(data)) data = [data];

  if (requester) data = data.filter((item) => item.sender === requester);

  const inputCoin = parseCoins(data[0].tokens_in)[0];
  const outputCoin = parseCoins(data[data.length - 1].tokens_out)[0];

  return {
    inputAmount: inputCoin.amount,
    inputDenom: inputCoin.denom,
    outputAmount: outputCoin.amount,
    outputDenom: outputCoin.denom,
    poolId: data[data.length - 1].pool_id,
    orderPrice: '0',
  };
};

export const getGravityResultFromDecodedEvents = (
  endBlockEvents: Record<string, any>,
  requester?: string,
): SwapTransactionResult | undefined => {
  let data = endBlockEvents.swap_transacted;

  if (!data) return;
  if (Array.isArray(data)) data = data[data.length - 1];

  if (requester) {
    if (data.swap_requester !== requester) return undefined;
  }

  return {
    remainingInputAmount: data.remaining_offer_coin_amount,
    inputAmount: data.exchanged_offer_coin_amount,
    inputDenom: data.offer_coin_denom,
    outputAmount: data.exchanged_demand_coin_amount,
    outputDenom: data.demand_coin_denom,
    poolId: data.pool_id,
    orderPrice: data.order_price,
  };
};

export const resolveSwapResponse = async (response: Record<string, any>, chainName: string, requester?: string) => {
  const protocol = getProtocolFromChain(chainName);
  const { height, tx_result } = response;

  if (!requester) requester = await getOwnAddress({ chain_name: chainName });

  if (protocol === EmerisDEXInfo.DEX.Osmosis) {
    const parsedEvents = parseEncodedEvents(tx_result.events);

    return getOsmosisResultFromDecodedEvents(parsedEvents, requester);
  }

  if (protocol === EmerisDEXInfo.DEX.Gravity) {
    const blockResults = await fetchBlockResults(height, chainName);
    const parsedEvents = parseEncodedEvents(blockResults.end_block_events);
    return getGravityResultFromDecodedEvents(parsedEvents, requester);
  }
};
