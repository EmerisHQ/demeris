import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { ChainData } from '@/store/demeris-api/state';
import { Denom } from '@/types/api';
import { AmountWithMeta } from '@/types/base';

import { useStore } from './useStore';

export async function addChain(chain_name: string): Promise<void> {
  const apistore = useStore() as TypedAPIStore;
  const chain = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({
    chain_name,
  }) as ChainData;
  let rpc;
  let rest;
  if (chain.chain_name == 'terra') {
    rpc = 'https://rpc-columbus.keplr.app';
    rest = 'https://lcd-columbus.keplr.app';
  } else if (chain.chain_name == 'microtick') {
    rpc = 'https://microtick.chorus.one';
    rest = 'https://microtick-lcd.chorus.one';
  } else if (chain.chain_name == 'bitcanna') {
    rpc = 'https://rpc.bitcanna.io';
    rest = 'https://lcd.bitcanna.io';
  } else if (chain.chain_name == 'juno') {
    rpc = 'https://rpc-juno.nodes.guru';
    rest = 'https://api-juno.nodes.guru';
  } else if (chain.chain_name == 'likecoin') {
    rpc = 'https://mainnet-node.like.co/rpc';
    rest = 'https://mainnet-node.like.co';
  } else {
    rpc = chain.public_node_endpoints.tendermint_rpc[0];
    rest = chain.public_node_endpoints.cosmos_api[0];
  }
  await window.keplr.experimentalSuggestChain({
    chainId: chain.node_info.chain_id,
    chainName: chain.display_name,
    rpc,
    rest,
    stakeCurrency: {
      coinDenom: chain.denoms.filter((x) => x.stakable)[0].display_name,
      coinMinimalDenom: chain.denoms.filter((x) => x.stakable)[0].name,
      coinDecimals: parseInt(chain.denoms.filter((x) => x.stakable)[0].precision),
    },
    bip44: {
      coinType: parseInt(chain.derivation_path.split('/')[2].slice(0, -1)),
    },
    bech32Config: {
      bech32PrefixAccAddr: chain.node_info.bech32_config.acc_addr,
      bech32PrefixAccPub: chain.node_info.bech32_config.acc_pub,
      bech32PrefixValAddr: chain.node_info.bech32_config.val_addr,
      bech32PrefixValPub: chain.node_info.bech32_config.val_pub,
      bech32PrefixConsAddr: chain.node_info.bech32_config.cons_addr,
      bech32PrefixConsPub: chain.node_info.bech32_config.cons_pub,
    },
    currencies: chain.denoms.map((x: Denom) => {
      const y: AmountWithMeta = {
        amount: '0',
        denom: '',
        coinDenom: '',
        coinMinimalDenom: '',
        coinDecimals: 0,
      };
      y.coinDenom = x.display_name;
      y.coinMinimalDenom = x.name;
      y.coinDecimals = parseInt(x.precision);

      if (isNaN(y.coinDecimals)) {
        y.coinDecimals = 6;
      }
      return y;
    }),
    feeCurrencies: chain.denoms
      .filter((x) => x.fee_token)
      .map((x: Denom) => {
        const y: AmountWithMeta = {
          amount: '0',
          denom: '',
          coinDenom: '',
          coinMinimalDenom: '',
          coinDecimals: 0,
        };
        y.coinDenom = x.display_name.toUpperCase();
        y.coinMinimalDenom = x.name;
        y.coinDecimals = parseInt(x.precision);
        if (isNaN(y.coinDecimals)) {
          y.coinDecimals = 6;
        }
        return y;
      }),
    coinType: parseInt(chain.derivation_path.split('/')[2].slice(0, -1)),
    gasPriceStep: {
      low: 0.01,
      average: 0.025,
      high: 0.04,
    },
    features: ['stargate', 'ibc-transfer'],
  });
}
