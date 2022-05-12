export enum ActionTypes {
  // Cross-chain endpoint actions
  REDEEM_GET_HAS_SEEN = 'REDEEM_GET_HAS_SEEN',
  REDEEM_SET_HAS_SEEN = 'REDEEM_SET_HAS_SEEN',
  BALANCES_LOADED = 'BALANCES_LOADED',
  PRICES_LOADED = 'PRICES_LOADED',
  STAKING_BALANCES_LOADED = 'STAKING_BALANCES_LOADED',
  SET_SESSION_DATA = 'SET_SESSION_DATA',
  LOAD_SESSION_DATA = 'LOAD_SESSION_DATA',
  SIGN_IN = 'SIGN_IN',
  SIGN_IN_NEW = 'SIGN_IN_NEW', //  TODO : replace the SIGN_IN after USE_EMERIS_EXTENSION is turned on by default in the repo
  SIGN_IN_WITH_WATCHER = 'SIGN_IN_WITH_WATCHER',
  SET_GAS_LIMIT = 'SET_GAS_LIMIT',
  SIGN_OUT = 'SIGN_OUT',
  // Internal module actions
  RESET_STATE = 'RESET_STATE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  STORE_UPDATE = 'STORE_UPDATE',
}
export enum GlobalActionTypes {
  /**
   * Namespace is defined in the module and should be re-used here. Not possible due to TypeScript limitation,
   * re-evaluate once this is released:
   *     https://github.com/microsoft/TypeScript/issues/40793
   */
  REDEEM_GET_HAS_SEEN = 'demerisUSER/REDEEM_GET_HAS_SEEN',
  REDEEM_SET_HAS_SEEN = 'demerisUSER/REDEEM_SET_HAS_SEEN',
  BALANCES_LOADED = 'demerisUSER/BALANCES_LOADED',
  PRICES_LOADED = 'demerisUSER/PRICES_LOADED',
  STAKING_BALANCES_LOADED = 'demerisUSER/STAKING_BALANCES_LOADED',
  SET_SESSION_DATA = 'demerisUSER/SET_SESSION_DATA',
  LOAD_SESSION_DATA = 'demerisUSER/LOAD_SESSION_DATA',
  SIGN_IN = 'demerisUSER/SIGN_IN',
  SIGN_IN_NEW = 'demerisUSER/SIGN_IN_NEW',
  SIGN_IN_WITH_WATCHER = 'demerisUSER/SIGN_IN_WITH_WATCHER',
  SET_GAS_LIMIT = 'demerisUSER/SET_GAS_LIMIT',
  SIGN_OUT = 'demerisUSER/SIGN_OUT',
  // Internal module actions
  RESET_STATE = 'demerisUSER/RESET_STATE',
  UNSUBSCRIBE = 'demerisUSER/UNSUBSCRIBE',
  STORE_UPDATE = 'demerisUSER/STORE_UPDATE',
}
