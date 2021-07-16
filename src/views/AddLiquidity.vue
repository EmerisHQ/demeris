<template>
  <div class="add-liquidity">
    <header class="add-liquidity__header">
      <button class="add-liquidity__header__button" :disabled="state.step === 'send'" @click="goBack">
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

          <div v-if="hasPair" class="add-liquidity__pool">
            <div class="add-liquidity__pool__pair">
              <CircleSymbol
                :denom="hasPool ? pool.reserve_coin_denoms[0] : form.coinA.asset.base_denom"
                size="sm"
                class="add-liquidity__pool__pair__avatar token-a"
              />
              <CircleSymbol
                :denom="hasPool ? pool.reserve_coin_denoms[1] : form.coinB.asset.base_denom"
                size="sm"
                class="add-liquidity__pool__pair__avatar token-b"
              />
            </div>

            <span class="add-liquidity__pool__name">
              <Denom :name="hasPool ? pool.reserve_coin_denoms[0] : form.coinA.asset.base_denom" /> /
              <Denom :name="hasPool ? pool.reserve_coin_denoms[1] : form.coinB.asset.base_denom" />
            </span>
          </div>

          <div v-if="hasPair" class="add-liquidity__estimated">
            <input
              v-model="state.totalEstimatedPrice"
              type="number"
              step=".01"
              min="1"
              class="add-liquidity__estimated__price s-2 w-bold"
              @input="currencyAmountHandler"
            />
            <label class="add-liquidity__estimated__max">
              <input v-model="state.isMaximumAmountChecked" type="checkbox" name="add-liquidity__max" />
              <span class="elevation-button">Max</span>
            </label>
          </div>

          <div class="add-liquidity__content">
            <div class="add-liquidity__modal-wrapper">
              <ChainSelectModal
                v-if="state.isChainsModalOpen"
                title="Select chain"
                :assets="balances"
                :selected-denom="form[state.chainsModalSource].asset.base_denom"
                :func="() => toggleChainsModal()"
                @select="toggleChainsModal($event, state.chainsModalSource)"
              />
            </div>

            <div
              class="add-liquidity__input input-a elevation-card"
              :class="{ 'input-invalid': !hasSufficientFunds.coinA }"
            >
              <Alert v-if="hasPair && !hasPool" class="add-liquidity__create-warning elevation-card">
                <p class="add-liquidity__create-warning__title w-bold">Your are the first liquidity provider</p>
                <p class="add-liquidity__create-warning__description">
                  As the first liquidity provider to the <Denom :name="form.coinA.asset.base_denom" /> /
                  <Denom :name="form.coinB.asset.base_denom" />
                  pool, you will be creating the pool and setting the price. Proceed with caution.
                </p>
              </Alert>

              <div class="add-liquidity__input__main">
                <label class="add-liquidity__input__label s-minus">Supply</label>
                <div>
                  <DenomSelect
                    v-model:amount="form.coinA.amount"
                    :input-header="`Pay`"
                    :selected-denom="form.coinA.asset"
                    :assets="balances"
                    @select="coinSelectHandler('coinA', $event)"
                    @change="coinAChangeHandler"
                  />
                </div>
              </div>

              <div v-if="form.coinA.asset" class="add-liquidity__input__details">
                <button class="add-liquidity__input__details__from" @click="toggleChainsModal(null, 'coinA')">
                  From <span class="w-bold"><ChainName :name="form.coinA.asset.on_chain || '-'" /></span>
                </button>

                <div class="add-liquidity__input__details__available">
                  <AmountDisplay
                    :amount="{ amount: form.coinA.asset.amount || 0, denom: form.coinA.asset.base_denom }"
                  />
                  available
                </div>
              </div>
            </div>

            <div class="add-liquidity__price">
              <span class="add-liquidity__price__divider" />
              <div class="add-liquidity__price__container">
                <template v-if="form.coinA.asset && form.coinB.asset">
                  <AmountDisplay :amount="{ amount: 1e6, denom: form.coinA.asset.base_denom }" /> :
                  <AmountDisplay :amount="{ amount: exchangeAmount, denom: form.coinB.asset.base_denom }" />
                </template>
                <span v-else>Price</span>
              </div>
            </div>

            <div
              class="add-liquidity__input input-b elevation-card"
              :class="{ 'input-invalid': !hasSufficientFunds.coinB }"
            >
              <div class="add-liquidity__input__main">
                <label class="add-liquidity__input__label s-minus">Supply</label>
                <div>
                  <DenomSelect
                    v-model:amount="form.coinB.amount"
                    :input-header="`Pay`"
                    :selected-denom="form.coinB.asset"
                    :assets="balancesForSecond"
                    @select="coinSelectHandler('coinB', $event)"
                    @change="coinBChangeHandler"
                  />
                </div>
              </div>

              <div v-if="form.coinB.asset" class="add-liquidity__input__details">
                <button class="add-liquidity__input__details__from" @click="toggleChainsModal(null, 'coinB')">
                  From <span class="w-bold"><ChainName :name="form.coinB.asset.on_chain || '-'" /></span>
                </button>

                <div class="add-liquidity__input__details__available">
                  <AmountDisplay
                    :amount="{ amount: form.coinB.asset.amount || 0, denom: form.coinB.asset.base_denom }"
                  />
                  available
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
                  <CircleSymbol
                    :denom="hasPool ? pool.pool_coin_denom : ''"
                    :pool-denoms="hasPool ? [] : [form.coinA.asset?.base_denom, form.coinB.asset?.base_denom]"
                    size="sm"
                    class="add-liquidity__receive__token__avatar"
                  />
                  <span v-if="hasPool" class="w-bold">
                    <Denom :name="pool.pool_coin_denom" />
                  </span>
                  <span v-else class="w-bold">G-LK-LP</span>
                </div>

                <input
                  v-model="state.receiveAmount"
                  :readonly="!hasPool"
                  type="number"
                  class="add-liquidity__receive__amount w-bold"
                  @input="coinPoolChangeHandler"
                />
              </div>
            </div>

            <Alert v-if="hasPair && needsTransferToHub" status="info" class="add-liquidity__transfer-info">
              Your assets will be transferred to Cosmos Hub
            </Alert>

            <div class="add-liquidity__controls">
              <Button
                :name="hasSufficientFunds.total ? 'Continue' : 'Insufficient funds'"
                :disabled="!isValid"
                @click="goToReview"
              />
              <div class="add-liquidity__controls__fees">
                <FeeLevelSelector v-if="actionSteps.length > 0" v-model:gasPriceLevel="gasPrice" :steps="actionSteps" />
              </div>
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

      <template v-else>
        <section class="add-liquidity__content add-liquidity__review">
          <TxStepsModal
            :data="actionSteps"
            :gas-price-level="gasPrice"
            @transacting="goToStep('send')"
            @failed="goToStep('review')"
            @reset="resetHandler"
          />
        </section>
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
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
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
import { AddLiquidityAction, CreatePoolAction, Pool, Step } from '@/types/actions';
import { Balance } from '@/types/api';
import { actionHandler } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

export default {
  name: 'AddLiquidity',
  components: {
    AmountDisplay,
    Icon,
    CircleSymbol,
    Button,
    ChainName,
    Denom,
    DenomSelect,
    Alert,
    ChainSelectModal,
    TxStepsModal,
    FeeLevelSelector,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const poolId = computed(() => route.params.id as unknown as string);
    const pool = ref<Pool>();
    const actionSteps = ref<Step[]>([]);

    const steps = ['amount', 'review', 'send'];

    const state = reactive({
      step: 'amount',
      isTransferConfirmationOpen: false,
      isChainsModalOpen: false,
      chainsModalSource: 'coinA',
      isMaximumAmountChecked: false,
      totalEstimatedPrice: '0.00',
      receiveAmount: 0,
    });

    const gasPrice = computed(() => {
      return store.getters['demeris/getPreferredGasPriceLevel'];
    });

    const form = reactive<Record<string, { asset: Balance; amount: number }>>({
      coinA: {
        asset: undefined,
        amount: 0,
      },
      coinB: {
        asset: undefined,
        amount: 0,
      },
    });

    const { pools, getReserveBaseDenoms } = usePools();

    const hasPair = computed(() => {
      return !!form.coinA.asset && !!form.coinB.asset;
    });

    const { calculateSupplyTokenAmount, calculateWithdrawBalances } = usePool(computed(() => pool.value?.id));

    const { balances } = useAccount();

    const balancesForSecond = computed(() => {
      return balances.value.filter((item) => item.base_denom !== form.coinA.asset?.base_denom);
    });

    const hasPool = computed(() => {
      return !!pool.value;
    });

    const updateReceiveAmount = () => {
      if (!form.coinA.asset?.amount || !form.coinB.asset?.amount) {
        state.receiveAmount = 0;
        return;
      }

      state.receiveAmount = calculateSupplyTokenAmount(+form.coinA.amount, +form.coinB.amount);
    };

    const exchangeAmount = computed(() => {
      if (!hasPair.value) {
        return;
      }

      const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
      const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });

      if (!priceA || !priceB) {
        return 1e6;
      }

      return ((priceA / priceB) * 1e6).toFixed(6);
    });

    const hasSufficientFunds = computed(() => {
      let coinA = false;
      let coinB = false;

      if (form.coinA.asset) {
        const precisionA = store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom }) || 6;
        const amountA = form.coinA.amount * Math.pow(10, precisionA);
        coinA = +parseCoins(form.coinA.asset.amount)[0].amount >= amountA;
      }

      if (form.coinB.asset) {
        const precisionB = store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom }) || 6;
        const amountB = form.coinB.amount * Math.pow(10, precisionB);
        coinB = +parseCoins(form.coinB.asset.amount)[0].amount >= amountB;
      }

      return {
        coinA,
        coinB,
        total: coinA && coinB,
      };
    });

    const isValid = computed(() => {
      if (form.coinA.amount <= 0 || form.coinB.amount <= 0) {
        return false;
      }

      if (!hasSufficientFunds.value.total) {
        return false;
      }

      return true;
    });

    const needsTransferToHub = computed(() => {
      const hubName = store.getters['demeris/getDexChain'];

      if (form.coinA.asset?.on_chain !== hubName || form.coinB.asset?.on_chain !== hubName) {
        return true;
      }

      return false;
    });

    const updateTotalCurrencyPrice = () => {
      let total = 0;

      if (form.coinA.asset) {
        const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
        total += priceA * form.coinA.amount;
      }

      if (form.coinB.asset) {
        const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });
        total += priceB * form.coinB.amount;
      }

      state.totalEstimatedPrice = total.toFixed(2);
    };

    const generateActionSteps = async () => {
      let action: AddLiquidityAction | CreatePoolAction;
      const precisions = [
        store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom }) || 6,
        store.getters['demeris/getDenomPrecision']({ name: form.coinB.asset.base_denom }) || 6,
      ];
      let coinAdenom = form.coinA.asset.base_denom;
      if (form.coinA.asset.ibc.hash) {
        coinAdenom = 'ibc/' + form.coinA.asset.ibc.hash;
      }
      let coinBdenom = form.coinB.asset.base_denom;
      if (form.coinB.asset.ibc.hash) {
        coinBdenom = 'ibc/' + form.coinB.asset.ibc.hash;
      }
      const baseParams = {
        coinA: {
          amount: {
            amount: (+form.coinA.amount * Math.pow(10, precisions[0])).toString(),
            denom: coinAdenom,
          },
          chain_name: form.coinA.asset.on_chain,
        },
        coinB: {
          amount: {
            amount: (+form.coinB.amount * Math.pow(10, precisions[1])).toString(),
            denom: coinBdenom,
          },
          chain_name: form.coinB.asset.on_chain,
        },
      };

      if (hasPool.value) {
        action = {
          name: 'addliquidity',
          params: {
            pool_id: BigInt(pool.value.id),
            ...baseParams,
          },
        } as AddLiquidityAction;
      } else {
        action = {
          name: 'createpool',
          params: {
            ...baseParams,
          },
        } as CreatePoolAction;
      }
      const result = await actionHandler(action);
      actionSteps.value = result;
    };

    const findPoolByDenoms = async () => {
      if (hasPair.value) {
        const denoms = [form.coinA.asset.base_denom, form.coinB.asset.base_denom].sort();

        for (const poolIterator of pools.value) {
          const reserveDenoms = await getReserveBaseDenoms(poolIterator);

          if (reserveDenoms.join().toLowerCase() === denoms.join().toLowerCase()) {
            pool.value = poolIterator;
            return;
          }
        }
      }

      pool.value = undefined;
    };

    const onClose = () => {
      router.push('/pools');
    };

    const coinSelectHandler = (key: 'coinA' | 'coinB', balance: Balance) => {
      form[key].asset = balance;
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

      if (!hasPool.value) {
        state.isTransferConfirmationOpen = true;
        return;
      }

      goToStep('review');
    };

    const toggleChainsModal = (asset?: Balance, source: 'coinA' | 'coinB' = 'coinA') => {
      if (asset) {
        coinSelectHandler(source, asset);
      }
      state.chainsModalSource = source;
      state.isChainsModalOpen = !state.isChainsModalOpen;
    };

    const goToStep = (step: 'amount' | 'review' | 'send') => {
      state.step = step;
    };

    const resetHandler = () => {
      form.coinA.amount = 0;
      form.coinB.amount = 0;

      actionSteps.value = [];

      goToStep('amount');
    };

    const coinAChangeHandler = () => {
      state.isMaximumAmountChecked = false;

      if (!hasPair.value || !hasPool.value) {
        return;
      }

      const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
      const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });

      const result = (form.coinA.amount * priceA) / priceB;

      form.coinB.amount = +result.toFixed(6);
    };

    const coinBChangeHandler = () => {
      state.isMaximumAmountChecked = false;

      if (!hasPair.value || !hasPool.value) {
        return;
      }

      const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
      const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });

      const result = (form.coinB.amount * priceB) / priceA;

      form.coinA.amount = +result.toFixed(6);
    };

    const coinPoolChangeHandler = () => {
      state.isMaximumAmountChecked = false;
      const result = calculateWithdrawBalances(state.receiveAmount);

      form.coinA.amount = +(result[0].amount / 1e6).toFixed(6);
      form.coinB.amount = +(result[1].amount / 1e6).toFixed(6);
    };

    const currencyAmountHandler = () => {
      state.isMaximumAmountChecked = false;

      const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
      const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });

      form.coinA.amount = +(parseFloat(state.totalEstimatedPrice) / 2 / priceA).toFixed(6);
      form.coinB.amount = +(parseFloat(state.totalEstimatedPrice) / 2 / priceB).toFixed(6);
    };

    onMounted(async () => {
      if (!poolId.value) {
        return;
      }

      const poolFromRoute = pools.value.find((item) => item.id === poolId.value);

      if (poolFromRoute) {
        const poolBaseDenoms = await getReserveBaseDenoms(poolFromRoute);
        form.coinA.asset = balances.value.find((item) => item.base_denom === poolBaseDenoms[0]);
        form.coinB.asset = balances.value.find((item) => item.base_denom === poolBaseDenoms[1]);
      }
    });

    watch(
      [form.coinA.asset, form.coinB.asset, hasPair],
      async () => {
        await findPoolByDenoms();
      },
      { deep: true },
    );

    watch([form.coinA, form.coinB, pool, hasPair], async () => {
      if (hasPair.value) {
        await generateActionSteps();
      }
    });

    watch(
      () => [form.coinA.amount, form.coinB.amount],
      () => {
        updateTotalCurrencyPrice();
        updateReceiveAmount();
      },
    );

    watch(
      () => [state.isMaximumAmountChecked, form.coinA, form.coinB],
      () => {
        if (state.isMaximumAmountChecked) {
          if (form.coinA.asset) {
            const precision = store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom });
            form.coinA.amount = +parseCoins(form.coinA.asset.amount)[0].amount / Math.pow(10, precision);
          }

          if (form.coinB.asset) {
            const precision = store.getters['demeris/getDenomPrecision']({ name: form.coinB.asset.base_denom });
            form.coinB.amount = +parseCoins(form.coinB.asset.amount)[0].amount / Math.pow(10, precision);
          }
        }
      },
      { deep: true },
    );

    return {
      gasPrice,
      actionSteps,
      balances,
      balancesForSecond,
      pool,
      hasPool,
      hasPair,
      form,
      state,
      steps,
      needsTransferToHub,
      hasSufficientFunds,
      isValid,
      exchangeAmount,
      coinAChangeHandler,
      coinBChangeHandler,
      coinPoolChangeHandler,
      currencyAmountHandler,
      resetHandler,
      toggleChainsModal,
      goBack,
      goToReview,
      goToStep,
      coinSelectHandler,
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

  .denom-select__coin-amount-type {
    display: none;
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

    &__price {
      text-align: center;
      padding-right: 2rem;
      &:focus {
        outline: none;
      }
    }

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
      text-align: left;
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

  &__review {
    max-width: 44rem;
  }

  &__pool {
    margin-top: 1.6rem;
    display: flex;
    align-items: center;

    &__pair {
      display: inline-flex;
      align-items: center;
      margin-right: 0.8rem;

      &__avatar {
        &.token-a {
          z-index: 1;
        }

        & + & {
          margin-left: -0.6rem;
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

    &__fees {
      margin-top: 2.4rem;
      margin-left: -2.4rem;
      margin-right: -2.4rem;
    }
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
      display: flex;
      align-items: center;

      &__avatar {
        margin-right: 1.2rem;
      }
    }

    &__label {
      color: var(--muted);
    }

    &__amount {
      text-align: right;
      appearance: none;

      &:read-only {
        &::-webkit-inner-spin-button {
          appearance: none;
        }

        &:focus {
          outline: none;
        }
      }
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

    &.input-invalid &__details__available {
      color: var(--negative-text);
    }

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
