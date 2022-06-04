<template>
  <div class="flex w-full justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <fieldset class="py-8">
        <div class="w-full max-w-lg mx-auto">
          <div class="relative text-4 font-bold px-20 w-full text-center transition-colors">
            <div v-if="hasPrice" class="flex items-center absolute inset-y-0 left-0">
              <Button
                :click-function="
                  () => {
                    state.isUSDInputChecked = !state.isUSDInputChecked;
                  }
                "
                size="sm"
                variant="secondary"
                rounded
                :tooltip-text="$t('components.moveForm.tooltip', { type: state.isUSDInputChecked ? 'crypto' : 'USD' })"
              >
                <Icon
                  name="SwapUDIcon"
                  :icon-size="1"
                  :class="['transform transition', { 'rotate-180': state.isUSDInputChecked }]"
                />
              </Button>
            </div>
            <FlexibleAmountInput
              v-show="state.isUSDInputChecked"
              v-model="state.usdValue"
              :min-width="state.isUSDInputChecked ? 35 : 0"
              prefix="$"
            >
              <template #default="inputProps">
                <USDInput
                  :model-value="form.amount"
                  :denom="baseDenom || ''"
                  :class="[inputProps.class]"
                  :style="inputProps.style"
                  placeholder="0"
                  @update:price="state.usdValue = $event"
                  @update:modelValue="
                    ($event) => {
                      state.isMaximumAmountChecked = false;
                      if (state.isUSDInputChecked) {
                        form.amount = $event;
                      }
                    }
                  "
                />
              </template>
            </FlexibleAmountInput>
            <FlexibleAmountInput
              v-show="!state.isUSDInputChecked"
              v-model="form.amount"
              :min-width="!state.isUSDInputChecked ? 35 : 0"
              placeholder="0"
              :suffix="state.assetTicker"
              class="uppercase"
              @input="state.isMaximumAmountChecked = false"
            />
            <div class="flex items-center absolute inset-y-0 right-0">
              <Button
                :click-function="
                  () => {
                    state.isMaximumAmountChecked = true;
                  }
                "
                :name="$t('generic_cta.max')"
                class="flex"
                :class="{ 'text-negative-text': !hasSufficientFunds }"
                size="sm"
                variant="secondary"
                rounded
              />
            </div>
          </div>
          <div class="text-muted mt-3 text-center">
            <AmountDisplay
              v-if="state.isUSDInputChecked"
              :amount="{
                amount: form.amount ? parseInt(form.amount) * denomDecimals + '' : '0',
                denom: baseDenom,
              }"
            />
            <div v-else-if="hasPrice" class="text-muted mt-3 text-center">
              <CurrencyDisplay :value="state.usdValue" />
            </div>
          </div>
        </div>
      </fieldset>
      <main class="pb-28 flex-1 flex flex-col items-center justify-center">
        <div class="w-full max-w-lg mx-auto">
          <div
            class="denom-select w-full flex flex-col items-center rounded-2xl shadow-panel bg-surface"
            :class="{
              'px-6': size === 'sm',
              'px-5': size === 'md',
            }"
          >
            <div class="flex self-stretch items-center justify-end px-2">
              <div class="w-16">From</div>
              <ValidatorDisplay v-if="fromValidator" :validator="fromValidator" />
            </div>
            <div class="flex self-stretch items-center justify-end px-2 cursor-pointer" @click="validatorSelectHandler">
              <div class="w-16">To</div>
              <ValidatorDisplay v-if="toValidator" :validator="toValidator" />
              <Icon name="ChevronRightIcon" :icon-size="1" class="-mr-4 absolute" />
            </div>
          </div>
          <div class="mt-2 w-full max-w-sm mx-auto">
            <!-- Stake Info -->
            <ListItem inset size="md" label="Claiming rewards">
              <AmountDisplay :amount="{ amount: stakingRewards, denom: baseDenom }" />
              <div class="text-muted">
                <Price :amount="{ denom: baseDenom, amount: stakingRewards }" :show-zero="true" :show-dash="false" />
              </div>
            </ListItem>

            <!-- Fee -->
            <div class="mt-6 mb-2">
              <FeeLevelSelector :steps="steps" @update:fees="fees = $event" />
            </div>
            <!-- Continue button -->
            <Button :name="$t('generic_cta.continue')" :disabled="!isValid" @click="goToReview" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, inject, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import USDInput from '@/components/common/USDInput.vue';
import Button from '@/components/ui/Button.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useStaking from '@/composables/useStaking';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { RestakeForm, Step } from '@/types/actions';

import ValidatorDisplay from '../ValidatorDisplay.vue';

interface Props {
  size?: string;
  validators: EmerisAPI.Validator[];
  steps?: Step[];
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  validators: () => [],
  steps: () => [],
});

const emit = defineEmits<{
  (e: 'previous'): void;
  (e: 'next'): void;
}>();

const store = useStore() as RootStoreTyped;

const { getStakingRewardsByBaseDenom } = useStaking();

const form = inject<RestakeForm>('switchForm');

const propsRef = toRefs(props);
const fees = ref({});
const stakingRewardsData = ref(null);

const chain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getChain]({
    chain_name: propsRef.validators.value[0].chain_name,
  });
});
const baseDenom = chain.value?.denoms.find((x) => x.stakable).name;
const precision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({
    name: baseDenom,
  }),
);

const denomDecimals = computed(() => {
  return Math.pow(10, precision.value);
});
const hasPrice = computed(() => {
  const price = store.getters[GlobalGetterTypes.API.getPrice]({ denom: baseDenom });

  return !!price;
});

const state = reactive({
  currentAsset: undefined,
  assetTicker: undefined,
  isMaximumAmountChecked: false,
  isUSDInputChecked: false,
  isDenomModalOpen: false,
  isChainsModalOpen: false,
  chainsModalSource: 'from',
  usdValue: '',
  fees: {},
  gasPrice: '',
});
watch(
  () => state.isMaximumAmountChecked,
  () => {
    if (state.isMaximumAmountChecked) {
      form.amount = new BigNumber(stakingBalance.value).dividedBy(10 ** precision.value).toString();
      return;
    }
  },
);
const stakingRewards = computed(() => {
  if (stakingRewardsData.value !== null && stakingRewardsData.value?.rewards) {
    return parseFloat(
      stakingRewardsData.value.rewards.find((x) => x.validator_address == form.validatorAddress)?.reward ?? '0',
    ).toString();
  } else {
    return '0';
  }
});
const stakingBalance = computed(() => {
  return propsRef.validators.value.find((x) => x.operator_address == form.validatorAddress).stakedAmount;
});
const remainingStake = computed(() => {
  return new BigNumber(stakingBalance.value ?? 0)
    .minus(new BigNumber(form.amount != '' ? form.amount ?? 0 : 0).multipliedBy(10 ** precision.value))
    .toString();
});

const hasSufficientFunds = computed(() => {
  return new BigNumber(remainingStake.value).isGreaterThanOrEqualTo(0);
});
const fromValidator = computed(() => {
  return propsRef.validators.value.find((x) => x.operator_address == form.validatorAddress);
});
const toValidator = computed(() => {
  return propsRef.validators.value.find((x) => x.operator_address == form.toValidatorAddress);
});
const isValid = computed(() => {
  return parseFloat(remainingStake.value) >= 0;
});
const goToReview = () => {
  emit('next');
};
const validatorSelectHandler = () => {
  emit('previous');
};
onMounted(async () => {
  stakingRewardsData.value = await getStakingRewardsByBaseDenom(baseDenom);
});
</script>
