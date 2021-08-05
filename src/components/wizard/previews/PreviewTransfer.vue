<template>
  <List>
    <ListItem :label="$t('components.previews.transfer.sendLbl')">
      <div class="send__item">
        <CircleSymbol
          :denom="denomName"
          :chain-name="transactionInfo.from.chain"
          size="sm"
          class="send__item__symbol"
        />
        <AmountDisplay class="w-bold" :amount="{ amount: transactionInfo.from.amount, denom: denomName }" />
      </div>
      <div class="preview-chain"><ChainName :name="transactionInfo.from.chain" /></div>
    </ListItem>

    <ListItem
      v-if="stepType !== 'transfer-to-hub'"
      :label="$t('components.previews.transfer.fromLbl')"
      direction="column"
      collapsable
      collapsed
    >
      <Address :address="transactionInfo.from.address" :chain-name="transactionInfo.from.chain" readonly />
    </ListItem>

    <ListItem
      v-if="hasMultipleTransactions"
      :label="$t('components.previews.transfer.txToSign', { txCount: step.transactions.length })"
      direction="column"
      :hint="$t('components.previews.transfer.txToSignHint')"
    >
      <ListItem v-for="(fee, chain) in fees" :key="'fee_' + chain" :description="formatChain(chain)" inset>
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" class="s-minus" />
          <span v-if="includedFees && includedFees.includes(denom)" class="s-minus">
            ({{ $t('components.previews.transfer.includedFee') }})</span>
        </template>
      </ListItem>
    </ListItem>

    <ListItem v-if="!hasMultipleTransactions" :description="$t('components.previews.transfer.feeLbl')">
      <template v-for="(fee, chain) in fees" :key="'fee_' + chain">
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" class="s-minus" />
        </template>
      </template>
    </ListItem>

    <ListItem label="Receive">
      <div class="send__item">
        <CircleSymbol :denom="denomName" :chain-name="transactionInfo.to.chain" size="sm" class="send__item__symbol" />
        <AmountDisplay class="w-bold" :amount="{ amount: transactionInfo.to.amount, denom: denomName }" />
      </div>
      <div class="preview-chain"><ChainName :name="transactionInfo.to.chain" /></div>
    </ListItem>

    <ListItem
      v-if="stepType !== 'transfer-to-hub'"
      :label="$t('components.previews.transfer.toLbl')"
      direction="column"
    >
      <Address :address="transactionInfo.to.address" :chain-name="transactionInfo.to.chain" readonly />
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Address from '@/components/ui/Address.vue';
import { List, ListItem } from '@/components/ui/List';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';
import { getBaseDenom } from '@/utils/actionHandler';

export default defineComponent({
  name: 'PreviewTransfer',

  components: {
    AmountDisplay,
    Address,
    ChainName,
    CircleSymbol,
    List,
    ListItem,
  },

  props: {
    step: {
      type: Object as PropType<Actions.Step>,
      required: true,
    },
    fees: {
      type: Object as PropType<Actions.FeeTotals>,
      required: true,
    },

    gasPriceLevel: {
      type: String as PropType<Actions.GasPriceLevel>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const denomName = ref('-');

    const stepType = computed(() => {
      const description = (props.step as Actions.Step).description;
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
      return (props.step as Actions.Step).transactions.length > 1;
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
      const transactions = (props.step as Actions.Step).transactions;
      const firstTransaction = transactions[0] as Record<string, any>;
      const [lastTransaction] = (transactions.length > 1 ? transactions.slice(-1) : transactions) as Record<
        string,
        any
      >[];

      const isIBC = ['ibc_forward', 'ibc_backward'].includes(firstTransaction.name);
      let fromAmount = firstTransaction.data.amount.amount;
      if (firstTransaction.addFee) {
        fromAmount = (
          parseInt(fromAmount) +
          parseFloat(firstTransaction.feeToAdd[0].amount[props.gasPriceLevel]) * store.getters['demeris/getGasLimit']
        ).toString();
      }
      const from = {
        address: '',
        amount: fromAmount,
        chain: firstTransaction.data.from_chain || firstTransaction.data.chain_name,
        denom: (firstTransaction.data.amount as Base.Amount).denom,
      };

      let totalFees = 0;

      for (const denoms of Object.values(props.fees as Actions.FeeTotals)) {
        for (const fee of Object.values(denoms)) {
          totalFees += fee;
        }
      }

      const to = {
        amount: firstTransaction.data.amount.amount,
        address: lastTransaction.data.to_address,
        chain:
          lastTransaction.data.to_chain ||
          lastTransaction.data.destination_chain_name ||
          lastTransaction.data.chain_name,
        denom: (lastTransaction.data.amount as Base.Amount).denom,
      };

      from.address = store.getters['demeris/getOwnAddress']({ chain_name: from.chain });

      if (to.chain && !to.address) {
        to.address = store.getters['demeris/getOwnAddress']({ chain_name: to.chain });
      }

      return {
        isIBC,
        from,
        to,
      };
    });

    const formatMultipleChannel = (transaction: Actions.TransferData) => {
      const getName = (name: string) => store.getters['demeris/getDisplayChain']({ name });
      // @ts-ignore
      return `Fee ${getName(transaction.data.from_chain)} -> ${getName(transaction.data.to_chain)}`;
    };

    const formatChain = (name: string) => {
      return 'Fees on ' + store.getters['demeris/getDisplayChain']({ name });
    };

    watch(
      transactionInfo,
      async (detail) => {
        if (detail.isIBC) {
          denomName.value = await getBaseDenom(detail.from.denom, detail.from.chain);
        } else {
          denomName.value = detail.from.denom;
        }
      },
      { immediate: true },
    );

    return {
      denomName,
      stepType,
      formatChain,
      transactionInfo,
      hasMultipleTransactions,
      formatMultipleChannel,
      includedFees,
    };
  },
});
</script>

<style lang="scss" scoped>
.send__item {
  display: inline-flex;

  &__symbol {
    margin-right: 0.8rem;
  }
}

.preview-chain {
  display: block;
  margin-top: -0.2rem;
  font-size: 1.2rem;
}
</style>
