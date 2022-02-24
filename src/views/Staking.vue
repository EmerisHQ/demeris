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

        <nav v-if="actionType" class="flex-1 flex items-center justify-center space-x-12">
          <span
            v-for="label of allSteps[actionType]"
            :key="label"
            class="capitalize font-medium cursor-default"
            :class="step === label ? 'text-text' : 'text-inactive'"
          >
            {{ label }}
          </span>
        </nav>

        <Button class="ml-auto" variant="link" :full-width="false" :click-function="onClose">
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
              :validators="validatorList"
              :preselected="validator"
              @previous="goBack"
            />
          </div>
        </template>
        <template v-if="actionType == 'unstake'">
          <div class="w-full max-w-lg" :class="{ 'mt-0 mb-auto': step == 'validator' }">
            <UnstakeForm v-model:step="step" :validator="selectedValidators.slice()[0]" @previous="goBack" />
          </div>
        </template>
      </main>
    </div>
    <div v-else class="flex w-full min-h-screen flex-col items-center justify-center">
      <EphemerisSpinner class="h-64 w-64" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
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
import useStaking from '@/composables/useStaking';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { Step } from '@/types/actions';
import { pageview } from '@/utils/analytics';
import { keyHashfromAddress } from '@/utils/basic';

type ActionType = 'stake' | 'unstake' | 'claim' | 'switch';

export default defineComponent({
  name: 'Staking',
  components: {
    Button,
    Icon,
    StakeForm,
    UnstakeForm,
    SwitchForm,
    ClaimForm,
    EphemerisSpinner,
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const transactionsStore = useTransactionsStore();
    const route = useRoute();
    const editing = ref(null);
    const { getValidatorsByBaseDenom } = useStaking();
    const { balances, stakingBalances } = useAccount();
    const actionType = route.params.action as ActionType;
    const validator = route.params.validator as string;
    const baseDenom = route.params.denom as string;
    const validatorList = ref([]);
    const totalStakedAmount = ref<number>(0);
    const unstakeAmount = ref<string>('0');
    const selectedValidators = ref([]);
    const step = actionType == 'claim' ? ref('review') : actionType == 'unstake' ? ref('amount') : ref('validator');
    const fromValidator = ref({});
    const toValidator = ref({});
    onMounted(async () => {
      validatorList.value = await getValidatorsByBaseDenom(baseDenom);
      const preselectedValidator = validatorList.value.find((x) => x.operator_address == validator);
      if (preselectedValidator) {
        if (actionType == 'switch') {
          fromValidator.value = preselectedValidator;
        } else {
          selectedValidators.value.push(preselectedValidator);
        }
      }
      if (stakingBalances.value.length) {
        validatorList.value.forEach((vali: any) => {
          const stakedValidator = stakingBalances.value.find(
            (stakedVali) => stakedVali.validator_address === keyHashfromAddress(vali.operator_address),
          );
          totalStakedAmount.value += Number(vali.tokens);
          if (stakedValidator) {
            vali.stakedAmount = parseInt(stakedValidator.amount);
          } else {
            vali.stakedAmount = 0;
          }
        });
      } else {
        validatorList.value.forEach((vali: any) => {
          totalStakedAmount.value += Number(vali.tokens);
          vali.stakedAmount = 0;
        });
      }
    });
    pageview({ page_title: actionType + ': ' + baseDenom, page_path: '/staking/' + baseDenom + '/' + actionType });
    const selectAnother = (e) => {
      step.value = allSteps[actionType][currentStepIndex.value - 1];
      editing.value = e;
    };
    const disabledValidators = computed(() => {
      if (editing.value !== null) {
        return selectedValidators.value.slice().splice(editing.value, 1);
      } else {
        return selectedValidators.value;
      }
    });
    const showBackButton = computed(() => {
      return currentStepIndex.value > 0 && !!actionType;
    });
    const isBackDisabled = computed(() => {
      return (
        step.value === 'validator' ||
        (actionType === 'claim' && step.value === 'review') ||
        (actionType === 'unstake' && step.value === 'amount')
      );
    });
    const steps = ref<Step[]>([]);
    const allSteps = {
      stake: ['validator', 'amount', 'review', 'stake'],
      unstake: ['amount', 'review', 'unstake'],
      switch: ['validator', 'amount', 'review', 'restake'],
      claim: ['review', 'claim'],
    };

    const resetHandler = () => {
      if (actionType == 'claim') {
        step.value = 'review';
      } else if (actionType == 'unstake') {
        step.value = 'amount';
      } else {
        step.value = 'validator';
      }
    };
    const currentStepIndex = computed(() => allSteps[actionType]?.indexOf(step.value));
    const addValidator = (val) => {
      if (editing.value !== null) {
        selectedValidators.value[editing.value] = val;
      } else {
        selectedValidators.value.push(val);
      }
      editing.value = null;
      step.value = allSteps[actionType][currentStepIndex.value + 1];
    };
    const metaSource = computed(() => {
      let title = t('context.stake.title');

      return {
        title,
      };
    });
    useMeta(metaSource);

    const goBack = () => {
      transactionsStore.removeTransaction(transactionsStore.currentId);
      if (currentStepIndex.value > 0) {
        step.value = allSteps[actionType][currentStepIndex.value - 1];
        return;
      }

      step.value = undefined;
      router.back();
    };
    const setSteps = (actionSteps) => {
      steps.value = actionSteps.slice();

      step.value = allSteps[actionType][currentStepIndex.value + 1];
    };
    const onClose = () => {
      transactionsStore.removeTransaction(transactionsStore.currentId);
      const hasPrevPath = !!router.options.history.state.back;
      hasPrevPath ? router.back() : router.push('/');
    };

    return {
      balances,
      actionType,
      step,
      allSteps,
      goBack,
      showBackButton,
      onClose,
      isBackDisabled,
      validatorList,
      addValidator,
      selectedValidators,
      selectAnother,
      totalStakedAmount,
      disabledValidators,
      resetHandler,
      setSteps,
      steps,
      validator,
      unstakeAmount,
      fromValidator,
      toValidator,
    };
  },
});
</script>

<style lang="scss" scoped></style>
