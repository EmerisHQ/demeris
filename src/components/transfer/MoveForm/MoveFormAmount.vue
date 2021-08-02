<template>
  <div>
    <DenomSelectModal
      v-if="state.isDenomModalOpen"
      class="fixed inset-0 z-30 bg-bg"
      title="Select asset"
      :assets="availableBalances"
      :func="() => toggleDenomModal()"
      @select="toggleDenomModal"
    />

    <ChainSelectModal
      v-if="state.isChainsModalOpen"
      class="fixed inset-0 z-30 bg-bg"
      title="Select chain"
      :assets="availableChains"
      :selected-denom="state.currentAsset.base_denom"
      :func="() => toggleChainsModal()"
      :show-subtitle="false"
      @select="toggleChainsModal"
    >
      <template #description>
        Select the chain to swap {{ state.chainsModalSource === 'to' ? 'to' : 'from' }}.
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
                :tooltip-text="`Enter amount in ${state.isUSDInputChecked ? 'crypto' : 'USD'}`"
              >
                <Icon
                  name="SwapUDIcon"
                  :icon-size="1"
                  :class="['transform transition', { 'rotate-180': state.isUSDInputChecked }]"
                />
              </Button>
            </div>
            <FlexibleAmountInput
              v-if="state.isUSDInputChecked"
              v-model="state.usdValue"
              :min-width="state.isUSDInputChecked ? 35 : 0"
              prefix="$"
            >
              <template #default="inputProps">
                <USDInput
                  :model-value="form.balance.amount"
                  :denom="state.currentAsset?.base_denom || ''"
                  :class="[inputProps.class]"
                  :style="inputProps.style"
                  placeholder="0"
                  @update:price="state.usdValue = $event"
                  @update:modelValue="
                    ($event) => {
                      if (state.isUSDInputChecked) {
                        form.balance.amount = $event;
                      }
                    }
                  "
                />
              </template>
            </FlexibleAmountInput>
            <FlexibleAmountInput
              v-else-if="!state.isUSDInputChecked"
              v-model="form.balance.amount"
              :min-width="35"
              placeholder="0"
              class="uppercase"
              @input="state.isMaximumAmountChecked = false"
            >
              <template v-if="state.currentAsset" #suffix>
                <Denom :name="state.currentAsset?.base_denom || ''" />
              </template>
            </FlexibleAmountInput>
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
                :disabled="!hasPrice"
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
                amount: +form.balance.amount ? form.balance.amount * denomDecimals : 0,
                denom: state.currentAsset?.base_denom,
              }"
            />
            <div v-else-if="!state.isUSDInputChecked && hasPrice" class="text-muted mt-3 text-center">
              {{ displayUSDValue }}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <div class="bg-surface shadow-card rounded-xl overflow-hidden divide-y divide-border">
          <button
            class="py-5 px-4 flex items-stretch w-full outline-none text-left group focus:opacity-70 transition-opacity"
            @click="toggleDenomModal()"
          >
            <span
              class="mr-2.5 w-10 self-center text-muted text-left group-hover:text-text transition-colors -text-1"
            >{{ $t('components.moveForm.action') }}</span>

            <div class="flex items-center flex-1">
              <CircleSymbol
                :chain-name="state.currentAsset ? form.on_chain : undefined"
                :denom="form.balance.denom"
                class="mr-3"
              />
              <span class="font-medium">
                <Denom v-if="state.currentAsset" :name="state.currentAsset?.base_denom || form.balance.denom || ''" />
              </span>
            </div>

            <div class="ml-1.5 px-1.5 flex items-center text-muted group-hover:text-text transition-colors">
              <Icon name="CaretRightIcon" :icon-size="1" />
            </div>
          </button>

          <button
            v-if="state.currentAsset"
            class="py-5 px-4 flex items-stretch w-full outline-none text-left group focus:opacity-70 transition-opacity"
            @click="toggleChainsModal(null, 'from')"
          >
            <span
              class="mr-2.5 w-10 self-center text-muted text-left group-hover:text-text transition-colors -text-1"
            >{{ $t('components.moveForm.from') }}</span>

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
            class="py-5 px-4 flex items-stretch w-full outline-none text-left group focus:opacity-70 transition-opacity"
            :class="{ 'chain-selected': !!form.to_chain }"
            :disabled="!state.currentAsset"
            @click="toggleChainsModal(null, 'to')"
          >
            <span
              class="mr-2.5 w-10 self-center text-muted text-left group-hover:text-text transition-colors -text-1"
            >{{ $t('components.moveForm.to') }}</span>

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
        </div>
      </fieldset>

      <fieldset class="w-full max-w-sm mx-auto mt-10">
        <Button
          :name="hasSufficientFunds ? $t('generic_cta.continue') : $t('generic_cta.noFunds')"
          :status="isValid ? 'normal' : 'inactive'"
          :disabled="!isValid"
          @click="onSubmit"
        />
      </fieldset>

      <div class="w-full max-w-sm mx-auto mt-6">
        <FeeLevelSelector
          v-if="steps.length > 0"
          v-model:gasPriceLevel="state.gasPrice"
          :steps="steps"
          @update:fees="state.fees = $event"
        />
      </div>

      <div v-if="state.currentAsset && hasPrice && !hasFunds" class="move-form-amount__buy">
        <button class="shadow-button" @click="openAssetPage">
          <div class="inline-flex items-center">
            <span>{{ $t('generic_cta.get') }}&nbsp;</span>
            <Denom :name="state.currentAsset.base_denom" />
            <Icon name="ArrowRightIcon" :icon-size="1" class="ml-2" />
          </div>
          <CircleSymbol
            size="lg"
            :denom="state.currentAsset.base_denom"
            class="move-form-amount__buy__button__symbol"
          />
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, inject, onMounted, PropType, reactive, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';

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
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';
import { ChainData } from '@/store/demeris/state';
import { GasPriceLevel, MoveAssetsForm } from '@/types/actions';
import { Balances, Chain } from '@/types/api';
import { parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'MoveFormAmount',

  components: {
    FlexibleAmountInput,
    AmountDisplay,
    Button,
    Denom,
    DenomSelectModal,
    ChainSelectModal,
    ChainName,
    CircleSymbol,
    Icon,
    Price,
    USDInput,
    FeeLevelSelector,
  },

  props: {
    balances: {
      type: Object as PropType<Balances>,
      required: true,
    },
    steps: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['next'],

  setup(props, { emit }) {
    const store = useStore();
    const form = inject<MoveAssetsForm>('moveForm');
    const router = useRouter();

    const { nativeBalances } = useAccount();

    const state = reactive({
      currentAsset: undefined,
      isMaximumAmountChecked: false,
      isUSDInputChecked: false,
      isDenomModalOpen: false,
      isChainsModalOpen: false,
      chainsModalSource: 'from',
      usdValue: '',
      fees: {},
      gasPrice: undefined,
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

    const displayUSDValue = computed(() => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      return formatter.format(+state.usdValue);
    });

    const hasPrice = computed(() => {
      if (!state.currentAsset) {
        return false;
      }

      const price = store.getters['demeris/getPrice']({ denom: state.currentAsset.base_denom });

      return !!price;
    });

    const denomDecimals = computed(() => {
      if (state.currentAsset) {
        const precision = store.getters['demeris/getDenomPrecision']({
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
      const chains = store.getters['demeris/getChains'] as Record<string, ChainData>;
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
          const dexChain = store.getters['demeris/getDexChain'];
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

      const totalAmount = parseCoins(state.currentAsset.amount)[0].amount;

      return +totalAmount > 0;
    });

    const hasSufficientFunds = computed(() => {
      if (!state.currentAsset) {
        return true;
      }

      if (!hasFunds.value) {
        return false;
      }

      const precision = store.getters['demeris/getDenomPrecision']({ name: state.currentAsset.base_denom }) || 6;
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

    const toggleChainsModal = (asset?: Record<string, unknown>, source = 'from') => {
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

    const setCurrentAsset = (asset: Record<string, unknown>) => {
      const dexChain = store.getters['demeris/getDexChain'];
      const targetChains = Object.values(store.getters['demeris/getChains']).filter(
        (chain: Chain) => chain.chain_name !== dexChain,
      );

      state.currentAsset = asset;
      form.balance.denom = parseCoins(asset.amount as string)[0].denom;
      form.on_chain = asset.on_chain as string;
      form.to_chain = asset.on_chain !== dexChain ? dexChain : (targetChains[0] as Chain).chain_name;
    };

    onMounted(() => {
      state.gasPrice = store.getters['demeris/getPreferredGasPriceLevel'] || GasPriceLevel.AVERAGE;
    });

    // TODO: Select chain based in user option
    watch(
      () => [state.isMaximumAmountChecked, state.currentAsset, state.fees],
      () => {
        if (state.isMaximumAmountChecked) {
          const precision = store.getters['demeris/getDenomPrecision']({ name: state.currentAsset.base_denom }) || 6;
          const assetAmount = new BigNumber(parseCoins(state.currentAsset.amount)[0].amount);
          const fee = feesAmount.value[state.currentAsset.base_denom] || 0;

          form.balance.amount = assetAmount.minus(fee).shiftedBy(-precision).decimalPlaces(precision).toString();
          return;
        }
      },
    );

    watch(
      () => props.balances,
      (newVal) => {
        if (newVal.length > 0 && !state.currentAsset) {
          let asset = props.balances[0];

          if (form.balance.denom) {
            asset = props.balances.find((item) => {
              const balance = parseCoins(item.amount)[0];
              return balance.denom === form.balance.denom;
            });
          }

          setCurrentAsset(asset);
        }
      },
      { immediate: true },
    );

    const { on_chain: onChain, to_chain: toChain } = toRefs(form);
    watch([onChain, toChain], ([onChainNew, toChainNew], [onChainOld]) => {
      if (onChainNew === toChainNew) {
        if (onChainOld !== onChainNew) {
          form.to_chain = onChainOld;
        } else {
          form.to_chain = undefined;
        }
      }
    });

    return {
      availableBalances,
      displayUSDValue,
      form,
      hasFunds,
      onSubmit,
      hasPrice,
      state,
      setCurrentAsset,
      hasSufficientFunds,
      isValid,
      denomDecimals,
      toggleDenomModal,
      toggleChainsModal,
      openAssetPage,
      availableChains,
    };
  },
});
</script>

<style lang="scss" scoped>
// .btn {
//   &:hover:not(:active),
//   &:focus:not(:active) {
//     --tw-shadow: 4px 11px 35px -4px rgba(0, 0, 0, 0.12);
//   }
//   &:active {
//     opacity: 0.7;
//     transition-duration: 0s;
//   }
// }
</style>
