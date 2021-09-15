import { WalletType } from '.';

export abstract class Wallet {
  constructor(public type: WalletType) {}
  abstract connect(): void;
  abstract disconnect(): void;
  abstract getKeyHashes(): void;
  abstract requestSignature(): void;
  abstract useWithChain(): void;
}
