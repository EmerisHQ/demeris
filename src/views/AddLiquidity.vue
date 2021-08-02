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
        <template v-if="!state.isCreationConfirmationOpen">
          <h2 class="add-liquidity__title s-2">
            {{ hasPair && !hasPool ? 'Create Liquidity' : 'Add Liquidity' }}
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
              <Ticker :name="hasPool ? pool.reserve_coin_denoms[0] : form.coinA.asset.base_denom" /> /
              <Ticker :name="hasPool ? pool.reserve_coin_denoms[1] : form.coinB.asset.base_denom" />
            </span>
          </div>

          <div v-if="hasPrices" class="add-liquidity__estimated">
            <FlexibleAmountInput
              v-model="state.totalEstimatedPrice"
              :max-width="250"
              :min-width="32"
              prefix="$"
              placeholder="0"
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
                  As the first liquidity provider to the <Ticker :name="form.coinA.asset.base_denom" /> /
                  <Ticker :name="form.coinB.asset.base_denom" />
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
                <template v-if="exchangeAmount">
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
                    <Ticker :name="pool.pool_coin_denom" />
                  </span>
                  <span v-else class="w-bold">G-LK-LP</span>
                </div>

                <AmountInput
                  v-model="state.receiveAmount"
                  :readonly="!hasPool"
                  placeholder="0"
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
                <FeeLevelSelector
                  v-if="actionSteps.length > 0"
                  v-model:gasPriceLevel="gasPrice"
                  :steps="actionSteps"
                  @update:fees="state.fees = $event"
                />
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="state.isCreationConfirmationOpen">
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
                @click="state.isCreationConfirmationOpen = false"
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
            action-name="addliquidity"
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
import { computed, onMounted, reactive, ref, toRefs, watch } from '@vue/runtime-core';
import BigNumber from 'bignumber.js';
import { useRoute, useRouter } from 'vue-router';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Ticker from '@/components/common/Ticker.vue';
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import Alert from '@/components/ui/Alert.vue';
import AmountInput from '@/components/ui/AmountInput.vue';
import Button from '@/components/ui/Button.vue';
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import { AddLiquidityAction, CreatePoolAction, Pool, Step } from '@/types/actions';
import { Balance, Balances } from '@/types/api';
import { actionHandler } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

export default {
  name: 'AddLiquidity',
  components: {
    Alert,
    AmountDisplay,
    AmountInput,
    Button,
    ChainName,
    ChainSelectModal,
    CircleSymbol,
    Ticker,
    DenomSelect,
    FeeLevelSelector,
    FlexibleAmountInput,
    Icon,
    TxStepsModal,
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
      isCreationConfirmationOpen: false,
      isChainsModalOpen: false,
      chainsModalSource: 'coinA',
      isMaximumAmountChecked: false,
      totalEstimatedPrice: '',
      receiveAmount: '',
      poolBaseDenoms: [],
      fees: {},
    });

    const gasPrice = computed(() => {
      return store.getters['demeris/getPreferredGasPriceLevel'];
    });

    const hasPrices = computed(() => {
      if (!hasPool.value) {
        return false;
      }

      if (!hasPair.value) {
        return false;
      }

      const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
      const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });

      if (!priceA || !priceB) {
        return false;
      }

      return true;
    });

    const form = reactive<Record<string, { asset: Balance; amount: string }>>({
      coinA: {
        asset: undefined,
        amount: '',
      },
      coinB: {
        asset: undefined,
        amount: '',
      },
    });

    const feesAmount = computed(() => {
      const result = {};

      for (const [, obj] of Object.entries(state.fees)) {
        for (const [denom, value] of Object.entries(obj)) {
          result[denom] = value;
        }
      }

      return result;
    });

    const { pools, getReserveBaseDenoms } = usePools();

    const hasPair = computed(() => {
      return !!form.coinA.asset && !!form.coinB.asset;
    });

    const { calculateSupplyTokenAmount, calculateWithdrawBalances, reserveBalances, totalSupply } = usePool(
      computed(() => pool.value?.id),
    );

    const { balances: userBalances, getNativeBalances } = useAccount();

    const balances = computed(() => {
      const nativeBalances = getNativeBalances();
      const result = [...userBalances.value];

      for (const nativeBalance of nativeBalances) {
        const hasBalance = userBalances.value.some(
          (item) => item.on_chain === nativeBalance.on_chain && item.base_denom === nativeBalance.base_denom,
        );
        if (!hasBalance) {
          result.push(nativeBalance);
        }
      }

      result.sort((a, b) => {
        const coinA = parseCoins(a.amount)[0];
        const coinB = parseCoins(b.amount)[0];
        return +coinB.amount - +coinA.amount;
      });

      return result;
    });

    const balancesForSecond = computed(() => {
      return balances.value.filter((item) => item.base_denom !== form.coinA.asset?.base_denom);
    });

    const hasPool = computed(() => {
      return !!pool.value;
    });

    const updateReceiveAmount = () => {
      if (!hasPool.value) {
        state.receiveAmount = '1';
        return;
      }

      if (!form.coinA.amount || !form.coinB.amount) {
        state.receiveAmount = undefined;
        return;
      }

      const result = calculateSupplyTokenAmount(+form.coinA.amount, +form.coinB.amount);
      state.receiveAmount = (+result.toFixed(6)).toString();
    };

    const exchangeAmount = computed(() => {
      if (!hasPair.value) {
        return;
      }

      if (!hasPool.value && (!form.coinB.amount || !form.coinA.amount)) {
        return;
      }

      if (!hasPool.value) {
        return ((+form.coinB.amount || 1) / (+form.coinA.amount || 1)) * 1e6;
      }

      if (reserveBalances.value?.length) {
        return new BigNumber(reserveBalances.value[1].amount)
          .dividedBy(reserveBalances.value[0].amount)
          .shiftedBy(6)
          .toNumber();
      }

      return undefined;
    });

    const hasSufficientFunds = computed(() => {
      let coinA = true;
      let coinB = true;

      if (form.coinA.asset && form.coinA.amount) {
        const precisionA = store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom }) || 6;
        const amountA = new BigNumber(form.coinA.amount).shiftedBy(precisionA);
        const feeA = feesAmount.value[form.coinA.asset.base_denom] || 0;
        coinA = amountA.plus(feeA).isLessThanOrEqualTo(parseCoins(form.coinA.asset.amount)[0].amount);
      }

      if (form.coinB.asset && form.coinB.amount) {
        const precisionB = store.getters['demeris/getDenomPrecision']({ name: form.coinB.asset.base_denom }) || 6;
        const amountB = new BigNumber(form.coinB.amount).shiftedBy(precisionB);
        const feeB = feesAmount.value[form.coinB.asset.base_denom] || 0;
        coinB = amountB.plus(feeB).isLessThanOrEqualTo(parseCoins(form.coinB.asset.amount)[0].amount);
      }

      return {
        coinA,
        coinB,
        total: coinA && coinB,
      };
    });

    const isValid = computed(() => {
      if (+form.coinA.amount <= 0 || +form.coinB.amount <= 0) {
        return false;
      }

      if (!hasPool.value && (+form.coinA.amount < 1 || +form.coinB.amount < 1)) {
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
      if (!state.receiveAmount && !form.coinA.amount && !form.coinB.amount) {
        return;
      }

      if (!hasPrices.value) {
        return;
      }

      let total = new BigNumber(0);

      if (form.coinA.asset) {
        const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
        total = total.plus(new BigNumber(priceA).multipliedBy(form.coinA.amount));
      }

      if (form.coinB.asset) {
        const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });
        total = total.plus(new BigNumber(priceB).multipliedBy(form.coinB.amount));
      }

      state.totalEstimatedPrice = total.isFinite() ? total.decimalPlaces(2).toString() : '';
    };

    const generateActionSteps = async () => {
      let action: AddLiquidityAction | CreatePoolAction;
      const precisions = [
        store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom }) || 6,
        store.getters['demeris/getDenomPrecision']({ name: form.coinB.asset.base_denom }) || 6,
      ];
      let coinAdenom = form.coinA.asset.base_denom;
      if (form.coinA.asset.ibc?.hash) {
        coinAdenom = 'ibc/' + form.coinA.asset.ibc.hash;
      }
      let coinBdenom = form.coinB.asset.base_denom;
      if (form.coinB.asset.ibc?.hash) {
        coinBdenom = 'ibc/' + form.coinB.asset.ibc.hash;
      }
      const baseParams = {
        coinA: {
          amount: {
            amount: new BigNumber(form.coinA.amount).shiftedBy(precisions[0]).toString(),
            denom: coinAdenom,
          },
          chain_name: form.coinA.asset.on_chain,
        },
        coinB: {
          amount: {
            amount: new BigNumber(form.coinB.amount).shiftedBy(precisions[1]).toString(),
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
        const baseDenoms = [form.coinA.asset.base_denom, form.coinB.asset.base_denom].sort();
        const denoms = [
          parseCoins(form.coinA.asset.amount)[0].denom,
          parseCoins(form.coinB.asset.amount)[0].denom,
        ].sort();

        for (const poolIterator of pools.value) {
          const reserveDenoms = await getReserveBaseDenoms(poolIterator);

          if (
            reserveDenoms.sort().join().toLowerCase() === baseDenoms.join().toLowerCase() ||
            poolIterator.reserve_coin_denoms.join().toLowerCase() === denoms.join().toLowerCase()
          ) {
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
      if (state.isCreationConfirmationOpen) {
        goToStep('review');
        state.isCreationConfirmationOpen = false;
        return;
      }

      if (!hasPool.value) {
        state.isCreationConfirmationOpen = true;
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
      form.coinA.amount = '';
      form.coinB.amount = '';
      state.receiveAmount = '';
      state.totalEstimatedPrice = '';
      updateTotalCurrencyPrice();
      updateReceiveAmount();

      actionSteps.value = [];

      goToStep('amount');
    };

    const coinAChangeHandler = () => {
      state.isMaximumAmountChecked = false;

      if (!hasPair.value || !hasPool.value) {
        updateReceiveAmount();
        return;
      }

      if (!exchangeAmount.value) {
        return;
      }

      const result = new BigNumber(exchangeAmount.value).shiftedBy(-6).multipliedBy(form.coinA.amount);

      form.coinB.amount = result.isFinite() ? result.decimalPlaces(6).toString() : '';
      updateTotalCurrencyPrice();
      updateReceiveAmount();
    };

    const coinBChangeHandler = () => {
      state.isMaximumAmountChecked = false;

      if (!hasPair.value || !hasPool.value) {
        updateReceiveAmount();
        return;
      }

      if (!exchangeAmount.value) {
        return;
      }

      const result = new BigNumber(exchangeAmount.value).shiftedBy(-6).dividedBy(form.coinB.amount);

      form.coinA.amount = result.isFinite() ? result.decimalPlaces(6).toString() : '';
      updateTotalCurrencyPrice();
      updateReceiveAmount();
    };

    const coinPoolChangeHandler = () => {
      state.isMaximumAmountChecked = false;
      const result = calculateWithdrawBalances(+state.receiveAmount);

      form.coinA.amount = new BigNumber(result[0].amount).decimalPlaces(6).toString();
      form.coinB.amount = new BigNumber(result[1].amount).decimalPlaces(6).toString();
      updateTotalCurrencyPrice();
    };

    const currencyAmountHandler = () => {
      state.isMaximumAmountChecked = false;

      if (!state.totalEstimatedPrice || +!state.totalEstimatedPrice) {
        form.coinA.amount = undefined;
        form.coinB.amount = undefined;
        state.receiveAmount = undefined;
        return;
      }

      const precisionA = store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom }) || 6;
      const precisionB = store.getters['demeris/getDenomPrecision']({ name: form.coinB.asset.base_denom }) || 6;

      const priceA = store.getters['demeris/getPrice']({ denom: form.coinA.asset.base_denom });
      const priceB = store.getters['demeris/getPrice']({ denom: form.coinB.asset.base_denom });

      const totalA = new BigNumber(reserveBalances.value[0].amount).shiftedBy(-precisionA).multipliedBy(priceA);
      const totalB = new BigNumber(reserveBalances.value[1].amount).shiftedBy(-precisionB).multipliedBy(priceB);
      const pricePerCoin = new BigNumber(totalSupply.value).shiftedBy(-6).dividedBy(totalA.plus(totalB));
      const poolCoinAmount = new BigNumber(state.totalEstimatedPrice).multipliedBy(pricePerCoin);

      const result = calculateWithdrawBalances(poolCoinAmount.toNumber());

      form.coinA.amount = new BigNumber(result[0].amount).decimalPlaces(6).toString();
      form.coinB.amount = new BigNumber(result[1].amount).decimalPlaces(6).toString();
      updateReceiveAmount();
    };

    onMounted(async () => {
      if (!poolId.value) {
        return;
      }

      const poolFromRoute = pools.value.find((item) => item.id === poolId.value);

      if (poolFromRoute) {
        const poolBaseDenoms = await getReserveBaseDenoms(poolFromRoute);
        state.poolBaseDenoms = poolBaseDenoms;
        form.coinA.asset = balances.value.find((item) => item.base_denom === poolBaseDenoms[0]);
        form.coinB.asset = balances.value.find((item) => item.base_denom === poolBaseDenoms[1]);
      }
    });

    const { asset: assetA } = toRefs(form.coinA);
    const { asset: assetB } = toRefs(form.coinB);

    watch(
      [assetA, assetB, hasPair],
      async ([assetANew, assetBNew], [assetAOld, assetBOld]) => {
        if (assetANew?.base_denom === assetBNew?.base_denom) {
          form.coinB.asset = undefined;
        }

        if (assetANew?.base_denom > assetBNew?.base_denom) {
          form.coinA.asset = assetBNew;
          form.coinB.asset = assetANew;
        }

        await findPoolByDenoms();

        if (assetANew?.base_denom !== assetAOld?.base_denom || assetBNew?.base_denom !== assetBOld?.base_denom) {
          resetHandler();
        }
      },
      {
        immediate: true,
      },
    );

    watch([form.coinA, form.coinB, pool, hasPair], async () => {
      if (hasPair.value) {
        await generateActionSteps();
      }
    });

    watch(
      () => [state.isMaximumAmountChecked, form.coinA, form.coinB, state.fees],
      () => {
        if (state.isMaximumAmountChecked) {
          if (form.coinA.asset && form.coinB.asset) {
            const precisionA = store.getters['demeris/getDenomPrecision']({ name: form.coinA.asset.base_denom }) || 6;
            const amountA = parseCoins(form.coinA.asset.amount)[0].amount;
            const feeA = feesAmount.value[form.coinA.asset.base_denom] || 0;

            const precisionB = store.getters['demeris/getDenomPrecision']({ name: form.coinB.asset.base_denom }) || 6;
            const amountB = parseCoins(form.coinB.asset.amount)[0].amount;
            const feeB = feesAmount.value[form.coinB.asset.base_denom] || 0;

            const bigExchangeAmount = new BigNumber(exchangeAmount.value).shiftedBy(-6);

            const bigAmountA = new BigNumber(amountA).minus(feeA);

            const bigAmountB = new BigNumber(amountB).minus(feeB);

            const minAmount = BigNumber.minimum(bigAmountA, bigAmountB.dividedBy(bigExchangeAmount));

            if (minAmount.isEqualTo(bigAmountA)) {
              form.coinA.amount = bigAmountA.shiftedBy(-precisionA).decimalPlaces(precisionA).toString();

              form.coinB.amount = bigAmountA
                .multipliedBy(bigExchangeAmount)
                .shiftedBy(-precisionB)
                .decimalPlaces(precisionB)
                .toString();
            } else {
              form.coinB.amount = bigAmountB.shiftedBy(-precisionB).decimalPlaces(precisionB).toString();

              form.coinA.amount = bigAmountB
                .dividedBy(bigExchangeAmount)
                .shiftedBy(-precisionA)
                .decimalPlaces(precisionA)
                .toString();
            }
          }

          updateReceiveAmount();
          updateTotalCurrencyPrice();
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
      hasPrices,
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
      font-size: 5.1rem;
      font-weight: 600;

      &::placeholder {
        color: red;
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
