export type IbcInfo = {
  path: string;
  hash: string;
};
export type BalanceResponse = {
  address: string;
  base_denom: string;
  verified: boolean;
  amount: number;
  on_chain: string;  
  ibc: IbcInfo | {};
};
export type AddrReq = {
  address: string;
};

export type Denom = {
  name: string;
  verified: boolean;
};
export type Bech32Config = {
  main_prefix: string;
  prefix_account: string;
  prefix_validator: string;
  prefix_consensus: string;
  prefix_public: string;
  prefix_operator: string;
}
export type NodeInfo = {
  endpoint: string;
  chain_id: string;
  bech32_config: Bech32Config;
}
export type ChainResponse = {
  chain_name: string;
  display_name: string;
  native_denoms: Array<Denom>;
  fee_tokens: Array<Denom>;
  fee_address:string;
  price_modifier: number;
  base_ibc_fee: number;
  base_fee: number;
  genesis_hash: string;
  node_indo: NodeInfo;
};
export type SupportedChain = {
  chain_name: string;
  display_name: string;
}
export type SupportedChainsResponse = {
  supported_chains: Array<SupportedChain>
}
export type ChainReq = {
  chain_name: string;
};
export type Bech32ConfigResponse = {
  chain_name: string;
  bech32_config: Bech32Config;
}
export type FeeAddress = {
  chain_name: string;  
  fee_address: string;
};
export type FeeAddressesResponse = {
  fee_addresses: Array<FeeAddress>
}
export type FeeToken = {
  name: string;
  verified: boolean;
};
export type FeeTokensResponse = {
  fee_tokens: Array<FeeToken>;
}

export type FeeResponse = {
  chain_name: string;
  fee: string;
};
export type CounterpartyResponse = {
  chain_name: string;
  counterparty: string;
  channel_name: string;
}
export type ChannelsResponse= {
  channels: Array<CounterpartyResponse>
}
export type ChannelsReq = {
  source_chain: string;
  destination_chain?: string;
}
export type Trace = {
  channel: string;
  port: string;
  client_id: string;
  chain_name:string;
  counterparty_name: string;
}
export type VerifiedTraceResponse = {
  ibc_denom: string;
  base_denom: string;
  verified: boolean;
  path: string;
  trace: Array<Trace>
}
export type VerifiedTraceReq= {
  chain_name: string;
  hash:string;
}
export type Delegation = {
  validator_address: string;
  amount:string;
}
export type DelegationsResponse = {
  delegator: string;
  delegations: Array<Delegation>
}

export type ChainStatus = {
  status: string;
};

export type ChainStatusReq = {
  chain_id: string;
};
export type VerifiedDenom = {
  name: string;
  verified: boolean;
};
export type VerifiedDenomsResponse = {
  verified_denoms: Array<VerifiedDenom>
}
export type Price = {
  base_denom: string;
  chain_id: string;
  price: number;
};
export type APIRequests =
  | BalanceReq
  | VerifiedTraceReq
  | ChainReq
  | DelegationsReq
  | ChannelsReq
  | ChainStatusReq;
