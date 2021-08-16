<template>
  <List>
    <!-- Pay/Receive -->
    <div class="space-y-2 pt-2 pb-6">
      <ListItem
        :size="size"
        first-cell-class="flex-shrink"
        second-cell-class="flex-grow"
        inset
        :label="$t('components.previews.swap.payLbl')"
      >
        <div class="flex justify-end">
          <div>
            <AmountDisplay
              class="font-medium"
              :class="context === 'widget' ? 'text-0' : 'text-1'"
              :amount="data.from"
            />
            <sub class="block text-muted -text-1 bottom-0" :class="{ 'mt-0.5': context !== 'widget' }">
              <ChainName :name="payCoinChainName" />
            </sub>
          </div>
          <CircleSymbol :denom="data.from.denom" :chain-name="payCoinChainName" class="ml-2" size="sm" />
        </div>
      </ListItem>
      <ListItem
        :size="size"
        first-cell-class="flex-shrink"
        second-cell-class="flex-grow"
        inset
        :label="$t('components.previews.swap.receiveLbl')"
        :description="$t('components.previews.swap.receiveLblHint')"
      >
        <div class="flex justify-end">
          <div>
            <AmountDisplay class="font-medium" :class="context === 'widget' ? 'text-0' : 'text-1'" :amount="data.to" />
            <sub class="block text-muted -text-1" :class="{ 'mt-0.5': context !== 'widget' }">
              <ChainName :name="dexChainName" />
            </sub>
          </div>
          <CircleSymbol :denom="data.to.denom" :chain-name="dexChainName" class="ml-2" size="sm" />
        </div>
      </ListItem>
    </div>

    <!-- Price  -->
    <ListItem :size="size" :label="$t('components.previews.swap.priceLbl')" direction="col">
      <!-- minReceivedAmount -->
      <ListItem
        :size="size"
        :description="$t('components.previews.swap.minReceivedLbl')"
        :hint="$t('components.previews.swap.minReceivedLblHint')"
        inset
      >
        <AmountDisplay :amount="minReceivedAmount" />
      </ListItem>

      <!-- limit price -->
      <ListItem
        :size="size"
        :description="$t('components.previews.swap.limitPriceLbl')"
        :hint="$t('components.previews.swap.limitPriceLblHint')"
        inset
      >
        <AmountDisplay
          :amount="{
            amount:
              10 **
              store.getters['demeris/getDenomPrecision']({
                name: fromCoinBaseDenom,
              }),
            denom: data.from.denom,
          }"
        />
        =
        <AmountDisplay :amount="{ amount: limitPrice, denom: data.to.denom }" />
      </ListItem>
    </ListItem>

    <!-- Fee -->
    <ListItem :size="size" :label="$t('components.previews.swap.feesLbl')" direction="col">
      <!-- tx fee -->
      <ListItem
        :size="size"
        :description="$t('components.previews.swap.feeLbl')"
        :hint="$t('components.previews.swap.feeLblHint')"
        inset
      >
        <AmountDisplay :amount="{ amount: fee, denom: 'uatom' }" />
      </ListItem>

      <!-- swap fee -->
      <ListItem
        :size="size"
        :description="$t('components.previews.swap.swapFeeLbl')"
        :hint="$t('components.previews.swap.swapFeeLblHint')"
        inset
      >
        <ul>
          <li>
            <AmountDisplay
              :amount="{ amount: ((10000 - swapFeeRate * 10000) / 10000) * data.from.amount, denom: data.from.denom }"
            />
          </li>
          <li class="mt-0.5">
            <AmountDisplay
              :amount="{ amount: ((10000 - swapFeeRate * 10000) / 10000) * data.to.amount, denom: data.to.denom }"
            />
          </li>
        </ul>
      </ListItem>
    </ListItem>
  </List>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import { List, ListItem } from '@/components/ui/List';
import useCalculation from '@/composables/useCalculation';
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
    context: {
      type: String as PropType<'default' | 'widget'>,
      default: 'default',
    },
  },

  setup(props) {
    const store = useStore();
    const { reserveBalancesById, getReserveBaseDenoms, poolById } = usePools();
    const { getSwapPrice } = useCalculation();
    const swapFeeRate = computed(() => {
      const feeRate =
        1 - (parseFloat(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate) ?? 0.003 / 2);
      return Number((1 - (1 - feeRate) / 2).toFixed(4));
    });
    //tx data
    const data = computed(() => {
      return (props.step as Actions.Step).transactions[0].data as Actions.SwapData;
    });

    //for receive coin chain_name(always cosmos hub)
    const dexChainName = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    // minReceivedAmount & limit price
    const minReceivedAmount = ref({});
    const limitPrice = ref(0);
    const fromCoinBaseDenom = ref('');
    const toCoinBaseDenom = ref('');
    watch(
      () => {
        ((props.step as Actions.Step).transactions[0].data as Actions.SwapData).pool.id;
      },
      async () => {
        const id = ((props.step as Actions.Step).transactions[0].data as Actions.SwapData).pool.id;
        const pool = poolById(id);
        const reserveDenoms = await getReserveBaseDenoms(pool);
        const reserveBalances = await reserveBalancesById(id);
        toCoinBaseDenom.value = await getBaseDenom(data.value.to.denom as string, dexChainName.value);
        fromCoinBaseDenom.value = await getBaseDenom(data.value.from.denom as string, dexChainName.value);
        let swapPrice = null;

        if (reserveDenoms[1] === toCoinBaseDenom.value) {
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

        const fromPrecision = store.getters['demeris/getDenomPrecision']({
          name: fromCoinBaseDenom.value,
        });
        const toPrecision = store.getters['demeris/getDenomPrecision']({
          name: toCoinBaseDenom.value,
        });
        const precisionDiff = fromPrecision - toPrecision < 0 ? Math.abs(fromPrecision - toPrecision) : 0;

        minReceivedAmount.value = {
          denom: toCoinBaseDenom.value,
          amount:
            (1 / Number(swapPrice)) *
            Number(data.value.from.amount) *
            swapFeeRate.value ** 2 *
            (1 - slippageTolerance.value / 100) *
            10 ** (toPrecision - precisionDiff),
        };

        limitPrice.value =
          Math.trunc(
            ((1 / Number(swapPrice)) *
              Number(
                10 **
                  store.getters['demeris/getDenomPrecision']({
                    name: fromCoinBaseDenom.value,
                  }),
              ) *
              swapFeeRate.value ** 2 *
              (1 - slippageTolerance.value / 100) *
              10 ** (toPrecision - precisionDiff)) /
              10000,
          ) * 10000;
      },
      { immediate: true },
    );

    //user slippage tolerance
    const slippageTolerance = computed(() => {
      return store.getters['demeris/getSlippagePerc'] || 0.5;
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
          payCoinChainName.value = verifyTrace.trace[0].chain_name;
        }
      },
      { immediate: true },
    );

    // tx fee
    const fee = computed(() => {
      return props.fees[store.getters['demeris/getDexChain']]['uatom'];
    });

    const size = props.context === 'default' ? 'md' : 'sm';

    return {
      data,
      dexChainName,
      payCoinChainName,
      limitPrice,
      minReceivedAmount,
      toCoinBaseDenom,
      fromCoinBaseDenom,
      store,
      swapFeeRate,
      fee,
      size,
    };
  },
});
</script>
<style lang="scss" scoped></style>
