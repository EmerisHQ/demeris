<template>
  <div class="flex flex-col items-center text-center space-y-8">
    <div class="flex flex-col items-center" :class="{ 'flex-col-reverse': isSwapComponent }">
      <h1
        class="font-bold pt-8 whitespace-pre-line"
        :class="{
          'text-3': !isSwapComponent,
          'text-2 px-3 pt-28': isSwapComponent,
        }"
      >
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-1 text-muted mt-3">{{ subtitle }}</p>

      <img
        :src="imageBanner"
        name="Transfer"
        class=""
        :class="{ '-mb-10 max-w-sm': !isSwapComponent, 'absolute z-0 rounded-t-2xl top-0': isSwapComponent }"
      />
    </div>

    <p class="text-muted leading-copy max-w-md mx-auto" :class="{ 'px-6': isSwapComponent }">
      {{ description }}
    </p>

    <a
      v-if="action !== 'addliquidity'"
      href="https://blog.cosmos.network/deep-dive-how-will-ibc-create-value-for-the-cosmos-hub-eedefb83c7a0"
      target="_blank"
      class="font-medium hover:underline"
    >
      {{ $t('generic_cta.learnMore') }} &#x2197;
    </a>

    <div class="w-full max-w-sm mx-auto" :class="{ 'px-6': isSwapComponent }">
      <Button :name="$t('generic_cta.continue')" class="mb-8" :click-function="emitContinue" />
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import {
  AbstractIBCTransferTransactionData,
  AbstractTransferTransactionData,
} from '@emeris/types/lib/EmerisTransactions';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import TransferImage from '@/assets/images/transfer-interstitial.png';
import TransferSwapImage from '@/assets/images/transfer-interstitial-swap.png';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes } from '@/store';
import { RootStoreTyped } from '@/store';
import { Step, UserAction } from '@/types/actions';
import { getBaseDenom, getBaseDenomSync, getDisplayName } from '@/utils/actionHandler';

interface Props {
  isSwapComponent?: boolean;
  action?: UserAction['name'];
  steps: Step[];
}

const props = withDefaults(defineProps<Props>(), {
  isSwapComponent: false,
  action: 'swap',
});

const emit = defineEmits<{
  (e: 'continue'): void;
}>();

const typedstore = useStore() as RootStoreTyped;
const { nativeBalances } = useAccount();
const { t } = useI18n({ useScope: 'global' });
const denoms = ref([]);
const chains = ref([]);

const imageBanner = computed(() => (props.isSwapComponent ? TransferSwapImage : TransferImage));

const currentAction = computed(() => {
  if (props.action === 'move') {
    return 'transfer';
  }
  return props.action;
});

const hasMultiple = computed(() => {
  if (currentAction.value === 'addliquidity') {
    return props.steps.length > 2;
  }

  return props.steps.length > 1;
});

const title = computed(() => {
  let result = '';

  switch (currentAction.value) {
    case 'transfer':
      result = t('components.transferToHub.transfer');
      break;
    case 'addliquidity':
      result = t('components.transferToHub.addLiquidity');
      break;
    case 'swap':
      result = t('components.transferToHub.swap');
      break;
    case 'stake':
    case 'multistake':
      result = t('components.transferToHub.stake', { denom: denoms.value[0], chain: chains.value[0] });
      break;
  }

  return result;
});

const subtitle = computed(() => {
  const result = '';

  if (currentAction.value === 'transfer') {
    const backwardData = props.steps[0].transactions[0].data as AbstractIBCTransferTransactionData;
    const fromChain = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({
      name: backwardData.chainName,
    });
    let toChain = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({ name: backwardData.toChain });

    if (
      props.steps[0].transactions.length > 1 &&
      (props.steps[0].transactions[1].type == 'IBCtransferBackward' ||
        props.steps[0].transactions[1].type == 'IBCtransferForward')
    ) {
      const forwardData = props.steps[0].transactions[1].data as AbstractIBCTransferTransactionData;
      toChain = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({ name: forwardData.toChain });
    }

    return t('components.transferToHub.transferSubtitle', { from: fromChain, to: toChain });
  }

  return result;
});

const description = computed(() => {
  let description = '';

  if (!denoms.value.length) {
    return description;
  }

  switch (currentAction.value) {
    case 'addliquidity':
      if (hasMultiple.value) {
        description = t('components.transferToHub.addLiquidityDescriptionMultiple', {
          denomA: denoms.value[0],
          denomB: denoms.value[1],
        });
      } else {
        description = t('components.transferToHub.addLiquidityDescription', { denom: denoms.value[0] });
      }
      break;
    case 'swap':
      description = t('components.transferToHub.swapDescription', { denom: denoms.value[0] });
      break;
    case 'stake':
    case 'multistake':
      description = t('components.transferToHub.stakeDescription', {
        denom: denoms.value[0],
        chain: chains.value[0],
      });
      break;
    case 'transfer':
      if (
        props.steps[0].transactions.length > 1 &&
        (props.steps[0].transactions[1].type == 'IBCtransferBackward' ||
          props.steps[0].transactions[1].type == 'IBCtransferForward')
      ) {
        const backwardData = props.steps[0].transactions[0].data as AbstractIBCTransferTransactionData;
        const forwardData = props.steps[0].transactions[1].data as AbstractIBCTransferTransactionData;

        const fromChain = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({
          name: backwardData.chainName,
        });
        const toChain = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({
          name: forwardData.toChain,
        });
        const asset = nativeBalances.value.find(
          (item) => item.base_denom === getBaseDenomSync(backwardData.amount.denom),
        );
        const nativeChain = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({
          name: asset.on_chain,
        });

        const translateKeyPath =
          props.steps[0].transactions.length > 2 ? 'transferDescriptionMultipleMemo' : 'transferDescriptionMultiple';

        description = t(`components.transferToHub.${translateKeyPath}`, {
          denom: denoms.value[0],
          fromChain,
          toChain,
          nativeChain,
        });
      } else {
        description = t('components.transferToHub.transferDescription');
      }
      break;
  }

  return description;
});

const emitContinue = () => {
  emit('continue');
};

watch(
  props.steps,
  async () => {
    let stepDenoms = [];
    const dexChain = typedstore.getters[GlobalGetterTypes.API.getDexChain];

    stepDenoms = props.steps
      .map((step) => {
        const transaction = step.transactions[0];
        if (!(transaction.type == 'IBCtransferBackward' || transaction.type == 'IBCtransferForward')) {
          return;
        }
        const chain = (transaction.data as AbstractIBCTransferTransactionData).chainName || dexChain;
        const tochain = (transaction.data as AbstractIBCTransferTransactionData).toChain || dexChain;

        const denom = (transaction.data as AbstractTransferTransactionData).amount.denom;
        return { chain, denom, tochain };
      })
      .filter(Boolean);

    (chains.value = stepDenoms.map((item) => {
      const displayChain = typedstore.getters[GlobalGetterTypes.API.getDisplayChain]({
        name: item.tochain,
      });
      return displayChain;
    })),
      (denoms.value = await Promise.all(
        stepDenoms.map(async (item) => {
          const denom = await getBaseDenom(item.denom, item.chain);
          const displayDenom = await getDisplayName(denom, item.chain);
          return displayDenom;
        }),
      ));
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
