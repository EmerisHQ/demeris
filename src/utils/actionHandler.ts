import * as Actions from '@/types/actions';
import {store} from '../store/index'


export async function actionHandler(action:Actions.Any):Promise<Array<Actions.Step>> {
	let steps=[]
	switch(action.name) {
		case 'swap':
			try {
				let from = await store.dispatch('demeris/GET_VERIFIED_PATH', { params: action.from_denom }, { root: true})
				let to = await store.dispatch('demeris/GET_VERIFIED_PATH', { params: action.to_denom },{ root: true})
				//if (from.verified_path.length==2 && from.verified_path.
			}catch(e) {
				console.log("Unable to create action steps")
			}
	}
	return []
}