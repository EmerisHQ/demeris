export enum ActionTypes {
  // Wrapper/Grouping actions
  GET_ALL_BALANCES = 'GET_ALL_BALANCES',
  GET_ALL_STAKING_BALANCES = 'GET_ALL_STAKING_BALANCES',
  GET_ALL_UNBONDING_DELEGATIONS = 'GET_ALL_UNBONDING_DELEGATIONS',

  // Emeris Endpoints
  GET_BALANCES = 'GET_BALANCES',
  GET_POOL_BALANCES = 'GET_POOL_BALANCES',
  GET_STAKING_BALANCES = 'GET_STAKING_BALANCES',
  GET_UNBONDING_DELEGATIONS = 'GET_UNBONDING_DELEGATIONS',
  GET_NUMBERS_CHAIN = 'GET_NUMBERS_CHAIN',
  GET_VERIFIED_DENOMS = 'GET_VERIFIED_DENOMS',
  GET_CHAIN = 'GET_CHAIN',
  GET_CHAIN_STATUS = 'GET_CHAIN_STATUS',
  GET_CHAINS = 'GET_CHAINS',
  GET_CHAINS_AND_CHAIN_STATUS = 'GET_CHAINS_AND_CHAIN_STATUS',
  GET_PRICES = 'GET_PRICES',
  GET_TX_STATUS = 'GET_TX_STATUS',
  GET_TX_DEST_HASH = 'GET_TX_DEST_HASH',
  GET_END_BLOCK_EVENTS = 'GET_END_BLOCK_EVENTS',
  GET_VALIDATORS = 'GET_VALIDATORS',
  GET_INFLATION = 'GET_INFLATION',
  GET_STAKING_REWARDS = 'GET_STAKING_REWARDS',
  GET_UNSTAKING_PARAM = 'GET_UNSTAKING_PARAM',
  GET_VERIFY_TRACE = 'GET_VERIFY_TRACE',
  GET_TOKEN_PRICES = 'GET_TOKEN_PRICES',
  TRACE_TX_RESPONSE = 'TRACE_TX_RESPONSE',
  GET_TX_FROM_RPC = 'GET_TX_FROM_RPC',
  GET_NEW_BLOCK = 'GET_NEW_BLOCK',

  // Coingecko Endpoints
  GET_COINGECKO_ID_BY_NAMES = 'GET_COINGECKO_ID_BY_NAMES',

  // Airdrop Endpoints
  GET_GIT_AIRDROPS_LIST = 'GET_GIT_AIRDROPS_LIST',
  GET_AIRDROPS = 'GET_AIRDROPS',
  RESET_AIRDROPS = 'RESET_AIRDROPS',
  SET_SELECTED_AIRDROP = 'SET_SELECTED_AIRDROP',
  VALIDATE_POOLS = 'VALIDATE_POOLS',
  RESET_TOKEN_PRICES = 'RESET_TOKEN_PRICES',
  SIGN_OUT = 'SIGN_OUT',

  // Internal module actions
  INIT = 'INIT',
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
}
export enum GlobalActionTypes {
  // Wrapper/Grouping actions
  GET_ALL_BALANCES = 'demerisAPI/GET_ALL_BALANCES',
  GET_ALL_STAKING_BALANCES = 'demerisAPI/GET_ALL_STAKING_BALANCES',
  GET_ALL_UNBONDING_DELEGATIONS = 'demerisAPI/GET_ALL_UNBONDING_DELEGATIONS',

  // Emeris Endpoints
  GET_BALANCES = 'demerisAPI/GET_BALANCES',
  GET_POOL_BALANCES = 'demerisAPI/GET_POOL_BALANCES',
  GET_STAKING_BALANCES = 'demerisAPI/GET_STAKING_BALANCES',
  GET_UNBONDING_DELEGATIONS = 'demerisAPI/GET_UNBONDING_DELEGATIONS',
  GET_NUMBERS_CHAIN = 'demerisAPI/GET_NUMBERS_CHAIN',
  GET_VERIFIED_DENOMS = 'demerisAPI/GET_VERIFIED_DENOMS',
  GET_CHAIN = 'demerisAPI/GET_CHAIN',
  GET_CHAIN_STATUS = 'demerisAPI/GET_CHAIN_STATUS',
  GET_CHAINS = 'demerisAPI/GET_CHAINS',
  GET_CHAINS_AND_CHAIN_STATUS = 'demerisAPI/GET_CHAINS_AND_CHAIN_STATUS',
  GET_PRICES = 'demerisAPI/GET_PRICES',
  GET_TX_STATUS = 'demerisAPI/GET_TX_STATUS',
  GET_TX_DEST_HASH = 'demerisAPI/GET_TX_DEST_HASH',
  GET_END_BLOCK_EVENTS = 'demerisAPI/GET_END_BLOCK_EVENTS',
  GET_VALIDATORS = 'demerisAPI/GET_VALIDATORS',
  GET_INFLATION = 'demerisAPI/GET_INFLATION',
  GET_STAKING_REWARDS = 'demerisAPI/GET_STAKING_REWARDS',
  GET_UNSTAKING_PARAM = 'demerisAPI/GET_UNSTAKING_PARAM',
  GET_VERIFY_TRACE = 'demerisAPI/GET_VERIFY_TRACE',
  GET_TOKEN_PRICES = 'demerisAPI/GET_TOKEN_PRICES',
  TRACE_TX_RESPONSE = 'demerisAPI/TRACE_TX_RESPONSE',
  GET_TX_FROM_RPC = 'demerisAPI/GET_TX_FROM_RPC',
  GET_NEW_BLOCK = 'demerisAPI/GET_NEW_BLOCK',

  // Coingecko Endpoints
  GET_COINGECKO_ID_BY_NAMES = 'demerisAPI/GET_COINGECKO_ID_BY_NAMES',

  // Airdrop Endpoints
  GET_GIT_AIRDROPS_LIST = 'demerisAPI/GET_GIT_AIRDROPS_LIST',
  GET_AIRDROPS = 'demerisAPI/GET_AIRDROPS',
  RESET_AIRDROPS = 'demerisAPI/RESET_AIRDROPS',
  SET_SELECTED_AIRDROP = 'demerisAPI/SET_SELECTED_AIRDROP',
  VALIDATE_POOLS = 'demerisAPI/VALIDATE_POOLS',
  RESET_TOKEN_PRICES = 'demerisAPI/RESET_TOKEN_PRICES',
  SIGN_OUT = 'demerisAPI/SIGN_OUT',

  // Internal module actions
  INIT = 'demerisAPI/INIT',
  RESET_STATE = 'demerisAPI/RESET_STATE',
  UNSUBSCRIBE = 'demerisAPI/UNSUBSCRIBE',
  STORE_UPDATE = 'demerisAPI/STORE_UPDATE',
}
