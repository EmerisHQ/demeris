import * as API from '@/types/api'
import { DemerisSubscriptions } from './action-types'
export type ChainData = {
	full: API.ChainResponse
	fee: API.FeeResponse
	feeAddress: API.FeeAddressesResponse
	feeToken: API.FeeTokensResponse
	status: API.ChainStatus
	primaryChannels: API.ChannelsResponse
	bech32Config: API.Bech32ConfigResponse
	verifiedTrace: Record<string,API.VerifiedTraceResponse>
}
export type State = {
	balances: Record<string,Array<API.BalanceResponse>>
	stakingBalances: Record<string, Array<API.DelegationsResponse>>
	verifiedDenoms:Array<API.VerifiedDenomsResponse>
	prices:Array<API.Price>
	chains: Record<string,ChainData>,
	_Subscriptions: Set<DemerisSubscriptions>

}
export function getDefaultState():State {
	return {
		balances: {},
		stakingBalances: {},
		verifiedDenoms: [],
		prices: [],
		chains: {},
		_Subscriptions: new Set()
	}
}