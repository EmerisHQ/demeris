<template>
  <div
    class="max-w-lg flex flex-col items-center justify-center h-full w-full"
    :class="isSwapComponent ? 'space-y-2 pb-8' : 'space-y-3 pb-16'"
  >
    <h1 class="font-bold" :class="isSwapComponent ? 'text-2' : 'text-3'">{{ titleMap[transaction.name] }}</h1>

    <p class="text-muted">{{ subtitle }}</p>

    <div class="w-full max-w-lg flex items-center justify-center -space-x-8">
      <template v-if="transaction.name == 'swap'">
        <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data.from.denom)" />
        <EphemerisSpinner class="-my-6 flex-grow max-w-xs" />
        <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data.to.denom)" />
      </template>

      <template v-if="transaction.name == 'addliquidity' || transaction.name == 'createpool'">
        <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data.coinA.denom)" />
        <EphemerisSpinner class="-my-6 flex-grow max-w-xs" />
        <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data.coinB.denom)" />
      </template>

      <template v-if="transaction.name == 'withdrawliquidity'">
        <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data.pool.reserve_coin_denoms[0])" />
        <EphemerisSpinner class="flex-grow max-w-xs" />
        <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data.pool.reserve_coin_denoms[1])" />
      </template>

      <template v-if="transaction.name == 'ibc_forward' || transaction.name == 'ibc_backward'">
        <CircleSymbol size="lg" variant="chain" :chain-name="transaction.data.from_chain" />
        <EphemerisSpinner class="-my-6 flex-grow max-w-xs" />
        <div class="animate-lr absolute left-1/2 -ml-5 transition transform">
          <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data.amount.denom)" />
        </div>
        <CircleSymbol size="lg" variant="chain" :chain-name="transaction.data.to_chain" />
      </template>

      <template v-if="transaction.name == 'transfer'">
        <EphemerisSpinner class="-my-6 flex-grow max-w-xs" />
        <div class="animate-lr absolute left-1/2 -ml-5 transition transform">
          <CircleSymbol
            size="lg"
            :denom="getBaseDenomSync(transaction.data.amount.denom)"
            :chain-name="transaction.data.chain_name"
          />
        </div>
      </template>
    </div>

    <div class="text-center">
      <template v-if="transaction.name === 'transfer' || transaction.name.startsWith('ibc')">
        <p class="font-medium text-1">
          <AmountDisplay
            :amount="{
              amount: transaction.data.amount.amount,
              denom: getBaseDenomSync(transaction.data.amount.denom),
            }"
          />
        </p>

        <template v-if="transaction.name.startsWith('ibc')">
          <div class="mt-0.5 text-muted">
            <ChainName :name="transaction.data.from_chain" /> &rarr;
            <ChainName :name="transaction.data.to_chain" />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import EphemerisSpinner from '@/components/ui/EphemerisSpinner.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { getCurrentTransaction, ProvideViewerKey } from '../../transactionProcessSelectors';

const { t } = useI18n({ useScope: 'global' });
const { actor, isSwapComponent } = inject(ProvideViewerKey);
const { state } = actor;

const transaction = computed(() => getCurrentTransaction(state.value.context));
const titleMap = {
  transfer: t('components.txHandlingModal.transferAction'),
  ibc_forward: t('components.txHandlingModal.transferAction'),
  ibc_backward: t('components.txHandlingModal.transferAction'),
  swap: t('components.txHandlingModal.pleaseWait'),
  addliquidity: t('components.txHandlingModal.addLiqAction'),
  withdrawliquidity: t('components.txHandlingModal.withdrawing'),
  createpool: t('components.txHandlingModal.createPoolAction'),
};

const subtitle = computed(() => {
  if (transaction.value.name.startsWith('ibc')) {
    return t('components.txHandlingModal.ibcTransferSubtitle');
  }
  return t('components.txHandlingModal.txProgress');
});
</script>

<style scoped>
.animate-lr {
  animation: animate-lr 2s infinite cubic-bezier(0.33, 1, 0.68, 1);
}

@keyframes animate-lr {
  0% {
    transform: translateX(-300%) rotate(0deg);
    opacity: 0;
  }
  40%,
  70% {
    opacity: 1;
  }
  100% {
    transform: translateX(350%) rotate(360deg);
    opacity: 0;
  }
}
</style>
