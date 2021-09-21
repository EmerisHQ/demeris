import { DemoWallet } from './demoWallet';
import { KeplrWallet } from './keplrWallet';
import { TerraWallet } from './terraWallet';

export type ImplementedWallet = KeplrWallet | DemoWallet | TerraWallet;
