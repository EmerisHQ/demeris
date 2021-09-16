import { ImplementedWallet } from './implementations';
import { KeplrWallet } from './keplrWallet';

export type WalletType = 'keplr' | 'metamask' | 'terrastation' | 'walletconnect';

export function getWalletInstance(type: WalletType): ImplementedWallet {
  switch (type) {
    case 'keplr':
      return new KeplrWallet();
      break;
    default:
      return new KeplrWallet();
      break;
  }
}
