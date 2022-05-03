<template>
  <Button
    v-if="!hideControls"
    v-tippy="{
      placement: 'left',
      trigger: isProcessingState(state) || state.done ? 'manual' : 'mouseenter focus',
    }"
    size="none"
    class="ml-3 transactions-center__close-btn transition-all w-6 h-6 z-10 absolute inset-y-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 focus:opacity-75 group-hover:opacity-75 group-focus:opacity-75"
    :content="$t('context.transactions.widget.removeItem')"
    rounded
    @click="removeTransactionItem"
  >
    <Icon name="CloseIcon" :icon-size="0.85" />
  </Button>
  <div class="ml-3 relative">
    <button
      v-bind="$attrs"
      class="hover:bg-fg flex w-full items-center"
      :class="hideControls ? 'space-x-3' : 'space-x-4'"
    >
      <div class="item-icon w-8">
        <Icon v-if="state.matches('failed.unknown')" name="QuestionIcon" class="text-warning" />
        <Icon v-else-if="state.matches('failed.sign')" name="ExclamationIcon" class="text-warning" />
        <Icon v-else-if="state.matches('failed')" name="WarningTriangleIcon" class="text-negative" />
        <Icon v-else-if="state.matches('success')" name="SuccessOutlineIcon" class="text-positive" />
        <Icon v-else-if="state.matches('waitingPreviousTransaction')" name="TimeIcon" class="opacity-60" />
        <div
          v-else-if="state.matches('review') || state.matches('receipt')"
          class="-space-x-3 inline-flex items-center pt-1.5"
        >
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
          <template
            v-if="
              action == 'transfer' &&
              (transactionAction.type === 'transfer' ||
                transactionAction.type === 'IBCtransferBackward' ||
                transactionAction.type === 'IBCtransferForward')
            "
          >
            Send
            <Ticker
              :name="getBaseDenomSync(transactionAction.data.amount.denom)"
              :chain="transactionAction.data.chainName"
            />
          </template>
          <template
            v-if="
              action == 'move' &&
              (transactionAction.type === 'transfer' ||
                transactionAction.type === 'IBCtransferBackward' ||
                transactionAction.type === 'IBCtransferForward')
            "
          >
            Move
            <Ticker
              :name="getBaseDenomSync(transactionAction.data.amount.denom)"
              :chain="transactionAction.data.chainName"
            />
          </template>
          <template v-if="action == 'swap' && transactionAction.type === 'swap'">
            Swap
            <Ticker
              :name="getBaseDenomSync(transactionAction.data.from.denom)"
              :chain="transactionAction.data.chainName"
            />
            &rarr;
            <Ticker
              :name="getBaseDenomSync(transactionAction.data.to.denom)"
              :chain="transactionAction.data.chainName"
            />
          </template>
          <template v-if="action == 'addliquidity' && transactionAction.type === 'addLiquidity'">
            Add <Ticker :name="getBaseDenomSync(transactionAction.data.coinA.denom)" /> ·
            <Ticker :name="getBaseDenomSync(transactionAction.data.coinB.denom)" />
          </template>
          <template v-if="action === 'withdrawliquidity' && transactionAction.type === 'withdrawLiquidity'">
            Withdraw <Ticker :name="getBaseDenomSync(transactionAction.data.pool.reserve_coin_denoms[0])" /> ·
            <Ticker :name="getBaseDenomSync(transactionAction.data.pool.reserve_coin_denoms[1])" />
          </template>
          <template v-if="action === 'createpool' && transactionAction.type === 'createPool'">
            Pool <Ticker :name="getBaseDenomSync(transactionAction.data.coinA.denom)" /> ·
            <Ticker :name="getBaseDenomSync(transactionAction.data.coinB.denom)" />
          </template>
          <template v-if="action === 'claim' && transactionAction.type === 'claim'">
            Claim <Ticker :name="getStakableBaseDenomFromChainName(transactionAction.data.chainName)" />
          </template>
          <template v-if="action === 'stake' && transactionAction.type === 'stake'">
            Stake <Ticker :name="getBaseDenomSync(transactionAction.data[0].amount.denom)" />
          </template>
          <template v-if="action === 'unstake' && transactionAction.type === 'unstake'">
            Unstake <Ticker :name="getBaseDenomSync(transactionAction.data.amount.denom)" />
          </template>
          <template v-if="action === 'switch' && transactionAction.type === 'switch'">
            Restake <Ticker :name="getBaseDenomSync(transactionAction.data.amount.denom)" />
          </template>
        </p>

        <p class="item-description -text-1 opacity-75 truncate">
          <i18n-t
            v-if="state.matches('validating')"
            scope="global"
            keypath="context.transactions.widget.description.validating"
          />
          <template v-else-if="state.matches('transacting') && transactionOffset">
            {{ $t('context.transactions.widget.description.transactingPartial', transactionOffset) }}
          </template>
          <i18n-t
            v-else-if="state.matches('transacting')"
            scope="global"
            keypath="context.transactions.widget.description.transacting"
          />
          <i18n-t
            v-else-if="state.matches('signing')"
            scope="global"
            keypath="context.transactions.widget.description.signing"
          />
          <i18n-t
            v-else-if="state.matches('waitingPreviousTransaction')"
            scope="global"
            keypath="context.transactions.widget.description.waitingPreviousTransaction"
          />
          <i18n-t
            v-else-if="state.matches('success')"
            scope="global"
            keypath="context.transactions.widget.description.success"
          />
          <i18n-t
            v-else-if="state.matches('failed.sign')"
            scope="global"
            keypath="context.transactions.widget.description.failed.sign"
            tag="span"
            class="text-warning"
          />
          <i18n-t
            v-else-if="state.matches('failed.unknown')"
            scope="global"
            keypath="context.transactions.widget.description.failed.unknown"
            tag="span"
          />
          <i18n-t
            v-else-if="state.matches('failed')"
            scope="global"
            keypath="context.transactions.widget.description.failed.default"
            tag="span"
            class="text-negative"
          />
          <template v-else-if="state.matches('review') && transactionOffset">
            {{ $t('context.transactions.widget.description.reviewPartial', transactionOffset) }}
          </template>
          <i18n-t
            v-else-if="state.matches('review')"
            scope="global"
            keypath="context.transactions.widget.description.review"
          />
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
                chain: globalStore.getters[GlobalGetterTypes.API.getDisplayChain]({ name: chainName }),
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
  </div>
</template>

<script lang="ts">
/* eslint-disable max-lines */
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
import useDenomsFactory from '@/composables/useDenoms';
import { GlobalGetterTypes } from '@/store';
import type { Pool } from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';

import {
  getCurrentTransaction,
  getSourceChainFromTransaction,
  getTransactionFromAction,
  getTransactionOffset,
  isProcessingState,
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
const { getStakableBaseDenomFromChainName } = useDenomsFactory();

const transaction = computed(() => getCurrentTransaction(state.value.context));
const transactionAction = computed(() => getTransactionFromAction(state.value.context));
const action = computed(() => state.value.context.input.action);
const chainName = computed(() => getSourceChainFromTransaction(transaction.value));

const transactionOffset = computed(() => getTransactionOffset(state.value.context));

const getIconAssets = () => {
  const name = transaction.value.type;
  const assets = [];

  if (name === 'transfer' || name === 'IBCtransferBackward' || name === 'IBCtransferForward') {
    const denom = transaction.value.data.amount.denom;
    const chainName = getSourceChainFromTransaction(transaction.value);
    assets.push({ denom, chainName });
  }

  if (name === 'swap') {
    const denom = transaction.value.data.to.denom;
    const chainName = getSourceChainFromTransaction(transaction.value);
    assets.push({ denom, chainName });
  }

  if (name === 'addLiquidity') {
    const denomA = transaction.value.data.coinA.denom;
    const denomB = transaction.value.data.coinB.denom;
    assets.push({ denom: denomA }, { denom: denomB });
  }

  if (name === 'withdrawLiquidity') {
    const denoms = (transaction.value.data.pool as Pool).reserve_coin_denoms.map(getBaseDenomSync);
    assets.push(...denoms);
  }

  if (name === 'createPool') {
    const denomA = transaction.value.data.coinA.denom;
    const denomB = transaction.value.data.coinB.denom;
    assets.push({ denom: denomA }, { denom: denomB });
  }

  if (name === 'claim') {
    const data = transaction.value.data;
    const denom = getStakableBaseDenomFromChainName(data.chainName);
    assets.push({ denom });
  }

  if (name === 'stake') {
    const denom = transaction.value.data[0].amount.denom;
    assets.push({ denom });
  }

  if (name === 'unstake') {
    const denom = transaction.value.data.amount.denom;
    assets.push({ denom });
  }

  if (name === 'switch') {
    const denom = transaction.value.data.amount.denom;
    assets.push({ denom });
  }

  return assets;
};
</script>

<style lang="postcss">
.transactions-center__close-btn .button {
  @apply w-6 h-6;
}

.transactions-center {
  .item-title,
  .item-description {
    max-width: 11rem;
  }
}
</style>
