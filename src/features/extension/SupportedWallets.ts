import { SupportedWallet, WalletData } from '@/features/extension/types';
import { walletActionHandler } from '@/features/extension/WalletActionHandler';
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
          const accountChangeHandler = () => dynamicAccountChangeHandler(SupportedWallet.KEPLR);
          window.addEventListener('keplr_keystorechange', accountChangeHandler);
          return () => window.removeEventListener('keplr_keystorechange', accountChangeHandler);
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
          const accountChangeHandler = () => dynamicAccountChangeHandler(SupportedWallet.EMERIS);
          window.addEventListener('emeris_account_changed', accountChangeHandler);
          return () => window.removeEventListener('emeris_account_changed', accountChangeHandler);
        },
      },
    },
  },
};

function dynamicAccountChangeHandler(walletType: SupportedWallet) {
  walletActionHandler.setLastSession({
    timestamp: Date.now(),
    wallet: walletType,
  });
  const typedstore = useStore();
  if (
    typedstore.getters[GlobalGetterTypes.USER.isSignedIn] &&
    !typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  ) {
    typedstore.dispatch(GlobalActionTypes.USER.SIGN_IN_NEW, { walletType });
  }
}

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
