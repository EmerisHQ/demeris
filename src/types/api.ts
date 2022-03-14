import * as Base from './base';

export enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  LOADED = 'LOADED',
}

// Params object for actions requiring a BECH32 decoded address as param
export type AddrReq = {
  address: string;
};
export type TokenPriceReq = {
  token_id: string;
  days: string;
  currency: string;
  showSkeleton: boolean;
};
export type TokenIdReq = {
  token: string;
  showSkeleton: boolean;
};
export type GitAirdropsListReq = {
  airdropFileName: string;
};
export type DenomReq = {
  denom: string;
};
export type TokenId = string;
export type TokenPrices = {
  x: string;
  y: number;
};
export type ChainAddrReq = {
  chain_name: string;
  address: string;
};
// Params object for actions requiring a chain name (and optionally a target chain)
export type ChainReq = {
  chain_name: string;
  destination_chain_name?: string;
};
export type TicketReq = {
  chain_name: string;
  ticket: string;
};
// Params object for verifying a specific trace hash on a specific chain
export type VerifyTraceReq = {
  chain_name: string;
  hash: string;
};

// Helper type to hold ibc information
export type IbcInfo = {
  path?: string;
  hash?: string;
};

// helper type to hold denom information

export type Denom = {
  display_name: string;
  logo?: string;
  precision: string;
  name: string;
  verified: boolean;
  stakable: boolean;
  fee_token: boolean;
  gas_price_levels: Fee;
  ticker: string;
  fetch_price: boolean;
};

// Helper type to hold Bech32 config information

export type Bech32Config = {
  main_prefix: string;
  prefix_account: string;
  prefix_validator: string;
  prefix_consensus: string;
  prefix_public: string;
  prefix_operator: string;
  acc_addr: string;
  acc_pub: string;
  val_addr: string;
  val_pub: string;
  cons_addr: string;
  cons_pub: string;
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

// /chain/:chain_name/staking/params response data types
export type UnstakingParamReq = {
  chain_name: string;
};
export type UnstakingParam = {
  chain_name: string;
  unbonding_time: number;
  max_validators: number;
  max_entries: number;
  historical_entries: number;
  bond_denom: string;
};
export type UnstakingParams = Array<UnstakingParam>;

// /unbonding_delegations/:address response data types
export type UnbondingDelegationEntry = {
  balance: string;
  completion_time: string;
  creation_height: number;
  initial_balance: string;
};
export type UnbondingDelegation = {
  validator_address: string;
  entries: UnbondingDelegationEntry[];
  chain_name: string;
};
export type UnbondingDelegations = Array<UnbondingDelegation>;
export type UnbondingDelegationsResponse = {
  unbonding_delegations: UnbondingDelegations;
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

export type Price = {
  Symbol: string;
  Price: number;
};
export type Prices = {
  Fiats: Price[];
  Tokens: (Price & { Supply: number })[];
};
export type PricesResponse = {
  data: Prices;
  message: string | null;
  status: number;
};

// CHAIN-SPECIFIC APIs

// /chain/:chain endpoint data types

export type NodeInfo = {
  endpoint: string;
  chain_id: string;
  bech32_config: Bech32Config;
};
export type Chain = {
  chain_name: string;
  enabled?: boolean;
  display_name: string;
  logo?: string;
  denoms?: Array<Denom>;
  counterparty_names?: Record<string, string>;
  primary_channel?: Record<string, any>;
  demeris_addresses?: Array<string>;
  price_modifier?: number;
  genesis_hash?: string;
  node_info?: NodeInfo;
  derivation_path?: string;
  public_node_endpoints?: {
    tendermint_rpc?: string[];
    cosmos_api?: string[];
  };
};
export type ChainResponse = {
  chain: Chain;
};
// /chain/:chain/status endpoint data types
export type ChainStatusResponse = {
  online: boolean;
};
export type RelayerStatusResponse = {
  running: boolean;
};

export type RelayerBalance = {
  address: string;
  chain_name: string;
  enough_balance: boolean;
};
export type RelayerBalances = RelayerBalance[];

export type RelayerBalancesResponse = {
  balances: RelayerBalances;
};
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

export type Fee = {
  low: string;
  average: string;
  high: string;
};
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
export type Ticket = {
  status: string;
  height?: number;
  newTicket?: string;
  error?: string;
  tx_hashes?: any[];
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
export type APIRequests = AddrReq | VerifyTraceReq | ChainReq | TicketReq | ChainAddrReq | DenomReq | UnstakingParamReq;

export type SwapEndBlockResponse = {
  exchanged_offer_coin_amount: string;
  remaining_offer_coin_amount: string;
  exchanged_demand_coin_amount: string;
  demand_coin_denom: string;
  offer_coin_denom: string;
};

export type AddLiquidityEndBlockResponse = {
  accepted_coins: string;
  depositor: string;
  pool_coin_amount: string;
  pool_coin_denom: string;
  refunded_coins: string;
  success: string;
};

export type WithdrawLiquidityEndBlockResponse = {
  pool_id: string;
  pool_coin_amount: string;
  pool_coin_denom: string;
  withdraw_coins: string;
  withdraw_fee_coins: string;
  withdrawer: string;
  success: string;
};

export type AirdropEligibilityCriteria = {
  description: string;
};

export type AirdropClaimAction = {
  actionType: string;
  tokenAutodropReceivingChain: string;
  AutodropBlockheight: string;
  AutodropSendingAddress: string;
  action: number;
  desc: string;
  actionURL: string;
  cosmosSDKMessageType: string;
  unlockPercentage: number;
};

export type Airdrop = {
  project: string;
  projectWebsiteUrl: string;
  eligibilityType: string;
  projectDescription: string;
  chainName: string;
  chainID: string;
  tokenTicker: string;
  tokenIcon: string;
  twitterUrl: string;
  discordUrl: string;
  mediumUrl: string;
  airdropBlogUrl: string;
  airdropStartDate: Date;
  airdropEndDate: Date;
  airdropStatus: string;
  dateStatus: string;
  snapshotDate: string;
  snapshotBlockHeight: string;
  eligibilityCriteria: AirdropEligibilityCriteria[];
  eligibilityCheckEndpoint: string;
  unanimousClaim: boolean;
  claimActions: AirdropClaimAction[];
};

export type selectedAirdropReq = {
  airdrop: Airdrop;
};

export type TransactionDetailResponse = {
  tx: {
    body: {
      messages: { '@type': string; [key: string]: any }[];
      memo: string;
    };
    auth_info: {
      fee: { amount: Base.Amount[]; gas_limit: string };
    };
    signatures: string[];
  };
  tx_response: {
    height: string;
    txhash: string;
    gas_wanted: string;
    gas_used: string;
    tx: {
      '@type': string;
      body: {
        messages: { '@type': string; [key: string]: any }[];
        memo: string;
      };
      auth_info: {
        fee: { amount: Base.Amount[]; gas_limit: string };
      };
      signatures: [];
    };
    timestamp: string;
  };
};

export type PriceQuote = {
  dex: string;
  amount: number;
  denom: string;
  numberOfTransactions: string;
  usdAmount: number;
  fee?: { amount: number; denom: string };
};
