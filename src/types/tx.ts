import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/stargate';

export type TxParams = {
  tx: string;
  chain_name: string;
  address: string;
};
export type TxResultParams = {
  height: number;
  stepType: string;
};
export type SignParams = {
  msgs: Array<EncodeObject>;
  chain_name: string;
  fee: StdFee;
  registry: Registry;
  memo?: string;
};

export type TxResponse = {
  ticket: string;
};
