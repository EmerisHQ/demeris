import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { EmerisBase } from '@emeris/types';

export type BaseAction = {
  memo?: string;
};
export type SwapParams = {
  from: EmerisBase.ChainAmount;
  to: EmerisBase.ChainAmount;
};

export type TransferParams = {
  from: EmerisBase.ChainAmount;
  to: {
    chain_name: string;
    address: string;
  };
};
export type MoveParams = {
  from: EmerisBase.ChainAmount;
  to: {
    chain_name: string;
  };
};
export type AddLiquidityParams = {
  pool_id: bigint;
  coinA: EmerisBase.ChainAmount;
  coinB: EmerisBase.ChainAmount;
};
export type WithdrawLiquidityParams = {
  pool_id: bigint;
  poolCoin: EmerisBase.ChainAmount;
};
export type CreatePoolParams = {
  coinA: EmerisBase.ChainAmount;
  coinB: EmerisBase.ChainAmount;
};
export type ClaimRewardsParams = {
  rewards: { validator_address: string; reward: string }[];
  total: string;
  chain_name: string;
};
export type StakeParams = {
  validatorAddress: string;
  amount: EmerisBase.ChainAmount;
};

export type MultiStakeParams = Array<StakeParams>;

export type UnstakeParams = {
  validatorAddress: string;
  amount: EmerisBase.ChainAmount;
};
export type RestakeParams = {
  validatorSrcAddress: string;
  validatorDstAddress: string;
  amount: EmerisBase.ChainAmount;
};
export type RedeemParams = Array<EmerisBase.ChainAmount>;
export type SwapAction = BaseAction & { name: 'swap'; params: SwapParams };
export type MoveAction = BaseAction & { name: 'move'; params: MoveParams };
export type RedeemAction = BaseAction & { name: 'redeem'; params: RedeemParams };
export type AddLiquidityAction = BaseAction & { name: 'addliquidity'; params: AddLiquidityParams };
export type WithdrawLiquidityAction = BaseAction & { name: 'withdrawliquidity'; params: WithdrawLiquidityParams };
export type TransferAction = BaseAction & { name: 'transfer'; params: TransferParams };
export type MemoTransferAction = BaseAction & { name: 'memo-transfer'; params: TransferParams };
export type CreatePoolAction = BaseAction & { name: 'createpool'; params: CreatePoolParams };
export type ClaimRewardsAction = BaseAction & { name: 'claim'; params: ClaimRewardsParams };
export type MultiStakeAction = BaseAction & { name: 'multistake'; params: MultiStakeParams };
export type StakeAction = BaseAction & { name: 'stake'; params: StakeParams };
export type UnstakeAction = BaseAction & { name: 'unstake'; params: UnstakeParams };
export type RestakeAction = BaseAction & { name: 'switch'; params: RestakeParams };
export type UserAction =
  | SwapAction
  | RedeemAction
  | TransferAction
  | AddLiquidityAction
  | WithdrawLiquidityAction
  | MemoTransferAction
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
  amount: EmerisBase.Amount;
  from_chain: string;
  base_denom?: string;
  to_chain: string;
  to_address?: string;
  through: string;
};
export type IBCForwardsData = {
  amount: EmerisBase.Amount;
  from_chain: string;
  to_chain: string;
  chain_fee?: FeeWDenom;
  to_address?: string;
  through: string;
};
export type TransferData = {
  amount: EmerisBase.Amount;
  chain_name: string;
  to_address: string;
};
export type SwapData = {
  from: EmerisBase.Amount;
  to: EmerisBase.Amount;
  pool: Pool;
};
export type AddLiquidityData = {
  coinA: EmerisBase.Amount;
  coinB: EmerisBase.Amount;
  pool: Pool;
};
export type CreatePoolData = {
  coinA: EmerisBase.Amount;
  coinB: EmerisBase.Amount;
};
export type WithdrawLiquidityData = {
  poolCoin: EmerisBase.Amount;
  pool: Pool;
};
export type ClaimData = {
  total: string;
  rewards: { reward: string; validator_address: string }[];
  chain_name: string;
};
export type StakeData = {
  validatorAddress: string;
  amount: EmerisBase.Amount;
  chain_name: string;
};
export type UnstakeData = {
  validatorAddress: string;
  amount: EmerisBase.Amount;
  chain_name: string;
};
export type RestakeData = {
  validatorSrcAddress: string;
  validatorDstAddress: string;
  amount: EmerisBase.Amount;
  chain_name: string;
};
export type BaseStepTx = {
  status: 'pending' | 'active' | 'completed';
  addFee?: boolean;
  feeToAdd?: FeeWDenom[];
};
export type IBCBackwardsStepTx = BaseStepTx & {
  name: 'ibc_forward';
  data: IBCBackwardsData;
};
export type IBCForwardsStepTx = BaseStepTx & {
  name: 'ibc_backward';
  data: IBCForwardsData;
};
export type SwapStepTx = BaseStepTx & {
  name: 'swap';
  data: SwapData;
};
export type TransferStepTx = BaseStepTx & {
  name: 'transfer';
  data: TransferData;
};
export type AddLiqStepTx = BaseStepTx & {
  name: 'addliquidity';
  data: AddLiquidityData;
};
export type WithdrawLiqStepTx = BaseStepTx & {
  name: 'withdrawliquidity';
  data: WithdrawLiquidityData;
};
export type CreatePoolStepTx = BaseStepTx & {
  name: 'createpool';
  data: CreatePoolData;
};
export type ClaimStepTx = BaseStepTx & {
  name: 'claim';
  data: ClaimData;
};
export type StakeStepTx = BaseStepTx & {
  name: 'stake';
  data: StakeData[];
};
export type UnstakeStepTx = BaseStepTx & {
  name: 'unstake';
  data: UnstakeData;
};
export type RestakeStepTx = BaseStepTx & {
  name: 'switch';
  data: RestakeData;
};
export type StepTransaction =
  | IBCBackwardsStepTx
  | IBCForwardsStepTx
  | SwapStepTx
  | TransferStepTx
  | AddLiqStepTx
  | WithdrawLiqStepTx
  | CreatePoolStepTx
  | ClaimStepTx
  | StakeStepTx
  | UnstakeStepTx
  | RestakeStepTx;
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
  balance: EmerisBase.Amount;
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
  balance: EmerisBase.Amount;
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
