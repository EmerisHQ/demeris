<template>
  <List>
    <!-- Total rewards -->
    <ListItem :label="$t(`components.previews.claim.totalRewards`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay
            class="font-medium"
            :class="context === 'widget' ? 'text-0' : 'text-1'"
            :amount="{ amount: rewardsAmount, denom: rewardsDenom }"
          />
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <Price :amount="{ denom: rewardsDenom, amount: rewardsAmount }" />
          </div>
        </div>
        <CircleSymbol :denom="'uatom'" :chain-name="'cosmos-hub'" size="md" class="ml-3" />
      </div>
    </ListItem>

    <!-- Validator list -->
    <ListItem :label="$t(`components.previews.claim.validators`)">
      <div
        v-for="vali of validators"
        :key="vali.validator_address"
        class="flex justify-end items-center mb-4 last:mb-0"
      >
        <div class="text-right">
          <div class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
            <div class="text-text text-0">
              {{ vali.moniker }}
            </div>
            <AmountDisplay class="font-medium" :amount="{ amount: parseInt(vali.reward), denom: rewardsDenom }" />
            {{ $t(`components.previews.claim.rewards`) }}
          </div>
        </div>
        <!-- TODO -->
        <!-- <CircleSymbol :denom="'uatom'" :chain-name="'cosmos-hub'" size="md" class="ml-3" /> -->
      </div>
    </ListItem>

    <!-- Transaction fees -->
    <ListItem :label="$t(`components.previews.claim.transactionFee`)">
      <div class="flex justify-end items-center">
        <div class="text-right">
          <AmountDisplay class="text-0" :amount="{ amount: fee, denom: rewardsDenom }" />
        </div>
        <CircleSymbol :denom="'uatom'" :chain-name="'cosmos-hub'" size="md" class="ml-3" />
      </div>
    </ListItem>
  </List>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Price from '@/components/common/Price.vue';
// import Address from '@/components/ui/Address.vue';
import { List, ListItem } from '@/components/ui/List';
//
import useStaking from '@/composables/useStaking';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';
import { getBaseDenom } from '@/utils/actionHandler';
import { getOwnAddress } from '@/utils/basic';

export default defineComponent({
  name: 'PreviewTransfer',

  components: {
    AmountDisplay,
    Price,

    CircleSymbol,
    List,
    ListItem,
  },

  props: {
    step: {
      type: Object as PropType<Actions.Step>,
      default: undefined,
    },
    response: {
      type: Object as PropType<Actions.Step>,
      default: undefined,
    },
    fees: {
      type: Object as PropType<Actions.FeeTotals>,
      required: true,
    },
    context: {
      type: String as PropType<'default' | 'widget'>,
      default: 'default',
    },
  },

  setup(props: any) {
    const { getValidatorsByBaseDenom, getValidatorMoniker } = useStaking();
    const store = useStore();
    const rewardsDenom = computed(() => {
      return props.step.transactions[0].data.total.replace(/[0-9.,]+/gi, '');
    });
    const rewardsAmount = computed(() => {
      return parseInt(props.step.transactions[0].data.total);
    });
    const validators = computed(() => {
      console.log('p', props);
      return props.step.transactions[0].data.rewards;
    });
    const fee = computed(() => {
      return Object.values(Object.values(props.fees)[0]);
    });

    // const denomName = ref('-');

    // const gasPriceLevel = computed(() => store.getters['demeris/getPreferredGasPriceLevel']);

    // const currentStep = computed(() => {
    //   return props.response || props.step;
    // });
    // const displayFrom = ref('-');
    // const displayTo = ref('-');
    // const stepType = computed(() => {
    //   const description = currentStep.value.description;
    //   const descriptionKeyMap = {
    //     'Assets Must be transferred to hub first': 'transfer-to-hub',
    //     'AssetA must be transferred to hub': 'transfer-to-hub',
    //     'AssetB must be transferred to hub': 'transfer-to-hub',
    //     'Assets Moved': 'move',
    //     'Assets Transferred': 'transfer',
    //   };

    //   return descriptionKeyMap[description] || 'transfer';
    // });

    // const hasMultipleTransactions = computed(() => {
    //   return currentStep.value.transactions.length > 1;
    // });
    // const includedFees = computed(() => {
    //   const included = [];
    //   const transactions = (props.step as Actions.Step).transactions;
    //   for (const tx of transactions) {
    //     if (tx.addFee) {
    //       included.push(tx.feeToAdd[0].denom);
    //     }
    //   }
    //   return included;
    // });
    // const transactionInfo = computed(() => {
    //   const transactions = currentStep.value.transactions;
    //   const firstTransaction = transactions[0] as Record<string, any>;
    //   const [lastTransaction] = (transactions.length > 1 ? transactions.slice(-1) : transactions) as Record<
    //     string,
    //     any
    //   >[];

    //   const isIBC = ['ibc_forward', 'ibc_backward'].includes(firstTransaction.name);
    //   let fromAmount = firstTransaction.data.amount.amount;
    //   if (firstTransaction.addFee) {
    //     fromAmount = (
    //       parseInt(fromAmount) +
    //       parseFloat(firstTransaction.feeToAdd[0].amount[gasPriceLevel.value]) * store.getters['demeris/getGasLimit']
    //     ).toString();
    //   }
    //   const from = {
    //     address: '',
    //     amount: fromAmount,
    //     chain: firstTransaction.data.from_chain || firstTransaction.data.chain_name,
    //     denom: (firstTransaction.data.amount as Base.Amount).denom,
    //   };

    //   const to = {
    //     amount: firstTransaction.data.amount.amount,
    //     address: lastTransaction.data.to_address,
    //     chain:
    //       lastTransaction.data.to_chain ||
    //       lastTransaction.data.destination_chain_name ||
    //       lastTransaction.data.chain_name,
    //     denom: (lastTransaction.data.amount as Base.Amount).denom,
    //   };

    //   //from.address = store.getters['demeris/getOwnAddress']({ chain_name: from.chain });

    //   return {
    //     isIBC,
    //     from,
    //     to,
    //   };
    // });

    // const formatMultipleChannel = (transaction: Actions.TransferData) => {
    //   const getName = (name: string) => store.getters['demeris/getDisplayChain']({ name });
    //   // @ts-ignore
    //   return `Fee ${getName(transaction.data.from_chain)} -> ${getName(transaction.data.to_chain)}`;
    // };

    // const formatChain = (name: string) => {
    //   return 'Fees on ' + store.getters['demeris/getDisplayChain']({ name });
    // };

    // const truncateAddress = (address: string) => {
    //   return `${address.substring(0, address.indexOf('1') + 6)}…${address.substring(
    //     address.length - 3,
    //     address.length,
    //   )}`;
    // };

    // watch(
    //   transactionInfo,
    //   async (detail) => {
    //     if (!detail.from.address) {
    //       displayFrom.value = await getOwnAddress({ chain_name: detail.from.chain });
    //     }
    //     if (detail.to.chain && detail.to.address) {
    //       displayTo.value = detail.to.address;
    //     }
    //     if (detail.to.chain && !detail.to.address) {
    //       displayTo.value = await getOwnAddress({ chain_name: detail.to.chain });
    //     }
    //     if (detail.isIBC) {
    //       denomName.value = await getBaseDenom(detail.from.denom, detail.from.chain);
    //     } else {
    //       denomName.value = detail.from.denom;
    //     }
    //   },
    //   { immediate: true },
    // );

    return {
      // denomName,
      // stepType,
      // currentStep,
      // formatChain,
      // truncateAddress,
      // transactionInfo,
      // hasMultipleTransactions,
      // formatMultipleChannel,
      // includedFees,
      // displayFrom,
      // displayTo,
      //
      rewardsDenom,
      rewardsAmount,
      validators,
      fee,
    };
  },
});
</script>

<style lang="scss" scoped></style>
