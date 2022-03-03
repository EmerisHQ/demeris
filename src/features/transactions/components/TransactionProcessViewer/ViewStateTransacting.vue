<template>
  <div
    class="max-w-lg flex-1 flex flex-col items-center justify-center h-full w-full"
    :class="isSwapComponent ? 'space-y-2 pb-8 px-8' : 'space-y-3 pb-16'"
  >
    <div
      class="flex-1 flex flex-col items-center justify-center w-full"
      :class="isSwapComponent ? 'space-y-2' : 'space-y-3'"
    >
      <h1 class="font-bold" :class="isSwapComponent ? 'text-2' : 'text-3'">{{ titleMap[transaction.name] }}</h1>

      <p class="text-muted">{{ subtitle }}</p>

      <div :class="['w-full max-w-lg flex items-center justify-center', { '-space-x-8': transaction.name != 'stake' }]">
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

        <template v-if="transaction.name == 'stake'">
          <div class="absolute w-full flex items-center justify-center">
            <CircleSymbol size="lg" :denom="getBaseDenomSync(transaction.data[0]?.amount.denom)" />
          </div>
          <div class="flex items-center justify-center w-full">
            <EphemerisSpinner class="flex-grow max-w-xs" />
          </div>
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
        <template v-if="transaction.name === 'stake' && transaction.data[0]?.amount?.amount">
          <p class="font-medium text-1">
            <AmountDisplay
              :amount="{
                amount: transaction.data[0].amount.amount,
                denom: getBaseDenomSync(transaction.data[0].amount.denom),
              }"
            />
          </p>
        </template>
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

        <template v-if="transaction.name === 'swap'">
          <p class="font-medium">
            <Ticker :name="transaction.data.from.denom" /> &rarr;
            <Ticker :name="transaction.data.to.denom" />
          </p>
        </template>

        <template v-if="transaction.name === 'addliquidity'">
          <div>
            <p class="font-medium">
              <AmountDisplay :amount="transaction.data.coinA" /> ·
              <AmountDisplay :amount="transaction.data.coinB" />
            </p>
            <p class="text-muted mt-1">
              <Ticker :name="getDepositDenoms()[0]" /> · <Ticker :name="getDepositDenoms()[1]" /> Pool
            </p>
          </div>
        </template>
      </div>
    </div>

    <div class="text-center">
      <Button v-if="isSwapComponent" variant="secondary" class="w-full mt-8" @click="minimizeModal">
        <span>
          {{ $t('context.transactions.controls.swapAnotherAsset') }}
        </span>
      </Button>
      <Button v-else variant="primary" class="w-full mt-8" @click="minimizeModal">
        <span>{{ $t('context.transactions.controls.backToEmeris') }}</span>
      </Button>
      <p v-if="transaction.name === 'swap'" class="text-muted -text-1 px-4 mt-3">
        {{ $t('context.transactions.transacting.notifiedWhenCompleteSwap') }}
      </p>
      <p v-else class="text-muted -text-1 px-4 mt-3">
        {{ $t('context.transactions.transacting.notifiedWhenComplete') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import EphemerisSpinner from '@/components/ui/EphemerisSpinner.vue';
import { AddLiquidityData } from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { getCurrentTransaction, ProvideViewerKey } from '../../transactionProcessHelpers';

const { t } = useI18n({ useScope: 'global' });
const { actor, isSwapComponent, minimizeModal } = inject(ProvideViewerKey);
const { state } = actor;

const transaction = computed(() => getCurrentTransaction(state.value.context));
const titleMap = {
  transfer: t('components.txHandlingModal.transferAction'),
  ibc_forward: t('components.txHandlingModal.transferAction'),
  ibc_backward: t('components.txHandlingModal.transferAction'),
  swap: t('components.txHandlingModal.swapAction'),
  addliquidity: t('components.txHandlingModal.addLiqAction'),
  withdrawliquidity: t('components.txHandlingModal.withdrawing'),
  createpool: t('components.txHandlingModal.createPoolAction'),
  stake: t('components.txHandlingModal.stakeAction'),
  multistake: t('components.txHandlingModal.stakeAction'),
  unstake: t('components.txHandlingModal.unstakeAction'),
  switch: t('components.txHandlingModal.switchAction'),
  claim: t('components.txHandlingModal.claimAction'),
};

const getDepositDenoms = () => {
  return (transaction.value.data as AddLiquidityData).pool.reserve_coin_denoms.map(getBaseDenomSync).sort();
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
