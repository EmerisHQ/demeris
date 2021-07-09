import { Coin } from '@cosmjs/amino';
import { sha256 } from '@cosmjs/crypto';
import { toHex } from '@cosmjs/encoding';
import { Uint64 } from '@cosmjs/math';
import { bech32 } from 'bech32';

import { store } from '../store/index';

export function toHexString(byteArray) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    })
    .join('');
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
export async function getOwnAddress({ chain_name }) {
  const chain = store.getters['demeris/getChain']({ chain_name });
  const key = await window.keplr.getKey(chain.node_info.chain_id);
  return key.bech32Address;
}
export function isNative(denom: string) {
  return denom.indexOf('ibc/') != 0 ? true : false;
}

export function getChannel(path, index) {
  const parts = path.split('/');
  return parts[index * 2 + 1];
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
      const match = part.match(/^([0-9]+)([a-zA-Z][a-zA-Z0-9/-]{2,127})$/);
      if (!match) throw new Error('Got an invalid coin string');
      return {
        amount: Uint64.fromString(match[1]).toString(),
        denom: match[2],
      };
    });
}
