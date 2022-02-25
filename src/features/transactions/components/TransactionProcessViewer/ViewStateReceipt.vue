<template>
  <div
    class="max-w-lg flex-1 flex flex-col items-center justify-between w-full"
    :class="isSwapComponent ? 'space-y-4 pb-6' : 'space-y-6 pb-16'"
  >
    <div
      class="flex-1 flex flex-col items-center justify-center w-full"
      :class="isSwapComponent ? 'space-y-4' : 'space-y-6'"
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
        :class="isSwapComponent ? 'w-28 h-28' : 'w-36 h-36'"
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
        <template v-if="transaction.name === 'stake'">
          <p class="font-medium text-1">
            <AmountDisplay
              :amount="{
                amount: stakedAmount,
                denom: getBaseDenomSync(transaction.data[0].amount.denom),
              }"
            />
          </p>
        </template>
        <template v-if="transaction.name === 'switch'">
          <p class="font-medium text-1">
            <AmountDisplay
              :amount="{
                amount: stakedAmount,
                denom: getBaseDenomSync(transaction.data.amount.denom),
              }"
            />
          </p>
        </template>
        <template v-if="transaction.name === 'unstake'">
          <p class="font-medium text-1">
            <AmountDisplay
              :amount="{
                amount: stakedAmount,
                denom: getBaseDenomSync(transaction.data.amount.denom),
              }"
            />
          </p>
        </template>
        <template v-if="transaction.name === 'claim'">
          <p class="font-medium text-1">
            <AmountDisplay
              :amount="{
                amount: stakedAmount,
                denom: getBaseDenomSync(parseCoins(transaction.data.total)[0].denom),
              }"
            />
          </p>
        </template>
        <template v-if="transaction.name === 'swap'">
          <template v-if="isSwapComponent">
            <i18n-t
              v-if="getSwapPercent() < 100"
              scope="global"
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

            <i18n-t
              v-else
              scope="global"
              tag="p"
              class="text-center px-4"
              keypath="components.txHandlingModal.received"
            >
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
              :is-receipt="true"
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
    </div>

    <div class="pt-4 flex flex-col space-y-5 w-full" :class="isSwapComponent ? 'px-8' : 'px-16'">
      <Button v-if="state.matches('receipt')" @click="onNext">{{ $t('context.transactions.controls.next') }}</Button>

      <template v-if="state.matches('success')">
        <template v-if="transaction.name === 'transfer' || transaction.name.startsWith('ibc')">
          <Button variant="secondary" @click="goToMove">
            {{ $t('context.transactions.controls.sendAnotherAsset') }} &rarr;
          </Button>
        </template>

        <template v-if="transaction.name === 'swap'">
          <Button variant="secondary" @click="goToSend">
            <i18n-t scope="global" keypath="context.transactions.controls.sendAmount">
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
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Collapse from '@/components/ui/Collapse.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import Icon from '@/components/ui/Icon.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewClaim from '@/components/wizard/previews/PreviewClaim.vue';
import PreviewStake from '@/components/wizard/previews/PreviewStake.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewSwitch from '@/components/wizard/previews/PreviewSwitch.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewUnstake from '@/components/wizard/previews/PreviewUnstake.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { ClaimData, RestakeData, StakeData, UnstakeData } from '@/types/actions';
import { AddLiquidityEndBlockResponse, WithdrawLiquidityEndBlockResponse } from '@/types/api';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

import { getExplorerTx, getSwappedPercent, ProvideViewerKey } from '../../transactionProcessHelpers';

const { actor, isSwapComponent, removeTransactionAndClose } = inject(ProvideViewerKey);

const { state, send } = actor;
const globalStore = useStore();
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
  claim: t('components.txHandlingModal.claimActionComplete'),
  switch: t('components.txHandlingModal.switchActionComplete'),
  stake: t('components.txHandlingModal.stakeActionComplete'),
  multistake: t('components.txHandlingModal.stakeActionComplete'),
  unstake: t('components.txHandlingModal.unstakeActionComplete'),
};

const previewComponentMap = {
  ibc_backward: PreviewTransfer,
  ibc_forward: PreviewTransfer,
  transfer: PreviewTransfer,
  swap: PreviewSwap,
  stake: PreviewStake,
  multistake: PreviewStake,
  unstake: PreviewUnstake,
  claim: PreviewClaim,
  switch: PreviewSwitch,
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
const stakedAmount = ref('0');
if (transaction.value.name == 'stake') {
  stakedAmount.value = (transaction.value.data as StakeData[])
    .reduce((acc, tx) => {
      return acc.plus(new BigNumber(tx.amount.amount));
    }, new BigNumber(0))
    .toString();
}
if (transaction.value.name == 'unstake') {
  stakedAmount.value = (transaction.value.data as UnstakeData).amount.amount;
}
if (transaction.value.name == 'switch') {
  stakedAmount.value = (transaction.value.data as RestakeData).amount.amount;
}
if (transaction.value.name == 'claim') {
  stakedAmount.value = parseCoins((transaction.value.data as ClaimData).total)[0].amount;
}
const onNext = () => {
  send('CONTINUE');
};

const goToMove = () => {
  router.push(`/send/move`);
  removeTransactionAndClose();
};

const goToSend = () => {
  const amount = lastResult.value.endBlock?.exchanged_demand_coin_amount;
  const denom = lastResult.value.endBlock?.demand_coin_denom;
  router.push(`/send/move?base_denom=${denom}&amount=${amount}`);
  removeTransactionAndClose();
};

const getDepositTotal = () => {
  const endBlock = lastResult.value.endBlock as AddLiquidityEndBlockResponse;
  const amounts = parseCoins(endBlock.accepted_coins);

  let total = new BigNumber(0);
  for (const item of amounts) {
    const baseDenom = getBaseDenomSync(item.denom);
    const price = globalStore.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: baseDenom });
    const precision = globalStore.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: baseDenom }) ?? 6;
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
    const price = globalStore.getters[GlobalDemerisGetterTypes.API.getPrice]({ denom: baseDenom });
    const precision = globalStore.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: baseDenom }) ?? 6;
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
