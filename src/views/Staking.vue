<template>
  <div class="send relative flex w-full min-h-screen justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <header class="flex items-center justify-between py-6 h-24">
        <Button
          v-if="showBackButton"
          variant="link"
          :full-width="false"
          :disabled="isBackDisabled"
          :click-function="goBack"
        >
          <Icon name="ArrowLeftIcon" :icon-size="1.5" />
        </Button>

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
        <template v-if="actionType == 'stake'">
          <div class="w-full">
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
          <div class="w-full max-w-lg">
            <UnstakeForm v-model:step="step" :validator="selectedValidators.slice()[0]" @previous="goBack" />
          </div>
        </template>
        <template v-if="actionType == 'switch' && step == 'amount'">
          <div class="max-w-7xl">
            <RestakeValidatorAmount
              v-if="fromValidator"
              :size="'md'"
              :from-validator="fromValidator"
              :to-validator="toValidator"
              @next="
                (actionSteps) => {
                  setSteps(actionSteps);
                }
              "
            />
          </div>
        </template>
        <template v-if="step == 'review'">
          <TransactionProcessCreator
            v-if="steps.length > 0"
            :steps="steps"
            :action="actionType"
            @pending="
              () => {
                closeModal();
                resetHandler();
              }
            "
            @close="
              () => {
                closeModal();
                resetHandler();
              }
            "
            @previous="$emit('previous')"
          />
        </template>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import RestakeValidatorAmount from '@/components/stake/RestakeValidatorAmount.vue';
import StakeForm from '@/components/stake/StakeForm';
import UnstakeForm from '@/components/stake/UnstakeForm';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useStaking from '@/composables/useStaking';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { ClaimRewardsAction } from '@/types/actions';
import { Step } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { pageview } from '@/utils/analytics';
import { keyHashfromAddress } from '@/utils/basic';

type ActionType = 'stake' | 'unstake' | 'claim' | 'switch';

export default defineComponent({
  name: 'Staking',
  components: {
    Button,
    Icon,
    StakeForm,
    TransactionProcessCreator,
    UnstakeForm,
    RestakeValidatorAmount,
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const transactionsStore = useTransactionsStore();
    const route = useRoute();
    const editing = ref(null);
    const { getValidatorsByBaseDenom, getStakingRewardsByBaseDenom, getValidatorMoniker, getChainNameByBaseDenom } =
      useStaking();
    const { balances, stakingBalances } = useAccount();
    const actionType = route.params.action as ActionType;
    const validator = route.params.validator;
    const baseDenom = route.params.denom as string;
    const validatorList = ref([]);
    const totalStakedAmount = ref<number>(0);
    const unstakeAmount = ref<string>('0');
    const selectedValidators = ref([]);
    const step = actionType == 'claim' ? ref('review') : ref('validator');
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
      if (actionType == 'claim') {
        const rewardsData = (await getStakingRewardsByBaseDenom(baseDenom)) as any;
        const chainName = await getChainNameByBaseDenom(baseDenom);
        const rewardsDataWithMoniker = rewardsData.rewards.map((reward) => {
          reward.moniker = getValidatorMoniker(reward.validator_address, validatorList.value);
          return reward;
        });
        const action = {
          name: 'claim',
          params: { total: rewardsData.total, rewards: rewardsDataWithMoniker, chain_name: chainName },
        } as ClaimRewardsAction;

        steps.value = await actionHandler(action);
        console.log(steps);
      }
    });
    pageview({ page_title: 'Send: ' + route.params.type, page_path: '/send/' + route.params.type });
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
      return !!actionType;
    });
    const isBackDisabled = computed(() => {
      return step.value === 'validator' || (actionType === 'claim' && step.value === 'review');
    });
    const steps = ref<Step[]>([]);
    const allSteps = {
      stake: ['validator', 'amount', 'review', 'delegate'],
      unstake: ['validator', 'amount', 'review', 'undelegate'],
      switch: ['validator', 'amount', 'review', 'redelegate'],
      claim: ['review', 'claim'],
    };

    const resetHandler = () => {
      if (actionType == 'claim') {
        step.value = 'review';
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
      let title = t('components.send.send');
      /*
      if (actionType) {
        title = actionType === 'address' ? t('components.send.sendToAddress') : t('components.send.moveAssets');
      }
      */

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
      console.log(steps);
    };
    const onClose = () => {
      transactionsStore.removeTransaction(transactionsStore.currentId);
      router.push('/');
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

<style lang="scss" scoped>
.send__type:hover {
  transform: translateY(-2px);

  .send__type__circle {
    transform: scale(8);
    transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }
}
</style>
