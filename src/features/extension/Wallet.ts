import every from 'lodash.every';
import isArray from 'lodash.isarray';

import { WalletFeatureMap } from '@/features/extension/types';

export class EmerisWallet {
  private readonly featureMap: WalletFeatureMap;
  private keplrWallet: CustomKeplr;
  public readonly isKeplrCompatible;
  private walletObj: any;

  /**
   *
   * @param walletObj - the object attached to the window by the extension
   * @param isKeplrCompatible - whether basic Keplr methods are available in the extension
   * @param featureMap
   */
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
      if (walletObj?.keplr && EmerisWallet.checkHasRequiredFeatures(walletObj.keplr)) {
        this.keplrWallet = walletObj.keplr;
        this.isKeplrCompatible = isKeplrCompatible;
      } else {
        console.error(
          `Wallet is not keplr-compatible - it's missing one or more of the following methods - [${Object.keys(
            WALLET_METHOD,
          ).join(', ')}]`,
        );
        this.isKeplrCompatible = false;
      }
    } else {
      this.isKeplrCompatible = false;
    }
  }

  //  for defaultOptions - unused for current implementation(https://github.com/EmerisHQ/emeris-extension/issues/29#issuecomment-1110542041)
  // public setKeplrValue(property: string, value: any) {
  //   this.keplrWallet[property] = value;
  // }

  /**
   * Calls a Keplr method
   * @param methodName
   * @param params
   */
  public async callKeplrMethod(methodName: WALLET_METHOD, ...params: any[]) {
    if (!this.isKeplrCompatible) throw new Error('Attempted to call Keplr method to a Keplr uncompatible Wallet');
    return new Promise(async (resolve, reject) => {
      let result;
      try {
        switch (methodName) {
          case WALLET_METHOD.enable:
            if (typeof params[0] !== 'string' && !(isArray(params[0]) && every(params[0], (v) => typeof v == 'string')))
              throw new TypeError('String or Array of strings param required');
            result = await this.keplrWallet.enable(params[0]);
            break;

          case WALLET_METHOD.getKey:
            if (typeof params[0] !== 'string') throw new TypeError('String param required');
            result = await this.keplrWallet.getKey(params[0]);
            break;

          case WALLET_METHOD.getOfflineSigner:
            if (typeof params[0] !== 'string') throw new TypeError('String param required');
            result = this.keplrWallet.getOfflineSigner(params[0]);
            break;
          default:
            throw new Error(`Missing switch case - unknown method [${methodName}]`);
        }
      } catch (ex) {
        console.error(`Error while calling keplr method - [${methodName}]`);
        reject(ex);
      }
      resolve(result);
    });
  }

  //  static functions
  static checkHasRequiredFeatures(object: unknown): object is CustomKeplr {
    return every(WALLET_METHOD, (method) => Object.prototype.hasOwnProperty.call(object, method));
  }
}

// TODO : add more methods as required by the app
export enum WALLET_METHOD {
  enable = 'enable',
  getKey = 'getKey',
  getOfflineSigner = 'getOfflineSigner',
}

function checkIsKeplr(object: unknown): object is CustomKeplr {
  const prototype = Object.getPrototypeOf(object);
  return EmerisWallet.checkHasRequiredFeatures(prototype);
}
