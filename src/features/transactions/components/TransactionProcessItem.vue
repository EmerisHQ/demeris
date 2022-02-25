<template>
  <Button
    v-tippy="{
      placement: 'left',
      trigger: !state.done ? 'mouseenter focus' : 'manual',
    }"
    size="none"
    class="transactions-center__close-btn transition-all w-6 h-6 absolute inset-y-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 focus:opacity-75 group-hover:opacity-75 group-focus:opacity-75"
    :content="$t('context.transactions.widget.removeItem')"
    rounded
    @click="removeTransactionItem"
  >
    <Icon name="CloseIcon" :icon-size="0.85" />
  </Button>

  <button v-bind="$attrs" class="flex w-full items-center" :class="hideControls ? 'space-x-3' : 'space-x-4'">
    <div class="item-icon w-8">
      <Icon v-if="state.matches('failed.unknown')" name="QuestionIcon" class="text-warning" />
      <Icon v-else-if="state.matches('failed')" name="WarningTriangleIcon" class="text-negative" />
      <Icon v-else-if="state.matches('success')" name="SuccessOutlineIcon" class="text-positive" />
      <Icon v-else-if="state.matches('waitingPreviousTransaction')" name="TimeIcon" class="opacity-60" />
      <div v-else-if="state.matches('review') || state.matches('receipt')" class="-space-x-3 inline-flex items-center">
        <CircleSymbol
          v-for="asset of getIconAssets()"
          :key="asset.denom"
          v-bind="asset"
          size="sm"
          class="z-0 first:z-10"
        />
      </div>
      <div
        v-else-if="['transacting', 'validating', 'signing'].some(state.matches)"
        style="transform: scale(0.5) translateX(-0.75rem)"
      >
        <Spinner :size="2.5" />
      </div>
      <Icon v-else name="ExclamationIcon" class="text-warning" />
    </div>

    <div class="flex-1 text-left flex flex-col">
      <p class="item-title font-medium truncate">
        <template v-if="action === 'transfer'">
          Send <Ticker :name="getBaseDenomSync(transactionAction.data.amount.denom)" />
        </template>
        <template v-if="action === 'move'">
          Move <Ticker :name="getBaseDenomSync(transactionAction.data.amount.denom)" />
        </template>
        <template v-if="action === 'swap'">
          Swap <Ticker :name="getBaseDenomSync(transactionAction.data.from.denom)" /> &rarr;
          <Ticker :name="getBaseDenomSync(transactionAction.data.to.denom)" />
        </template>
        <template v-if="action === 'addliquidity'">
          Add <Ticker :name="getBaseDenomSync(transactionAction.data.coinA.denom)" /> ·
          <Ticker :name="getBaseDenomSync(transactionAction.data.coinB.denom)" />
        </template>
        <template v-if="action === 'withdrawliquidity'">
          Withdraw <Ticker :name="getBaseDenomSync(transactionAction.data.pool.reserve_coin_denoms[0])" /> ·
          <Ticker :name="getBaseDenomSync(transactionAction.data.pool.reserve_coin_denoms[1])" />
        </template>
        <template v-if="action === 'createpool'">
          Pool <Ticker :name="getBaseDenomSync(transactionAction.data.coinA.denom)" /> ·
          <Ticker :name="getBaseDenomSync(transactionAction.data.coinB.denom)" />
        </template>
        <template v-if="action === 'claim'">
          Claim <Ticker :name="getBaseDenomSync(transactionAction.data.amount.denom)" />
        </template>
        <template v-if="action === 'stake'">
          Stake <Ticker :name="getBaseDenomSync(transactionAction.data[0].amount.denom)" />
        </template>
        <template v-if="action === 'unstake'">
          Unstake <Ticker :name="getBaseDenomSync(transactionAction.data.amount.denom)" />
        </template>
        <template v-if="action === 'switch'">
          Restake <Ticker :name="getBaseDenomSync(transactionAction.data.amount.denom)" />
        </template>
      </p>

      <p class="item-description -text-1 opacity-75">
        <i18n-t v-if="state.matches('validating')" keypath="context.transactions.widget.description.validating" />
        <template v-else-if="state.matches('transacting') && transactionOffset">
          {{ $t('context.transactions.widget.description.transactingPartial', transactionOffset) }}
        </template>
        <i18n-t
          v-else-if="state.matches('transacting')"
          keypath="context.transactions.widget.description.transacting"
        />
        <i18n-t v-else-if="state.matches('signing')" keypath="context.transactions.widget.description.signing" />
        <i18n-t
          v-else-if="state.matches('waitingPreviousTransaction')"
          keypath="context.transactions.widget.description.waitingPreviousTransaction"
        />
        <i18n-t v-else-if="state.matches('success')" keypath="context.transactions.widget.description.success" />
        <i18n-t
          v-else-if="state.matches('failed.sign')"
          keypath="context.transactions.widget.description.failed.sign"
          tag="span"
          class="text-negative"
        />
        <i18n-t
          v-else-if="state.matches('failed.unknown')"
          keypath="context.transactions.widget.description.failed.unknown"
          tag="span"
        />
        <i18n-t
          v-else-if="state.matches('failed')"
          keypath="context.transactions.widget.description.failed.default"
          tag="span"
          class="text-negative"
        />
        <template v-else-if="state.matches('review') && transactionOffset">
          {{ $t('context.transactions.widget.description.reviewPartial', transactionOffset) }}
        </template>
        <i18n-t v-else-if="state.matches('review')" keypath="context.transactions.widget.description.review" />
        <template v-else-if="state.matches('receipt')">
          {{ $t('context.transactions.widget.description.receipt', transactionOffset) }}
        </template>
      </p>
    </div>

    <div>
      <template v-if="!hideControls">
        <Button
          v-if="state.can('RETRY')"
          :name="$t('context.transactions.controls.tryAgain')"
          size="sm"
          @click.stop="send('RETRY')"
        />
        <Button
          v-if="state.can('SIGN')"
          :name="$t('context.transactions.controls.sign')"
          size="sm"
          @click.stop="send('SIGN')"
        />
        <Button
          v-else-if="state.matches('waitingPreviousTransaction')"
          :name="$t('context.transactions.controls.sign')"
          size="sm"
          :tooltip-text="
            $t('context.transactions.controls.waitingTransactionTooltip', {
              chain: globalStore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({ name: chainName }),
            })
          "
          disabled
          @click.stop="void 0"
        />
        <Button
          v-else-if="state.matches('receipt')"
          :name="$t('context.transactions.controls.next')"
          size="sm"
          @click.stop="send('CONTINUE')"
        />
      </template>
    </div>
  </button>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { useActor } from '@xstate/vue';
import { computed, PropType, toRefs } from 'vue';
import { useStore } from 'vuex';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { AddLiquidityData, CreatePoolData, SwapData, TransferData, WithdrawLiquidityData } from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';

import {
  getCurrentTransaction,
  getSourceChainFromTransaction,
  getTransactionFromAction,
  getTransactionOffset,
} from '../transactionProcessHelpers';
import { TransactionProcessService } from '../transactionProcessMachine';

const props = defineProps({
  service: {
    type: Object as PropType<TransactionProcessService>,
    required: true,
  },
  hideControls: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['remove']);
const removeTransactionItem = () => emit('remove');

const globalStore = useStore();
const { service } = toRefs(props);
const { state, send } = useActor(service);

const transaction = computed(() => getCurrentTransaction(state.value.context));
const transactionAction = computed(() => getTransactionFromAction(state.value.context));
const action = computed(() => state.value.context.input.action);
const chainName = computed(() => getSourceChainFromTransaction(transaction.value));

const transactionOffset = computed(() => getTransactionOffset(state.value.context));

const getIconAssets = () => {
  const name = transaction.value.name;
  const assets = [];

  if (name === 'transfer' || name.startsWith('ibc')) {
    const denom = (transaction.value.data as TransferData).amount.denom;
    const chainName = getSourceChainFromTransaction(transaction.value);
    assets.push({ denom, chainName });
  }

  if (name === 'swap') {
    const denom = (transaction.value.data as SwapData).to.denom;
    assets.push({ denom });
  }

  if (name === 'addliquidity') {
    const denomA = (transaction.value.data as AddLiquidityData).coinA.denom;
    const denomB = (transaction.value.data as AddLiquidityData).coinB.denom;
    assets.push({ denom: denomA }, { denom: denomB });
  }

  if (name === 'withdrawliquidity') {
    const denoms = (transaction.value.data as WithdrawLiquidityData).pool.reserve_coin_denoms.map(getBaseDenomSync);
    assets.push(...denoms);
  }

  if (name === 'createpool') {
    const denomA = (transaction.value.data as CreatePoolData).coinA.denom;
    const denomB = (transaction.value.data as CreatePoolData).coinB.denom;
    assets.push({ denom: denomA }, { denom: denomB });
  }

  return assets;
};
</script>

<style lang="postcss">
.transactions-center__close-btn .button {
  @apply w-6 h-6;
}
</style>
