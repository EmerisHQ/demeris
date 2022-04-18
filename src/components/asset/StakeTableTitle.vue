<template>
  <div class="flex justify-between mt-16">
    <div>
      <div class="flex items-center">
        <h2 class="text-2 font-bold cursor-pointer" :class="getTabClass(1)" @click="emit('selectTab', 1)">
          {{ $t('components.stakeTable.staking') }}
          <div v-if="showTotalStakedAsset" class="text-0 font-normal text-muted">
            {{ totalStakedAssetDisplayAmount }} <Ticker :name="denom" />
          </div>
        </h2>
        <h2
          v-if="isUnstakingAssetExist"
          class="text-2 font-bold ml-6 cursor-pointer"
          :class="getTabClass(2)"
          @click="$emit('selectTab', 2)"
        >
          {{ $t('components.stakeTable.unstaking') }}
          <div class="text-0 font-normal text-muted">
            <div class="text-0 font-normal text-muted">{{ unstakingAssetValue }} <Ticker :name="denom" /></div>
          </div>
        </h2>
        <div class="flex items-center justify-center">
          <div class="ml-4 bg-border rounded-md px-1.5 py-2 flex items-center justify-center">
            <p class="-text-1">{{ apr === '' ? '--.--' : apr }}% APR</p>
          </div>
        </div>
      </div>
      <!-- TODO: a separate check for liquid staking? -->
      <div v-if="denom === 'ucre'" class="flex items-center gap-2 mt-3">
        <InformationIcon class="w-5 h-5" />
        <p class="text-muted -text-1">{{ $t('components.stakeTable.noLiquidStaking') }}</p>
      </div>
    </div>

    <Button
      v-if="showStakingButton"
      data-cy="stake-button"
      :name="$t('components.stakeTable.stake')"
      variant="link"
      :full-width="false"
      @click="() => goToStakingPage()"
    >
      <Icon name="PlusIcon" :icon-size="1.5" />
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from '@vue/reactivity';
import BigNumber from 'bignumber.js';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import InformationIcon from '@/components/common/Icons/InformationIcon.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useChains from '@/composables/useChains';
import useStaking from '@/composables/useStaking';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { StakingActions } from '@/types/actions';
import { event } from '@/utils/analytics';

const { getStakingAPR } = useStaking();

const emit = defineEmits(['selectTab']);

const router = useRouter();
const props = defineProps<{ denom: string; selectedTab: number; totalRewardsAmount: number }>();
const apr = ref<string>('');
const propsRef = toRefs(props);
const { stakingBalancesByChain, unbondingDelegationsByChain } = useAccount();
const store = useStore() as RootStoreTyped;
const { getChainNameByBaseDenom } = useChains();

let chainName = ref<string>(null);

onMounted(async () => {
  chainName.value = await getChainNameByBaseDenom(propsRef.denom.value);
  apr.value = await getStakingAPR(chainName.value);
});

const stakingBalances = computed(() => {
  return stakingBalancesByChain(chainName.value).filter((x) => Math.floor(parseFloat(x.amount)) > 0);
});

const assetPrecision = computed(() => {
  return (
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: propsRef.denom.value,
    }) ?? 6
  );
});

const unbondingBalances = computed(() => {
  if (!chainName.value) return;
  return unbondingDelegationsByChain(chainName.value);
});

const showStakingButton = computed(() => {
  return stakingBalances.value.length > 0;
});

const showTotalStakedAsset = computed(() => {
  return stakingBalances.value.length > 0;
});

const isUnstakingAssetExist = computed(() => {
  return unbondingBalances.value?.length > 0;
});
const getTabClass = (tabNumber: number): string => {
  return propsRef.selectedTab.value === tabNumber ? '' : 'text-inactive';
};

const unstakingAssetValue = computed(() => {
  return unbondingBalances.value
    .map((x) => x.entries)
    .flat()
    .reduce((acc, entry) => {
      return acc.plus(new BigNumber(entry.balance));
    }, new BigNumber(0))
    .dividedBy(10 ** assetPrecision.value)
    .toString();
});
const totalStakedAssetDisplayAmount = computed(() => {
  const total = new BigNumber(propsRef.totalRewardsAmount.value).plus(
    stakingBalances.value.reduce(
      (total, currentValue) => total.plus(new BigNumber(currentValue.amount)),
      new BigNumber(0),
    ),
  );
  if (total.isLessThan(1)) {
    return '<' + (1 / 10 ** assetPrecision.value).toFixed(assetPrecision.value);
  } else {
    const totalDisplay = total.dividedBy(10 ** assetPrecision.value);
    return totalDisplay.toFixed(assetPrecision.value);
  }
});
const goToStakingPage = () => {
  event('staking_entry_point', { event_label: 'Asset Page Staking Button Click', event_category: 'button' });
  router.push(`/staking/${props.denom}/${StakingActions.STAKE}`);
};
</script>
