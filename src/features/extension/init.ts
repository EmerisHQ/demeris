import { SupportedWallet } from '@/features/extension/types';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { featureRunning } from '@/utils/FeatureManager';

export function initializeExtension() {
  if (featureRunning('USE_EMERIS_EXTENSION')) {
    if (window?.keplr) {
      walletActionHandler.add(SupportedWallet.KEPLR, window.keplr, true);
    }

    if ((window as unknown as any)?.emeris) {
      walletActionHandler.add(SupportedWallet.EMERIS, (window as unknown as any).emeris, true);
    }
  }

  window.addEventListener('keplr_keystorechange', keyStoreChangeHandler);
  if (featureRunning('USE_EMERIS_EXTENSION')) {
    window.addEventListener('emeris_account_changed', keyStoreChangeHandler);
  }
}
