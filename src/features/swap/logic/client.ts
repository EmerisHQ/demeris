/* eslint-disable max-lines-per-function */
import { EmerisDEXInfo } from '@emeris/types';
import axios from 'axios';

import { SwapContext } from '../state';
import { amountToUnit } from './amount';

export const fetchDexInfoSwaps = async (): Promise<EmerisDEXInfo.Swaps> => {
  const { data } = await axios.get('https://api.dev.emeris.com/v1/dexinfo/swaps');
  return data.swaps;
};

export const fetchSwapRoutes = async (context: SwapContext, direction?: string) => {
  const payload = {
    chainIn: context.inputCoin.chain,
    denomIn: context.inputCoin.denom,
    denomOut: context.outputCoin.denom,
    amountIn: amountToUnit({ amount: context.inputAmount, denom: context.inputCoin?.baseDenom }).amount,
    amountOut: amountToUnit({ amount: context.outputAmount, denom: context.outputCoin?.baseDenom }).amount,
  };

  if (direction === 'input') payload.amountOut = null;
  if (direction === 'output') payload.amountIn = null;

  const { data } = await axios.post('https://api.dev.emeris.com/v1/daggregation/routing', payload);
  if (data.routes?.length === 0) {
    throw new Error('No swaps available');
  }
  return data.routes;
};

export const fetchAvailableDenoms = async () => {
  try {
    const { data } = await axios.get('https://api.dev.emeris.com/v1/daggregation/available_denoms', {});

    return data.denoms;
  } catch {
    // Mock fallback
    return [
      'crescent/ucre',
      'crescent/ubcre',
      'crescent/ibc/c4cff46fd6de35ca4cf4ce031e643c8fdc9ba4b99ae598e9b0ed98fe3a2319f9',
      'cosmos-hub/ibc/14F9BC3E44B8A9C1BE1FB08980FAB87034C9905EF17CF2F5008FC085218811CC',
      'cosmos-hub/uatom',
      'osmosis/uosmo',
      'cosmos-hub/ibc/12DA42304EE1CE96071F712AA4D58186AD11C3165C0DCDA71E017A54F3935E66',
      'cosmos-hub/ibc/42E47A5BA708EBE6E0C227006254F2784E209F4DBD3C6BB77EDC4B29EF875E8E',
      'iris/uiris',
      'sentinel/udvpn',
      'cosmos-hub/ibc/81D08BC39FB520EBD948CF017910DD69702D34BF5AC160F76D3B5CFC444EBCE0',
      'persistence/uxprt',
      'cosmos-hub/ibc/2181AAB0218EAC24BC9F86BD1364FBBFA3E6E3FCC25E88E3E68C15DC6E752D86',
      'akash/uakt',
      'cosmos-hub/ibc/1FBDD58D438B4D04D26CBFB2E722C18984A0F1A52468C4F42F37D102F3D3F399',
      'regen/uregen',
      'cosmos-hub/ibc/5BB694D466CCF099EF73F165F88472AF51D9C4991EAA42BD1168C5304712CC0D',
      'osmosis/uion',
      'cosmos-hub/ibc/B2B5AEE174062FA7804AC95223D8169852F8F58962C51C66391C272C838258B7',
      'ixo/uixo',
      'cosmos-hub/ibc/1D5826F7EDE6E3B13009FEF994DC9CAAF15CC24CA7A9FF436FFB2E56FD72F54F',
      'likecoin/nanolike',
      'cosmos-hub/ibc/ADBEC1A7AC2FEF73E06B066A1C94DAB6C27924EF7EA3F5A43378150009620284',
      'bitcanna/ubcna',
      'osmosis/ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
      'osmosis/ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4',
      'osmosis/ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
      'osmosis/ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0',
      'osmosis/ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293',
      'osmosis/ibc/1DCC8A6CB5689018431323953344A9F6CC4D0BFB261E88C9F7777372C10CD076',
      'osmosis/ibc/CD942F878C80FBE9DEAB8F8E57F592C7252D06335F193635AF002ACBD69139CC',
      'microtick/utick',
      'osmosis/ibc/A91B70554A510310B2A068979C8E7A9B433EF689E82A9321922D8A1B845B95F5',
      'cosmos-hub/poolDFB8434D5A80B4EAFA94B6878BD5B85265AC6C5D37204AB899B1C3C52543DA7E',
      'osmosis/ibc/655BCEF3CDEBE32863FF281DBBE3B06160339E9897DC9C9C9821932A5F8BA6F8',
      'osmosis/ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
      'osmosis/ibc/F3FF7A84A73B62921538642F9797C423D2B4C4ACB3C7FCFFCE7F12AA69909C4B',
      'osmosis/ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
      'osmosis/ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
      'ki/uxki',
      'osmosis/ibc/EA3E1640F9B1532AB129A571203A0B9F789A7F14BB66E350DCBFA18E1A1931F0',
      'comdex/ucmdx',
      'osmosis/ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA',
      'cheqd/ncheq',
      'osmosis/ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
      'chihuahua/uhuahua',
      'osmosis/ibc/8A34AF0C1943FD0DFCDE9ADBF0B2C9959C45E87E6088EA2FC6ADACD59261B8A2',
      'lum/ulum',
      'osmosis/ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
      'desmos/udsm',
      'osmosis/ibc/9BBA9A1C257E971E38C1422780CE6F0B0686F0A3085E2D61118D904BFE0F5F5E',
      'sommelier/usomm',
      'osmosis/ibc/8318FD63C42203D16DDCAF49FE10E8590669B3219A3E87676AC9DA50722687FB',
      'sifchain/rowan',
    ];
  }
};
