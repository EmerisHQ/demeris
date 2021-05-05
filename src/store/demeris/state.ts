import * as API from '@/types/api'
import {DemerisSubscriptions} from './action-types'
export type State = {
	balances: Record<string,Array<API.BalanceResponse>>
	verifiedPath: Record<string,API.VerifiedTraceResponse>
	feeAddress:Record<string,API.FeeAddress>
	fee:Record<string,API.FeeResponse>
	feeToken: Record<string,API.FeeTokensResponse>
	stakingBalances:Record<string,Array<API.DelegationsResponse>>
	prices:Array<API.Price>
	chains:Array<API.ChainResponse>
	verifiedDenoms:Array<API.VerifiedDenomsResponse>
	primaryChannel: Record<string,API.ChannelsResponse>
	chainStatus:Record<string,API.ChainStatus>
	_Subscriptions: Set<DemerisSubscriptions>

}
export function getDefaultState():State {
	return {
		balances: {},
		verifiedPath: {},
		feeAddress: {},
		fee: {},
		feeToken: {},
		stakingBalances: {},
		prices: [],
		chains: [],
		verifiedDenoms: [],
		primaryChannel: {},
		chainStatus: {},
		_Subscriptions: new Set()
	}
}