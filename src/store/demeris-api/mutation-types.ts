export enum MutationTypes {
  SET_BALANCES = 'SET_BALANCES',
  SET_POOL_BALANCES = 'SET_POOL_BALANCES',
  SET_VERIFY_TRACE = 'SET_VERIFY_TRACE',
  SET_FEE_ADDRESS = 'SET_FEE_ADDRESS',
  SET_BECH32_CONFIG = 'SET_BECH32_CONFIG',
  SET_FEE_ADDRESSES = 'SET_FEE_ADDRESSES',
  SET_STAKING_BALANCES = 'SET_STAKING_BALANCES',
  SET_UNSTAKING_PARAM = 'SET_UNSTAKING_PARAM',
  SET_UNBONDING_DELEGATIONS = 'SET_UNBONDING_DELEGATIONS',
  SET_VALID_POOLS = 'SET_VALID_POOLS',
  SET_NUMBERS = 'SET_NUMBERS',
  SET_NUMBERS_CHAIN = 'SET_NUMBERS_CHAIN',
  SET_PRICES = 'SET_PRICES',
  SET_TX_STATUS = 'SET_TX_STATUS',
  SET_CHAINS = 'SET_CHAINS',
  SET_CHAIN_APR = 'SET_CHAIN_APR',
  SET_CHAIN = 'SET_CHAIN',
  SET_VERIFIED_DENOMS = 'SET_VERIFIED_DENOMS',
  SET_PRIMARY_CHANNEL = 'SET_PRIMARY_CHANNEL',
  SET_PRIMARY_CHANNELS = 'SET_PRIMARY_CHANNELS',
  SET_TOKEN_PRICES = 'SET_TOKEN_PRICES',
  SET_TOKEN_PRICES_STATUS = 'SET_TOKEN_PRICES_STATUS',
  SET_CHAIN_STATUS = 'SET_CHAIN_STATUS',
  SET_RELAYER_STATUS = 'SET_RELAYER_STATUS',
  SET_RELAYER_BALANCES = 'SET_RELAYER_BALANCES',
  INIT = 'INIT',
  SET_IN_PROGRESS = 'SET_IN_PROGRESS',
  DELETE_IN_PROGRESS = 'DELETE_IN_PROGRESS',
  RESET_STATE = 'RESET_STATE',
  CLEAR_SUBSCRIPTIONS = 'CLEAR_SUBSCRIPTIONS',
  SIGN_OUT = 'SIGN_OUT',
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',

  //Airdrops Mutation Types
  SET_AIRDROPS = 'SET_AIRDROPS',
  RESET_AIRDROPS = 'RESET_AIRDROPS',
  SET_AIRDROPS_STATUS = 'SET_AIRDROPS_STATUS',

  //Coingecko Mutation Types
  SET_COINGECKO_ID_STATUS = 'SET_COINGECKO_ID_STATUS',
  SET_COINGECKO_ID = 'SET_COINGECKO_ID',
}
