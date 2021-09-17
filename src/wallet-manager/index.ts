import { DemoWallet } from './demoWallet';
import { ImplementedWallet } from './implementations';
import { KeplrWallet } from './keplrWallet';

export type WalletType = 'keplr' | 'metamask' | 'terrastation' | 'walletconnect' | 'demo';

export function getWalletInstance(type: WalletType): ImplementedWallet {
  switch (type) {
    case 'keplr':
      return new KeplrWallet();

    case 'demo':
      return new DemoWallet();

    default:
      return new DemoWallet();
      break;
  }
}
