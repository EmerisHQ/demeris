<template>
  <div :class="{ 'move-form-amount--insufficient-funds': !hasSufficientFunds }">
    <div class="move-form-amount__modal-wrapper">
      <DenomSelectModal
        v-if="state.isDenomModalOpen"
        title="Select asset"
        :assets="balances"
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

    <fieldset class="form__field move-form-amount">
      <div class="move-form-amount__input">
        <input v-model="form.balance.amount" class="move-form-amount__input__control" min="0" placeholder="0" />
        <span class="move-form-amount__input__denom"><Denom :name="state.currentAsset?.base_denom || ''" :chain-name="state.currentAsset?.on_chain" /></span>
      </div>

      <span class="move-form-amount__estimated"> $8,866.34 </span>

      <div class="move-form-amount__controls">
        <label class="move-form-amount__controls__button">
          <input type="checkbox" name="move-form-amount-usd" />
          <span class="elevation-button">USD</span>
        </label>
        <label class="move-form-amount__controls__button">
          <input v-model="state.isMaximumAmountChecked" type="checkbox" name="move-form-amount-max" />
          <span class="elevation-button">Max</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="form__field">
      <div class="move-form-amount__assets elevation-card">
        <button class="move-form-amount__assets__item denom-item" @click="toggleDenomModal()">
          <span class="move-form-amount__assets__item__label s-minus">Move</span>

          <div class="move-form-amount__assets__item__asset">
            <span class="move-form-amount__assets__item__avatar" />
            <span class="move-form-amount__assets__item__name w-bold">
              <Denom :name="form.balance.denom || ''" :chain-name="form.on_chain" />
            </span>
          </div>

          <div class="move-form-amount__assets__item__button">
            <Icon name="CaretRightIcon" :icon-size="1.2" />
          </div>
        </button>

        <button class="move-form-amount__assets__item from-item" @click="toggleChainsModal(null, 'from')">
          <span class="move-form-amount__assets__item__label s-minus">From</span>

          <div class="move-form-amount__assets__item__asset">
            <span class="move-form-amount__assets__item__avatar" />
            <span class="move-form-amount__assets__item__name w-bold">
              {{ form.on_chain }}
            </span>
          </div>

          <div class="move-form-amount__assets__item__amount">
            <p class="move-form-amount__assets__item__amount__balance s-minus">$13,400</p>
            <p class="move-form-amount__assets__item__amount__available s-minus">
              {{ `${state.currentAsset?.amount} ${form.balance.denom}` }}
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
          <span class="move-form-amount__assets__item__label s-minus">To</span>

          <div class="move-form-amount__assets__item__asset">
            <span class="move-form-amount__assets__item__avatar" />
            <span class="move-form-amount__assets__item__name w-bold"> {{ form.to_chain || 'Select chain' }} </span>
          </div>

          <div class="move-form-amount__assets__item__button">
            <Icon name="CaretRightIcon" :icon-size="1.2" />
          </div>
        </button>
      </div>
    </fieldset>

    <fieldset class="form__field">
      <Button :name="hasSufficientFunds ? 'Continue' : 'Insufficient funds'" :disabled="!isValid" @click="onSubmit" />
    </fieldset>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType, reactive, watch } from 'vue';

import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { useStore } from '@/store';
import { ChainData } from '@/store/demeris/state';
import { MoveAssetsForm } from '@/types/actions';
import { Balances } from '@/types/api';

export default defineComponent({
  name: 'SendFormAmount',

  components: {
    Button,
    Denom,
    DenomSelectModal,
    ChainSelectModal,
    Icon,
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
      isDenomModalOpen: false,
      isChainsModalOpen: false,
      chainsModalSource: 'from',
    });

    const availableRecipientsChains = computed(() => {
      const chains = store.getters['demeris/getChains'] as Record<string, ChainData>;

      return Object.values(chains).map((item) => {
        if (state.currentAsset.on_chain === item.chain_name) {
          return;
        }

        const balance = (props.balances as Balances).find((balance) => balance.on_chain === item.chain_name);

        return {
          amount: balance?.amount || 0,
          base_denom: state.currentAsset.base_denom,
          on_chain: item.chain_name,
        };
      });
    });

    const hasSufficientFunds = computed(() => {
      if (!state.currentAsset) {
        return false;
      }
      return state.currentAsset.amount >= +form.balance.amount;
    });

    const isValid = () => {
      if (!hasSufficientFunds.value) {
        return false;
      }

      return true;
    };

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
          form.balance.amount = state.currentAsset.amount;
        }
      },
    );

    // TODO: Select defaut asset based in specific conditions
    if (!state.currentAsset) {
      setCurrentAsset(props.balances[0]);
    }

    return {
      form,
      onSubmit,
      state,
      setCurrentAsset,
      hasSufficientFunds,
      isValid,
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
    display: inline-flex;
    align-items: center;
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
  }

  &__controls {
    display: flex;
    align-items: stretch;
    margin-top: 1.4rem;

    &__button {
      input {
        display: none;
      }

      input:checked + span {
        background: var(--text);
        color: var(--bg);
        font-weight: 500;
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

      &.from-item &__avatar {
        background: transparent;
        border: 2px solid #7782ff;
      }

      &.to-item.chain-selected &__avatar {
        background: transparent;
        border: 2px solid #9eb0f7;
      }

      &.to-item &__avatar {
        background: transparent;
        border: 2px solid var(--border-trans);
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
        position: relative;
        width: 3rem;
        height: 3rem;
        border-radius: 2.4rem;
        background-color: rgba(0, 0, 0, 0.3);
        margin-right: 1.2rem;
        border: 2px solid transparent;
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
