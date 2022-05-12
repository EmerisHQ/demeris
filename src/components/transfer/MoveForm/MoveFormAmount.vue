<template>
  <div>
    <DenomSelectModal
      v-if="state.isDenomModalOpen"
      class="fixed inset-0 z-30 bg-bg"
      :title="$t('components.moveForm.selectAsset')"
      :assets="availableBalances"
      :func="() => toggleDenomModal()"
      @select="toggleDenomModal"
    />

    <ChainSelectModal
      v-if="state.isChainsModalOpen"
      class="fixed inset-0 z-30 bg-bg"
      :title="$t('components.moveForm.selectChain')"
      :show-subtitle="false"
      :assets="availableChains"
      :selected-denom="state.currentAsset.base_denom"
      :func="() => toggleChainsModal()"
      @select="toggleChainsModal"
    >
      <template #description>
        {{ $t('components.moveForm.selectChainToSwap') }} {{ state.chainsModalSource === 'to' ? 'to' : 'from' }}.
      </template>
    </ChainSelectModal>
    <template v-if="true">
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
                :tooltip-text="$t('components.moveForm.tooltip', { type: state.isUSDInputChecked ? 'crypto' : 'USD' })"
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
                  :model-value="form.balance.amount ? form.balance.amount : '0'"
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
              placeholder="0"
              :suffix="state.assetTicker"
              class="uppercase"
              @input="state.isMaximumAmountChecked = false"
            />
            <div class="flex items-center absolute inset-y-0 right-0">
              <Button
                :click-function="
                  () => {
                    state.isMaximumAmountChecked = true;
                  }
                "
                :name="$t('generic_cta.max')"
                class="flex"
                :class="{ 'text-negative-text': !hasSufficientFunds }"
                size="sm"
                variant="secondary"
                rounded
              />
            </div>
          </div>
          <div class="text-muted mt-3 text-center">
            <AmountDisplay
              v-if="state.isUSDInputChecked"
              :amount="{
                amount: form.balance.amount
                  ? `${new BigNumber(parseCoins(form.balance.amount)[0].amount).multipliedBy(denomDecimals)}`
                  : '0',
                denom: state.currentAsset?.base_denom,
              }"
            />
            <div v-else-if="hasPrice" class="text-muted mt-3 text-center">
              <CurrencyDisplay :value="state.usdValue" />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset class="bg-surface shadow-card rounded-xl overflow-hidden divide-y divide-border">
        <button
          class="py-5 px-4 flex items-stretch w-full outline-none text-left group active:opacity-70 transition-opacity"
          @click="toggleDenomModal()"
        >
          <span class="mr-2.5 w-10 self-center text-muted text-left group-hover:text-text transition-colors -text-1">{{
            $t('components.moveForm.action')
          }}</span>

          <div class="flex items-center flex-1">
            <CircleSymbol
              :chain-name="state.currentAsset ? form.on_chain : undefined"
              :denom="form.balance.denom"
              class="mr-3"
            />
            <span class="font-medium">
              <Denom
                v-if="state.currentAsset"
                :name="state.currentAsset?.base_denom || form.balance.denom || 'Select asset'"
              />
              <template v-else>{{ $t('components.moveForm.selectAsset') }}</template>
            </span>
          </div>

          <Icon
            name="CaretRightIcon"
            :icon-size="1"
            class="ml-1.5 px-1.5 self-stretch text-muted group-hover:text-text transition-colors"
          />
        </button>

        <button
          v-if="state.currentAsset"
          class="py-5 px-4 flex items-stretch w-full outline-none text-left group active:opacity-70 transition-opacity"
          @click="toggleChainsModal(null, 'from')"
        >
          <span class="mr-2.5 w-10 self-center text-muted text-left group-hover:text-text transition-colors -text-1">{{
            $t('components.moveForm.from')
          }}</span>

          <div class="flex items-center flex-1">
            <CircleSymbol variant="chain" :chain-name="form.on_chain" class="mr-3" />
            <span class="font-medium">
              <ChainName :name="form.on_chain" />
            </span>
          </div>

          <div class="text-right flex flex-col justify-between">
            <p>
              <Price
                :amount="{ amount: state.currentAsset?.amount || 0, denom: state.currentAsset?.base_denom }"
                :auto-update="false"
                show-zero
              />
            </p>
            <p class="-text-1 mt-0.5" :class="hasSufficientFunds ? 'text-muted' : 'text-negative-text'">
              <AmountDisplay
                :amount="{ amount: state.currentAsset?.amount || 0, denom: state.currentAsset?.base_denom }"
              />
            </p>
          </div>

          <div class="ml-1.5 px-1.5 flex items-center text-muted group-hover:text-text transition-colors">
            <Icon name="CaretRightIcon" :icon-size="1" />
          </div>
        </button>

        <button
          class="py-5 px-4 flex items-stretch w-full outline-none text-left group active:opacity-70 transition-opacity"
          :class="{ 'chain-selected': !!form.to_chain }"
          :disabled="!state.currentAsset"
          @click="toggleChainsModal(null, 'to')"
        >
          <span class="mr-2.5 w-10 self-center text-muted text-left group-hover:text-text transition-colors -text-1">{{
            $t('components.moveForm.to')
          }}</span>

          <div class="flex items-center flex-1">
            <CircleSymbol variant="chain" :chain-name="form.to_chain" class="mr-3" />
            <span class="font-medium">
              <ChainName v-if="form.to_chain" :name="form.to_chain" />
              <span v-else>{{ $t('components.moveForm.selectChain') }}</span>
            </span>
          </div>

          <div class="ml-1.5 px-1.5 flex items-center text-muted group-hover:text-text transition-colors">
            <Icon name="CaretRightIcon" :icon-size="1" />
          </div>
        </button>
      </fieldset>

      <div class="w-full max-w-sm mx-auto mt-8">
        <div class="mb-2">
          <FeeLevelSelector v-if="steps.length > 0" :steps="steps" @update:fees="state.fees = $event" />
        </div>
        <Button
          :name="hasSufficientFunds ? $t('generic_cta.continue') : $t('generic_cta.noFunds')"
          :disabled="!isValid"
          :click-function="onSubmit"
        />
        <button
          v-if="state.currentAsset && hasPrice && !hasFunds"
          class="get-asset-cta mt-6 relative h-12 py-3 px-4 flex items-center w-full bg-surface shadow-button rounded-xl overflow-hidden outline-none text-left font-medium transition transform hover:-translate-y-px active:opacity-70 active:transform-none"
          @click="openAssetPage"
        >
          <span> {{ $t('generic_cta.get') }} <Denom :name="state.currentAsset?.base_denom" /> &rarr; </span>
          <div class="absolute right-4 -mt-4 transform -rotate-6">
            <CircleSymbol size="lg" :denom="state.currentAsset?.base_denom" />
          </div>
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, inject, onMounted, PropType, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
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
import { GasPriceLevel, MoveAssetsForm, Step } from '@/types/actions';
import { getTicker } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

const props = defineProps({
  balances: {
    type: Array as PropType<EmerisAPI.Balances>,
    required: true,
  },
  steps: {
    type: Array as PropType<Step[]>,
    default: () => [],
  },
});

const emit = defineEmits(['next']);
const store = useStore() as RootStoreTyped;
const form = inject<MoveAssetsForm>('moveForm');
const router = useRouter();

const { nativeBalances, orderBalancesByPrice } = useAccount();

const state = reactive({
  currentAsset: undefined,
  assetTicker: undefined,
  isMaximumAmountChecked: false,
  isUSDInputChecked: false,
  isDenomModalOpen: false,
  isChainsModalOpen: false,
  chainsModalSource: 'from',
  usdValue: '',
  fees: {},
  gasPrice: '',
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

const hasPrice = computed(() => {
  if (!state.currentAsset) {
    return false;
  }

  const price = store.getters[GlobalGetterTypes.API.getPrice]({ denom: state.currentAsset.base_denom });

  return !!price;
});

const denomDecimals = computed(() => {
  if (state.currentAsset) {
    const precision = store.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: state.currentAsset.base_denom,
    });

    return Math.pow(10, precision);
  } else {
    return 1;
  }
});

const availableBalances = computed(() => {
  if (props.balances.length) {
    return props.balances;
  }

  return nativeBalances.value;
});

const availableChains = computed(() => {
  const chains = store.getters[GlobalGetterTypes.API.getChains];
  let results = [];

  if (state.chainsModalSource === 'to') {
    results = Object.values(chains)
      .map((item) => {
        const balance = props.balances.find(
          (balance) => balance.on_chain === item.chain_name && balance.base_denom === state.currentAsset.base_denom,
        );

        return {
          amount: balance?.amount || '0' + state.currentAsset.base_denom,
          base_denom: state.currentAsset.base_denom,
          on_chain: item.chain_name,
        };
      })
      .filter((item) => item.on_chain !== state.currentAsset?.on_chain);
  } else {
    if (props.balances.length) {
      results = props.balances;
    } else {
      const dexChain = store.getters[GlobalGetterTypes.API.getDexChain];
      results = [
        {
          amount: '0' + state.currentAsset.base_denom,
          base_denom: state.currentAsset.base_denom,
          on_chain: dexChain,
        },
      ];
    }
  }

  results.sort((a, b) => {
    const coinA = parseCoins(a.amount)[0];
    const coinB = parseCoins(b.amount)[0];
    return +coinB.amount - +coinA.amount;
  });

  return results;
});

const hasFunds = computed(() => {
  if (!state.currentAsset) {
    return false;
  }

  const totalAmount = new BigNumber(parseCoins(state.currentAsset.amount)[0].amount);

  return totalAmount.isGreaterThan(new BigNumber(0));
});

const hasSufficientFunds = computed(() => {
  if (!state.currentAsset) {
    return true;
  }

  if (!hasFunds.value) {
    return false;
  }

  const precision =
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: state.currentAsset.base_denom }) || 6;
  const amount = new BigNumber(form.balance.amount || 0).shiftedBy(precision);
  const fee = feesAmount.value[state.currentAsset.base_denom] || 0;

  return amount.plus(fee).isLessThanOrEqualTo(new BigNumber(parseCoins(state.currentAsset.amount)[0].amount));
});

const isValid = computed(() => {
  const value = new BigNumber(form.balance.amount);

  if (!value.isFinite() || value.isLessThanOrEqualTo(0)) {
    return false;
  }

  if (!hasSufficientFunds.value) {
    return false;
  }

  if (!form.to_chain || !form.to_chain || form.to_chain === form.on_chain) {
    return false;
  }

  return true;
});

const toggleDenomModal = (asset?: Record<string, unknown>) => {
  if (asset) {
    setCurrentAsset(asset);
  }
  state.isDenomModalOpen = !state.isDenomModalOpen;
};

const toggleChainsModal = (asset?: Record<string, unknown>, source = state.chainsModalSource) => {
  if (asset) {
    if (state.chainsModalSource === 'to') {
      form.to_chain = asset.on_chain as string;
    } else {
      setCurrentAsset(asset);
    }
  }

  state.chainsModalSource = source;
  state.isChainsModalOpen = !state.isChainsModalOpen;
};

const onSubmit = () => {
  emit('next');
};

const openAssetPage = () => {
  router.push({ name: 'Asset', params: { denom: state.currentAsset.base_denom } });
};

const findDefaultDestinationChain = () => {
  if (state.chainsModalSource === 'from') {
    const dexChain = store.getters[GlobalGetterTypes.API.getDexChain];
    const nativeChain = nativeBalances.value.find(
      (item) => item.base_denom === state.currentAsset?.base_denom,
    )?.on_chain;

    if (form.on_chain === nativeChain && nativeChain !== dexChain) {
      form.to_chain = dexChain;
    } else if (form.on_chain !== nativeChain) {
      form.to_chain = nativeChain;
    }
  }
};

const setCurrentAsset = async (asset: Record<string, unknown>) => {
  const dexChain = store.getters[GlobalGetterTypes.API.getDexChain];
  const targetChains = Object.values(store.getters[GlobalGetterTypes.API.getChains]).filter(
    (chain) => chain.chain_name !== dexChain,
  );

  state.currentAsset = { ...asset, amount: parseCoins(asset.amount as string)[0].amount };

  form.balance.denom = parseCoins(asset.amount as string)[0].denom;
  if (location.search) {
    form.on_chain = dexChain;
  } else {
    form.on_chain = asset.on_chain as string;
  }
  form.to_chain = asset.on_chain !== dexChain ? dexChain : targetChains[0].chain_name;

  findDefaultDestinationChain();
  state.assetTicker = await getTicker(asset.base_denom, dexChain);
};

onMounted(() => {
  state.gasPrice = store.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel] || GasPriceLevel.AVERAGE;
});

// TODO: Select chain based in user option
watch(
  () => [state.isMaximumAmountChecked, state.currentAsset, state.fees],
  () => {
    if (state.isMaximumAmountChecked) {
      const precision =
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: state.currentAsset.base_denom }) || 6;
      const assetAmount = new BigNumber(state.currentAsset.amount);
      const fee = new BigNumber(feesAmount.value[state.currentAsset.base_denom] ?? 0);

      form.balance.amount = assetAmount.minus(fee).shiftedBy(-precision).decimalPlaces(precision).toString();
      return;
    }
  },
);

watch(
  () => props.balances,
  (newVal) => {
    if (newVal.length > 0 && !state.currentAsset) {
      let asset;
      if (location.search) {
        const params = new URL(location.href).searchParams;
        form.balance.denom = params.get('base_denom');
        const precision = store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.balance.denom }) ?? 6;
        form.balance.amount = new BigNumber(params.get('amount') ?? 0).shiftedBy(-precision).toString();
      }

      if (form.balance.denom) {
        asset = props.balances.find((item) => {
          const balance = parseCoins(item.amount)[0];
          return balance.denom === form.balance.denom;
        });
      }

      if (!asset) {
        asset = orderBalancesByPrice(props.balances)[0];
      }

      setCurrentAsset(asset);
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.get-asset-cta {
  background-image: url('@/assets/images/gold-rings-2.png');
  background-position: 121% 70%;
  background-repeat: no-repeat;
  background-size: 52%;
}
</style>
