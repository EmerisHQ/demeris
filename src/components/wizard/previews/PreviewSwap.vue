<template>
  <List>
    <ListItem direction="column">
      <ListItem :label="$t('components.previews.swap.payLbl')">
        <div class="coin-info">
          <CircleSymbol :denom="data.from.denom" :chain-name="payCoinChainName" class="coin-info__image" :size="'xs'" />
          <AmountDisplay class="w-bold" :amount="data.from" />
        </div>
        <sub class="chain-name"><ChainName :name="payCoinChainName" /></sub>
      </ListItem>
      <ListItem
        :label="$t('components.previews.swap.receiveLbl')"
        :description="$t('components.previews.swap.receiveLblHint')"
      >
        <div class="coin-info">
          <CircleSymbol :denom="data.to.denom" :chain-name="dexChainName" class="coin-info__image" :size="'xs'" />
          <AmountDisplay class="w-bold" :amount="data.to" />
        </div>
        <sub class="chain-name"><ChainName :name="dexChainName" /></sub>
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
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { List, ListItem } from '@/components/ui/List';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';
import { isNative } from '@/utils/basic';
export default defineComponent({
  name: 'PreviewSwap',

  components: {
    AmountDisplay,
    ChainName,
    List,
    ListItem,
    CircleSymbol,
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
    const dexChainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });
    const data = computed(() => {
      return (props.step as Actions.Step).transactions[0].data as Actions.SwapData;
    });
    const payCoinChainName = ref('');
    watch(
      () => data.value.from.denom,
      async () => {
        if (isNative(data.value.from.denom)) {
          payCoinChainName.value = store.getters['demeris/getDexChain'];
        } else {
          const verifyTrace =
            store.getters['demeris/getVerifyTrace']({
              chain_name: store.getters['demeris/getDexChain'],
              hash: data.value.from.denom.split('/')[1],
            }) ??
            (await store.dispatch(
              GlobalDemerisActionTypes.GET_VERIFY_TRACE,
              {
                subscribe: false,
                params: {
                  chain_name: store.getters['demeris/getDexChain'],
                  hash: data.value.from.denom.split('/')[1],
                },
              },
              { root: true },
            ));
          console.log('TEST', verifyTrace);
          payCoinChainName.value = verifyTrace.trace[0].chain_name;
        }
      },
      { immediate: true },
    );

    return {
      dexChainName,
      data,
      limitPrice,
      payCoinChainName,
    };
  },
});
</script>
<style lang="scss" scoped>
.coin-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  &__image {
    margin-right: 0.8rem;
  }
}

.chain-name {
  color: var(--muted);
}
</style>
