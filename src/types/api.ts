export type IBCDetails = {
  source_chain: string;
  ibc_denom: string;
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
export type BalanceReq = {
  address: string;
};
export type FeeAddress = {
  chain_name: string;
  chain_id: string;
  address: string;
};
export type FeeAddressReq = {
  chain_id: string;
};
export type Fee = {
  base_fee: string;
};

export type FeeReq = FeeAddressReq;

export type FeeToken = {
  fee_denom: string;
};
export type FeeTokenReq = FeeReq;

export type ChainStatus = {
  status: string;
};

export type ChainStatusReq = {
  chain_id: string;
};
export type PrimaryChannel = {
  channel_id: string;
};
export type PrimaryChannelReq = {
  source_chain_id: string;
  destination_chain_id: string;
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

export type StakingBalanceReq = {
  address: string;
};
export type VerifiedPath = IBCDetails;
export type VerifiedPathReq = {
  denom: string;
  chain_id: string;
};
export type APIRequests =
  | BalanceReq
  | VerifiedPathReq
  | FeeAddressReq
  | FeeReq
  | FeeTokenReq
  | StakingBalanceReq
  | PrimaryChannelReq
  | ChainStatusReq;
