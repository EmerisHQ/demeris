// Params object for actions requiring a BECH32 decoded address as param
export type AddrReq = {
  address: string;
};
// Params object for actions requiring a chain name (and optionally a target chain)
export type ChainReq = {
  chain_name: string;
  destination_chain_name?: string;
};
// Params object for verifying a specific trace hash on a specific chain
export type VerifyTraceReq = {
  chain_name: string;
  hash: string;
};

// Helper type to hold ibc information
export type IbcInfo = {
  path: string;
  hash: string;
};

// helper type to hold denom information

export type Denom = {
  display_name: string;
  logo?: string;
  precision: string;
  name: string;
  verified: boolean;
};

// Helper type to hold Bech32 config information

export type Bech32Config = {
  main_prefix: string;
  prefix_account: string;
  prefix_validator: string;
  prefix_consensus: string;
  prefix_public: string;
  prefix_operator: string;
};

//Helper type to hold primary channel information for a chain

export type PrimaryChannel = {
  counterparty: string;
  channel_name: string;
};

//Helper alias to hold fee address for consistency

export type FeeAddress = string;

// CROSS-CHAIN APIs

// /balances/:address response data types
export type Balance = {
  address: string;
  base_denom: string;
  verified: boolean;
  amount: string;
  on_chain: string;
  ibc: IbcInfo | Record<string, never>;
};
export type Balances = Array<Balance>;
export type BalancesResponse = {
  balances: Balances;
};

// /staking_balances/:address response data types

export type StakingBalance = {
  validator_address: string;
  amount: string;
  chain_name: string;
};
export type StakingBalances = Array<StakingBalance>;
export type StakingBalancesResponse = {
  staking_balances: StakingBalances;
};

// /verified_denoms endpoint data types

export type VerifiedDenom = Denom & { chain_name: string };
export type VerifiedDenoms = Array<VerifiedDenom>;
export type VerifiedDenomsResponse = {
  verified_denoms: VerifiedDenoms;
};

// /chains endpoint data types

export type Chains = Array<Chain>;
export type ChainsResponse = {
  chains: Chains;
};

// /chains/fee/addresses endpoint data types
export type ChainFeeAddress = {
  fee_address: FeeAddress;
  chain_name: string;
};
export type FeeAddresses = Array<ChainFeeAddress>;
export type FeeAddressesResponse = {
  fee_addresses: FeeAddresses;
};

// /prices endpoint data types
// TODO: /prices

// CHAIN-SPECIFIC APIs

// /chain/:chain endpoint data types

export type NodeInfo = {
  endpoint: string;
  chain_id: string;
  bech32_config: Bech32Config;
};
export type Chain = {
  chain_name: string;
  display_name: string;
  logo?: string;
  native_denoms?: Array<Denom>;
  fee_tokens?: Array<Denom>;
  fee_address?: string;
  price_modifier?: number;
  base_ibc_fee?: number;
  base_fee?: number;
  genesis_hash?: string;
  node_info?: NodeInfo;
};
export type ChainResponse = {
  chain: Chain;
};

// /chain/:chain/status endpoint data types
// TODO: Chain status

// /chain/:chain/denom/verify_trace/:hash endpoint data types

export type Trace = {
  channel: string;
  port: string;
  client_id: string;
  chain_name: string;
  counterparty_name: string;
};
export type VerifyTrace = {
  ibc_denom: string;
  base_denom: string;
  verified: boolean;
  path: string;
  trace: Array<Trace>;
};
export type VerifyTraceResponse = {
  verify_trace: VerifyTrace;
};

// /chain/:chain/bech32 endpoint data types

export type Bech32ConfigResponse = {
  bech32_config: Bech32Config;
};

// /chain/:chain/primary_channels endpoint data types

export type PrimaryChannels = Array<PrimaryChannel>;

export type PrimaryChannelsResponse = {
  primary_channels: PrimaryChannels;
};

// /chain/:chain/primary_channel/:counterparty endpoint data types

export type PrimaryChannelResponse = {
  primary_channel: PrimaryChannel;
};

// /chain/:chain/fee endpoint data types

export type Fee = number;
export type FeeResponse = {
  fee: Fee;
};

// /chain/:chain/fee/address endpoint data types

export type FeeAddressResponse = {
  fee_address: FeeAddress;
};

// /chain/:chain/fee/token endpoint data types

export type FeeTokens = Array<Denom>;
export type FeeTokensResponse = {
  fee_tokens: FeeTokens;
};
export type SeqNumber = {
  chain_name: string;
  address: string;
  sequence_number: string;
  account_number: string;
};
export type Numbers = Array<SeqNumber>;
export type NumbersResponse = {
  numbers: Array<Numbers>;
};
export type APIRequests = AddrReq | VerifyTraceReq | ChainReq;
