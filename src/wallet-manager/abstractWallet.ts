import EventEmmiter from 'events';

import { WalletType } from '.';
import { WalletTransaction } from './types';
export abstract class Wallet extends EventEmmiter {
  constructor(public type: WalletType) {
    super();
  }
  getType(): string {
    return this.type;
  }
  abstract connect(chain_list: string[]): void;
  abstract disconnect(): void;
  abstract getKeyHashes(): void;
  abstract getAddress({ chain_name, chain_id }): void;
  abstract requestSignature(transaction: WalletTransaction): void;
  abstract useWithChain(chain_id: string): void;
}
