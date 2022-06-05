import { AccountData, UserData } from '@/types/user';

export type USERState = {
  gas_limit: number;
  balancesFirstLoad: boolean;
  correlationId: string;
  stakingBalancesFirstLoad: boolean;
  pricesFirstLoad: boolean;
  account: AccountData;
  chainKeyData: {
    keyHash: string;
    pubKey: Uint8Array;
    algo: string;
    chainName: string;
  }[];
  _Subscriptions: Set<string>;
  _Session: UserData | Record<string, never>;
};
export function getDefaultState(): USERState {
  return {
    gas_limit: 500000,
    balancesFirstLoad: true,
    stakingBalancesFirstLoad: true,
    pricesFirstLoad: true,
    correlationId: '',
    account: null,
    chainKeyData: [],
    _Subscriptions: new Set(),
    _Session: {},
  };
}
