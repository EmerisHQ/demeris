<template>
  <List>
    <!-- Pay/Receive -->
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

    <!-- Price  -->
    <ListItem :label="$t('components.previews.swap.priceLbl')" direction="column">
      <!-- minReceivedAmount -->
      <ListItem
        :description="$t('components.previews.swap.minReceivedLbl')"
        :hint="$t('components.previews.swap.minReceivedLblHint')"
        inset
      >
        <AmountDisplay class="s-minus" :amount="minReceivedAmount" />
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

    <!-- Fee -->
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
import useCalculation from '@/composables/useCalculation.vue';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import * as Actions from '@/types/actions';
import * as Base from '@/types/base';
import { getBaseDenom } from '@/utils/actionHandler';
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
    const { poolPriceById, reserveBalancesById, getReserveBaseDenoms, poolById } = usePools();
    const { getSwapPrice, getPrecision } = useCalculation();

    //tx data
    const data = computed(() => {
      return (props.step as Actions.Step).transactions[0].data as Actions.SwapData;
    });

    //for receive coin chain_name(always cosmos hub)
    const dexChainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    //swap price
    const minReceivedAmount = ref({});
    watch(
      () => {
        ((props.step as Actions.Step).transactions[0].data as Actions.SwapData).pool.id;
      },
      async () => {
        const id = ((props.step as Actions.Step).transactions[0].data as Actions.SwapData).pool.id;
        const pool = poolById(id);
        const reserveDenoms = await getReserveBaseDenoms(pool);
        const reserveBalances = await reserveBalancesById(id);
        const toCoinBaseDenom = await getBaseDenom(data.value.to.denom as string, dexChainName.value);
        const swapFeeRate =
          1 - (store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate ?? 0.003 / 2);
        let swapPrice = null;

        if (reserveDenoms[1] === toCoinBaseDenom) {
          swapPrice = getSwapPrice(
            parseInt(data.value.from.amount),
            reserveBalances.balanceA,
            reserveBalances.balanceB,
          );
        } else {
          //reverse
          swapPrice = getSwapPrice(
            parseInt(data.value.from.amount),
            reserveBalances.balanceB,
            reserveBalances.balanceA,
          );
        }

        minReceivedAmount.value = {
          denom: toCoinBaseDenom,
          amount:
            (1 / Number(swapPrice)) *
            Number(data.value.from.amount) *
            Number((1 - (1 - swapFeeRate) / 2).toFixed(4)) ** 2 *
            (1 - slippageTolerance.value / 100) *
            10 ** getPrecision(toCoinBaseDenom),
        };
      },
      { immediate: true },
    );

    //user slippage tolerance
    const slippageTolerance = computed(() => {
      return store.getters['demeris/getSlippagePerc'] || 0.5;
    });
    console.log('slippageTolerance', slippageTolerance.value);

    //limit price
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

    //fee todo
    // const gasPrice = computed(() => {
    //   return store.getters['demeris/getPreferredGasPriceLevel'];
    // });
    // console.log('gasPrice', gasPrice.value);

    //for pay coin image(chain_name ring style)
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
          payCoinChainName.value = verifyTrace.trace[0].chain_name;
        }
      },
      { immediate: true },
    );

    return {
      data,
      dexChainName,
      payCoinChainName,
      limitPrice,
      minReceivedAmount,
      // gasPrice,
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
