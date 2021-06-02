<template>
  <div :class="{ 'send-form-amount--insufficient-funds': !hasSufficientFunds }">
    <fieldset class="form__field send-form-amount">
      <div class="send-form-amount__input">
        <input v-model="form.balance.amount" class="send-form-amount__input__control" min="0" placeholder="0" />
        <span class="send-form-amount__input__denom">{{ state.currentAsset?.denom }}</span>
      </div>

      <span class="send-form-amount__estimated"> $8,866.34 </span>

      <div class="send-form-amount__controls">
        <label class="send-form-amount__controls__button">
          <input type="checkbox" name="send-form-amount-usd" />
          <span class="elevation-button">USD</span>
        </label>

        <label class="send-form-amount__controls__button">
          <input v-model="state.isMaximumAmountChecked" type="checkbox" name="send-form-amount-max" />
          <span class="elevation-button">Max</span>
        </label>
      </div>
    </fieldset>

    <fieldset class="form__field">
      <div class="send-form-amount__assets">
        <button
          v-for="asset of balancesByAsset"
          :key="asset.denom"
          :class="{
            'send-form-amount__assets__item--active': state.currentAsset?.denom === asset.denom,
          }"
          class="send-form-amount__assets__item elevation-button"
          @click="setCurrentAsset(asset)"
        >
          <div class="send-form-amount__assets__item__asset">
            <span class="send-form-amount__assets__item__avatar" />

            <div class="send-form-amount__assets__item__chain">
              <p class="send-form-amount__assets__item__denom w-bold">
                {{ asset.denom }}
              </p>
              <p class="send-form-amount__assets__item__name s-minus">
                {{ asset.chains[0].on_chain }}
              </p>
            </div>
          </div>

          <div class="send-form-amount__assets__item__amount">
            <p class="send-form-amount__assets__item__amount__balance">$13,400</p>
            <p class="send-form-amount__assets__item__amount__available s-minus">
              {{ `${asset.chains[0].amount} ${asset.denom.toUpperCase()} available` }}
            </p>
          </div>

          <button class="send-form-amount__assets__item__button" @click.prevent.stop="">
            <Icon name="CaretRightIcon" :icon-size="1.2" />
          </button>
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
import { computed, defineComponent, inject, PropType, reactive, watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import { SendAddressForm } from '@/types/actions';
import { Balances } from '@/types/api';

export default defineComponent({
  name: 'SendFormAmount',

  components: {
    Button,
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
    const form = inject<SendAddressForm>('transferForm');

    const state = reactive({
      currentAsset: undefined,
      isMaximumAmountChecked: false,
    });

    const balancesByAsset = computed(() => {
      const denomsAggregate = groupBy(props.balances as Balances, 'base_denom');

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

    const onSubmit = () => {
      emit('next');
    };

    const setCurrentAsset = (asset: Record<string, unknown>) => {
      state.currentAsset = asset;
      form.balance.denom = asset.denom as string;
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

    return { form, balancesByAsset, onSubmit, state, setCurrentAsset, hasSufficientFunds, isValid };
  },
});
</script>

<style lang="scss" scoped>
.send-form-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &--insufficient-funds &__input {
    color: #ca0865;
  }

  &--insufficient-funds &__assets__item--active &__assets__item__amount__available {
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
      border-radius: 1rem;
      padding: 1.6rem;
      display: flex;
      align-items: stretch;
      width: 100%;

      & + & {
        margin-top: 1.6rem;
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
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 2.4rem;
        background-color: rgba(0, 0, 0, 0.3);
        margin-right: 1.6rem;
        transition: box-shadow linear 100ms;
      }

      &--active &__avatar {
        border: 2px solid white;
        box-shadow: 0 0 0 2px #7aafff;
      }

      &__denom {
        margin-bottom: 0.2rem;
        text-transform: uppercase;
      }

      &__name {
        color: var(--muted);
        text-align: left;
      }

      &__amount {
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &__available {
          transition: color linear 100ms;
          color: var(--muted);
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
