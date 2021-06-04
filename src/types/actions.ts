import { Pool } from '@starport/tendermint-liquidity-js/tendermint/liquidity/tendermint.liquidity.v1beta1/module/types/tendermint/liquidity/v1beta1/liquidity';

import * as Base from './base';

export type BaseAction = {
  name: 'swap' | 'redeem' | 'addliquidity' | 'withdrawliquidity' | 'transfer';
};
export type SwapParams = {
  from: Base.ChainAmount;
  to: Base.ChainAmount;
};

export type TransferParams = {
  from: Base.ChainAmount;
  to: {
    chain_name: string;
    address?: string;
  };
};
export type AddLiquidityParams = {
  pool_id: bigint;
  coinA: Base.ChainAmount;
  coinB: Base.ChainAmount;
};
export type WithdrawLiquidityParams = {
  pool_id: bigint;
  poolCoin: Base.ChainAmount;
};
export type RedeemParams = Array<Base.ChainAmount>;
export type SwapAction = BaseAction & { params: SwapParams };
export type RedeemAction = BaseAction & { params: RedeemParams };
export type AddLiquidityAction = BaseAction & { params: AddLiquidityParams };
export type WithdrawLiquidityAction = BaseAction & { params: WithdrawLiquidityParams };
export type TransferAction = BaseAction & { params: TransferParams };

export type Any = SwapAction | RedeemAction | TransferAction | AddLiquidityAction | WithdrawLiquidityAction;
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

export type SendAddressForm = {
  recipient: string;
  memo: string;
  isTermChecked?: boolean;
  balance: Base.Amount;
};

export type MoveAssetsForm = {
  balance: Base.Amount;
  on_chain: '';
  to_chain: '';
};

export type { Pool };
