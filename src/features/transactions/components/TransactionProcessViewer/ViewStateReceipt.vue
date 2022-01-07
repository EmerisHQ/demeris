<template>
  <div
    class="max-w-lg flex flex-col items-center w-full"
    :class="isSwapComponent ? 'space-y-4 pb-6' : 'space-y-6 pb-16'"
  >
    <Icon
      v-if="isSwapComponent && state.matches('success')"
      name="SuccessIcon"
      class="text-positive mx-auto"
      :icon-size="2.5"
    />
    <div
      v-else
      class="transferred-image block bg-no-repeat bg-center bg-contain"
      :class="isSwapComponent ? 'w-32 h-32' : 'w-44 h-44'"
    />

    <h1 class="font-bold" :class="isSwapComponent ? 'text-2 px-6' : 'text-3'">
      {{ title }}
    </h1>

    <div class="flex flex-col items-center justify-center">
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
        <template v-if="isSwapComponent">
          <i18n-t
            v-if="getSwapPercent() < 100"
            tag="p"
            class="text-center px-4"
            keypath="components.txHandlingModal.notSwapped"
          >
            <template #amount>
              <span class="font-bold">
                <AmountDisplay
                  :amount="{
                    denom: lastResult.endBlock?.offer_coin_denom,
                    amount: String(lastResult.endBlock?.remaining_offer_coin_amount),
                  }"
                />
              </span>
            </template>
            <template #chainName>
              <ChainName :name="'cosmos-hub'" />
            </template>
          </i18n-t>

          <i18n-t v-else tag="p" class="text-center px-4" keypath="components.txHandlingModal.received">
            <template #amount>
              <span class="font-bold">
                <AmountDisplay
                  :amount="{
                    denom: lastResult.endBlock?.demand_coin_denom,
                    amount: String(
                      lastResult.endBlock?.exchanged_demand_coin_amount > 0
                        ? lastResult.endBlock?.exchanged_demand_coin_amount
                        : 0,
                    ),
                  }"
                />
              </span>
            </template>
            <template #chainName>
              <ChainName :name="'cosmos-hub'" />
            </template>
          </i18n-t>
        </template>

        <template v-else>
          <div class="text-1 font-bold">
            <AmountDisplay
              :amount="{
                amount: lastResult.endBlock?.exchanged_offer_coin_amount,
                denom: lastResult.endBlock?.offer_coin_denom,
              }"
            />
            &rarr;
            <AmountDisplay
              :amount="{
                amount: lastResult.endBlock?.exchanged_demand_coin_amount,
                denom: lastResult.endBlock?.demand_coin_denom,
              }"
            />
          </div>
          <p class="text-muted">{{ $t('context.transactions.receipt.swappedOnHub') }}</p>
        </template>
      </template>

      <template v-if="transaction.name === 'addliquidity'">
        <div class="text-center">
          <p class="font-medium text-1"><CurrencyDisplay :value="getDepositTotal()" /></p>
          <span class="text-muted">supplied</span>
        </div>
      </template>

      <template v-if="transaction.name === 'withdrawliquidity'">
        <div class="text-center">
          <p class="font-medium text-1"><CurrencyDisplay :value="getWithdrawTotal()" /></p>
          <span class="text-muted">withdrawn</span>
        </div>
      </template>
    </div>

    <template v-if="state.matches('success') && !isSwapComponent">
      <Collapse
        :label-open="$t('generic_cta.showDetails')"
        :label-hide="$t('generic_cta.hideDetails')"
        class="items-center pt-5 w-full"
      >
        <div
          class="rounded-lg w-full px-6 flex flex-col"
          :class="{ 'border border-border py-4': !isSwapComponent, 'py-1': isSwapComponent }"
        >
          <component
            :is="previewComponentMap[transaction.name]"
            :response="lastResult.endBlock || state.context.formattedSteps[lastResult.stepIndex]"
            :step="state.context.formattedSteps[lastResult.stepIndex]"
            :context="isSwapComponent ? 'widget' : 'default'"
            :class="{ '-text-1': isSwapComponent }"
            :bordered="isSwapComponent"
            :fees="state.context.fees.totals[lastResult.stepIndex]"
            class="border-b"
          />

          <template v-if="getExplorerTx(lastResult)">
            <a
              :href="getExplorerTx(lastResult)"
              rel="noopener noreferrer"
              target="_blank"
              class="self-center mt-8 mb-4 p-2 font-medium"
            >
              {{ $t('context.transaction.viewOnExplorer') }} ↗️
            </a>
          </template>
        </div>
      </Collapse>
    </template>

    <template v-if="isSwapComponent && getExplorerTx(lastResult)">
      <a
        :href="getExplorerTx(lastResult)"
        rel="noopener noreferrer"
        target="_blank"
        class="self-center mt-8 mb-4 p-2 font-medium"
      >
        {{ $t('context.transaction.viewOnExplorer') }} ↗️
      </a>
    </template>

    <div class="pt-4 flex flex-col space-y-5 w-full" :class="isSwapComponent ? 'px-8' : 'px-16'">
      <Button v-if="state.matches('receipt')" @click="onNext">{{ $t('context.transactions.controls.next') }}</Button>

      <template v-if="state.matches('success')">
        <template v-if="transaction.name === 'transfer' || transaction.name.startsWith('ibc')">
          <Button variant="link" @click="onNext">
            {{ $t('context.transactions.controls.sendAnotherAsset') }} &rarr;
          </Button>
        </template>

        <template v-if="transaction.name === 'swap'">
          <Button variant="secondary" @click="goToSend">
            <i18n-t keypath="context.transactions.controls.sendAmount">
              <template #amount>
                <AmountDisplay
                  :amount="{
                    amount: lastResult.endBlock?.exchanged_demand_coin_amount,
                    denom: lastResult.endBlock?.demand_coin_denom,
                  }"
                />
                &rarr;
              </template>
            </i18n-t>
          </Button>
        </template>

        <Button @click="removeTransactionAndClose">{{ $t('context.transactions.controls.done') }}</Button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BigNumber from 'bignumber.js';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import Icon from '@/components/ui/Icon.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';
import { store as globalStore } from '@/store';
import { AddLiquidityEndBlockResponse, WithdrawLiquidityEndBlockResponse } from '@/types/api';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

import { getExplorerTx, getSwappedPercent, ProvideViewerKey } from '../../transactionProcessHelpers';

const { actor, isSwapComponent, removeTransactionAndClose } = inject(ProvideViewerKey);

const { state, send } = actor;
const { t } = useI18n({ useScope: 'global' });
const router = useRouter();
const lastResult = computed(() => Object.values(state.value.context.results).slice(-1)[0]);
const transaction = computed(() => lastResult.value.transaction);

const titleMap = {
  ibc_backward: t('components.txHandlingModal.transferred'),
  ibc_forward: t('components.txHandlingModal.transferred'),
  transfer: t('components.txHandlingModal.transferred'),
  swap: t('components.txHandlingModal.swapActionComplete'),
  addliquidity: t('components.txHandlingModal.addLiqActionComplete'),
  withdrawliquidity: t('components.txHandlingModal.withdrawLiqActionComplete'),
  createpool: t('components.txHandlingModal.createPoolActionComplete'),
};

const previewComponentMap = {
  ibc_backward: PreviewTransfer,
  ibc_forward: PreviewTransfer,
  transfer: PreviewTransfer,
  swap: PreviewSwap,
  addliquidity: PreviewAddLiquidity,
  withdrawliquidity: PreviewWithdrawLiquidity,
  createpool: PreviewAddLiquidity,
};

const title = computed(() => {
  if (transaction.value.name === 'swap') {
    const swappedPercent = getSwapPercent();
    if (swappedPercent < 100) {
      return t('components.txHandlingModal.swapActionPartiallyComplete');
    }
  }

  return titleMap[transaction.value.name];
});

const onNext = () => {
  send('CONTINUE');
};

const goToSend = () => {
  const amount = lastResult.value.endBlock?.exchanged_demand_coin_amount;
  const denom = lastResult.value.endBlock?.demand_coin_denom;
  router.push(`/send/move?base_denom=${denom}&amount=${amount}`);
};

const getDepositTotal = () => {
  const endBlock = lastResult.value.endBlock as AddLiquidityEndBlockResponse;
  const amounts = parseCoins(endBlock.accepted_coins);

  let total = new BigNumber(0);
  for (const item of amounts) {
    const baseDenom = getBaseDenomSync(item.denom);
    const price = globalStore.getters['demeris/getPrice']({ denom: baseDenom });
    const precision = globalStore.getters['demeris/getDenomPrecision']({ name: baseDenom }) ?? 6;
    total = total.plus(new BigNumber(price).multipliedBy(item.amount).shiftedBy(-precision));
  }
  return total.toNumber();
};

const getWithdrawTotal = () => {
  const endBlock = lastResult.value.endBlock as WithdrawLiquidityEndBlockResponse;
  const amounts = parseCoins(endBlock.withdraw_coins);

  let total = new BigNumber(0);
  for (const item of amounts) {
    const baseDenom = getBaseDenomSync(item.denom);
    const price = globalStore.getters['demeris/getPrice']({ denom: baseDenom });
    const precision = globalStore.getters['demeris/getDenomPrecision']({ name: baseDenom }) ?? 6;
    total = total.plus(new BigNumber(price).multipliedBy(item.amount).shiftedBy(-precision));
  }
  return total.toNumber();
};

const getSwapPercent = () => getSwappedPercent(lastResult.value.endBlock);
</script>

<style scoped>
.transferred-image {
  background-image: url('~@/assets/images/silver-surfer-1-light.png');
}

@media (prefers-color-scheme: dark) {
  .transferred-image {
    background-image: url('~@/assets/images/silver-surfer-1-dark.png');
  }
}
</style>
