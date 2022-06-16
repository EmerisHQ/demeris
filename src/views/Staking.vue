<template>
  <div class="stake relative flex w-full min-h-screen justify-center">
    <div v-if="validatorList.length > 0" class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <header class="flex items-center justify-between py-6 h-24">
        <div class="w-12">
          <Button
            v-if="showBackButton"
            variant="link"
            :full-width="false"
            :disabled="isBackDisabled"
            :click-function="goBack"
          >
            <Icon name="ArrowLeftIcon" :icon-size="1.5" />
          </Button>
        </div>

        <nav v-if="showNavigation" class="flex-1 flex items-center justify-center space-x-12">
          <span
            v-for="label of allSteps[actionType]"
            :key="label"
            class="capitalize font-medium cursor-default"
            :class="step === label ? 'text-text' : 'text-inactive'"
          >
            {{ $t('components.staking.navigation.' + label) }}
          </span>
        </nav>

        <Button v-if="!inModal" class="ml-auto" variant="link" :full-width="false" :click-function="onClose">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </header>

      <main class="pt-8 pb-28 flex-1 flex flex-col items-center justify-center">
        <template v-if="actionType == 'claim'">
          <div class="w-full" :class="{ 'mt-0 mb-auto': step == 'validator' }">
            <ClaimForm
              v-if="validatorList.length > 0"
              v-model:step="step"
              :validators="validatorList"
              @previous="goBack"
            />
          </div>
        </template>
        <template v-if="actionType == 'switch'">
          <div class="w-full" :class="{ 'mt-0 mb-auto': step == 'validator' }">
            <SwitchForm
              v-if="validatorList.length > 0"
              v-model:step="step"
              :validators="validatorList"
              :preselected="validator"
              @previous="goBack"
            />
          </div>
        </template>
        <template v-if="actionType == 'stake'">
          <div class="w-full" :class="{ 'mt-0 mb-auto': step == 'validator' }">
            <StakeForm
              v-if="validatorList.length > 0"
              v-model:step="step"
              v-model:inModal="inModal"
              :validators="validatorList"
              :preselected="validator"
              @previous="goBack"
            />
          </div>
        </template>
        <template v-if="actionType == 'unstake'">
          <div class="w-full max-w-lg" :class="{ 'mt-0 mb-auto': step == 'validator' }">
            <UnstakeForm v-model:step="step" :validators="validatorList" :validator="validator" @previous="goBack" />
          </div>
        </template>
      </main>
    </div>
    <div v-else class="flex w-full min-h-screen flex-col items-center justify-center">
      <EphemerisSpinner class="h-64 w-64" />
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/naming-convention */
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import ClaimForm from '@/components/stake/ClaimForm/ClaimForm.vue';
import StakeForm from '@/components/stake/StakeForm';
import SwitchForm from '@/components/stake/SwitchForm/SwitchForm.vue';
import UnstakeForm from '@/components/stake/UnstakeForm';
import Button from '@/components/ui/Button.vue';
import EphemerisSpinner from '@/components/ui/EphemerisSpinner.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useChains from '@/composables/useChains';
import useStaking from '@/composables/useStaking';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { pageview } from '@/utils/analytics';
import { keyHashfromAddress } from '@/utils/basic';

type ActionType = 'stake' | 'unstake' | 'claim' | 'switch';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const transactionsStore = useTransactionsStore();
const route = useRoute();
const { getValidatorsByBaseDenom } = useStaking();
const { stakingBalancesByChain } = useAccount();
const actionType = route.params.action as ActionType;
const validator = route.params.validator as string;
const baseDenom = route.params.denom as string;
const rawValidatorList = ref([]);
const step = actionType == 'claim' ? ref('review') : actionType == 'unstake' ? ref('amount') : ref('validator');
const inModal = ref(undefined);
const { getChainNameByBaseDenom } = useChains();

const chainName = ref<string>(null);

onMounted(async () => {
  chainName.value = await getChainNameByBaseDenom(baseDenom);
});

const stakingBalances = computed(() => {
  return stakingBalancesByChain(chainName.value);
});
watch(
  () => chainName.value,
  async (newVal, _) => {
    if (newVal) {
      rawValidatorList.value = await getValidatorsByBaseDenom(baseDenom);
    }
  },
  { immediate: true },
);
const validatorList = computed(() => {
  const validators = [];
  if (stakingBalances.value.length) {
    rawValidatorList.value.forEach((vali: any) => {
      const stakedValidator = stakingBalances.value.find(
        (stakedVali) => stakedVali.validator_address === keyHashfromAddress(vali.operator_address),
      );
      if (stakedValidator && Math.floor(parseFloat(stakedValidator.amount)) > 0) {
        validators.push({ ...vali, stakedAmount: parseInt(stakedValidator.amount) });
      } else {
        validators.push({ ...vali, stakedAmount: 0 });
      }
    });
  } else {
    rawValidatorList.value.forEach((vali: any) => {
      validators.push({ ...vali, stakedAmount: 0 });
    });
  }
  return validators;
});
pageview({ page_title: actionType + ': ' + baseDenom, page_path: '/staking/' + baseDenom + '/' + actionType });

const showBackButton = computed(() => {
  if (step.value === 'staked' || step.value === 'unstaked') {
    return false;
  }

  return (currentStepIndex.value > 0 && !!actionType) || inModal.value;
});
const isBackDisabled = computed(() => {
  return (
    (step.value === 'validator' && !inModal.value) ||
    (actionType === 'claim' && step.value === 'review') ||
    (actionType === 'unstake' && step.value === 'amount')
  );
});
const allSteps = {
  stake: ['validator', 'amount', 'review', 'staked'],
  unstake: ['amount', 'review', 'unstake'],
  switch: ['validator', 'amount', 'review', 'restake'],
  claim: ['review', 'claim'],
};

const currentStepIndex = computed(() => allSteps[actionType]?.indexOf(step.value));

const metaSource = computed(() => {
  const title = t('context.stake.title');

  return {
    title,
  };
});
useMeta(metaSource);

const goBack = () => {
  if (inModal.value) {
    step.value = inModal.value;
    inModal.value = undefined;
  } else {
    transactionsStore.removeTransaction(transactionsStore.currentId);
    if (currentStepIndex.value > 0) {
      step.value = allSteps[actionType][currentStepIndex.value - 1];
      return;
    }

    step.value = undefined;
    router.back();
  }
};

const onClose = () => {
  transactionsStore.setTransactionAsPending(transactionsStore.currentId);
  const hasPrevPath = !!router.options.history.state.back;
  hasPrevPath ? router.back() : router.push('/');
};

const showNavigation = computed(() => {
  if (step.value === 'staked' || step.value === 'unstaked') {
    return false;
  }
  return actionType && !inModal.value;
});
</script>

<style lang="scss" scoped></style>
