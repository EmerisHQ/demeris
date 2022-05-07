import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { Key } from '@keplr-wallet/types';
import { noop } from 'lodash';

import { SupportedWallet, WalletFeatureMap } from '@/features/extension/types';
import { EmerisWallet } from '@/features/extension/Wallet';

class WalletActionHandler {
  private currentWallet: SupportedWallet;
  private walletMap = new Map<SupportedWallet, EmerisWallet>();
  private unsubscribeWalletEvents: () => void = noop; // array of functions to call when switching connected wallet in order to unsub
  private debugMode = process.env.NODE_ENV === 'development';

  /**
   * @desc adds a supported wallet throws on failure, returns true on success
   * @param wallet
   * @param walletObj
   */
  public add(wallet: SupportedWallet, walletObj: any, featureMap: WalletFeatureMap) {
    try {
      this.walletMap.set(wallet, new EmerisWallet(wallet, walletObj, featureMap));
      return true;
    } catch (ex) {
      console.error(`failed to set wallet - ${wallet}`, ex);
      throw new Error(ex);
    }
  }

  private cleanupWalletEvents() {
    this.unsubscribeWalletEvents();
    this.unsubscribeWalletEvents = noop;
  }

  private get wallet() {
    if (!this.isConnected) throw new Error(`Wallet is not currently connected`);
    return this.walletMap.get(this.currentWallet);
  }

  public isAvailable(wallet: SupportedWallet) {
    return this.walletMap.has(wallet);
  }

  get isConnected() {
    return this.walletMap.has(this.currentWallet);
  }

  private subscribeWalletEvents() {
    if (!this.isConnected) throw new Error('No wallet connected but attempted to subscribe to wallet events');
    this.unsubscribeWalletEvents = this.wallet.subscribeWalletEvents();
  }

  public disconnect() {
    this.cleanupWalletEvents();
    this.currentWallet = null;
  }

  //  wallet methods
  public connect(wallet: SupportedWallet): boolean {
    if (!this.walletMap.has(wallet)) throw new Error(`Wallet[${wallet}] is unavailable, needs to be added first`);
    this.cleanupWalletEvents();
    this.currentWallet = wallet;
    this.subscribeWalletEvents();
    return true;
  }

  public async enable(chainId: string | string[]): Promise<boolean> {
    if (this.debugMode) console.count('WAH >> enable request');
    return await this.wallet.enable(chainId);
  }
  // TODO : figure out which methods are cacheable(like getAccount) and return the cached result accordingly
  public async getAccount(chainId: string): Promise<Key> {
    if (this.debugMode) console.count('WAH >> getAccount request');
    return await this.wallet.getAccount(chainId);
  }
  public async getOfflineSigner(chainId: string): Promise<OfflineSigner & OfflineDirectSigner> {
    if (this.debugMode) console.count('WAH >> getOfflineSigner request');
    return await this.wallet.getOfflineSigner(chainId);
  }
}

export const walletActionHandler = new WalletActionHandler();
