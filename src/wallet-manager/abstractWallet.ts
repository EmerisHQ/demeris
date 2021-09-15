import EventEmmiter from 'events';

import { WalletType } from '.';
import { WalletTransaction } from './types';
export abstract class Wallet extends EventEmmiter {
  constructor(public type: WalletType) {
    super();
  }
  abstract connect(chain_list: string[]): void;
  abstract disconnect(): void;
  abstract getKeyHashes(): void;
  abstract requestSignature(transaction: WalletTransaction): void;
  abstract useWithChain(chain_id: string): void;
}
