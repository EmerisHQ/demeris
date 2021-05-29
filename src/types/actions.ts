import { Pool } from '@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module/types/tendermint/liquidity/v1beta1/liquidity';

import * as Base from './base';

export type BaseAction = {
  name: 'swap' | 'redeem' | 'addliquidity' | 'withdrawliquidity' | 'transfer';
};
export type MetaDenom = {
  denom: string;
  chain_name: string;
};
export type SwapParams = {
  from: {
    denom: MetaDenom;
    amount: number;
  };
  to: {
    denom: MetaDenom;
    amount: number;
  };
};
export type RedeemParams = {
  denom: MetaDenom;
  amount: number;
};
export type Swap = BaseAction & { params: SwapParams };
export type Redeem = BaseAction & { params: RedeemParams };

export type Any = Swap | Redeem;
export type StepTransaction = {
  typeUrl: string;
  value: Record<string, unknown>;
  status: 'pending' | 'active' | 'completed';
};

export type IBCBackwardsData = {
  amount: Base.Amount;
  from_chain: string;
  to_chain: string;
  through: string;
};
export type IBCForwardsData = {
  amount: Base.Amount;
  from_chain: string;
  to_chain: string;
  through: string;
};
export type SwapData = {
  from: Base.Amount;
  to: Base.Amount;
  pool: Pool;
};
export type Step = {
  name: 'ibc_forward' | 'ibc_backward' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity';
  status: 'pending' | 'active' | 'completed';
  data: IBCBackwardsData | IBCForwardsData | SwapData;
};

export type {
  Pool
}
