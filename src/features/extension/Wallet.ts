import { Keplr as KeplrWallet } from '@keplr-wallet/types';
import every from 'lodash.every';

import { WalletFeatureMap } from '@/features/extension/types';

export class EmerisWallet {
  //  remove Partial from below when feature map is properly implemented
  private readonly featureMap: WalletFeatureMap;
  private keplrWallet: KeplrWallet;
  public readonly isKeplrCompatible;
  private walletObj: any;

  constructor(walletObj: any, isKeplrCompatible = false, featureMap?: WalletFeatureMap) {
    this.walletObj = walletObj;
    if (featureMap) this.featureMap = featureMap;
    else if (!isKeplrCompatible) throw Error('Does not have a featureMap and is not Keplr compatible');

    // the wallet is Keplr
    if (checkIsKeplr(walletObj)) {
      this.keplrWallet = walletObj;
      this.isKeplrCompatible = true;
      return;
    }

    if (isKeplrCompatible) {
      if (walletObj?.keplr && checkIsValidKeplrWallet(walletObj.keplr)) {
        this.keplrWallet = walletObj.keplr;
        this.isKeplrCompatible = isKeplrCompatible;
      } else {
        console.error(
          `Wallet is not keplr-compatible - it's missing one or more of the following methods - [${keplrMethods.join(
            ', ',
          )}]`,
        );
        this.isKeplrCompatible = false;
      }
    } else {
      this.isKeplrCompatible = false;
    }
  }

  //  for defaultOptions
  public setKeplrValue(property: string, value: any) {
    this.keplrWallet[property] = value;
  }

  public async callKeplrMethod(methodName: string, ...params: any[]) {
    if (!this.isKeplrCompatible) throw new Error('Attempted to call Keplr method to a Keplr uncompatible Wallet');
    if (keplrMethods.includes(methodName))
      throw new Error(`Attempted to call method [${methodName}] which is not a Keplr method`);
    return new Promise((resolve, reject) => {
      const result = this.keplrWallet[methodName](...params);
      // return value is promise
      if (typeof result?.then === 'function') {
        result
          .then((res) => {
            resolve(res);
          })
          .catch((ex) => {
            console.error(`Error while calling keplr method - [${methodName}]`);
            reject(ex);
          });
      }
    });
  }
}

// TODO : add more methods as required by the app
export const keplrMethods = ['enable', 'getKey', 'getOfflineSigner'];
function checkIsValidKeplrWallet(object: unknown): object is KeplrWallet {
  return every(keplrMethods, (method) => Object.prototype.hasOwnProperty.call(object, method));
}

function checkIsKeplr(object: unknown): object is KeplrWallet {
  const prototype = Object.getPrototypeOf(object);
  return every(keplrMethods, (method) => Object.prototype.hasOwnProperty.call(prototype, method));
}
