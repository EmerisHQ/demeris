import { supportedWalletData } from '@/features/extension/SupportedWallets';
import { SupportedWallet } from '@/features/extension/types';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';

export function initializeExtension() {
  if (window?.keplr) {
    walletActionHandler.add(SupportedWallet.KEPLR, window.keplr, supportedWalletData[SupportedWallet.KEPLR].featureMap);
  }

  if ((window as unknown as any)?.emeris) {
    walletActionHandler.add(
      SupportedWallet.EMERIS,
      (window as unknown as any).emeris,
      supportedWalletData[SupportedWallet.EMERIS].featureMap,
    );
  } else {
    console.error('emeris wallet is not installed / detected');
  }
}
