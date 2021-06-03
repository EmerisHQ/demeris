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

export type TransferParams = {
  from: {
    denom: MetaDenom;
    amount: number;
  };
  to: {
    chain_name: string;
    address: string;
  };
};
export type AddLiquidityParams = {
  pool_id: bigint;
  coinA: {
    denom: MetaDenom;
    amount: number;
  };
  coinB: {
    denom: MetaDenom;
    amount: number;
  };
};
export type WithdrawLiquidityParams = {
  pool_id: bigint;
  poolCoin: {
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
export type AddLiquidity = BaseAction & { params: AddLiquidityParams };
export type WithdrawLiquidity = BaseAction & { params: WithdrawLiquidityParams };
export type Transfer = BaseAction & { params: TransferParams };

export type Any = Swap | Redeem | Transfer | AddLiquidity | WithdrawLiquidity;
export type StepTransactionDetails = {
  typeUrl: string;
  value: Record<string, unknown>;
  status: 'pending' | 'active' | 'completed';
};

export type IBCBackwardsData = {
  amount: Base.Amount;
  from_chain: string;
  to_chain: string;
  to_address?: string;
  through: string;
};
export type IBCForwardsData = {
  amount: Base.Amount;
  from_chain: string;
  to_chain: string;
  to_address?: string;
  through: string;
};
export type TransferData = {
  amount: Base.Amount;
  chain_name: string;
  to_address: string;
};
export type SwapData = {
  from: Base.Amount;
  to: Base.Amount;
  pool: Pool;
};
export type AddLiquidityData = {
  coinA: Base.Amount;
  coinB: Base.Amount;
  pool: Pool;
};
export type WithdrawLiquidityData = {
  poolCoin: Base.Amount;
  pool: Pool;
};
export type StepTransaction = {
  name: 'ibc_forward' | 'ibc_backward' | 'swap' | 'transfer' | 'addliquidity' | 'withdrawliquidity';
  status: 'pending' | 'active' | 'completed';
  data: IBCBackwardsData | IBCForwardsData | SwapData | TransferData | AddLiquidityData | WithdrawLiquidityData;
};
export type Step = {
  name: 'transfer' | 'redeem' | 'swap' | 'addliquidity' | 'withdrawliquidity';
  transactions: Array<StepTransaction>;
};

export type { Pool };
