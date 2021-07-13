<template>
  <List>
    <ListItem>
      <ListItem :label="$t('components.previews.swap.payLbl')">
        <div>
          <AmountDisplay class="w-bold" :amount="data.from" />
        </div>
        <sub><ChainName :name="chainName" /></sub>
      </ListItem>
      <ListItem
        :label="$t('components.previews.swap.receiveLbl')"
        :description="$t('components.previews.swap.receiveLblHint')"
      >
        <div>
          <AmountDisplay
            class="w-bold"
            :amount="{ amount: '' + parseFloat(data.from.amount) * limitPrice, denom: data.to.denom }"
          />
        </div>
        <sub><ChainName :name="chainName" /></sub>
      </ListItem>
    </ListItem>

    <ListItem :label="$t('components.previews.swap.priceLbl')" direction="column">
      <ListItem
        :description="$t('components.previews.swap.minReceivedLbl')"
        :hint="$t('components.previews.swap.minReceivedLblHint')"
        inset
      >
        <!-- TODO: Slippage -->
        <AmountDisplay class="s-minus" :amount="data.to" />
      </ListItem>

      <ListItem
        :description="$t('components.previews.swap.limitPriceLbl')"
        :hint="$t('components.previews.swap.limitPriceLblHint')"
        inset
      >
        <span class="s-minus">
          <AmountDisplay class="s-minus" :amount="{ amount: limitPrice, denom: data.to.amount.denom }" /> =
          <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: data.from.amount.denom }" />
        </span>
      </ListItem>
    </ListItem>

    <ListItem :label="$t('components.previews.swap.feesLbl')" direction="column">
      <ListItem
        :description="$t('components.previews.swap.feeLbl')"
        :hint="$t('components.previews.swap.feeLblHint')"
        inset
      >
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uatom' }" />
      </ListItem>

      <ListItem
        :description="$t('components.previews.swap.swapFeeLbl')"
        :hint="$t('components.previews.swap.swapFeeLblHint')"
        inset
      >
        <AmountDisplay class="s-minus" :amount="{ amount: 1, denom: 'uatom' }" />
      </ListItem>
    </ListItem>
  </List>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import { List, ListItem } from '@/components/ui/List';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';

export default defineComponent({
  name: 'PreviewSwap',

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
      type: Object as PropType<Record<string, Base.Amount>>,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const { poolPriceById } = usePools();
    const limitPrice = ref(1);

    onMounted(async () => {
      limitPrice.value = await poolPriceById(
        ((props.step as Actions.Step).transactions[0].data as Actions.SwapData).pool.id,
      );
    });
    watch(
      () => ((props.step as Actions.Step).transactions[0].data as Actions.SwapData).pool.id,
      async (newId) => {
        limitPrice.value = await poolPriceById(newId);
      },
    );
    const chainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });
    const data = computed(() => {
      return (props.step as Actions.Step).transactions[0].data as Actions.SwapData;
    });
    return {
      chainName,
      data,
      limitPrice,
    };
  },
});
</script>
