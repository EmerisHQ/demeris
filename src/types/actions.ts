import * as Base from './base'

export interface BaseAction {
	name: 'swap' | 'redeem'
}
export interface MetaDenom {
	denom: string
	chain_id: string
}
export interface SwapParams {
	from_denom: MetaDenom
	to_denom: MetaDenom
	amount: number
	slippage: number
}
export type Swap = BaseAction & SwapParams

export type Any = Swap
export type StepTransaction = {
	typeUrl: string,
	value: Record<string,unknown>,
	status: 'pending' | 'active' | 'completed'
}
export interface RedeemData {
	denom: string
	on_chain:	string
}

export interface TransferData {
	amount: Base.Amount
	to_chain: string
	to_address: string
}
export interface SwapData {
	amount: Base.Amount
	to_denom: MetaDenom
	slippage: number
}
export type Step = {
	name: 'redeem' | 'transfer' | 'swap';
	status: 'pending' | 'active' | 'completed';
	data: RedeemData | TransferData | SwapData
}