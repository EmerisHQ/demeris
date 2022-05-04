import { isFunction, isObject, keys } from 'lodash';
import every from 'lodash/every';

import { NestedMap, WalletFeatureMap } from '@/features/extension/types';

export class EmerisWallet {
  private readonly featureMap: WalletFeatureMap;
  private walletObj: any;

  /**
   *
   * @param walletObj - the object attached to the window by the extension
   * @param featureMap
   */
  constructor(walletObj: any, featureMap: WalletFeatureMap) {
    if (!EmerisWallet.checkHasRequiredFeatures(walletObj, featureMap)) {
      console.error(`Wallet is not compatible with Emeris - it's missing one or more of the required methods`);
    }

    this.walletObj = walletObj;
    this.featureMap = featureMap;
  }

  //  static functions
  static checkHasRequiredFeatures(walletObject: unknown, featureMap: WalletFeatureMap): boolean {
    every(keys(featureMap), (key) => {
      return hasWalletFeature(key, featureMap, walletObject);
    });
    return true;
  }
}

/**
 * @desc checks whether the feature is mapped correctly, recursively inside objects as well
 * TODO : more correct type checks maybe? But probably overkill atm
 * @param param - the feature currently being checked. Recursively applies if the value is an object
 * @param map - the featureMap in the current context.
 * @param targetWallet - object with all the features directly appended
 */
function hasWalletFeature(param: string, map: NestedMap, targetWallet: unknown) {
  if (typeof map[param] === 'string') {
    const featureName = map[param] as string;
    if (isFunction(targetWallet[featureName])) return true;
    console.warn(`Wallet missing feature [${param}], should have method '${featureName}' in wallet object`);
    return false;
  } else if (isObject(map[param])) {
    const childMap = map[param] as NestedMap;
    return every(keys(childMap), (childKey) => {
      return hasWalletFeature(childKey, childMap, targetWallet);
    });
  }
  throw new Error('Feature map consists of values that are not a string or object');
}
