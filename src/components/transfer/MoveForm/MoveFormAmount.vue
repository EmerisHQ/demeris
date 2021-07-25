<template>
  <div :class="{ 'move-form-amount--insufficient-funds': !hasSufficientFunds }">
    <div class="move-form-amount__modal-wrapper">
      <DenomSelectModal
        v-if="state.isDenomModalOpen"
        title="Select asset"
        :assets="availableBalances"
        :func="() => toggleDenomModal()"
        @select="toggleDenomModal"
      />

      <ChainSelectModal
        v-if="state.isChainsModalOpen"
        title="Select chain"
        :assets="availableChains"
        :selected-denom="state.currentAsset.base_denom"
        :func="() => toggleChainsModal()"
        :show-subtitle="false"
        @select="toggleChainsModal"
      >
        <template #description>
          Select the Chain to swap {{ state.chainsModalSource === 'to' ? 'to' : 'from' }}.
        </template>
      </ChainSelectModal>
    </div>
    <template v-if="true">
      <fieldset class="form__field move-form-amount">
        <div v-show="state.isUSDInputChecked" class="flex flex-col items-center">
          <div class="move-form-amount__input">
            <FlexibleAmountInput
              v-model="state.usdValue"
              :max-width="300"
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
          </div>
          <span class="move-form-amount__estimated">
            <AmountDisplay
              :amount="{
                amount: +form.balance.amount ? form.balance.amount * denomDecimals : 0,
                denom: state.currentAsset?.base_denom,
              }"
            />
          </span>
        </div>
        <div v-if="!state.isUSDInputChecked" class="flex flex-col items-center">
          <div class="move-form-amount__input">
            <FlexibleAmountInput
              v-model="form.balance.amount"
              :max-width="250"
              :min-width="35"
              placeholder="0"
              @input="state.isMaximumAmountChecked = false"
            >
              <template v-if="state.currentAsset" #suffix>
                &nbsp;<Denom :name="state.currentAsset?.base_denom || ''" />
              </template>
            </FlexibleAmountInput>
          </div>

          <span v-if="hasPrice" class="move-form-amount__estimated">
            {{ displayUSDValue }}
          </span>
        </div>
        <div class="move-form-amount__controls">
          <label v-if="hasPrice" class="move-form-amount__controls__button">
            <input v-model="state.isUSDInputChecked" type="checkbox" name="move-form-amount-usd" />
            <span v-if="state.isUSDInputChecked" class="elevation-button"><Denom :name="state.currentAsset?.base_denom" /></span>
            <span v-else class="elevation-button">USD</span>
          </label>
          <label class="move-form-amount__controls__button is-toggle">
            <input
              v-model="state.isMaximumAmountChecked"
              type="checkbox"
              name="move-form-amount-max"
              :disabled="!hasFunds"
            />
            <span class="elevation-button">{{ $t('generic_cta.max') }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="form__field">
        <div class="move-form-amount__assets elevation-card">
          <button class="move-form-amount__assets__item denom-item" @click="toggleDenomModal()">
            <span class="move-form-amount__assets__item__label s-minus">{{ $t('components.moveForm.action') }}</span>

            <div class="move-form-amount__assets__item__asset">
              <CircleSymbol
                :chain-name="state.currentAsset ? form.on_chain : undefined"
                :denom="form.balance.denom"
                class="move-form-amount__assets__item__avatar"
              />
              <span class="move-form-amount__assets__item__name w-bold">
                <Denom v-if="state.currentAsset" :name="state.currentAsset?.base_denom || form.balance.denom || ''" />
                <span v-else>Select asset</span>
              </span>
            </div>

            <div class="move-form-amount__assets__item__button">
              <Icon name="CaretRightIcon" :icon-size="1.2" />
            </div>
          </button>

          <button
            v-if="state.currentAsset"
            class="move-form-amount__assets__item from-item"
            @click="toggleChainsModal(null, 'from')"
          >
            <span class="move-form-amount__assets__item__label s-minus">{{ $t('components.moveForm.from') }}</span>

            <div class="move-form-amount__assets__item__asset">
              <CircleSymbol
                variant="chain"
                :chain-name="form.on_chain"
                class="move-form-amount__assets__item__avatar"
              />
              <span class="move-form-amount__assets__item__name w-bold">
                <ChainName :name="form.on_chain" />
              </span>
            </div>

            <div class="move-form-amount__assets__item__amount">
              <p class="move-form-amount__assets__item__amount__balance s-minus">
                <Price
                  :amount="{ amount: state.currentAsset?.amount || 0, denom: state.currentAsset?.base_denom }"
                  :auto-update="false"
                  show-zero
                />
              </p>
              <p class="move-form-amount__assets__item__amount__available s-minus">
                <AmountDisplay
                  :amount="{ amount: state.currentAsset?.amount || 0, denom: state.currentAsset?.base_denom }"
                />
              </p>
            </div>

            <div class="move-form-amount__assets__item__button">
              <Icon name="CaretRightIcon" :icon-size="1.2" />
            </div>
          </button>

          <button
            class="move-form-amount__assets__item to-item"
            :class="{ 'chain-selected': !!form.to_chain }"
            :disabled="!state.currentAsset"
            @click="toggleChainsModal(null, 'to')"
          >
            <span class="move-form-amount__assets__item__label s-minus">{{ $t('components.moveForm.to') }}</span>

            <div class="move-form-amount__assets__item__asset">
              <CircleSymbol
                variant="chain"
                :chain-name="form.to_chain"
                class="move-form-amount__assets__item__avatar"
              />
              <span class="move-form-amount__assets__item__name w-bold">
                <ChainName v-if="form.to_chain" :name="form.to_chain" />
                <span v-else>{{ $t('components.moveForm.selectChain') }}</span>
              </span>
            </div>

            <div class="move-form-amount__assets__item__button">
              <Icon name="CaretRightIcon" :icon-size="1.2" />
            </div>
          </button>
        </div>
      </fieldset>

      <fieldset class="form__field">
        <Button
          :name="hasSufficientFunds ? $t('generic_cta.continue') : $t('generic_cta.noFunds')"
          :status="isValid ? 'normal' : 'inactive'"
          :disabled="!isValid"
          @click="onSubmit"
        />
      </fieldset>

      <div class="move-form-amount__fees">
        <FeeLevelSelector
          v-if="steps.length > 0"
          v-model:gasPriceLevel="state.gasPrice"
          :steps="steps"
          @update:fees="state.fees = $event"
        />
      </div>

      <div v-if="state.currentAsset && hasPrice && !hasFunds" class="move-form-amount__buy">
        <button class="move-form-amount__buy__button elevation-button" @click="openAssetPage">
          <div class="inline-flex items-center">
            <span>{{ $t('generic_cta.get') }}&nbsp;</span>
            <Denom :name="state.currentAsset.base_denom" />
            <Icon name="ArrowRightIcon" :icon-size="1.6" class="ml-2" />
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
.move-form-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__modal-wrapper {
    position: relative;
    width: 100%;

    .denom-select-modal-wrapper {
      // Back icon
      .title-with-goback > .icon:first-child {
        visibility: hidden;
      }
    }
  }

  &--insufficient-funds &__input {
    color: #ca0865;
  }

  &--insufficient-funds &__assets__item__amount__available {
    color: #ca0865;
  }

  &__fees {
    margin-top: 2.4rem;
  }

  &__buy {
    padding: 0 2.4rem 2.4rem;

    &__button {
      overflow: hidden;
      margin-top: 4.8rem;
      padding: 1.4rem 1.6rem;
      width: 100%;
      text-align: left;
      font-weight: 600;
      background-image: url('~@/assets/images/gold-rings-2.png');
      background-repeat: no-repeat;
      background-position: 19rem 85%;
      position: relative;

      &__symbol {
        position: absolute;
        top: -0.3rem;
        right: 2.6rem;
        transform: rotate(-7deg);
      }
    }
  }

  &__input {
    font-size: 5.1rem;
    font-weight: 700;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color linear 100ms;

    &__control {
      text-align: right;
      font-weight: 700;
      width: 50%;
      outline: none;
      appearance: none;
    }

    &__denom {
      flex: 1;
      margin-left: 1rem;
    }
  }

  &__estimated {
    color: var(--muted);
    margin-top: 1.2rem;
    text-align: center;
  }

  &__controls {
    display: flex;
    align-items: stretch;
    justify-content: center;
    margin: 2.4rem 0 3.2rem 0;

    &__button {
      line-height: 1;
      input {
        display: none;
      }
      &.is-toggle {
        input:checked + span {
          background: var(--text);
          color: var(--bg);
          font-weight: 500;
        }
        input:disabled + span {
          color: var(--inactive);
          cursor: not-allowed;
        }
      }
      span {
        padding: 1rem 1.6rem;
        border-radius: 2.4rem;
        margin-right: 1.6rem;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
      }
    }
  }

  &__assets {
    &__item {
      padding: 1.6rem;
      display: flex;
      align-items: stretch;
      width: 100%;

      &:focus {
        outline: none;
      }

      &:disabled {
        color: var(--inactive);
      }

      & + & {
        border-top: 1px solid var(--border);
      }

      &__asset {
        display: flex;
        align-items: center;
        flex: 1 1 0%;
      }

      &__chain {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      &__avatar {
        margin-right: 1.2rem;
      }

      &__label {
        color: var(--muted);
        text-align: left;
        margin-right: 1rem;
        width: 4rem;
        align-self: center;
      }

      &__amount {
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &__available {
          transition: color linear 100ms;
          color: var(--muted);
          margin-top: 0.1rem;
        }
      }

      &__button {
        margin-left: 0.6rem;
        padding: 0 0.6rem;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
