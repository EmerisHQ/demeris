import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { Key } from '@keplr-wallet/types';
import { each, isFunction, isObject, keys, map } from 'lodash';
import every from 'lodash/every';

import WalletError, {
  NestedMap,
  SupportedWallet,
  UnsubscribeableListener,
  WalletFeatureMap,
  WalletMethods,
} from '@/features/extension/types';

export class EmerisWallet {
  private readonly featureMap: WalletFeatureMap;
  private readonly walletType: SupportedWallet;
  private walletObj: unknown;

  /**
   * @param walletType
   * @param walletObj - the object attached to the window by the extension
   * @param featureMap -
   */
  constructor(walletType: SupportedWallet, walletObj: any, featureMap: WalletFeatureMap) {
    if (!EmerisWallet.checkHasRequiredFeatures(walletObj, featureMap)) {
      console.error(`Wallet is not compatible with Emeris - it's missing one or more of the required methods`);
    }
    this.walletType = walletType;
    this.walletObj = walletObj;
    this.featureMap = featureMap;
  }

  /**
   * @desc subscribes to wallet events. Unsuscribing should be handled outside
   * @returns callback that unsubs all the event listeners
   */
  public subscribeWalletEvents(): () => void {
    // TODO : append more subscribable events by adding to below array
    const subscribeFuncs: UnsubscribeableListener[] = [
      this.getNestedValue(WalletMethods.subscribeAccountChange, this.featureMap) as UnsubscribeableListener,
    ];
    const unsubFuncArray = map(subscribeFuncs, (suscribeFunc) => suscribeFunc());
    return () => each(unsubFuncArray, (unsubCb) => unsubCb());
  }

  public async getAccount(chainId: string): Promise<Key> {
    const method = this.getMethodName(WalletMethods.getAccount);
    try {
      return await this.walletObj[method](chainId);
    } catch (ex) {
      throw new WalletError(this.walletType, ex);
    }
  }

  public async getOfflineSigner(chainId: string): Promise<OfflineSigner & OfflineDirectSigner> {
    const method = this.getMethodName(WalletMethods.getOfflineSigner);
    try {
      return await this.walletObj[method](chainId);
    } catch (ex) {
      throw new WalletError(this.walletType, ex);
    }
  }

  public async enable(chainId: string | string[]): Promise<boolean> {
    const method = this.getMethodName(WalletMethods.enable);
    try {
      return await this.walletObj[method](chainId);
    } catch (ex) {
      throw new WalletError(this.walletType, ex);
    }
  }

  private getMethodName(walletMethod: WalletMethods) {
    if (!this.featureMap[walletMethod]) throw new TypeError(`Unknown or undefined WalletMethod - ${walletMethod}`);
    return this.featureMap[walletMethod];
  }

  //  static functions
  static checkHasRequiredFeatures(walletObject: unknown, featureMap: WalletFeatureMap): boolean {
    return every(keys(featureMap), (key) => {
      return hasWalletFeature(key, featureMap, walletObject);
    });
  }

  /**
   * @desc for strings using a '.' as a separator for deeply nested values
   * declared as private in order to access `this.walletType` for more info on error handling
   * @param param
   * @param targetObj
   */
  private getNestedValue(param: string, targetObj: NestedMap): unknown {
    try {
      if (param.includes('.')) {
        let currentObj = targetObj;
        const splitParams = param.split('.');
        for (let index = 0; index < splitParams.length - 1; index++) {
          currentObj = currentObj[splitParams[index]] as NestedMap;
        }
        return currentObj[splitParams[splitParams.length - 1]] as string;
      }
      return targetObj[param] as string;
    } catch (ex) {
      console.error(`Failed to retrive nested value - ${param}`);
      throw new WalletError(this.walletType, ex);
      return '';
    }
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
