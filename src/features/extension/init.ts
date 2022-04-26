import { SupportedWallets } from '@/features/extension/types';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';
import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

export function initializeExtension() {
  if (window?.keplr) {
    walletActionHandler.add(SupportedWallets.KEPLR, window.keplr, true);
  }
  if ((window as unknown as any)?.emeris) {
    walletActionHandler.add(SupportedWallets.EMERIS, (window as unknown as any).emeris, true);
  }

  window.addEventListener('keplr_keystorechange', keyStoreChangeHandler);
  window.addEventListener('pseudokeplr_keystorechange', keyStoreChangeHandler);
}

async function keyStoreChangeHandler() {
  window.localStorage.setItem('lastEmerisSession', '');
  const typedstore = useStore();
  if (
    typedstore.getters[GlobalGetterTypes.USER.isSignedIn] &&
    !typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  ) {
    typedstore.dispatch(GlobalActionTypes.USER.SIGN_IN);
  }
}
