<template>
  <div class="withdraw-liquidity">
    <header class="withdraw-liquidity__header">
      <button class="withdraw-liquidity__header__button" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.6" />
      </button>

      <nav class="withdraw-liquidity__steps">
        <span
          v-for="label of steps"
          :key="label"
          class="withdraw-liquidity__steps__item"
          :class="{ 'withdraw-liquidity__steps__item--active': state.step === label }"
        >
          {{ label }}
        </span>
      </nav>

      <button class="withdraw-liquidity__header__button close-button" @click="onClose">
        <Icon name="CloseIcon" :icon-size="1.6" />
      </button>
    </header>

    <main class="withdraw-liquidity__wrapper">
      <template v-if="state.step === 'amount'">
        <h2 class="withdraw-liquidity__title s-2">Withdraw liquidity</h2>

        <div class="withdraw-liquidity__pool">
          <div class="withdraw-liquidity__pool__pair">
            <span class="withdraw-liquidity__pool__pair__avatar token-a" />
            <span class="withdraw-liquidity__pool__pair__avatar token-b" />
          </div>

          <span class="withdraw-liquidity__pool__name">{{ formatPoolName(pool) }} Pool</span>
        </div>

        <div class="withdraw-liquidity__estimated">
          <span class="withdraw-liquidity__estimated__price s-2 w-bold"><Price :amount="{ amount: state.amount, denom: pool.poolCoinDenom }" /></span>
          <label class="withdraw-liquidity__estimated__max">
            <input v-model="state.isMaximumAmountChecked" type="checkbox" name="withdraw-liquidity__max" />
            <span class="elevation-button">Max</span>
          </label>
        </div>

        <div class="withdraw-liquidity__content">
          <div class="withdraw-liquidity__modal-wrapper">
            <ChainSelectModal
              v-if="state.isChainsModalOpen"
              title="Select chain"
              :assets="balances"
              :selected-denom="pool.poolCoinDenom"
              :func="() => toggleChainsModal()"
              @select="toggleChainsModal()"
            />
          </div>

          <div class="withdraw-liquidity__input amount-input elevation-card">
            <div class="withdraw-liquidity__input__main">
              <label class="withdraw-liquidity__input__label s-minus">Withdraw</label>
              <div>
                <DenomSelect
                  v-model:amount="state.amount"
                  :input-header="``"
                  :selected-denom="tokenAsset"
                  :assets="[]"
                  @change="denomChangeHandler"
                />
              </div>
            </div>

            <div class="withdraw-liquidity__input__details">
              <button class="withdraw-liquidity__input__details__from" @click="toggleChainsModal()">
                From <span class="w-bold">Terra</span>
              </button>

              <div class="withdraw-liquidity__input__details__available">
                1210
                <span class="uppercase">G-LK-LP</span> available
              </div>
            </div>
          </div>

          <div class="withdraw-liquidity__input receive-input elevation-card">
            <div class="withdraw-liquidity__input__main">
              <label class="withdraw-liquidity__input__label s-minus">Receive</label>
              <div class="withdraw-liquidity__input__select-wrapper token-a">
                <DenomSelect
                  :amount="200"
                  :input-header="``"
                  :selected-denom="{ base_denom: pool.reserveCoinDenoms[0], on_chain: 'Cosmos Hub' }"
                  :assets="[]"
                  :readonly="true"
                  @select="() => void 0"
                />
              </div>

              <div class="withdraw-liquidity__input__divider" />

              <div class="withdraw-liquidity__input__select-wrapper token-b">
                <DenomSelect
                  :amount="300"
                  :input-header="``"
                  :selected-denom="{ base_denom: pool.reserveCoinDenoms[1], on_chain: 'Cosmos Hub' }"
                  :assets="[]"
                  :readonly="true"
                  @select="() => void 0"
                />
              </div>
            </div>
          </div>

          <div class="withdraw-liquidity__price">
            <span class="withdraw-liquidity__price__label">Pool price</span>
            <span class="withdraw-liquidity__price__label">
              1 <span class="uppercase">{{ $filters.getCoinName(pool.reserveCoinDenoms[0]) }}</span> = 1.78
              <span class="uppercase">{{ $filters.getCoinName(pool.reserveCoinDenoms[1]) }}</span>
            </span>
          </div>

          <Alert v-if="state.needsTransferToHub" status="info" class="withdraw-liquidity__transfer-info">
            Your assets will be transferred to Cosmos Hub
          </Alert>

          <div class="withdraw-liquidity__controls">
            <Button name="Continue" @click="goToReview" />
          </div>
        </div>
      </template>

      <template v-if="state.step === 'review'">
        <div class="withdraw-liquidity__content">
          Review
          <div class="withdraw-liquidity__controls">
            <Button name="Continue" @click="goToStep('send')" />
          </div>
        </div>
      </template>

      <template v-if="state.step === 'send'"> Send </template>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, reactive, watch } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';

import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import DenomSelect from '@/components/common/DenomSelect.vue';
import Price from '@/components/common/Price.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';

export default {
  name: 'WithdrawLiquidity',
  components: { Alert, Button, Icon, DenomSelect, ChainSelectModal, Price },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const poolId = computed(() => route.params.id);
    const { poolById, formatPoolName } = usePools();
    const { balances } = useAccount();

    const steps = ['amount', 'review', 'send'];

    const state = reactive({
      step: 'amount',
      needsTransferToHub: true,
      amount: 0,
      isChainsModalOpen: false,
      isMaximumAmountChecked: false,
    });

    const pool = computed(() => {
      return poolById(+poolId.value);
    });

    // TODO: Fetch from API the wallet available amount
    const tokenAsset = computed(() => {
      return {
        base_denom: 'uG-LK-LP',
        on_chain: 'Terra',
        amount: 1210,
      };
    });

    const toggleChainsModal = () => {
      state.isChainsModalOpen = !state.isChainsModalOpen;
    };

    const onClose = () => {
      router.push('/pools');
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
      goToStep('review');
    };

    const goToStep = (step: 'amount' | 'review' | 'send') => {
      state.step = step;
    };

    const denomChangeHandler = () => {
      if (state.isMaximumAmountChecked) {
        state.isMaximumAmountChecked = false;
      }
    };

    watch(
      () => [state.isMaximumAmountChecked, state],
      () => {
        if (state.isMaximumAmountChecked) {
          state.amount = tokenAsset.value.amount;
        }
      },
    );

    return {
      route,
      router,
      pool,
      state,
      steps,
      tokenAsset,
      balances,
      denomChangeHandler,
      toggleChainsModal,
      goToReview,
      goToStep,
      formatPoolName,
      goBack,
      onClose,
    };
  },
};
</script>

<style lang="scss">
.withdraw-liquidity {
  position: relative;
  padding-bottom: 2rem;

  .denom-select {
    padding: 0;
  }

  &__input.amount-input {
    .denom-select__coin-from {
      display: none;
    }
  }

  &__transfer-info {
    width: 100%;
    margin-top: 3.2rem;
  }

  &__controls {
    width: 100%;
    margin-top: 3.2rem;
  }

  &__estimated {
    margin-top: 3.2rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 38rem;
    width: 100%;
    text-align: center;
    line-height: 1;

    &__max {
      margin-top: -0.6rem;
      position: absolute;
      right: 0;

      input {
        display: none;
      }

      span {
        border-radius: 2.4rem;
        padding: 1rem 1.6rem;
        font-size: 1.2rem;
        cursor: pointer;
      }

      input:checked + span {
        background: var(--text);
        color: var(--bg);
        font-weight: 500;
      }
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

  &__price {
    font-size: 1.2rem;
    margin-top: 3.2rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__label {
      color: var(--muted);
    }
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

  &__input {
    width: 100%;
    border-radius: 1rem;
    background: var(--bg);

    &.amount-input {
      margin-top: 3.2rem;
    }

    &.receive-input {
      margin-top: 1.6rem;
    }

    &__divider {
      margin: 1.2rem -1.6rem 1.2rem 3.6rem;
      border-top: 1px solid var(--border-trans);
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
