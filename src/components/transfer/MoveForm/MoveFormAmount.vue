<template>
  <div :class="{ 'move-form-amount--insufficient-funds': !hasSufficientFunds }">
    <div class="move-form-amount__modal-wrapper">
      <DenomSelectModal
        v-if="state.isDenomModalOpen"
        title="Select asset"
        :assets="balances"
        :func="() => toggleDenomModal()"
        @select="toggleDenomModal"
      />

      <ChainSelectModal
        v-if="state.isChainsModalOpen"
        title="Select chain"
        :assets="state.chainsModalSource === 'to' ? availableRecipientsChains : balances"
        :selected-denom="state.currentAsset.base_denom"
        :func="() => toggleChainsModal()"
        @select="toggleChainsModal"
      />
    </div>
    <template v-if="state.currentAsset">
      <fieldset class="form__field move-form-amount">
        <template v-if="state.isUSDInputChecked">
          <div class="move-form-amount__input">
            <FlexibleAmountInput v-model="state.usdValue" :max-width="250" :min-width="35" prefix="$">
              <template #default="inputProps">
                <USDInput
                  v-model="form.balance.amount"
                  :denom="state.currentAsset?.base_denom"
                  :class="[inputProps.class]"
                  :style="inputProps.style"
                  placeholder="0"
                  @update:price="state.usdValue = $event"
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
        </template>
        <template v-else>
          <div class="move-form-amount__input">
            <FlexibleAmountInput v-model="form.balance.amount" :max-width="250" :min-width="35" placeholder="0">
              <template #suffix> &nbsp;<Denom :name="state.currentAsset?.base_denom || ''" /> </template>
            </FlexibleAmountInput>
          </div>

          <span v-if="hasPrice" class="move-form-amount__estimated">
            <Price :amount="{ amount: form.balance.amount * denomDecimals, denom: state.currentAsset?.base_denom }" />
          </span>
        </template>
        <div class="move-form-amount__controls">
          <label v-if="hasPrice" class="move-form-amount__controls__button">
            <input v-model="state.isUSDInputChecked" type="checkbox" name="move-form-amount-usd" />
            <span v-if="state.isUSDInputChecked" class="elevation-button"><Denom :name="state.currentAsset?.base_denom" /></span>
            <span v-else class="elevation-button">USD</span>
          </label>
          <label class="move-form-amount__controls__button is-toggle">
            <input v-model="state.isMaximumAmountChecked" type="checkbox" name="move-form-amount-max" />
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
                :chain-name="form.on_chain"
                :denom="form.balance.denom"
                class="move-form-amount__assets__item__avatar"
              />
              <span class="move-form-amount__assets__item__name w-bold">
                <Denom :name="form.balance.denom || ''" />
              </span>
            </div>

            <div class="move-form-amount__assets__item__button">
              <Icon name="CaretRightIcon" :icon-size="1.2" />
            </div>
          </button>

          <button class="move-form-amount__assets__item from-item" @click="toggleChainsModal(null, 'from')">
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
                <Price :amount="{ amount: state.currentAsset?.amount || 0, denom: state.currentAsset?.base_denom }" />
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
          :disabled="!isValid"
          @click="onSubmit"
        />
      </fieldset>
    </template>
  </div>
</template>

<script lang="ts">
import { parseCoins } from '@cosmjs/amino';
import BigNumber from 'bignumber.js';
import { computed, defineComponent, inject, PropType, reactive, toRefs, watch } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import Price from '@/components/common/Price.vue';
import USDInput from '@/components/common/USDInput.vue';
import Button from '@/components/ui/Button.vue';
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import { useStore } from '@/store';
import { ChainData } from '@/store/demeris/state';
import { MoveAssetsForm } from '@/types/actions';
import { Balances } from '@/types/api';

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
  },

  props: {
    balances: {
      type: Object as PropType<Balances>,
      required: true,
    },
  },

  emits: ['next'],

  setup(props, { emit }) {
    const store = useStore();
    const form = inject<MoveAssetsForm>('moveForm');

    const state = reactive({
      currentAsset: undefined,
      isMaximumAmountChecked: false,
      isUSDInputChecked: false,
      isDenomModalOpen: false,
      isChainsModalOpen: false,
      chainsModalSource: 'from',
      usdValue: '',
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

    const availableRecipientsChains = computed(() => {
      const chains = store.getters['demeris/getChains'] as Record<string, ChainData>;

      return Object.values(chains)
        .map((item) => {
          const balance = (props.balances as Balances).find((balance) => balance.on_chain === item.chain_name);

          return {
            amount: balance?.amount || 0,
            base_denom: state.currentAsset.base_denom,
            on_chain: item.chain_name,
          };
        })
        .filter((item) => item.on_chain !== state.currentAsset?.on_chain);
    });

    const hasSufficientFunds = computed(() => {
      if (!state.currentAsset) {
        return false;
      }

      const cryptoAmount = +form.balance.amount * denomDecimals.value;

      return +parseCoins(state.currentAsset.amount)[0].amount >= cryptoAmount;
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

    const setCurrentAsset = (asset: Record<string, unknown>) => {
      state.currentAsset = asset;
      form.balance.denom = asset.base_denom as string;
      form.on_chain = asset.on_chain as string;
    };

    // TODO: Select chain based in user option
    watch(
      () => [state.isMaximumAmountChecked, state.currentAsset],
      () => {
        if (state.isMaximumAmountChecked) {
          const assetAmount = +parseCoins(state.currentAsset.amount)[0].amount;
          form.balance.amount = (assetAmount / denomDecimals.value).toString();
          return;
        }
      },
    );
    watch(
      () => props.balances,
      (newVal) => {
        if (newVal.length > 0 && !state.currentAsset) {
          setCurrentAsset(props.balances[0]);
        }
      },
      { immediate: true },
    );

    watch(
      () => state.isUSDInputChecked,
      () => (state.usdValue = ''),
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
      form,
      onSubmit,
      hasPrice,
      state,
      setCurrentAsset,
      hasSufficientFunds,
      isValid,
      denomDecimals,
      toggleDenomModal,
      toggleChainsModal,
      availableRecipientsChains,
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

      &.denom-item &__name {
        text-transform: uppercase;
      }

      & + & {
        border-top: 1px solid var(--border-trans);
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
