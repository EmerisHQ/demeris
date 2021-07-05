<template>
  <List>
    <ListItem label="Send">
      <div>
        <AmountDisplay
          class="w-bold"
          :amount="{ amount: transactionInfo.from.amount, denom: transactionInfo.from.denom }"
        />
      </div>
      <sub><ChainName :name="transactionInfo.from.chain" /></sub>
    </ListItem>

    <ListItem
      v-if="!stepType.value !== 'transfer-to-hub'"
      label="Send Address"
      direction="column"
      collapsable
      collapsed
    >
      <Address :address="transactionInfo.from.address" :chain-name="transactionInfo.from.chain" readonly />
    </ListItem>

    <ListItem
      v-if="hasMultipleTransactions"
      :label="`${step.transactions.length} transfers to sign`"
      direction="column"
      hint="TODO"
    >
      <ListItem
        v-for="transfer of step.transactions"
        :key="transfer.data.to_chain"
        :description="formatMultipleChannel(transfer)"
        inset
      >
        <AmountDisplay class="w-bold" :amount="fees[transfer.data.from_chain]" />
      </ListItem>
    </ListItem>

    <ListItem v-if="!hasMultipleTransactions" description="Transaction Fee">
      <template v-for="(amount, denom) in fees[transactionInfo.from.chain]" :key="'fee_' + denom">
        <AmountDisplay class="s-minus" :amount="{ amount: amount, denom: denom }" />
      </template>
    </ListItem>

    <ListItem label="Receive">
      <div>
        <AmountDisplay
          class="w-bold"
          :amount="{ amount: transactionInfo.to.amount, denom: transactionInfo.to.denom }"
        />
      </div>
      <sub><ChainName :name="transactionInfo.to.chain" /></sub>
    </ListItem>

    <ListItem v-if="!stepType.value !== 'transfer-to-hub'" label="Recipient Address" direction="column">
      <Address :address="transactionInfo.to.address" :chain-name="transactionInfo.to.chain" readonly />
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import Address from '@/components/ui/Address.vue';
import { List, ListItem } from '@/components/ui/List';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';

export default defineComponent({
  name: 'PreviewTransfer',

  components: {
    AmountDisplay,
    Address,
    ChainName,
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
  },

  setup(props) {
    const store = useStore();
    console.log(props.fees);
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

    const transactionInfo = computed(() => {
      const transactions = (props.step as Actions.Step).transactions;
      const firstTransaction = transactions[0] as Record<string, any>;
      const [lastTransaction] = (transactions.length > 1 ? transactions.slice(-1) : transactions) as Record<
        string,
        any
      >[];

      const from = {
        address: '',
        amount: transactions.reduce((acc, item) => {
          const amount = (item.data as Actions.TransferData).amount.amount;
          return acc + +amount;
        }, 0),
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
        amount: from.amount,
        address: lastTransaction.data.to_address,
        chain:
          lastTransaction.data.to_chain ||
          lastTransaction.data.destination_chain_name ||
          lastTransaction.data.chain_name,
        denom: (lastTransaction.data.amount as Base.Amount).denom,
      };

      from.address = store.getters['demeris/getOwnAddress']({ chain_name: from.chain });

      if (to.chain) {
        to.address = store.getters['demeris/getOwnAddress']({ chain_name: to.chain });
      }

      if (stepType.value === 'transfer') {
        to.amount = to.amount - totalFees;
      }

      return {
        from,
        to,
      };
    });

    const formatMultipleChannel = (transaction: Actions.TransferData) => {
      const getName = (name: string) => store.getters['demeris/getDisplayChain']({ name });
      // @ts-ignore
      return `Fee ${getName(transaction.data.from_chain)} -> ${getName(transaction.data.to_chain)}`;
    };

    return {
      stepType,
      transactionInfo,
      hasMultipleTransactions,
      formatMultipleChannel,
    };
  },
});
</script>
