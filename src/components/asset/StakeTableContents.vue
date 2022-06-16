<template>
  <template v-if="validatorList.length > 0">
    <div v-show="selectedTab === 1">
      <!-- staking reward table -->
      <table class="w-full table-fixed mt-8 text-right" data-cy="staking-table">
        <colgroup>
          <col width="32%" />
          <col width="38%" />
          <col width="20%" />
          <col width="8%" />
        </colgroup>

        <!-- table body -->
        <tbody>
          <!-- claim rewards -->
          <tr
            v-if="totalRewardsAmount && totalRewardsAmount > 1"
            class="group cursor-pointer shadow-card hover:shadow-dropdown transition-shadow rounded-xl"
            @click="goStakeActionPage(StakingActions.CLAIM)"
          >
            <td class="py-6 flex items-center rounded-l-xl bg-surface">
              <div class="inline-flex items-center ml-6 mr-4">
                <img src="@/assets/svg/icons/reward.svg" />
              </div>
              <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {{ $t('components.stakeTable.claimRewards') }}
              </span>
            </td>
            <td class="text-right text-muted bg-surface">{{ totalRewardsDisplayAmount }} <Ticker :name="denom" /></td>
            <td class="text-right font-medium bg-surface">
              <div class="flex justify-end">
                +<Price :amount="{ denom: denom, amount: totalRewardsAmount + '' }" :show-dash="false" />
              </div>
            </td>
            <td class="text-right rounded-r-xl bg-surface">
              <div class="flex justify-end">
                <Icon
                  name="CaretRightIcon"
                  :icon-size="1"
                  class="ml-1.5 mr-1 px-1 self-stretch text-muted group-hover:text-text transition-colors"
                />
              </div>
            </td>
          </tr>

          <!-- staked validators -->
          <tr v-for="validator of stakingBalances" :key="validator.validator_address" data-cy="validator-row">
            <td class="py-6 flex items-center transition">
              <div class="inline-flex items-center mr-4">
                <ValidatorBadge
                  :validator="
                    validatorList.find((x) => keyHashfromAddress(x.operator_address) == validator.validator_address)
                  "
                />
              </div>
              <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                {{ getValidatorMoniker(validator.validator_address) }}
              </span>
            </td>
            <td class="text-right text-muted">
              {{ getDisplayAmount(validator.amount, assetPrecision) }} <Ticker :name="denom" />
            </td>
            <td class="text-right font-medium">
              <Price :amount="{ denom: denom, amount: validator.amount }" />
            </td>
            <td class="text-right">
              <DropdownMenu icon="ThreeDotsIcon" :icon-size="1.5" placement="right-start" :offset="[-24, 0]">
                <DropdownMenuItem
                  @click="
                    () => {
                      if (
                        !validatorList.find(
                          (x) => keyHashfromAddress(x.operator_address) == validator.validator_address,
                        ).jailed
                      ) {
                        goStakeActionPage(StakingActions.STAKE, validator.validator_address);
                      }
                    }
                  "
                >
                  {{ $t('components.stakeTable.stake') }}
                </DropdownMenuItem>
                <DropdownMenuItem @click="goStakeActionPage(StakingActions.UNSTAKE, validator.validator_address)">
                  {{ $t('components.stakeTable.unstake') }}
                </DropdownMenuItem>
                <DropdownMenuItem @click="goStakeActionPage(StakingActions.SWITCH, validator.validator_address)">
                  {{ $t('components.stakeTable.switchValidator') }}
                </DropdownMenuItem>
              </DropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-show="selectedTab === 2">
      <table class="w-full table-fixed mt-8 text-right">
        <colgroup>
          <col width="30%" />
          <col width="20%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>

        <!-- table body -->
        <tbody>
          <!-- staked validators -->
          <template v-for="unbondingBalance of unbondingBalances">
            <tr
              v-for="(entry, index) of unbondingBalance.entries"
              :key="unbondingBalance.validator_address + '_' + index"
              class="group"
            >
              <td class="py-6 flex items-center transition">
                <div class="inline-flex items-center mr-4">
                  <ValidatorBadge
                    :validator="
                      validatorList.find(
                        (x) => keyHashfromAddress(x.operator_address) == unbondingBalance.validator_address,
                      )
                    "
                    class="w-8 h-8 rounded-full bg-fg z-1"
                  />
                </div>
                <span class="text-left overflow-hidden text-ellipsis whitespace-nowrap font-medium">
                  {{ getValidatorMoniker(unbondingBalance.validator_address) }}
                </span>
              </td>
              <td class="text-left text-muted">
                <div class="inline-flex items-center">
                  <TimeIcon class="mr-2" />
                  <span>
                    {{ getTimeToString(entry.completion_time) }}
                  </span>
                </div>
              </td>
              <td class="text-right text-muted">
                {{ getDisplayAmount(entry.balance, assetPrecision) }} <Ticker :name="denom" />
              </td>
              <td class="text-right font-medium">
                <Price :amount="{ denom: denom, amount: entry.balance }" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </template>
  <SkeletonLoader v-else width="100%" height="300px" class="mt-8" />
  <StakeTableBanner v-if="validatorList.length > 0 && stakingBalances.length === 0" :denom="denom" />
</template>
<script lang="ts" setup>
/* eslint-disable @typescript-eslint/naming-convention */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import StakeTableBanner from '@/components/asset/StakeTableBanner.vue';
import TimeIcon from '@/components/common/Icons/TimeIcon.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';
import DropdownMenuItem from '@/components/ui/DropdownMenuItem.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useChains from '@/composables/useChains';
import useStaking from '@/composables/useStaking';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { StakingActions } from '@/types/actions';
import { event } from '@/utils/analytics';
import { chainAddressfromKeyhash, getDisplayAmount, keyHashfromAddress } from '@/utils/basic';

dayjs.extend(relativeTime);
const { getValidatorsByBaseDenom, getChainDisplayInflationByBaseDenom } = useStaking();
const router = useRouter();
const { stakingBalancesByChain, unbondingDelegationsByChain } = useAccount();
const store = useStore() as RootStoreTyped;
/* variables */
const assetStakingAPY = ref<number | string>('-');
const validatorList = ref<Array<any>>([]);
const props = defineProps<{ denom: string; selectedTab: number; totalRewardsAmount: number }>();
const propsRef = toRefs(props);
let chainName = ref<string>(null);

const { getChainNameByBaseDenom } = useChains();

watch(
  () => propsRef.denom.value,
  async (newVal, _) => {
    if (newVal) {
      assetStakingAPY.value = await getChainDisplayInflationByBaseDenom(newVal);
      validatorList.value = await getValidatorsByBaseDenom(newVal);
    }
  },
  { immediate: true },
);

onMounted(async () => {
  chainName.value = await getChainNameByBaseDenom(propsRef.denom.value);
});

const assetPrecision = computed(() => {
  return (
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: propsRef.denom.value,
    }) ?? 6
  );
});

const stakingBalances = computed(() => {
  return stakingBalancesByChain(chainName.value).filter((x) => Math.floor(parseFloat(x.amount)) > 0);
});
const getTimeToString = (isodate: string) => {
  return dayjs().to(dayjs(isodate));
};
const unbondingBalances = computed(() => {
  return unbondingDelegationsByChain(chainName.value);
});
const operator_prefix = computed(() => {
  return store.getters[GlobalGetterTypes.API.getBech32Config]({
    chain_name: chainName.value,
  }).val_addr;
});

const totalRewardsDisplayAmount = computed(() => {
  if (propsRef.totalRewardsAmount.value < 1) {
    return '<' + (1 / 10 ** assetPrecision.value).toFixed(assetPrecision.value);
  }
  return getDisplayAmount(propsRef.totalRewardsAmount.value ?? 0, assetPrecision.value);
});
const getValidatorMoniker = (address: string): string => {
  let moniker;
  validatorList.value.some((vali) => {
    if (keyHashfromAddress(vali.operator_address) === address) {
      moniker = vali.moniker;
      return true;
    } else {
      return false;
    }
  });
  return moniker;
};
const goStakeActionPage = (action: string, valAddress = '') => {
  const validatorAddress = chainAddressfromKeyhash(operator_prefix.value, valAddress);
  if (action === StakingActions.STAKE) {
    event('staking_entry_point', {
      event_label: 'Asset Page Staking Table 3 Dot Icon Stake Click',
      event_category: 'menu',
    });
  }
  switch (action) {
    case StakingActions.STAKE:
    case StakingActions.UNSTAKE:
    case StakingActions.SWITCH:
      router.push(`/staking/${props.denom}/${action}${validatorAddress ? `/${validatorAddress}` : ''}`);
      return;
    default:
      router.push(`/staking/${props.denom}/${StakingActions.CLAIM}`);
      return;
  }
};
</script>
