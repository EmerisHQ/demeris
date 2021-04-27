export type IBCDetails = {
  source_chain: string;
  ibc_dennom: string;
  path: string;
  verified_path: Array<string>;
};
export type Balance = {
  address: string;
  base_denom: string;
  verified: boolean;
  native: boolean;
  amount: number;
  on_chain: string;
  fee_token?: boolean;
  ibc: IBCDetails | {};
};
export type FeeAddress = {
  chain_name: string;
  chain_id: string;
  address: string;
};
export type Fee = {
  base_fee: string;
};
export type FeeToken = {
  fee_denom: string;
};
export type ChainStatus = {
  status: string;
};
export type PrimaryChannel = {
  channel_id: string;
};
export type VerifiedDenom = {
  base_denom: string;
  source_chain: string;
  logo: string;
};
export type Chain = {
  chain_id: string;
  logo: string;
};
export type Price = {
  base_denom: string;
  chain_id: string;
  price: number;
};
export type StakingBalance = {
  address: string;
  staking_denom: string;
  amount: number;
};
export type VerifiedPath = IBCDetails;
