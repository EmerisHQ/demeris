import { DemoWallet } from './demoWallet';
import { ImplementedWallet } from './implementations';
import { KeplrWallet } from './keplrWallet';
import { TerraWallet } from './terraWallet';

export type WalletType = 'keplr' | 'metamask' | 'terrastation' | 'walletconnect' | 'demo';

export function getWalletInstance(type: WalletType): ImplementedWallet {
  switch (type) {
    case 'keplr':
      return new KeplrWallet();

    case 'demo':
      return new DemoWallet();
    case 'terrastation':
      return new TerraWallet();

    default:
      return new DemoWallet();
      break;
  }
}
