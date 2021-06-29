import { ChainData } from '@/store/demeris/state';
import { Denom } from '@/types/api';
import { AmountWithMeta } from '@/types/base';

import { store } from '../store/index';

export async function addChain(chain_name: string): Promise<void> {
  const chain = store.getters['demeris/getChain']({
    chain_name,
  }) as ChainData;
  console.log({
    chainId: chain.node_info.chain_id,
    chainName: chain.display_name,
    rpc: 'https://' + chain.chain_name + '-emeris.app.alpha.starport.cloud',
    rest: 'https://api.' + chain.chain_name + '-emeris.app.alpha.starport.cloud',
    stakeCurrency: {
      coinDenom: chain.denoms.filter((x) => x.stakable)[0].display_name,
      coinMinimalDenom: chain.denoms.filter((x) => x.stakable)[0].name,
      coinDecimals: 0,
    },
    bip44: {
      coinType: 118,
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
      const y = {
        coinDenom: '',
        coinMinimalDenom: '',
        coinDecimals: 0,
      };
      y.coinDenom = x.display_name;
      y.coinMinimalDenom = x.name;
      y.coinDecimals = parseInt(x.precision);
      return y;
    }),
    feeCurrencies: chain.denoms
      .filter((x) => x.fee_token)
      .map((x: Denom) => {
        const y = {
          coinDenom: '',
          coinMinimalDenom: '',
          coinDecimals: 0,
        };
        y.coinDenom = x.display_name.toUpperCase();
        y.coinMinimalDenom = x.name;
        y.coinDecimals = parseInt(x.precision);
        return y;
      }),
    coinType: 118,
    gasPriceStep: {
      low: 0.01,
      average: 0.025,
      high: 0.04,
    },
  });
  await window.keplr.experimentalSuggestChain({
    chainId: chain.node_info.chain_id,
    chainName: chain.display_name,
    rpc: 'https://' + chain.chain_name + '-emeris.app.alpha.starport.cloud',
    rest: 'https://api.' + chain.chain_name + '-emeris.app.alpha.starport.cloud',
    stakeCurrency: {
      coinDenom: chain.denoms.filter((x) => x.stakable)[0].display_name,
      coinMinimalDenom: chain.denoms.filter((x) => x.stakable)[0].name,
      coinDecimals: 0,
    },
    bip44: {
      coinType: 118,
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
        return y;
      }),
    coinType: 118,
    gasPriceStep: {
      low: 0.01,
      average: 0.025,
      high: 0.04,
    },
  });
}
