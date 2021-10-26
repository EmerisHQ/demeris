<template>
  <div class="send relative flex w-full min-h-screen justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <header class="flex items-center justify-between py-6 h-24">
        <Button v-if="isDisplayBackButton" variant="link" :full-width="false" :click-function="backToPreviousStep">
          <Icon name="ArrowLeftIcon" :icon-size="1.5" />
        </Button>

        <nav class="flex-1 flex items-center justify-center space-x-12">
          <span
            v-for="label of stakeSteps"
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
        <!-- Validator -->
        <template v-if="currentStepIndex === 0">
          <ValidatorTable :pools="pools" />
        </template>

        <!-- Amount -->
        <template v-if="currentStepIndex === 1">
          1
          <div class="max-w-3xl">
            <h1 class="text-3 font-bold py-8 text-center">{{ $t('pages.send.where') }}</h1>
            <div class="mt-8 pb-8 flex space-x-8"></div>
          </div>
        </template>

        <!-- Review -->
        <template v-if="currentStepIndex === 2">
          2
          <div class="max-w-3xl">
            <h1 class="text-3 font-bold py-8 text-center">{{ $t('pages.send.where') }}</h1>
            <div class="mt-8 pb-8 flex space-x-8"></div>
          </div>
        </template>

        <!-- Stake -->
        <template v-if="currentStepIndex === 3">
          3
          <div class="max-w-3xl">
            <h1 class="text-3 font-bold py-8 text-center">{{ $t('pages.send.where') }}</h1>
            <div class="mt-8 pb-8 flex space-x-8"></div>
          </div>
        </template>
        <button
          @click="
            () => {
              currentStep = stakeSteps[currentStepIndex + 1];
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
type stakeStepsType = 'Validator' | 'Amount' | 'Review' | 'Stake';

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';

import ValidatorTable from '@/components/stake/ValidatorTable.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import { pageview } from '@/utils/analytics';

export default {
  name: 'Stake',
  components: { Button, Icon, ValidatorTable },

  setup() {
    //test
    const { pools } = usePools();

    /* hooks */
    const { t } = useI18n({ useScope: 'global' });
    const { balances } = useAccount();
    const router = useRouter();
    const route = useRoute();

    /* meta & GA */
    pageview({ page_title: 'Stake: ' + route.params.denom, page_path: '/stake/' + route.params.denom });
    useMeta(
      computed(() => ({
        title: t('context.stake.title'),
      })),
    );

    /* variables */
    const stakeSteps: stakeStepsType[] = ['Validator', 'Amount', 'Review', 'Stake'];
    const currentStep = ref<stakeStepsType>(stakeSteps[0]);

    /* computeds */
    const isDisplayBackButton = computed(() => {
      return currentStep.value !== stakeSteps[0];
    });
    const transferType = computed(() => 'address');
    const currentStepIndex = computed(() => stakeSteps?.indexOf(currentStep.value));

    /* functions */
    const backToPreviousStep = () => {
      currentStep.value = stakeSteps[currentStepIndex.value - 1];
    };
    const backToAssetPage = () => {
      router.push(`/asset/${route.params.denom}`);
    };

    return {
      balances,
      transferType,
      currentStep,
      stakeSteps,
      isDisplayBackButton,
      currentStepIndex,
      backToPreviousStep,
      backToAssetPage,
      pools,
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
