import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { EmerisBase } from '@emeris/types';

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
export type StakeParams = {
  validatorAddress: string;
  amount: Base.ChainAmount;
};

export type MultiStakeParams = Array<StakeParams>;

export type UnstakeParams = {
  validatorAddress: string;
  amount: Base.ChainAmount;
};
export type RestakeParams = {
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
export type MultiStakeAction = BaseAction & { params: MultiStakeParams };
export type StakeAction = BaseAction & { params: StakeParams };
export type UnstakeAction = BaseAction & { params: UnstakeParams };
export type RestakeAction = BaseAction & { params: RestakeParams };
export type Any =
  | SwapAction
  | RedeemAction
  | TransferAction
  | AddLiquidityAction
  | WithdrawLiquidityAction
  | CreatePoolAction
  | MoveAction
  | ClaimRewardsAction
  | StakeAction
  | MultiStakeAction
  | UnstakeAction
  | RestakeAction;
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
export type StakeData = {
  validatorAddress: string;
  amount: Base.Amount;
  chain_name: string;
};
export type UnstakeData = {
  validatorAddress: string;
  amount: Base.Amount;
  chain_name: string;
};
export type RestakeData = {
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
    | StakeData[]
    | UnstakeData
    | RestakeData;
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
export type UnstakeForm = {
  validatorAddress: string;
  amount: string;
  denom: string;
  chain_name: string;
};
export type StakeForm = UnstakeForm & { from_chain: string };
export type MultiStakeForm = {
  stakes: StakeForm[];
};
export type RestakeForm = {
  validatorAddress: string;
  toValidatorAddress: string;
  amount: string;
  denom: string;
  chain_name: string;
};
export type MoveAssetsForm = {
  balance: Base.Amount;
  on_chain: string;
  to_chain: string;
};
export type FeeWDenom = {
  amount: EmerisBase.GasPrice;
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
