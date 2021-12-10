<template>
  <div class="send relative flex w-full min-h-screen justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <header class="flex items-center justify-between py-6 h-24">
        <Button v-if="isDisplayBackButton" variant="link" :full-width="false" :click-function="backToPreviousStep">
          <Icon name="ArrowLeftIcon" :icon-size="1.5" />
        </Button>

        <nav class="flex-1 flex items-center justify-center space-x-12">
          <span
            v-for="label of actionSteps"
            :key="label"
            class="capitalize font-medium cursor-default"
            :class="currentStep === label ? 'text-text' : 'text-inactive'"
          >
            {{ label }}
          </span>
        </nav>

        <Button class="ml-auto" variant="link" :full-width="false" :click-function="backToAssetPage">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </header>

      <main class="pt-8 pb-28 flex-1 flex flex-col items-center">
        <!-- Claim -->
        <template v-if="currentStep === StakingActionSteps.CLAIM">
          <div class="max-w-3xl">
            <TxStepsModal
              :action-name="'claim'"
              :data="stepsData"
              @transacting="() => {}"
              @failed="() => {}"
              @reset="() => {}"
            />
          </div>
        </template>

        <!-- Validator -->
        <template v-if="currentStep === StakingActionSteps.VALIDATOR">
          <ValidatorsTable
            :validator-list="validatorList"
            :total-staked-amount="totalStakedAmount"
            @selectValidator="addValidator"
          />
        </template>

        <!-- Amount -->
        <template v-if="currentStep === StakingActionSteps.AMOUNT">
          <h1 class="text-3 font-bold py-8 text-center">{{ $t('context.stake.enterAmount') }}</h1>
          <ValidatorAmountForm :validators="selectedValidators" />
        </template>

        <!-- Review -->
        <template v-if="currentStep === StakingActionSteps.REVIEW">
          2
          <div class="max-w-3xl">
            <h1 class="text-3 font-bold py-8 text-center">{{ $t('pages.send.where') }}</h1>
            <div class="mt-8 pb-8 flex space-x-8"></div>
          </div>
        </template>

        <!-- Stake -->
        <template v-if="currentStep === StakingActionSteps.STAKE">
          3
          <div class="max-w-3xl">
            <h1 class="text-3 font-bold py-8 text-center">{{ $t('pages.send.where') }}</h1>
            <div class="mt-8 pb-8 flex space-x-8"></div>
          </div>
        </template>
        <button
          @click="
            () => {
              currentStep = actionSteps[currentStepIndex + 1];
            }
          "
        >
          GO NEXT
        </button>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import TxStepsModal from '@/components/common/TxStepsModal.vue';
import ValidatorAmountForm from '@/components/stake/ValidatorAmountForm.vue';
import ValidatorsTable from '@/components/stake/ValidatorsTable.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import useStaking from '@/composables/useStaking';
import { StakingActions, StakingActionSteps } from '@/types/actions';
import { ClaimRewardsAction } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { pageview } from '@/utils/analytics';
import { keyHashfromAddress } from '@/utils/basic';
export default {
  name: 'Stake',
  components: { Button, Icon, ValidatorsTable, ValidatorAmountForm, TxStepsModal },

  setup() {
    /* hooks */
    const { t } = useI18n({ useScope: 'global' });
    const { stakingBalances } = useAccount();
    const { balances } = useAccount();
    const router = useRouter();
    const route = useRoute();
    const { getValidatorsByBaseDenom, getStakingRewardsByBaseDenom, getChainNameByBaseDenom, getValidatorMoniker } =
      useStaking();

    /* meta & GA */
    pageview({ page_title: 'Stake: ' + route.params.denom, page_path: '/stake/' + route.params.denom });
    useMeta({ title: t('context.stake.title') });

    /* variables */
    const actionSteps = ref<StakingActionSteps[]>([]);
    const currentStep = ref<StakingActionSteps>(actionSteps.value[0]);
    const baseDenom = router.currentRoute.value.params.denom as string;
    const validatorList = ref<Array<unknown>>([]);
    const totalStakedAmount = ref<number>(0);
    const selectedValidators = ref([]);
    const stepsData = ref([]);

    /* created */
    (async () => {
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

      // Set steps, initial step, data for the step
      const action = route.query.action as StakingActions;
      if (action === StakingActions.STAKE) {
        const validatorAddressFromQuery = route.query.validator_address;
        actionSteps.value = [
          StakingActionSteps.VALIDATOR,
          StakingActionSteps.AMOUNT,
          StakingActionSteps.REVIEW,
          StakingActionSteps.STAKE,
        ];
        currentStep.value = actionSteps.value[0];
        if (validatorAddressFromQuery) {
          const validatorFromQuery = validatorList.value.find((vali: any) => {
            return keyHashfromAddress(vali.operator_address) === validatorAddressFromQuery;
          });
          addValidator(validatorFromQuery);
        }
      } else if (action === StakingActions.UNSTAKE) {
        actionSteps.value = [StakingActionSteps.AMOUNT, StakingActionSteps.AMOUNT, StakingActionSteps.UNSTAKE];
        currentStep.value = actionSteps.value[0];
      } else if (action === StakingActions.SWITCH) {
        actionSteps.value = [
          StakingActionSteps.VALIDATOR,
          StakingActionSteps.AMOUNT,
          StakingActionSteps.REVIEW,
          StakingActionSteps.RESTAKE,
        ];
        currentStep.value = actionSteps.value[0];
      } else if (action === StakingActions.CLAIM) {
        actionSteps.value = [];
        currentStep.value = StakingActionSteps.CLAIM;
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
        stepsData.value = await actionHandler(action);
      }

      console.log('valilist f', validatorList.value);
      console.log('stakingBalance f', stakingBalances.value);
    })();

    /* computeds */
    const isDisplayBackButton = computed(() => {
      return currentStep.value !== actionSteps.value[0] && currentStep.value !== StakingActionSteps.CLAIM;
    });
    const transferType = computed(() => 'address');
    const currentStepIndex = computed(() => actionSteps.value?.indexOf(currentStep.value));

    /* functions */
    const backToPreviousStep = () => {
      currentStep.value = actionSteps.value[currentStepIndex.value - 1];
    };
    const backToAssetPage = () => {
      router.push(`/asset/${route.params.denom}`);
    };
    const addValidator = (vali) => {
      const isIncluded = selectedValidators.value.find((selectedVali) => {
        return selectedVali.operator_address === vali.operator_address;
      });
      if (!isIncluded) {
        selectedValidators.value.push(vali);
      }
      currentStep.value = StakingActionSteps.AMOUNT;
      console.log('selectedValidators', selectedValidators.value);
    };

    return {
      StakingActionSteps,
      balances,
      validatorList,
      selectedValidators,
      totalStakedAmount,
      transferType,
      currentStep,
      actionSteps,
      isDisplayBackButton,
      currentStepIndex,
      stepsData,
      backToPreviousStep,
      backToAssetPage,
      addValidator,
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
