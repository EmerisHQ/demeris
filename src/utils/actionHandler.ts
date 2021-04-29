import * as Actions from '@/types/actions';
import {store} from '../store/index'


export async function actionHandler(action:Actions.Any):Promise<Array<Actions.Step>> {
	let steps=[]
	switch(action.name) {
		case 'swap':
			try {
				// TODO: Match params to API requests
				let from = store.getters['demeris/getVerifiedPath'](action.from_denom) ?? await store.dispatch('demeris/GET_VERIFIED_PATH', { subscribe: true, params: action.from_denom }, { root: true})
				// TODO: Match params to API requests
				let to = store.getters['demeris/getVerifiedPath'](action.to_denom) ?? await store.dispatch('demeris/GET_VERIFIED_PATH', { subscribe: true, params: action.to_denom }, { root: true})
				
				
			}catch(e) {
				console.log("Unable to create action steps")
			}
	}
	return []
}
/*

swap:
	from:
		base_denom:
		on_chain
		denom:
		amount
	to:
		base_denom:
		on_chain
		

if verified {
	if ibc {
		if 1st hop is hub {
			ibc_backwards till hub
		}else{
			redeem steps
			ibc_forward to hub
		}
}	}else{
		ibc_forward to hub
	}
}else{
	error
}
*/