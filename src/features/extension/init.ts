import { supportedWalletData } from '@/features/extension/SupportedWallets';
import { SupportedWallet } from '@/features/extension/types';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';

export async function initializeExtension() {
  if (window?.keplr) {
    walletActionHandler.add(SupportedWallet.KEPLR, window.keplr, supportedWalletData[SupportedWallet.KEPLR].featureMap);
  }

  if ((window as unknown as any)?.emeris) {
    await (window as unknown as any)?.emeris?.init();
    walletActionHandler.add(
      SupportedWallet.EMERIS,
      (window as unknown as any).emeris,
      supportedWalletData[SupportedWallet.EMERIS].featureMap,
    );
  } else {
    console.error('emeris wallet is not installed / detected');
  }
}
