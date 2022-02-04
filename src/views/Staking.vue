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
        <template v-if="step == 'validator'">
          <div class="max-w-7xl">
            <ValidatorsTable
              :validator-list="validatorList"
              :disabled-list="disabledValidators"
              :total-staked-amount="totalStakedAmount"
              table-style="list"
              @selectValidator="addValidator"
            />
          </div>
        </template>
        <template v-if="step == 'amount'">
          <div class="max-w-3xl">
            <ValidatorAmountForm
              :validators="selectedValidators"
              @previous="
                (e) => {
                  selectAnother(e);
                }
              "
            />
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import ValidatorAmountForm from '@/components/stake/ValidatorAmountForm.vue';
import ValidatorsTable from '@/components/stake/ValidatorsTable.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useStaking from '@/composables/useStaking';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { pageview } from '@/utils/analytics';
import { keyHashfromAddress } from '@/utils/basic';

type ActionType = 'stake' | 'unstake' | 'claim' | 'switch';

export default {
  name: 'Staking',
  components: { Button, Icon, ValidatorsTable, ValidatorAmountForm },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const router = useRouter();
    const transactionsStore = useTransactionsStore();
    const route = useRoute();
    const editing = ref(null);
    const { getValidatorsByBaseDenom, getStakingRewardsByBaseDenom, getChainNameByBaseDenom, getValidatorMoniker } =
      useStaking();
    const { balances, stakingBalances } = useAccount();
    const actionType = route.params.action as ActionType;
    const validator = route.params.validator;
    const baseDenom = route.params.denom as string;
    const validatorList = ref<Array<unknown>>([]);
    const totalStakedAmount = ref<number>(0);
    const selectedValidators = ref([]);
    onMounted(async () => {
      validatorList.value = await getValidatorsByBaseDenom(baseDenom);
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
    const step = validator || actionType === 'claim' ? ref('amount') : ref('validator');
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
      return step.value === 'validator' || (actionType === 'claim' && step.value === 'amount');
    });
    const allSteps = {
      stake: ['validator', 'amount', 'review', 'delegate'],
      unstake: ['validator', 'amount', 'review', 'undelegate'],
      switch: ['validator', 'amount', 'review', 'redelegate'],
      claim: ['amount', 'review', 'claim'],
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

    const onClose = () => {
      transactionsStore.setTransactionAsPending();
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
    };
  },
};
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
