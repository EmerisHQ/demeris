import axios from 'axios';

import { GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

import { getOwnAddress } from './basic';

export enum AirdropEligibilityStatus {
  ELIGIBLE = 'ELIGIBLE',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  CLAIMABLE = 'CLAIMABLE',
  CLAIMED = 'CLAIMED',
  AUTO_DROP = 'AUTO_DROP',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export function getAirdropEligibility(airdrop: any) {
  if (airdrop.claimActions && airdrop.claimActions.length === 1 && airdrop.claimActions[0].actionType === 'autodrop') {
    return AirdropEligibilityStatus.AUTO_DROP;
  } else if (airdrop.eligibleTokens && airdrop.eligibleTokens.length > 0) {
    const denoms_existing = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms]?.filter((x) =>
      airdrop.eligibleTokens.includes(x.ticker),
    );

    const eligibility_check_responses = denoms_existing.map(async (denom_existing) => {
      let eligibility = null;
      let eligibility_data = null;
      const own_address = await getOwnAddress({ chain_name: denom_existing.chain_name });
      if (airdrop.eligibilityCheckEndpoint && own_address) {
        delete axios.defaults.headers.get['X-Correlation-Id'];
        const eligibilityEndpoint = airdrop.eligibilityCheckEndpoint.replace('<address>', own_address);
        try {
          const eligibility_res = await axios.get(eligibilityEndpoint);
          if (eligibility_res.status === 200) {
            eligibility = AirdropEligibilityStatus.ELIGIBLE;
            eligibility_data = eligibility_res.data;
          }
        } catch (err) {
          if (err.response && err.response.status === 403) {
            eligibility = AirdropEligibilityStatus.NOT_ELIGIBLE;
          } else {
            eligibility = AirdropEligibilityStatus.NOT_AVAILABLE;
          }
          eligibility_data = err.response ? err.response.data : null;
        }
      }

      return {
        project: airdrop.project,
        eligibility: eligibility ? eligibility : AirdropEligibilityStatus.NOT_AVAILABLE,
        eligibilityData: eligibility_data,
      };
    });

    /* only first response will be returned for now, pending 
    when the projects format there responses correctly. 
    After which we will be comparing each response per 
    address checked and adding the eligible amounts all together */
    return eligibility_check_responses[0].then((res) => {
      return res.eligibility;
    });
  } else {
    return AirdropEligibilityStatus.NOT_AVAILABLE;
  }
}
