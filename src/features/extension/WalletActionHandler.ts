import { SupportedWallets, WalletFeatureMap } from '@/features/extension/types';
import { EmerisWallet, keplrMethods } from '@/features/extension/Wallet';

class WalletActionHandler {
  private currentWallet: SupportedWallets;
  private walletMap = new Map<SupportedWallets, EmerisWallet>();

  /**
   * @desc adds a supported wallet throws / returns false on failure, returns true on success
   * @param wallet
   * @param walletObj
   * @param isKeplrCompatible
   */
  public add(wallet: SupportedWallets, walletObj: any, isKeplrCompatible = false, featureMap?: WalletFeatureMap) {
    try {
      this.walletMap.set(wallet, new EmerisWallet(walletObj, isKeplrCompatible, featureMap));
      return true;
    } catch (ex) {
      console.error(`failed to set wallet - ${wallet}`, ex);
      throw new Error(ex);
    }
  }

  public isAvailable(wallet: SupportedWallets) {
    return this.walletMap.has(wallet);
  }

  public connect(wallet: SupportedWallets) {
    this.currentWallet = wallet;
  }

  get wallet() {
    return this.walletMap.get(this.currentWallet);
  }

  public async call(method: string, params: any[], isKeplrMethod = true) {
    if (!this.currentWallet) throw new Error('wallet not loaded');
    if (keplrMethods.includes(method) && isKeplrMethod) {
      if (!this.wallet.isKeplrCompatible) throw new Error('currentWallet is not keplr compatible');
      return new Promise(async (resolve, reject) => {
        try {
          const res = await this.wallet.callKeplrMethod(method, ...params);
          resolve(res);
        } catch (ex) {
          reject(ex);
        }
      });
    }
    throw new Error('non-keplr methods are not implemented yet');
  }
}

export const walletActionHandler = new WalletActionHandler();
