<template>
  <div>
    <DenomSelectModal
      v-if="state.isSelectModalOpen"
      class="fixed inset-0 z-30 bg-bg"
      title="Select asset"
      :assets="availableBalances"
      :func="() => toggleSelectModal()"
      @select="toggleSelectModal"
    />

    <fieldset class="py-8">
      <div class="w-full max-w-lg mx-auto">
        <div class="relative text-4 font-bold px-20 w-full text-center transition-colors">
          <div v-if="hasPrice" class="flex items-center absolute inset-y-0 left-0">
            <Button
              :click-function="
                () => {
                  state.isUSDInputChecked = !state.isUSDInputChecked;
                }
              "
              size="sm"
              variant="secondary"
              rounded
              :tooltip-text="$t('components.sendForm.tooltip', { type: state.isUSDInputChecked ? 'crypto' : 'USD' })"
            >
              <Icon
                name="SwapUDIcon"
                :icon-size="1"
                :class="['transform transition', { 'rotate-180': state.isUSDInputChecked }]"
              />
            </Button>
          </div>
          <FlexibleAmountInput
            v-show="state.isUSDInputChecked"
            v-model="state.usdValue"
            :min-width="state.isUSDInputChecked ? 35 : 0"
            prefix="$"
          >
            <template #default="inputProps">
              <USDInput
                :model-value="form.balance.amount ? form.balance.amount : 0"
                :denom="state.currentAsset?.base_denom || ''"
                :class="[inputProps.class]"
                :style="inputProps.style"
                placeholder="0"
                @update:price="state.usdValue = $event"
                @update:modelValue="
                  ($event) => {
                    state.isMaximumAmountChecked = false;
                    if (state.isUSDInputChecked) {
                      form.balance.amount = $event;
                    }
                  }
                "
              />
            </template>
          </FlexibleAmountInput>
          <FlexibleAmountInput
            v-show="!state.isUSDInputChecked"
            v-model="form.balance.amount"
            :min-width="!state.isUSDInputChecked ? 35 : 0"
            :suffix="state.assetTicker"
            placeholder="0"
            class="uppercase"
            @input="state.isMaximumAmountChecked = false"
          />
          <div class="flex items-center absolute inset-y-0 right-0">
            <Button
              :name="$t('generic_cta.max')"
              class="flex"
              :class="{ 'text-negative-text': !hasSufficientFunds }"
              size="sm"
              variant="secondary"
              rounded
              @click="state.isMaximumAmountChecked = true"
            />
          </div>
        </div>
        <div class="text-muted mt-3 text-center">
          <AmountDisplay
            v-if="state.isUSDInputChecked"
            :amount="{
              amount: form.balance.amount ? form.balance.amount * denomDecimals + '' : '0',
              denom: state.currentAsset?.base_denom,
            }"
          />
          <div v-else-if="!state.isUSDInputChecked && hasPrice" class="text-muted mt-3 text-center">
            <CurrencyDisplay :value="state.usdValue" />
          </div>
        </div>
      </div>
    </fieldset>

    <button
      v-if="state.currentAsset"
      class="bg-surface shadow-button rounded-xl overflow-hidden py-4 pl-5 pr-3 flex justify-between w-full max-w-md mx-auto outline-none text-left group focus:outline-none active:opacity-70 active:transform-none transform hover:-translate-y-px focus:-translate-y-px transition"
      @click="toggleSelectModal()"
    >
      <div class="flex items-center flex-1">
        <CircleSymbol
          :chain-name="state.currentAsset.on_chain"
          :denom="state.currentAsset.base_denom"
          class="relative mr-4"
        />
        <div class="grow">
          <p class="font-medium">
            <Denom :name="state.currentAsset.base_denom" />
          </p>
          <p class="-text-1 text-muted mt-0.5">
            <ChainName :name="state.currentAsset.on_chain" />
          </p>
        </div>
      </div>

      <div class="text-right">
        <p>
          <Price
            :amount="{ amount: state.currentAsset.amount, denom: state.currentAsset.base_denom }"
            :auto-update="false"
            show-zero
          />
        </p>
        <p class="-text-1 mt-0.5 transition-colors" :class="hasSufficientFunds ? 'text-muted' : 'text-negative-text'">
          <span>
            <AmountDisplay :amount="{ amount: state.currentAsset.amount, denom: state.currentAsset.base_denom }" />
            {{ $t('components.sendForm.available') }}
          </span>
        </p>
      </div>
      <Icon
        name="CaretRightIcon"
        :icon-size="1"
        class="ml-2 px-1.5 self-stretch text-muted group-hover:text-text transition-colors"
      />
    </button>

    <fieldset class="w-full max-w-sm mx-auto mt-8">
      <div class="mb-2">
        <FeeLevelSelector v-if="steps.length > 0" :steps="steps" @update:fees="state.fees = $event" />
      </div>
      <Button
        :name="hasSufficientFunds ? $t('generic_cta.continue') : $t('generic_cta.noFunds')"
        :disabled="!isValid"
        :click-function="onSubmit"
      />
      <button
        v-if="state.currentAsset && !hasFunds"
        class="get-asset-cta mt-6 relative h-12 py-3 px-4 flex items-center w-full bg-surface shadow-button rounded-xl overflow-hidden outline-none text-left font-medium transition transform hover:-translate-y-px active:opacity-70 active:transform-none"
        @click="openAssetPage"
      >
        <span> {{ $t('generic_cta.get') }} <Denom :name="state.currentAsset?.base_denom" /> &rarr; </span>
        <div class="absolute right-4 -mt-4 transform -rotate-6">
          <CircleSymbol size="lg" :denom="state.currentAsset?.base_denom" />
        </div>
      </button>
    </fieldset>
  </div>
</template>

<script lang="ts">
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import { bech32 } from 'bech32';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash.orderby';
import { computed, defineComponent, inject, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Price from '@/components/common/Price.vue';
import USDInput from '@/components/common/USDInput.vue';
import Button from '@/components/ui/Button.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { GasPriceLevel, SendAddressForm, Step } from '@/types/actions';
import { getTicker } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'SendFormAmount',

  components: {
    AmountDisplay,
    ChainName,
    CircleSymbol,
    CurrencyDisplay,
    Denom,
    FeeLevelSelector,
    Button,
    Icon,
    DenomSelectModal,
    Price,
    USDInput,
    FlexibleAmountInput,
  },

  props: {
    balances: {
      type: Array as PropType<EmerisAPI.Balances>,
      required: true,
    },
    fees: {
      type: Object,
      default: undefined,
    },
    steps: {
      type: Array as PropType<Step[]>,
      default: () => [],
    },
  },

  emits: ['next'],

  setup(props, { emit }) {
    const typedstore = useStore() as RootStoreTyped;
    const router = useRouter();
    const form = inject<SendAddressForm>('transferForm');
    const { nativeBalances } = useAccount();
    const propsRef = toRefs(props);
    const availableBalances = computed(() => {
      if (propsRef.balances.value.length) {
        return propsRef.balances.value;
      }

      return nativeBalances.value;
    });

    const state = reactive({
      currentAsset: undefined,
      assetTicker: undefined,
      isMaximumAmountChecked: false,
      isUSDInputChecked: false,
      isSelectModalOpen: false,
      usdValue: '',
      gasPrice: undefined,
      fees: {},
    });

    const feesAmount = computed(() => {
      const result = {};
      if (state.fees) {
        for (const [, obj] of Object.entries(state.fees)) {
          for (const [denom, value] of Object.entries(obj)) {
            result[denom] = value;
          }
        }
      }

      return result;
    });

    const denomDecimals = computed(() => {
      if (state.currentAsset) {
        const precision = typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: state.currentAsset.base_denom,
        });

        return Math.pow(10, precision);
      } else {
        return 1;
      }
    });

    const hasFunds = computed(() => {
      if (!state.currentAsset) {
        return false;
      }

      const totalAmount = parseCoins(state.currentAsset.amount)[0].amount;

      return +totalAmount > 0;
    });

    const openAssetPage = () => {
      router.push({ name: 'Asset', params: { denom: state.currentAsset.base_denom } });
    };

    const hasPrice = computed(() => {
      if (!state.currentAsset) {
        return false;
      }

      const price = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: state.currentAsset.base_denom });

      return !!price;
    });

    const hasSufficientFunds = computed(() => {
      if (!state.currentAsset) {
        return true;
      }

      if (!hasFunds.value) {
        return false;
      }

      const precision =
        typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: state.currentAsset.base_denom }) || 6;
      const amount = new BigNumber(form.balance.amount || 0).shiftedBy(precision);
      const fee = feesAmount.value[state.currentAsset.base_denom] || 0;

      return amount.plus(fee).isLessThanOrEqualTo(parseCoins(state.currentAsset.amount)[0].amount);
    });

    const isValid = computed(() => {
      const value = new BigNumber(form.balance.amount);

      if (!value.isFinite() || value.isLessThanOrEqualTo(0)) {
        return false;
      }

      if (!hasSufficientFunds.value) {
        return false;
      }

      if (!form.chain_name) {
        return false;
      }

      return true;
    });

    const onSubmit = () => {
      if (!isValid.value) {
        return;
      }

      emit('next');
    };

    const setCurrentAsset = async (asset: Record<string, unknown>) => {
      state.currentAsset = asset;

      if (asset) {
        form.balance.denom = parseCoins(asset.amount as string)[0].denom;
        form.chain_name = asset.on_chain as string;
        state.assetTicker = await getTicker(asset.base_denom, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
      }
    };

    const toggleSelectModal = (asset?: Record<string, unknown>) => {
      if (asset) {
        setCurrentAsset(asset);
      }
      state.isSelectModalOpen = !state.isSelectModalOpen;
    };

    const findDefaultAsset = () => {
      const sortedBalances = [...availableBalances.value].sort((a, b) =>
        +parseCoins(b.amount)[0].amount > +parseCoins(a.amount)[0].amount ? 1 : -1,
      );

      const chains: EmerisAPI.Chain[] = Object.values(typedstore.getters[GlobalGetterTypes.API.getChains]);

      try {
        const prefix = bech32.decode(form.recipient).prefix;
        const chain = chains.find((item) => item.node_info.bech32_config.prefix_account === prefix);

        if (!chain) {
          setCurrentAsset(sortedBalances[0]);
          return;
        }

        const availableAssets = [];
        const sortedDenoms = orderBy(chain.denoms, (item) => (item.name.startsWith('pool') ? 1 : -1));
        for (const nativeDenom of sortedDenoms) {
          let asset = sortedBalances.find(
            (item) => item.on_chain === chain.chain_name && item.base_denom === nativeDenom.name,
          );
          // Find native denom from current chain in another
          if (!asset) {
            asset = sortedBalances.find((item) => item.base_denom === nativeDenom.name);
          }
          if (asset) {
            availableAssets.push(asset);
          }
        }

        if (!availableAssets.length) {
          setCurrentAsset(sortedBalances[0]);
          return;
        }

        setCurrentAsset(availableAssets[0]);
      } catch (e) {
        setCurrentAsset(sortedBalances[0]);
      }
    };

    onMounted(() => {
      state.gasPrice = typedstore.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel] || GasPriceLevel.AVERAGE;
    });

    // TODO: Select chain based in user option
    watch(
      () => [state.isMaximumAmountChecked, state.currentAsset, state.fees],
      () => {
        if (state.isMaximumAmountChecked) {
          const precision =
            typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: state.currentAsset.base_denom }) || 6;
          const assetAmount = new BigNumber(parseCoins(state.currentAsset.amount)[0].amount);
          const fee = feesAmount.value[state.currentAsset.base_denom] || 0;
          form.balance.amount = assetAmount.minus(fee).shiftedBy(-precision).decimalPlaces(precision).toString();
          return;
        }
      },
    );

    // Select defaut asset based in address prefix
    if (!state.currentAsset) {
      findDefaultAsset();
    }

    return {
      hasFunds,
      availableBalances,
      state,
      form,
      hasPrice,
      hasSufficientFunds,
      denomDecimals,
      isValid,
      openAssetPage,
      onSubmit,
      setCurrentAsset,
      toggleSelectModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.shadow-card {
  &:hover:not(:active),
  &:focus:not(:active) {
    --tw-shadow: 4px 11px 35px -4px rgba(0, 0, 0, 0.12);
  }
}
.get-asset-cta {
  background-image: url('@/assets/images/gold-rings-2.png');
  background-position: 121% 70%;
  background-repeat: no-repeat;
  background-size: 52%;
}
</style>
