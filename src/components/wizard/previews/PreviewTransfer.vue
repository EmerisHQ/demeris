<template>
  <List :bordered="bordered">
    <ListItem :label="$t(`components.previews.transfer.${response ? 'sentLbl' : 'sendLbl'}`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay
            class="font-medium"
            :class="context === 'widget' ? 'text-0' : 'text-1'"
            :chain="transactionInfo.from.chain"
            :amount="{ amount: transactionInfo.from.amount, denom: denomName }"
          />
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <ChainName :name="transactionInfo.from.chain" />
          </div>
        </div>
        <CircleSymbol :denom="denomName" :chain-name="transactionInfo.from.chain" size="md" class="ml-3" />
      </div>
    </ListItem>

    <ListItem
      v-if="stepType !== 'transfer-to-hub' && displayFrom != '-'"
      :label="$t(`components.previews.transfer.${response ? 'fromLbl' : 'senderLbl'}`)"
      :disclosure-show-text="truncateAddress(displayFrom)"
      direction="col"
      collapsible
      collapsed
    >
      <div class="mt-4">
        <Address :address="displayFrom" :chain-name="transactionInfo.from.chain" readonly />
      </div>
    </ListItem>

    <ListItem
      v-if="hasMultipleTransactions"
      :label="
        $t(`components.previews.transfer.${response ? 'feesLbl' : 'txToSign'}`, {
          txCount: currentStep.transactions.length,
        })
      "
      direction="col"
      :hint="
        currentStep.transactions.length > 2
          ? $t('components.previews.transfer.txToSignMemoHint')
          : currentStep.memo && currentStep.memo != ''
          ? $t('components.previews.transfer.txToSignMemoNoRedeemHint')
          : $t('components.previews.transfer.txToSignHint')
      "
    >
      <ListItem v-for="(fee, chain) in fees" :key="'fee_' + chain" :description="formatChain(chain)" inset>
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" class="-text-1" />
          <span v-if="includedFees && includedFees.includes(denom)" class="-text-1">
            ({{ $t('components.previews.transfer.includedFee') }})</span
          >
        </template>
      </ListItem>
    </ListItem>

    <ListItem v-if="!hasMultipleTransactions" :label="$t('components.previews.transfer.feeLbl')">
      <template v-for="(fee, chain) in fees" :key="'fee_' + chain">
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" />
        </template>
      </template>
    </ListItem>

    <ListItem :label="$t(`components.previews.transfer.${response ? 'recipientGotLbl' : 'receiveLbl'}`)">
      <div class="flex justify-end items-center">
        <div>
          <AmountDisplay
            class="font-medium"
            :class="context !== 'widget' ? 'text-1' : 'text-0'"
            :chain="transactionInfo.to.chain"
            :amount="{ amount: transactionInfo.to.amount, denom: denomName }"
          />
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <ChainName :name="transactionInfo.to.chain" />
          </div>
        </div>
        <CircleSymbol
          :denom="denomName"
          :chain-name="transactionInfo.to.chain"
          size="md"
          class="send__item__symbol ml-3"
        />
      </div>
    </ListItem>

    <ListItem
      v-if="stepType !== 'transfer-to-hub' && displayTo != '-'"
      :label="$t('components.previews.transfer.toLbl')"
      :disclosure-show-text="truncateAddress(displayTo)"
      direction="col"
      collapsible
      collapsed
    >
      <div class="mt-4">
        <Address :address="displayTo" :chain-name="transactionInfo.to.chain" readonly />
      </div>
    </ListItem>
  </List>
</template>

<script setup lang="ts">
/* eslint-disable max-lines-per-function */
import { EmerisBase } from '@emeris/types';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Address from '@/components/ui/Address.vue';
import { List, ListItem } from '@/components/ui/List';
import { GlobalGetterTypes } from '@/store';
import * as Actions from '@/types/actions';
import { getBaseDenom } from '@/utils/actionHandler';
import { getOwnAddress } from '@/utils/basic';

interface Props {
  step?: Actions.Step;
  response?: Actions.Step;
  fees: Actions.FeeTotals;
  context?: 'default' | 'widget';
  bordered?: boolean;
  isReceipt?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  step: undefined,
  response: undefined,
  context: 'default',
  bordered: true,
  isReceipt: false,
});

const store = useStore();
const denomName = ref('-');

const gasPriceLevel = computed(() => store.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel]);

const currentStep = computed(() => {
  return props.response || props.step;
});
const displayFrom = ref('-');
const displayTo = ref('-');
const stepType = computed(() => {
  const description = currentStep.value.description;
  const descriptionKeyMap = {
    'Assets Must be transferred to hub first': 'transfer-to-hub',
    'AssetA must be transferred to hub': 'transfer-to-hub',
    'AssetB must be transferred to hub': 'transfer-to-hub',
    'Assets Moved': 'move',
    'Assets Transferred': 'transfer',
  };

  return descriptionKeyMap[description] || 'transfer';
});

const hasMultipleTransactions = computed(() => {
  return currentStep.value.transactions.length > 1;
});
const includedFees = computed(() => {
  const included = [];
  const transactions = (props.step as Actions.Step).transactions;
  for (const tx of transactions) {
    if (tx.addFee) {
      included.push(tx.feeToAdd[0].denom);
    }
  }
  return included;
});
const transactionInfo = computed(() => {
  const transactions = currentStep.value.transactions;
  const firstTransaction = transactions[0] as Record<string, any>;
  const [lastTransaction] = (transactions.length > 1 ? transactions.slice(-1) : transactions) as Record<string, any>[];

  const isIBC = ['IBCtransferBackward', 'IBCtransferForward'].includes(firstTransaction.type);
  let fromAmount = firstTransaction.data.amount.amount;
  if (firstTransaction.addFee) {
    fromAmount = (
      parseInt(fromAmount) +
      parseFloat(firstTransaction.feeToAdd[0].amount[gasPriceLevel.value]) *
        store.getters[GlobalGetterTypes.USER.getGasLimit]
    ).toString();
  }
  const from = {
    address: '',
    amount: fromAmount,
    chain: firstTransaction.data.chainName || firstTransaction.data.chainName,
    denom: (firstTransaction.data.amount as EmerisBase.Amount).denom,
  };

  const to = {
    amount: firstTransaction.data.amount.amount,
    address: lastTransaction.data.toAddress,
    chain:
      lastTransaction.data.toChain || lastTransaction.data.destination_chain_name || lastTransaction.data.chain_name,
    denom: (lastTransaction.data.amount as EmerisBase.Amount).denom,
  };

  return {
    isIBC,
    from,
    to,
  };
});

const formatChain = (name: string) => {
  return 'Fees on ' + store.getters[GlobalGetterTypes.API.getDisplayChain]({ name });
};

const truncateAddress = (address: string) => {
  return `${address.substring(0, address.indexOf('1') + 6)}…${address.substring(address.length - 3, address.length)}`;
};

watch(
  transactionInfo,
  async (detail) => {
    if (!detail.from.address) {
      displayFrom.value = await getOwnAddress({ chain_name: detail.from.chain });
    }
    if (detail.to.address) {
      displayTo.value = detail.to.address;
    }
    if (detail.to.chain && !detail.to.address) {
      displayTo.value = await getOwnAddress({ chain_name: detail.to.chain });
    }
    if (detail.isIBC) {
      denomName.value = await getBaseDenom(detail.from.denom, detail.from.chain);
    } else {
      denomName.value = detail.from.denom;
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
