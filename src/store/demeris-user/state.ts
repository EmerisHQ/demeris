import { KeplrKeyData, UserData } from '@/types/user';

export type USERState = {
  gas_limit: number;
  balancesFirstLoad: boolean;
  correlationId: string;
  stakingBalancesFirstLoad: boolean;
  pricesFirstLoad: boolean;
  keplr: KeplrKeyData;
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
    keplr: null,
    _Subscriptions: new Set(),
    _Session: {},
  };
}
