import * as Actions from '@/types/actions';
import {store} from '../store/index'
import { Amount } from '@/types/base';

export function getChannel(path, index) {
	let parts = path.split('/');
	return parts[index*2+1]
}
export async function redeem({ amount, chain_id }: { amount: Amount, chain_id: string }) {
	const steps=[]
	let path = store.getters['demeris/getVerifiedPath'](amount.denom) ?? await store.dispatch('demeris/GET_VERIFIED_PATH', { subscribe: true, params: amount.denom }, { root: true })
	if (!path.verified) {
		throw new Error('Denom not verified')
	}
	if (path.native) {
		return steps
	} else {
		let i = 0;
		while (i < (path.verified_path.length-1)) {			
			steps.push({
				name: 'ibc_backward', status: 'pending', data: {
					amount: amount,
					from_chain: path.verified_path[i],
					to_chain: path.verified_path[i + 1],
					through: getChannel(path.path,i) 
				}
			})
			i++;
		}
	}
}
export async function transferToHub({ amount, chain_id }: { amount: Amount, chain_id: string }) {	
	// TODO: Match params to API requests
	const steps=[]
	let path = store.getters['demeris/getVerifiedPath'](amount.denom) ?? await store.dispatch('demeris/GET_VERIFIED_PATH', { subscribe: true, params: amount.denom }, { root: true })
	if (!path.verified) {
		throw new Error('Denom not verified')
	}
	if (path.native) {
		steps.push({
			name: 'ibc_forward', status: 'pending', data: {
				amount: amount,
				from_chain: chain_id,
				to_chain: 'cosmoshub-4'
			}
		})
		return steps
	} else {
		if (path.verified_path.length == 2 && path.verified_path[0] == 'cosmoshub-4') {
			return steps
		} else {
			if (path.verified_path.length > 2) {
				throw new Error('Denom must be redeemed first')
			} else {
				steps.push({
					name: 'ibc_backward', status: 'pending', data: {
						amount: amount,
						from_chain: chain_id,
						to_chain: path.verified_path[1],
						through: getChannel(path.path, 0)
					}
				})
				steps.push({
					name: 'ibc_forward', status: 'pending', data: {
						amount: {amount: amount.amount, denom: path.base_denom},
						from_chain: path.verified_path[1],
						to_chain: 'cosmoshub-4'
					}
				})
				return steps
			}
		}
	}
}
export async function transferFromHub({ amount, chain_id }: { amount: Amount, chain_id: string }) {	
	// TODO: Match params to API requests
	const steps=[]
	let path = store.getters['demeris/getVerifiedPath'](amount.denom) ?? await store.dispatch('demeris/GET_VERIFIED_PATH', { subscribe: true, params: amount.denom }, { root: true })
	if (!path.verified) {
		throw new Error('Denom not verified')
	}
	if (path.native) {
		steps.push({
			name: 'ibc_backward', status: 'pending', data: {
				amount: amount,
				from_chain: 'cosmoshub-4',
				to_chain: chain_id
			}
		})
		return steps
	} else {
		if (path.verified_path.length == 2 && chain_id != path.verified_path[1]) {
			steps.push({
				name: 'ibc_backward', status: 'pending', data: {
					amount: amount,
					from_chain: 'cosmoshub-4',
					to_chain: path.verified_path[1]
				}
			})
			steps.push({
				name: 'ibc_forward', status: 'pending', data: {
					amount: {amount: amount.amount, denom: path.base_denom},
					from_chain: path.verified_path[1],
					to_chain: chain_id
				}
			})
		} else {
			if (path.verified_path.length > 2) {
				throw new Error('Denom must be redeemed first')
			}
		}
	}
}
export async function swap() {
	/*
		if from/to denoms not single-hop (or native), primary channel, on hub throw errors
		else return array containing single swap transaction
	*/
}
export async function actionHandler(action:Actions.Any):Promise<Array<Actions.Step>> {
	const steps = []
	try {
		switch (action.name) {
			case 'swap':
				steps.push(...(await transferToHub({ amount: { amount: action.amount, denom: action.from_denom.denom }, chain_id: action.from_denom.chain_id })))
				steps.push(...(await transferToHub({ amount: { amount: action.amount, denom: action.from_denom.denom }, chain_id: action.from_denom.chain_id })))
		}	
	
	}catch(e) {
		console.log("Unable to create action steps")
	}
	
	return steps
}