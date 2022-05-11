import { Coin, Secp256k1HdWallet } from '@cosmjs/amino';
import { sha256, stringToPath } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import { EmerisAPI } from '@emeris/types';
import { bech32 } from 'bech32';
import BigNumber from 'bignumber.js';
import findIndex from 'lodash/findIndex';

import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { demoAddresses } from '@/store/demeris-user/demo-account';
import { featureRunning } from '@/utils/FeatureManager';
import { useStore } from '@/utils/useStore';

export function fromHexString(hexString) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}
export function toHexString(byteArray) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    })
    .join('');
}
export function getChainFromRecipient(recipient: string) {
  const typedstore = useStore() as RootStoreTyped;
  const prefix = bech32.decode(recipient).prefix;
  return (
    Object.values(typedstore.getters[GlobalGetterTypes.API.getChains]).find(
      (x) => x.node_info.bech32_config.prefix_account == prefix,
    )?.chain_name ?? null
  );
}
export function hashObject(str: unknown): string {
  return toHex(sha256(encodeUTF8(JSON.stringify(str)))).toUpperCase();
}
export function keyHashfromAddress(address: string): string {
  try {
    return toHexString(bech32.fromWords(bech32.decode(address).words));
  } catch (e) {
    throw new Error('Could not decode address');
  }
}
export function chainAddressfromAddress(prefix: string, address: string) {
  return bech32.encode(prefix, bech32.decode(address).words);
}
export function chainAddressfromKeyhash(prefix: string, keyhash: string) {
  const words = bech32.toWords(Buffer.from(keyhash, 'hex'));
  // TODO: remove this replace once the backend stops adding non-zero ASCII in the response
  return keyhash !== '' ? bech32.encode(prefix.replace(/[\u200B-\u200D\uFEFF]/g, ''), words) : '';
}
export async function getOwnAddress({ chain_name }) {
  const isCypress = !!window['Cypress'];
  const typedstore = useStore() as RootStoreTyped;
  if (typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]) {
    return demoAddresses[chain_name];
  } else {
    if (!featureRunning('USE_NEW_CHAINS_API'))
      await typedstore.dispatch(GlobalActionTypes.API.GET_CHAIN, {
        subscribe: true,
        params: { chain_name },
      });
    const chain = typedstore.getters[GlobalGetterTypes.API.getChain]({ chain_name });
    if (isCypress) {
      const signer = await Secp256k1HdWallet.fromMnemonic(import.meta.env.VITE_EMERIS_MNEMONIC, {
        prefix: chain.node_info.bech32_config.main_prefix,
        hdPaths: [stringToPath(chain.derivation_path)],
      });
      const [account] = await signer.getAccounts();
      const key = {
        name: 'Cypress Test',
        algo: account.algo,
        pubKey: account.pubkey,
        bech32Address: account.address,
        isNanoLedger: false,
        address: fromHexString(keyHashfromAddress(account.address)),
      };
      return key.bech32Address;
    } else {
      let key;
      if (featureRunning('USE_EMERIS_EXTENSION')) {
        key = await walletActionHandler.getAccount(chain.node_info.chain_id);
      } else {
        key = await window.keplr.getKey(chain.node_info.chain_id);
      }
      return key.bech32Address;
    }
  }
}

export function isValidatorOffline(validator: EmerisAPI.Validator) {
  return validator.status === 1 || validator.status === 2;
}

export function isNative(denom: string) {
  if (denom) {
    return denom.indexOf('ibc/') != 0 ? true : false;
  } else {
    return false;
  }
}

export function getChannel(path, index) {
  const parts = path.split('/');
  return parts[index * 2 + 1];
}
const LOGIN_TIMEOUT = 1000 * 60 * 60 * 24 * 30; //  30 days
export function autoLogin() {
  const last = window.localStorage.getItem('lastEmerisSession');
  if (last && last != '' && Date.now() < parseInt(last) + LOGIN_TIMEOUT) {
    return true;
  } else {
    return false;
  }
}
export function autoLoginDemo() {
  const returning = window.localStorage.getItem('isReturnUser');
  if (returning) {
    return true;
  } else {
    return false;
  }
}
export function encodeUTF8(s) {
  let i = 0;
  const bytes = new Uint8Array(s.length * 4);
  for (let ci = 0; ci != s.length; ci++) {
    let c = s.charCodeAt(ci);
    if (c < 128) {
      bytes[i++] = c;
      continue;
    }
    if (c < 2048) {
      bytes[i++] = (c >> 6) | 192;
    } else {
      if (c > 0xd7ff && c < 0xdc00) {
        if (++ci >= s.length) throw new Error('UTF-8 encode: incomplete surrogate pair');
        const c2 = s.charCodeAt(ci);
        if (c2 < 0xdc00 || c2 > 0xdfff)
          throw new Error(
            'UTF-8 encode: second surrogate character 0x' + c2.toString(16) + ' at index ' + ci + ' out of range',
          );
        c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
        bytes[i++] = (c >> 18) | 240;
        bytes[i++] = ((c >> 12) & 63) | 128;
      } else bytes[i++] = (c >> 12) | 224;
      bytes[i++] = ((c >> 6) & 63) | 128;
    }
    bytes[i++] = (c & 63) | 128;
  }
  return bytes.subarray(0, i);
}

export function getDenomHash(path, base_denom, hopsToRemove = 0) {
  const parts = path.split('/');
  parts.push(base_denom);
  const newPath = parts.slice(hopsToRemove * 2).join('/');
  return 'ibc/' + toHex(sha256(encodeUTF8(newPath))).toUpperCase();
}

export function generateDenomHash(channel, base_denom) {
  const parts = ['transfer', channel];
  parts.push(base_denom);
  const newPath = parts.join('/');
  return 'ibc/' + toHex(sha256(encodeUTF8(newPath))).toUpperCase();
}

export const hexToRGB = (hex: string) => {
  return hex
    .replace('#', '')
    .match(/[A-Za-z0-9]{2}/g)
    .map((v) => parseInt(v, 16))
    .join(',');
};
export function parseCoins(input: string): Coin[] {
  return input
    .replace(/\s/g, '')
    .split(',')
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^([0-9]+)(?:\.[0-9]+)?([a-zA-Z0-9\/-]{2,127})$/);
      if (!match) throw new Error('Got an invalid coin string');
      return {
        amount: BigInt(match[1]).toString(),
        denom: match[2],
      };
    });
}

/**
 * @desc splits a string by the number part and character part
 * @param input
 */
export function alphanumericSplit(input: string): Coin {
  const denom = input.match(/([a-zA-Z])+$/)[0];
  const numeric = input.match(/^\d+(\.\d{1,2})?/)[0];
  if (!denom || !numeric) {
    throw new Error(`Alphanumeric Split failed for string - [${input}]`);
  }
  return {
    amount: numeric,
    denom: denom,
  };
}

// A = 65, z = 122
export function getFirstAlphabet(str: string) {
  const index = findIndex(str, (letter) => {
    return letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 122;
  });
  if (index !== -1) return str[index];
  return '';
}

export function getDisplayAmount(rawAmount: string | number, precision = 6): string {
  return new BigNumber(rawAmount).dividedBy(10 ** precision).toFixed(precision);
}

export function checkStringIsKeybase(str: string) {
  if (!str || str.length !== 16) return false;
  return /[0-9A-F]{16}/.test(str.toUpperCase());
}

export function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
}

export function getChainFromDex(dex) {
  //temp util till API includes this info.
  return (
    {
      osmosis: 'osmosis',
      gravity: 'cosmos-hub',
    }[dex] || null
  );
}

export function getCleanURL(str: string) {
  if (!str || str === '') return;
  const url = str.split('://')[1];
  if (!url || str === '') return str;
  if (url[url.length - 1] === '/') return url.slice(0, url.length - 2);
  return url;
}

export function getProperUrl(str: string) {
  if (!/https?:\/\//.test(str)) return `https://${str}`;
  return str;
}

// ignores denoms that are not of baseDenom
export function getSumOfRewards(totalValue: string, baseDenom: string) {
  if (!totalValue || !baseDenom) return 0;
  const total = parseCoins(totalValue ?? '0')
    .map((value) => (value.denom !== baseDenom ? '0' : value.amount))
    .reduce((prevValue, currentValue) => BigNumber.sum(prevValue, currentValue).toString());
  return parseFloat(total ?? '0');
}

export const truncateMiddle = (str: string, left = 3, right = 3): string => {
  if (typeof str !== 'string') return '';
  if (str.length <= left + right) return str;
  return str.slice(0, left) + '...' + str.slice(str.length - right, str.length);
};
