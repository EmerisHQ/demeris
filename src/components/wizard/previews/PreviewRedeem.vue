<template>
  <List>
    <ListItem label="Send">
      <div>
        <AmountDisplay class="font-bold" :amount="step.transactions[0].data.amount" />
      </div>
      <sub class="-text-1 leading-title bottom-0 text-muted"
        ><ChainName :name="step.transactions[0].data.from_chain"
      /></sub>
    </ListItem>

    <ListItem
      v-if="hasMultipleTransactions"
      :label="$t('components.previews.redeem.txToSign', { txCount: step.transactions.length })"
      direction="col"
      :hint="$t('components.previews.redeem.txToSignHint')"
    >
      <ListItem v-for="(fee, chain) in fees" :key="'fee_' + chain" :description="formatChain(chain)" inset>
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" class="-text-1" />
        </template>
      </ListItem>
    </ListItem>

    <ListItem v-if="!hasMultipleTransactions" :description="$t('components.previews.redeem.feeLbl')">
      <template v-for="(fee, chain) in fees" :key="'fee_' + chain">
        <template v-for="(feeAmount, denom) in fee" :key="'fee' + chain + denom">
          <AmountDisplay :amount="{ amount: feeAmount.toString(), denom }" class="-text-1" />
        </template>
      </template>
    </ListItem>

    <ListItem label="Receive">
      <div>
        <AmountDisplay class="font-bold" :amount="step.transactions[step.transactions.length - 1].data.amount" />
      </div>
      <sub class="-text-1 leading-title bottom-0 text-muted"
        ><ChainName :name="step.transactions[step.transactions.length - 1].data.to_chain"
      /></sub>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, watch } from 'vue';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import { List, ListItem } from '@/components/ui/List';
import { GlobalGetterTypes } from '@/store';
import * as Actions from '@/types/actions';
import { getOwnAddress } from '@/utils/basic';

export default defineComponent({
  name: 'PreviewRedeem',

  components: {
    AmountDisplay,

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
    isReceipt: {
      type: Boolean as PropType<boolean>,
      required: false,
      default: false,
    },
  },

  setup(props) {
    const store = useStore();

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
      const firstTransaction = transactions[0];
      const [lastTransaction] = transactions.length > 1 ? transactions.slice(-1) : transactions;

      const from = {
        address: '',
        amount: transactions.reduce((acc, item) => {
          const amount = (item.data as Actions.TransferData).amount.amount;
          return acc + +amount;
        }, 0),
        chain:
          (firstTransaction.data as Actions.IBCForwardsData).from_chain ||
          (firstTransaction.data as Actions.TransferData).chain_name,
        denom: (firstTransaction.data as Actions.TransferData).amount.denom,
      };

      let totalFees = 0;

      for (const denoms of Object.values(props.fees as Actions.FeeTotals)) {
        for (const fee of Object.values(denoms)) {
          totalFees += fee;
        }
      }

      const to = {
        amount: from.amount,
        address: (lastTransaction.data as Actions.TransferData).to_address,
        chain:
          (lastTransaction.data as Actions.IBCBackwardsData).to_chain ||
          (lastTransaction.data as any).destination_chain_name || //TODO: No Action data  contains this field?
          (lastTransaction.data as Actions.TransferData).chain_name,
        denom: (lastTransaction.data as Actions.TransferData).amount.denom,
      };

      if (stepType.value === 'transfer') {
        to.amount = to.amount - totalFees;
      }

      return {
        from,
        to,
      };
    });

    watch(
      () => transactionInfo.value,
      async (newVal) => {
        if (newVal.to.chain) {
          newVal.to.address = await getOwnAddress({ chain_name: newVal.to.chain });
        }
        if (newVal.from.chain) {
          newVal.from.address = await getOwnAddress({ chain_name: newVal.from.chain });
        }
      },
      { immediate: true },
    );

    const formatMultipleChannel = (transaction: Actions.TransferData) => {
      const getName = (name: string) => store.getters[GlobalGetterTypes.API.getDisplayChain]({ name });
      // @ts-ignore
      return `Fee ${getName(transaction.data.from_chain)} -> ${getName(transaction.data.to_chain)}`;
    };
    const formatChain = (name: string) => {
      return 'Fees on ' + store.getters[GlobalGetterTypes.API.getDisplayChain]({ name });
    };
    return {
      stepType,
      formatChain,
      transactionInfo,
      hasMultipleTransactions,
      formatMultipleChannel,
    };
  },
});
</script>
