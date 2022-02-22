import { Coin, Secp256k1HdWallet } from '@cosmjs/amino';
import { sha256, stringToPath } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import { bech32 } from 'bech32';
import findIndex from 'lodash/findIndex';

import { GlobalDemerisGetterTypes, TypedAPIStore, TypedUSERStore } from '@/store';
import { demoAddresses } from '@/store/demeris-user/demo-account';
import { Chain } from '@/types/api';
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
  const apistore = useStore() as TypedAPIStore;
  const prefix = bech32.decode(recipient).prefix;
  return (
    (Object.values(apistore.getters[GlobalDemerisGetterTypes.API.getChains]) as Chain[]).find(
      (x) => (x as Chain).node_info.bech32_config.prefix_account == prefix,
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
  return keyhash != '' ? bech32.encode(prefix, words) : '';
}
export async function getOwnAddress({ chain_name }) {
  const isCypress = !!window['Cypress'];
  const userstore = useStore() as TypedUSERStore;
  const apistore = useStore() as TypedAPIStore;
  if (userstore.getters[GlobalDemerisGetterTypes.USER.isDemoAccount]) {
    return demoAddresses[chain_name];
  } else {
    const chain = apistore.getters[GlobalDemerisGetterTypes.API.getChain]({ chain_name });
    if (isCypress) {
      const signer = await Secp256k1HdWallet.fromMnemonic(process.env.VUE_APP_EMERIS_MNEMONIC, {
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
      const key = await window.keplr.getKey(chain.node_info.chain_id);
      return key.bech32Address;
    }
  }
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
export function autoLogin() {
  const last = window.localStorage.getItem('lastEmerisSession');
  if (last && last != '' && Date.now() < parseInt(last) + 60000) {
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
      const match = part.match(/^([0-9]+)([a-zA-Z0-9\/-]{2,127})$/);
      if (!match) throw new Error('Got an invalid coin string');
      return {
        amount: BigInt(match[1]).toString(),
        denom: match[2],
      };
    });
}

// A = 65, z = 122
export function getFirstAlphabet(str: string) {
  const index = findIndex(str, (letter) => {
    return letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 122;
  });
  if (index !== -1) return str[index];
  return '';
}

export function checkStringIsKeybase(str: string) {
  if (!str || str.length !== 16) return false;
  return /[0-9A-F]{16}/.test(str.toUpperCase());
}
