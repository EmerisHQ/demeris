<template>
  <div class="withdraw-liquidity" :class="{ 'withdraw-liquidity--insufficient-funds': !hasSufficientFunds }">
    <header class="withdraw-liquidity__header">
      <button class="withdraw-liquidity__header__button" :disabled="state.step === 'send'" @click="goBack">
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

          <span class="withdraw-liquidity__pool__name">{{ pairName }}</span>
        </div>

        <div class="withdraw-liquidity__estimated">
          <span class="withdraw-liquidity__estimated__price s-2 w-bold">{{ totalEstimatedPrice }}</span>
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
              :selected-denom="pool.pool_coin_denom"
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
                  :selected-denom="state.selectedAsset"
                  :assets="[]"
                  @change="denomChangeHandler"
                />
              </div>
            </div>

            <div class="withdraw-liquidity__input__details">
              <button class="withdraw-liquidity__input__details__from" @click="toggleChainsModal()">
                From <span class="w-bold"><ChainName :name="state.selectedAsset.on_chain" /></span>
              </button>

              <div class="withdraw-liquidity__input__details__available">
                <AmountDisplay
                  :amount="{ amount: state.selectedAsset.amount, denom: state.selectedAsset.base_denom }"
                />
                available
              </div>
            </div>
          </div>

          <div class="withdraw-liquidity__input receive-input elevation-card">
            <div class="withdraw-liquidity__input__main">
              <label class="withdraw-liquidity__input__label s-minus">Receive</label>
              <div class="withdraw-liquidity__input__select-wrapper token-a">
                <DenomSelect
                  :amount="receiveAmounts.coinA.amount"
                  :input-header="``"
                  :selected-denom="{ base_denom: reserveBaseDenoms[0], on_chain: state.selectedAsset.on_chain }"
                  :assets="[]"
                  :readonly="true"
                  @select="() => void 0"
                />
              </div>

              <div class="withdraw-liquidity__input__divider" />

              <div class="withdraw-liquidity__input__select-wrapper token-b">
                <DenomSelect
                  :amount="receiveAmounts.coinB.amount"
                  :input-header="``"
                  :selected-denom="{ base_denom: reserveBaseDenoms[1], on_chain: state.selectedAsset.on_chain }"
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
              <AmountDisplay :amount="{ amount: 1e6, denom: receiveAmounts.coinB.denom }" /> =
              <AmountDisplay :amount="{ amount: 1e6, denom: receiveAmounts.coinA.denom }" />
            </span>
          </div>

          <Alert v-if="needsTransferToHub" status="info" class="withdraw-liquidity__transfer-info">
            Your assets will be transferred to Cosmos Hub
          </Alert>

          <div class="withdraw-liquidity__controls">
            <Button
              :name="hasSufficientFunds ? 'Continue' : 'Insufficient funds'"
              :disabled="!isValid"
              @click="goToReview"
            />

            <div class="withdraw-liquidity__controls__fees">
              <FeeLevelSelector v-if="actionSteps.length > 0" v-model:gasPriceLevel="gasPrice" :steps="actionSteps" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="withdraw-liquidity__content">
          <TxStepsModal
            :data="actionSteps"
            :gas-price-level="gasPrice"
            @transacting="goToStep('send')"
            @failed="goToStep('review')"
            @reset="resetHandler"
          />
        </div>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive, ref, watch } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import { WithdrawLiquidityAction } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

export default {
  name: 'WithdrawLiquidity',
  components: {
    Alert,
    AmountDisplay,
    Button,
    ChainName,
    Icon,
    DenomSelect,
    ChainSelectModal,
    FeeLevelSelector,
    TxStepsModal,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const actionSteps = ref([]);
    const gasPrice = computed(() => {
      return store.getters['demeris/getPreferredGasPriceLevel'];
    });

    const poolId = computed(() => route.params.id);

    const { formatPoolName } = usePools();
    const { balancesByDenom } = useAccount();

    const steps = ['amount', 'review', 'send'];

    const state = reactive({
      step: 'amount',
      amount: 0,
      isChainsModalOpen: false,
      isMaximumAmountChecked: false,
      selectedAsset: undefined,
    });

    const { pool, pairName, calculateWithdrawBalances, reserveBaseDenoms } = usePool(
      computed(() => poolId.value as string),
    );

    const dexChain = computed(() => {
      return store.getters['demeris/getDexChain'];
    });

    // TODO: Fetch from API the wallet available amount
    const balances = computed(() => {
      return balancesByDenom(pool.value.pool_coin_denom);
    });

    const needsTransferToHub = computed(() => {
      if (state.selectedAsset.on_chain !== dexChain.value) {
        return true;
      }

      return false;
    });

    const hasSufficientFunds = computed(() => {
      if (!state.selectedAsset) {
        return false;
      }

      const cryptoAmount = state.amount * 1e6;

      return +parseCoins(state.selectedAsset.amount)[0].amount >= cryptoAmount;
    });

    const isValid = computed(() => {
      if (state.amount <= 0) {
        return false;
      }

      if (!hasSufficientFunds.value) {
        return false;
      }

      return true;
    });

    const receiveAmounts = computed(() => {
      if (!pool.value) {
        return;
      }

      const result = calculateWithdrawBalances(state.amount);

      return {
        coinA: result[0],
        coinB: result[1],
      };
    });

    const totalEstimatedPrice = computed(() => {
      let total = 0;

      if (!reserveBaseDenoms.value.length || !receiveAmounts.value) {
        return;
      }

      const priceA = store.getters['demeris/getPrice']({ denom: reserveBaseDenoms.value[0] });
      total += priceA * receiveAmounts.value.coinA.amount;

      const priceB = store.getters['demeris/getPrice']({ denom: reserveBaseDenoms.value[1] });
      total += priceB * receiveAmounts.value.coinB.amount;

      const displayTotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(total);

      return displayTotal;
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

    const generateActionsSteps = async () => {
      const action: WithdrawLiquidityAction = {
        name: 'withdrawliquidity',
        params: {
          pool_id: BigInt(pool.value.id),
          poolCoin: {
            amount: {
              denom: state.selectedAsset.base_denom,
              amount: (+state.amount * 1e6).toString(),
            },
            chain_name: state.selectedAsset.on_chain,
          },
        },
      };
      actionSteps.value = await actionHandler(action);
    };

    const resetHandler = () => {
      state.amount = 0;
      actionSteps.value = [];

      goToStep('amount');
    };

    onMounted(() => {
      state.selectedAsset = balances.value[0];
    });

    watch(
      () => [state.amount, state.selectedAsset, pool],
      () => {
        if (pool.value) {
          generateActionsSteps();
        }
      },
    );

    watch(
      () => [state.isMaximumAmountChecked, state.selectedAsset],
      () => {
        if (state.isMaximumAmountChecked && state.selectedAsset) {
          const precision = store.getters['demeris/getDenomPrecision']({ name: state.selectedAsset.base_denom }) || 6;
          state.amount = +parseCoins(state.selectedAsset.amount)[0].amount / Math.pow(10, precision);
        }
      },
    );

    return {
      dexChain,
      pool,
      pairName,
      state,
      steps,
      balances,
      receiveAmounts,
      gasPrice,
      actionSteps,
      totalEstimatedPrice,
      needsTransferToHub,
      reserveBaseDenoms,
      isValid,
      hasSufficientFunds,
      denomChangeHandler,
      toggleChainsModal,
      goToReview,
      goToStep,
      formatPoolName,
      goBack,
      onClose,
      resetHandler,
    };
  },
};
</script>

<style lang="scss">
.withdraw-liquidity {
  position: relative;
  padding-bottom: 2rem;

  &--insufficient-funds &__input__details__available {
    color: var(--negative-text);
  }

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

    &__fees {
      margin-top: 2.4rem;
      margin-left: -2.4rem;
      margin-right: -2.4rem;
    }
  }

  &__estimated {
    margin-top: 3.2rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 42rem;
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

      &:disabled {
        cursor: not-allowed;
        color: var(--inactive);
      }
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
    max-width: 42rem;
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
