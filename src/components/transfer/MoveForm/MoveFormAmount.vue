<template>
  <div :class="{ 'move-form-amount--insufficient-funds': !hasSufficientFunds }">
    <fieldset class="form__field move-form-amount">
      <div class="move-form-amount__input">
        <input v-model="form.balance.amount" class="move-form-amount__input__control" min="0" placeholder="0" />
        <span class="move-form-amount__input__denom">{{ state.currentAsset?.denom }}</span>
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
        <button class="move-form-amount__assets__item denom-item" @click="openAssetsModal">
          <span class="move-form-amount__assets__item__label s-minus">Move</span>

          <div class="move-form-amount__assets__item__asset">
            <span class="move-form-amount__assets__item__avatar" />
            <span class="move-form-amount__assets__item__name w-bold">
              {{ form.balance.denom }}
            </span>
          </div>

          <div class="move-form-amount__assets__item__button">
            <Icon name="CaretRightIcon" :icon-size="1.2" />
          </div>
        </button>

        <button class="move-form-amount__assets__item from-item" @click="openChainsModal">
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
              {{ `${state.currentAsset.chains[0].amount} ${form.balance.denom}` }}
            </p>
          </div>

          <div class="move-form-amount__assets__item__button">
            <Icon name="CaretRightIcon" :icon-size="1.2" />
          </div>
        </button>

        <button class="move-form-amount__assets__item to-item" @click="openChainsModal">
          <span class="move-form-amount__assets__item__label s-minus">To</span>

          <div class="move-form-amount__assets__item__asset">
            <span class="move-form-amount__assets__item__avatar" />
            <span class="move-form-amount__assets__item__name w-bold"> Select chain </span>
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
import groupBy from 'lodash.groupby';
import { computed, defineComponent, inject, reactive, watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { MoveAssetsForm } from '@/types/actions';
import { Balances } from '@/types/api';

import balancesFixture from '../../../../tests/fixtures/balances.json';

export default defineComponent({
  name: 'SendFormAmount',

  components: {
    Button,
    Icon,
  },

  emits: ['next'],

  setup(_, { emit }) {
    const form = inject<MoveAssetsForm>('moveForm');

    const state = reactive({
      currentAsset: undefined,
      isMaximumAmountChecked: false,
    });

    const balancesByAsset = computed(() => {
      const denomsAggregate = groupBy(balancesFixture as Balances, 'base_denom');

      return Object.entries(denomsAggregate).map(([denom, balances]) => {
        const totalAmount = balances.reduce((acc, item) => +item.amount + acc, 0);
        const chains = balances.map((item) => item);

        return {
          denom,
          totalAmount,
          chains,
        };
      });
    });

    const hasSufficientFunds = computed(() => {
      if (!state.currentAsset) {
        return false;
      }
      return state.currentAsset.chains[0].amount >= +form.balance.amount;
    });

    const isValid = () => {
      if (!hasSufficientFunds.value) {
        return false;
      }

      return true;
    };

    const openAssetsModal = () => {
      // TODO:
    };

    const openChainsModal = () => {
      // TODO:
    };

    const onSubmit = () => {
      emit('next');
    };

    const setCurrentAsset = (asset: Record<string, unknown>) => {
      state.currentAsset = asset;
      form.balance.denom = asset.denom as string;
      form.on_chain = asset.chains[0].on_chain;
    };

    // TODO: Select chain based in user option
    watch(
      () => [state.isMaximumAmountChecked, state.currentAsset],
      () => {
        if (state.isMaximumAmountChecked) {
          form.balance.amount = state.currentAsset.chains[0].amount;
        }
      },
    );

    // TODO: Select defaut asset based in specific conditions
    if (!state.currentAsset) {
      setCurrentAsset(balancesByAsset.value[0]);
    }

    return {
      form,
      balancesByAsset,
      onSubmit,
      state,
      setCurrentAsset,
      hasSufficientFunds,
      isValid,
      openAssetsModal,
      openChainsModal,
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

      &.denom-item &__name {
        text-transform: uppercase;
      }

      &.from-item &__avatar {
        background: transparent;
        border: 2px solid #7782ff;
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
