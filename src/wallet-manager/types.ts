import { EncodeObject, Registry } from '@cosmjs/proto-signing';

import { GasFee } from '@/store/demeris/actions';

export type KeplrTransaction = {
  msgs: EncodeObject[];
  chain_name: string;
  fee: GasFee;
  registry: Registry;
  memo: string;
};
export type SignedKeplrTransaction = {
  tx: string;
  chain_name: string;
  address: string;
};
export type WalletTransaction = KeplrTransaction;
