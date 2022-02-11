import { EncodeObject, Registry } from '@cosmjs/proto-signing';

import * as API from './api';
import * as Base from './base';

export type BaseAction = {
  name:
    | 'swap'
    | 'redeem'
    | 'addliquidity'
    | 'withdrawliquidity'
    | 'transfer'
    | 'move'
    | 'createpool'
    | 'memo-transfer'
    | 'claim'
    | 'stake'
    | 'multistake'
    | 'unstake'
    | 'switch';
  memo?: string;
};
export type SwapParams = {
  from: Base.ChainAmount;
  to: Base.ChainAmount;
};

export type TransferParams = {
  from: Base.ChainAmount;
  to: {
    chain_name: string;
    address: string;
  };
};
export type MoveParams = {
  from: Base.ChainAmount;
  to: {
    chain_name: string;
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
export type CreatePoolParams = {
  coinA: Base.ChainAmount;
  coinB: Base.ChainAmount;
};
export type ClaimRewardsParams = {
  rewards: { validator_address: string; reward: string }[];
  total: string;
  chain_name: string;
};
export type DelegateParams = {
  validatorAddress: string;
  amount: Base.ChainAmount;
};

export type MultiDelegateParams = Array<DelegateParams>;

export type UndelegateParams = {
  validatorAddress: string;
  amount: Base.ChainAmount;
};
export type RedelegateParams = {
  validatorSrcAddress: string;
  validatorDstAddress: string;
  amount: Base.ChainAmount;
};
export type RedeemParams = Array<Base.ChainAmount>;
export type SwapAction = BaseAction & { params: SwapParams };
export type MoveAction = BaseAction & { params: MoveParams };
export type RedeemAction = BaseAction & { params: RedeemParams };
export type AddLiquidityAction = BaseAction & { params: AddLiquidityParams };
export type WithdrawLiquidityAction = BaseAction & { params: WithdrawLiquidityParams };
export type TransferAction = BaseAction & { params: TransferParams };
export type MemoTransferAction = BaseAction & { params: TransferParams };
export type CreatePoolAction = BaseAction & { params: CreatePoolParams };
export type ClaimRewardsAction = BaseAction & { params: ClaimRewardsParams };
export type MultiDelegateAction = BaseAction & { params: MultiDelegateParams };
export type DelegateAction = BaseAction & { params: DelegateParams };
export type UndelegateAction = BaseAction & { params: UndelegateParams };
export type RedelegateAction = BaseAction & { params: RedelegateParams };
export type Any =
  | SwapAction
  | RedeemAction
  | TransferAction
  | AddLiquidityAction
  | WithdrawLiquidityAction
  | CreatePoolAction
  | MoveAction
  | ClaimRewardsAction
  | DelegateAction
  | MultiDelegateAction
  | UndelegateAction
  | RedelegateAction;
export type StepTransactionDetails = {
  typeUrl: string;
  value: Record<string, unknown>;
  status: 'pending' | 'active' | 'completed';
};

export type IBCBackwardsData = {
  amount: Base.Amount;
  from_chain: string;
  base_denom?: string;
  to_chain: string;
  to_address?: string;
  through: string;
};
export type IBCForwardsData = {
  amount: Base.Amount;
  from_chain: string;
  to_chain: string;
  chain_fee?: FeeWDenom;
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
export type CreatePoolData = {
  coinA: Base.Amount;
  coinB: Base.Amount;
};
export type WithdrawLiquidityData = {
  poolCoin: Base.Amount;
  pool: Pool;
};
export type ClaimData = {
  total: string;
  rewards: { reward: string; validator_address: string }[];
  chain_name: string;
};
export type DelegateData = {
  validatorAddress: string;
  amount: Base.Amount;
  chain_name: string;
};
export type UndelegateData = {
  validatorAddress: string;
  amount: Base.Amount;
  chain_name: string;
};
export type RedelegateData = {
  validatorSrcAddress: string;
  validatorDstAddress: string;
  amount: Base.Amount;
  chain_name: string;
};

export type StepTransaction = {
  name:
    | 'ibc_forward'
    | 'ibc_backward'
    | 'swap'
    | 'transfer'
    | 'addliquidity'
    | 'withdrawliquidity'
    | 'createpool'
    | 'claim'
    | 'stake'
    | 'unstake'
    | 'switch';
  status: 'pending' | 'active' | 'completed';
  addFee?: boolean;
  feeToAdd?: FeeWDenom[];
  data:
    | IBCBackwardsData
    | IBCForwardsData
    | SwapData
    | TransferData
    | AddLiquidityData
    | WithdrawLiquidityData
    | CreatePoolData
    | ClaimData
    | DelegateData[]
    | UndelegateData
    | RedelegateData;
};
export type Step = {
  name:
    | 'transfer'
    | 'redeem'
    | 'swap'
    | 'addliquidity'
    | 'withdrawliquidity'
    | 'createpool'
    | 'move'
    | 'claim'
    | 'stake'
    | 'unstake'
    | 'switch';
  description: string;
  memo?: string;
  output?: {
    amount: {
      denom: string;
      amount: string;
    };
    chain_name: string;
  };
  mustAddFee?: boolean;
  transactions: Array<StepTransaction>;
};

export type SendAddressForm = {
  recipient: string;
  chain_name: string;
  memo: string;
  isTermChecked?: boolean;
  balance: Base.Amount;
};
export type UndelegateForm = {
  validatorAddress: string;
  amount: string;
  denom: string;
  chain_name: string;
};
export type DelegateForm = UndelegateForm & { from_chain: string; from_balance: string };
export type MultiDelegateForm = {
  stakes: DelegateForm[];
};
export type MoveAssetsForm = {
  balance: Base.Amount;
  on_chain: string;
  to_chain: string;
};
export type FeeWDenom = {
  amount: API.Fee;
  denom: string;
  chain_name: string;
};
// HACK! Below needs fixing in starport codegen
export type Pool = {
  display_name?: string;
  /** id of the pool */
  id: string;
  /** id of the pool_type */
  type_id: number;
  /** denoms of reserve coin pair of the pool */
  reserve_coin_denoms: string[];
  /** reserve account address of the pool */
  reserve_account_address: string;
  /** denom of pool coin of the pool */
  pool_coin_denom: string;
};
export type MsgMeta = {
  msg: EncodeObject[];
  chain_name: string;
  registry: Registry;
};

export enum GasPriceLevel {
  LOW = 'low',
  AVERAGE = 'average',
  HIGH = 'high',
}
export type FeeTotals = Record<string, Record<string, number>>;
export type FeeWarning = {
  missingFees: Array<{ amount: string; denom: string; chain_name: string }>;
  ibcWarning: boolean;
  feeWarning: boolean;
  ibcDetails: {
    ibcDenom: string;
    chain_name: string;
    denom: string;
  };
};
export enum StakingActions {
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  SWITCH = 'switch',
  CLAIM = 'claim',
}
export enum StakingActionSteps {
  VALIDATOR = 'Validator',
  AMOUNT = 'Amount',
  REVIEW = 'Review',
  STAKE = 'Stake',
  RESTAKE = 'Restake',
  UNSTAKE = 'Unstake',
  TRANSFER = 'Transfer',
  CLAIM = 'Claim',
}
