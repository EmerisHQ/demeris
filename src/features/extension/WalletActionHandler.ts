import { SupportedWallet, WalletData, WalletFeatureMap } from '@/features/extension/types';
import { EmerisWallet, WALLET_METHOD } from '@/features/extension/Wallet';

export const SupportedWalletData: Record<SupportedWallet, WalletData> = {
  [SupportedWallet.KEPLR]: {
    isKeplrCompatible: true,
  },
  [SupportedWallet.EMERIS]: {
    isKeplrCompatible: true,
  },
};

class WalletActionHandler {
  private currentWallet: SupportedWallet;
  private walletMap = new Map<SupportedWallet, EmerisWallet>();

  /**
   * @desc adds a supported wallet throws on failure, returns true on success
   * @param wallet
   * @param walletObj
   * @param isKeplrCompatible
   */
  public add(wallet: SupportedWallet, walletObj: any, isKeplrCompatible = false, featureMap?: WalletFeatureMap) {
    try {
      this.walletMap.set(wallet, new EmerisWallet(walletObj, isKeplrCompatible, featureMap));
      return true;
    } catch (ex) {
      console.error(`failed to set wallet - ${wallet}`, ex);
      throw new Error(ex);
    }
  }

  public isAvailable(wallet: SupportedWallet) {
    return this.walletMap.has(wallet);
  }

  get isConnected() {
    return this.walletMap.has(this.currentWallet);
  }

  public connect(wallet: SupportedWallet) {
    if (!this.walletMap.has(wallet)) throw new Error(`Wallet[${wallet}] is unavailable, needs to be added first`);
    this.currentWallet = wallet;
  }

  get wallet() {
    if (!this.isConnected) throw new Error(`Wallet is not currently connected`);
    return this.walletMap.get(this.currentWallet);
  }

  public async call(method: WALLET_METHOD, params: any[], isKeplrMethod = true) {
    if (!this.isConnected) throw new Error('wallet not loaded');
    if (Object.values(WALLET_METHOD).includes(method) && isKeplrMethod) {
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
