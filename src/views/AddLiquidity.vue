<template>
  <div class="add-liquidity">
    <header class="add-liquidity__header">
      <button class="add-liquidity__header__button" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.6" />
      </button>

      <nav class="add-liquidity__steps">
        <span
          v-for="label of steps"
          :key="label"
          class="add-liquidity__steps__item"
          :class="{ 'add-liquidity__steps__item--active': state.step === label }"
        >
          {{ label }}
        </span>
      </nav>

      <button class="add-liquidity__header__button close-button" @click="onClose">
        <Icon name="CloseIcon" :icon-size="1.6" />
      </button>
    </header>

    <main class="add-liquidity__wrapper">
      <template v-if="state.step === 'amount'">
        <template v-if="!state.isTransferConfirmationOpen">
          <h2 class="add-liquidity__title s-2">
            {{ hasPool ? 'Add Liquidity' : 'Create Liquidity' }}
          </h2>

          <div v-if="hasPool" class="add-liquidity__pool">
            <div class="add-liquidity__pool__pair">
              <span class="add-liquidity__pool__pair__avatar token-a" />
              <span class="add-liquidity__pool__pair__avatar token-b" />
            </div>

            <span class="add-liquidity__pool__name">{{ formatPoolName(pool) }} Pool</span>
          </div>

          <div class="add-liquidity__content">
            <div class="add-liquidity__input input-a elevation-card">
              <Alert v-if="hasPair && !hasPool" class="add-liquidity__create-warning elevation-card">
                <p class="add-liquidity__create-warning__title w-bold">Your are the first liquidity provider</p>
                <p class="add-liquidity__create-warning__description">
                  As the first liquidity provider to the {{ $filters.getCoinName(form.coinA.balance.base_denom) }}/{{
                    $filters.getCoinName(form.coinB.balance.base_denom)
                  }}
                  pool, you will be creating the pool and setting the price. Proceed with caution.
                </p>
              </Alert>

              <div class="add-liquidity__input__main">
                <label class="add-liquidity__input__label s-minus">Supply</label>
                <div>
                  <DenomSelect
                    v-model:amount="form.coinA.amount"
                    :input-header="``"
                    :selected-denom="form.coinA.balance"
                    :assets="balances"
                    @select="coinSelectHandler('coinA', $event)"
                  />
                </div>
              </div>

              <div v-if="form.coinA.balance" class="add-liquidity__input__details">
                <div class="add-liquidity__input__details__from">
                  From <span class="w-bold">{{ form.coinA.balance.on_chain || '-' }}</span>
                </div>

                <div class="add-liquidity__input__details__available">
                  {{ form.coinA.balance.amount || 0 }}
                  <span class="uppercase">{{ $filters.getCoinName(form.coinA.balance.base_denom) }}</span> available
                </div>
              </div>
            </div>

            <div class="add-liquidity__price">
              <span class="add-liquidity__price__divider" />
              <div class="add-liquidity__price__container">
                <template v-if="form.coinA.balance && form.coinB.balance">
                  1 <span class="uppercase">{{ $filters.getCoinName(form.coinA.balance.base_denom) }}</span> : 1.78
                  <span class="uppercase">{{ $filters.getCoinName(form.coinB.balance.base_denom) }}</span>
                </template>
                <span v-else>Price</span>
              </div>
            </div>

            <div class="add-liquidity__input input-b elevation-card">
              <div class="add-liquidity__input__main">
                <label class="add-liquidity__input__label s-minus">Supply</label>
                <div>
                  <DenomSelect
                    v-model:amount="form.coinB.amount"
                    :input-header="``"
                    :selected-denom="form.coinB.balance"
                    :assets="balances"
                    @select="coinSelectHandler('coinB', $event)"
                  />
                </div>
              </div>

              <div v-if="form.coinB.balance" class="add-liquidity__input__details">
                <div class="add-liquidity__input__details__from">
                  From <span class="w-bold">{{ form.coinB.balance.on_chain || '-' }}</span>
                </div>

                <div class="add-liquidity__input__details__available">
                  {{ form.coinB.balance.amount || 0 }}
                  <span class="uppercase">{{ $filters.getCoinName(form.coinB.balance.base_denom) }}</span> available
                </div>
              </div>
            </div>

            <div v-if="hasPair" class="add-liquidity__receive">
              <div class="add-liquidity__receive__header">
                <label class="add-liquidity__receive__label s-minus">Receive</label>
                <Icon v-tippy content="TODO" name="HintIcon" :icon-size="1.6" />
              </div>

              <div class="add-liquidity__receive__wrapper">
                <div class="add-liquidity__receive__token">
                  <div class="add-liquidity__receive__token__avatar" />
                  <span class="w-bold">G-LK-LP</span>
                </div>

                <span class="add-liqudity__receive__amount w-bold"> 400 </span>
              </div>
            </div>

            <Alert v-if="hasPair && needsTransferToHub" status="info" class="add-liquidity__transfer-info">
              Your assets will be transferred to Cosmos Hub
            </Alert>

            <div class="add-liquidity__controls">
              <Button name="Continue" @click="goToReview" />
            </div>
          </div>
        </template>

        <template v-else>
          <section class="add-liquidity__content add-liquidity__confirmation">
            <h2 class="add-liquidity__title s-2">Creating a pool is risky business</h2>

            <div class="add-liquidity__confirmation__placeholder" />

            <p class="add-liquidity__confirmation__description">
              As the first liquidity provider, you are setting the pool price. This means that if you don’t know what
              you are doing, you may risk significant loss as a result of arbitrage.
            </p>

            <div class="add-liquidity__confirmation__controls">
              <button
                class="add-liquidity__confirmation__controls__button elevation-button"
                @click="state.isTransferConfirmationOpen = false"
              >
                Cancel
              </button>
              <button class="add-liquidity__confirmation__controls__button confirmation-button" @click="goToReview">
                I understand
              </button>
            </div>
          </section>
        </template>
      </template>

      <template v-if="state.step === 'review'"> Review </template>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';

import DenomSelect from '@/components/common/DenomSelect.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import { Balance } from '@/types/api';

export default {
  name: 'AddLiquidity',
  components: { Icon, Button, DenomSelect, Alert },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const poolId = computed(() => route.params.id);

    const steps = ['amount', 'review', 'send'];

    const state = reactive({
      step: 'amount',
      isTransferConfirmationOpen: false,
    });

    const form = reactive({
      coinA: {
        balance: undefined,
        amount: 0,
      },
      coinB: {
        balance: undefined,
        amount: 0,
      },
    });

    const { pools, formatPoolName } = usePools();
    const { balances } = useAccount();

    const hasPair = computed(() => {
      return form.coinA.balance && form.coinB.balance;
    });

    const pool = computed(() => {
      if (hasPair.value) {
        const denoms = [form.coinA.balance.base_denom, form.coinB.balance.base_denom].sort();
        return pools.value.find((pool) => pool.reserveCoinDenoms.join() === denoms.join());
      }

      return undefined;
    });

    const hasPool = computed(() => {
      return !!pool.value;
    });

    const needsTransferToHub = computed(() => {
      const hubName = 'Cosmos';

      if (form.coinA.balance.on_chain !== hubName || form.coinB.balance.on_chain !== hubName) {
        return true;
      }

      return false;
    });

    const onClose = () => {
      router.push('/pools');
    };

    const coinSelectHandler = (key: 'coinA' | 'coinB', balance: Balance) => {
      form[key].balance = balance;
    };

    const goBack = () => {
      const currentStepIndex = steps.findIndex((item) => item === state.step);

      if (currentStepIndex > 0) {
        state.step = steps[currentStepIndex - 1];
        return;
      }

      router.back();
    };

    const goToReview = () => {
      if (state.isTransferConfirmationOpen) {
        goToStep('review');
        state.isTransferConfirmationOpen = false;
        return;
      }

      if (needsTransferToHub) {
        state.isTransferConfirmationOpen = true;
      }
    };

    const goToStep = (step: 'amount' | 'review' | 'send') => {
      state.step = step;
    };

    onMounted(() => {
      if (!poolId.value) {
        return;
      }

      const poolFromRoute = pools.value.find((item) => item.id === +poolId.value);

      if (poolFromRoute) {
        // TODO: Find chain by user balance
        form.coinA.balance = { base_denom: poolFromRoute.reserveCoinDenoms[0] };
        form.coinB.balance = { base_denom: poolFromRoute.reserveCoinDenoms[1] };
      }
    });

    return {
      balances,
      pool,
      hasPool,
      hasPair,
      form,
      state,
      steps,
      needsTransferToHub,
      goBack,
      goToReview,
      goToStep,
      coinSelectHandler,
      formatPoolName,
      onClose,
    };
  },
};
</script>

<style lang="scss">
.add-liquidity {
  position: relative;
  padding-bottom: 2rem;

  .denom-select {
    padding: 0;
  }

  .denom-select__coin-from {
    display: none;
  }

  &__create-warning {
    width: 20rem;
    position: absolute;
    right: 0;
    transform: translateX(26rem);
    flex-direction: column;
    align-items: flex-start !important;

    .alert__content {
      margin-left: 0;
    }

    &__title {
      margin-top: 1.2rem;
      text-align: center;
    }

    &__description {
      margin-top: 1.2rem;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 4rem;
    background: var(--bg);

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.8rem;
      padding: 0.6rem;
    }

    .close-button {
      margin-left: auto;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3.1rem;
  }

  &__steps {
    flex: 1 1 0%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__item {
      text-transform: capitalize;
      color: var(--inactive);
      font-weight: 600;
      cursor: default;

      & + & {
        margin-left: 4.8rem;
      }
      &--active {
        color: var(--text);
      }
    }
  }

  &__content {
    width: 100%;
    max-width: 38rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__pool {
    margin-top: 1.6rem;

    &__pair {
      display: inline-flex;
      align-items: center;
      margin-right: 0.8rem;

      &__avatar {
        width: 1.4rem;
        height: 1.4rem;
        border-radius: 2.4rem;
        background: #ddd;

        & + & {
          margin-left: -0.4rem;
          background: #aaa;
        }
      }
    }

    &__name {
      color: var(--muted);
    }
  }

  &__price {
    position: relative;
    overflow: hidden;

    &__container {
      padding: 0.8rem 1.2rem;
      font-size: 1.2rem;
      color: var(--muted);
      border-radius: 2.4rem;
      background: #e6e6e6;
      display: inline-block;
      margin: 1.5rem auto;
      position: relative;
    }

    &__divider {
      position: absolute;
      content: '';
      display: block;
      height: 100%;
      width: 1px;
      background: #e6e6e6;
      top: 0;
      left: 50%;
    }
  }

  &__controls {
    margin-top: 3.2rem;
    width: 100%;
  }

  &__receive {
    width: 100%;
    border-radius: 1rem;
    border: 1px solid var(--border-trans);
    padding: 1.6rem;
    margin-top: 3rem;

    &__header {
      font-size: 1.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.6rem;
    }

    &__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__token {
      &__avatar {
        display: inline-block;
        vertical-align: middle;
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 2.6rem;
        background: var(--inactive);
        margin-right: 1.2rem;
      }
    }

    &__label {
      color: var(--muted);
    }
  }

  &__transfer-info {
    width: 100%;
    margin-top: 3rem;
  }

  &__confirmation {
    text-align: center;

    &__placeholder {
      background: var(--fg-trans);
      width: 36rem;
      height: 15rem;
      margin-top: 3.4rem;
      border-radius: 1rem;
    }

    &__description {
      color: var(--muted);
      line-height: 1.8;
      margin-top: 3.4rem;
    }

    &__controls {
      width: 100%;
      display: flex;

      &__button {
        margin-top: 4rem;
        font-weight: 600;
        padding: 1.6rem 2rem;
        flex: 1 1 0%;
        border-radius: 0.8rem;

        &.confirmation-button {
          background: var(--text);
          color: var(--bg);
        }

        & + & {
          margin-left: 2.4rem;
        }
      }
    }
  }

  &__input {
    width: 100%;
    border-radius: 1rem;
    background: var(--bg);

    &.input-a {
      margin-top: 3.2rem;
    }

    &__main {
      padding: 1.6rem;
      display: flex;
      flex-direction: column;
    }

    &__label {
      color: var(--muted);
      margin-bottom: 1.6rem;
    }

    &__details {
      padding: 1.2rem 1.6rem;
      font-size: 1.2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;

      &__available {
        color: var(--muted);
      }
    }
  }
}
</style>
