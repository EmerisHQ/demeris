import { SupportedWallet, WalletData } from '@/features/extension/types';
import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

export const supportedWalletData: Record<SupportedWallet, WalletData> = {
  [SupportedWallet.KEPLR]: {
    featureMap: {
      enable: 'enable',
      getAccount: 'getKey',
      getOfflineSigner: 'getOfflineSigner',
      subscribe: {
        accountChange: () => {
          if (!window.keplr) throw new Error('Keplr is not detected');
          window.addEventListener('keplr_keystorechange', keyStoreChangeHandler);
          return () => window.removeEventListener('keplr_keystorechange', keyStoreChangeHandler);
        },
      },
    },
  },
  [SupportedWallet.EMERIS]: {
    featureMap: {
      enable: 'enable',
      getAccount: 'getActiveAccount',
      getOfflineSigner: 'getOfflineSigner',
      subscribe: {
        accountChange: () => {
          // TODO : edit src/types.d.ts to include emeris in windows object when dust settles
          if (!(window as unknown as any)?.emeris) throw new Error('Emeris Extension is not detected');
          window.addEventListener('emeris_account_changed', keyStoreChangeHandler);
          return () => window.removeEventListener('emeris_account_changed', keyStoreChangeHandler);
        },
      },
    },
  },
};

export async function keyStoreChangeHandler() {
  window.localStorage.setItem('lastEmerisSession', '');
  const typedstore = useStore();
  if (
    typedstore.getters[GlobalGetterTypes.USER.isSignedIn] &&
    !typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  ) {
    typedstore.dispatch(GlobalActionTypes.USER.SIGN_IN);
  }
}
