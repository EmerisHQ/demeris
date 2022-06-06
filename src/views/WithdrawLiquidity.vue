<template>
  <div class="flex w-full min-h-screen justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <header class="flex items-center justify-between py-6 h-24">
        <Button variant="link" :full-width="false" :disabled="state.step === 'send'" :click-function="goBack">
          <Icon name="ArrowLeftIcon" :icon-size="1.5" />
        </Button>

        <nav class="flex-1 flex items-center justify-center space-x-12">
          <span
            v-for="label of steps"
            :key="label"
            class="capitalize font-medium cursor-default"
            :class="state.step === label ? 'text-text' : 'text-inactive'"
          >
            {{ $t('components.withdrawLiquidity.navigation.' + label) }}
          </span>
        </nav>

        <Button class="ml-auto" variant="link" :click-function="onClose">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </header>

      <main class="pt-8 pb-28 flex-1 flex flex-col items-center justify-center">
        <template v-if="state.step === 'amount'">
          <div class="w-full max-w-lg mx-auto">
            <div class="pt-8 mb-8 text-center">
              <h1 class="text-3 font-bold">{{ $t('components.withdrawLiquidity.title') }}</h1>

              <p class="mt-3 text-muted">{{ pairName }}</p>
            </div>

            <fieldset v-if="hasPrices" class="mt-8 pb-8 min-w-0">
              <div class="relative text-4 font-bold px-20 w-full text-center transition-colors">
                <FlexibleAmountInput
                  v-model="state.totalEstimatedPrice"
                  prefix="$"
                  placeholder="0"
                  @input="currencyAmountHandler"
                />
                <div class="flex items-center absolute inset-y-0 right-0">
                  <Button
                    :click-function="
                      () => {
                        state.isMaximumAmountChecked = true;
                      }
                    "
                    :name="$t('generic_cta.max')"
                    class="flex"
                    :class="{ 'text-negative-text': !hasSufficientFunds }"
                    size="sm"
                    variant="secondary"
                    rounded
                  />
                </div>
              </div>
            </fieldset>

            <ChainSelectModal
              v-if="state.isChainsModalOpen"
              class="fixed inset-0 z-30 bg-bg"
              title="Select chain"
              :assets="balances"
              :selected-denom="pool.pool_coin_denom"
              :func="() => toggleChainsModal()"
              @select="toggleChainsModal($event)"
            />

            <fieldset class="bg-surface shadow-card rounded-2xl">
              <div class="w-full flex justify-between text-muted pt-6 px-5">
                <span>{{ $t('pages.withdrawLiquidity.withdraw') }}</span>

                <span v-if="state.selectedAsset" :class="{ 'text-negative-text': !hasSufficientFunds }">
                  <AmountDisplay
                    :amount="{ amount: state.selectedAsset.amount, denom: state.selectedAsset.base_denom }"
                  />
                  {{ $t('pages.withdrawLiquidity.available') }}
                </span>
              </div>
              <DenomSelect
                v-model:amount="state.amount"
                :input-header="``"
                :selected-denom="state.selectedAsset"
                :assets="[]"
                :show-chain="false"
                @change="coinPoolChangeHandler"
              />

              <button
                v-if="state.selectedAsset"
                class="py-4 px-5 flex items-center justify-between w-full outline-none text-left group active:opacity-70 transition-opacity text-muted hover:text-text focus:text-text border-t border-border rounded-b-2xl"
                @click="toggleChainsModal(null)"
              >
                <div>
                  {{ $t('pages.withdrawLiquidity.from') }}
                  <span class="font-medium text-text"><ChainName :name="state.selectedAsset.on_chain || '–'" /></span>
                </div>
                <Icon name="ChevronRightIcon" :icon-size="1" class="ml-2" />
              </button>
            </fieldset>

            <fieldset
              v-if="state.selectedAsset && state.receiveAmounts"
              class="relative mt-6 z-10 bg-surface shadow-card rounded-2xl"
            >
              <div class="text-muted pt-6 px-5">{{ $t('pages.withdrawLiquidity.receive') }}</div>

              <DenomSelect
                v-model:amount="state.receiveAmounts.coinA.amount"
                :input-header="``"
                :selected-denom="{ base_denom: reserveBaseDenoms[0], on_chain: state.selectedAsset.on_chain }"
                :assets="[]"
                :show-chain="false"
                @change="coinAChangeHandler"
                @select="() => void 0"
              />

              <hr class="ml-16 border-t border-border" />

              <DenomSelect
                v-model:amount="state.receiveAmounts.coinB.amount"
                :input-header="``"
                :selected-denom="{ base_denom: reserveBaseDenoms[1], on_chain: state.selectedAsset.on_chain }"
                :assets="[]"
                :show-chain="false"
                @change="coinBChangeHandler"
                @select="() => void 0"
              />

              <div class="py-4 px-5 w-full text-muted border-t border-border">
                {{ $t('pages.withdrawLiquidity.on') }} <ChainName :name="state.selectedAsset.on_chain || '–'" />
              </div>
            </fieldset>

            <div v-if="exchangeAmount" class="mt-2 w-full max-w-sm mx-auto">
              <ListItem inset size="md" label="Pool price">
                <AmountDisplay
                  :amount="{
                    amount: (10 ** precisionA).toString(),
                    denom: reserveBaseDenoms[0],
                  }"
                />
                =
                <AmountDisplay
                  :amount="{ amount: (exchangeAmount * 10 ** precisionDiff).toString(), denom: reserveBaseDenoms[1] }"
                />
              </ListItem>
              <div class="mt-6 mb-2">
                <FeeLevelSelector
                  v-if="actionSteps.length > 0"
                  :steps="actionSteps"
                  @update:fees="state.fees = $event"
                />
              </div>
              <Alert v-if="needsTransferToHub" status="info" class="w-full max-w-sm mx-auto my-6">
                {{ $t('pages.withdrawLiquidity.hubWarning') }}
              </Alert>
              <Button
                :name="hasSufficientFunds ? $t('generic_cta.continue') : $t('generic_cta.noFunds')"
                :disabled="!isValid"
                :click-function="goToReview"
              />
            </div>
          </div>
        </template>

        <template v-else>
          <TransactionProcessCreator
            :steps="actionSteps"
            action="withdrawliquidity"
            @pending="
              () => {
                closeModal();
                resetHandler();
              }
            "
            @close="
              () => {
                closeModal();
                resetHandler();
              }
            "
            @previous="goBack"
          />
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable max-lines */
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { computed, reactive, Ref, ref, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { WithdrawLiquidityAction } from '@/types/actions';
import { event, pageview } from '@/utils/analytics';
import { parseCoins } from '@/utils/basic';

const { t } = useI18n({ useScope: 'global' });

useMeta(
  computed(() => ({
    title: t('components.withdrawLiquidity.title'),
  })),
);

const route = useRoute();
const router = useRouter();
const store = useStore() as RootStoreTyped;
const transactionsStore = useTransactionsStore();

const actionSteps = ref([]);
pageview({ page_title: 'Withdraw Liquidity', page_path: '/pools/withdraw/' + route.params.id });
const poolId = computed(() => route.params.id as string);

usePools();
const { balancesByDenom } = useAccount();

const steps = ['amount', 'review', 'send'];

const state = reactive({
  step: 'amount',
  amount: '',
  isChainsModalOpen: false,
  isMaximumAmountChecked: false,
  selectedAsset: undefined,
  fees: {},
  totalEstimatedPrice: '',
  receiveAmounts: {
    coinA: {
      amount: '',
      denom: '',
    },
    coinB: {
      amount: '',
      denom: '',
    },
  },
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

let usePoolInstance: Ref<ReturnType<typeof usePool>> = ref(null);
watch(
  () => poolId.value,
  async () => {
    const inst = usePool(poolId);
    await inst.initPromise;
    usePoolInstance.value = inst;
  },
  { immediate: true },
);
const pool = computed(() => {
  return unref(usePoolInstance.value?.pool);
});
const pairName = computed(() => {
  return unref(usePoolInstance.value?.pairName);
});
const reserveBaseDenoms = computed(() => {
  return unref(usePoolInstance.value?.reserveBaseDenoms);
});
const reserveBalances = computed(() => {
  return unref(usePoolInstance.value?.reserveBalances);
});
const totalSupply = computed(() => {
  return unref(usePoolInstance.value?.totalSupply);
});
const isReverse = computed(() => pool.value.reserve_coin_denoms[0] !== reserveBalances.value[0].denom);
const coinA = computed(() => reserveBalances.value[isReverse.value ? 1 : 0]);
const coinB = computed(() => reserveBalances.value[isReverse.value ? 0 : 1]);
const precisionA = computed(
  () =>
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: reserveBaseDenoms.value[isReverse.value ? 1 : 0],
    }) || 6,
);
const precisionB = computed(
  () =>
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: reserveBaseDenoms.value[isReverse.value ? 0 : 1],
    }) || 6,
);

const precisionDiff = computed(() => {
  return (
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: reserveBaseDenoms.value[0] }) -
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: reserveBaseDenoms.value[1] })
  );
});

const exchangeAmount = computed(() => {
  if (reserveBalances.value?.length) {
    return new BigNumber(coinB.value.amount).dividedBy(coinA.value.amount).shiftedBy(6).toNumber();
  }

  return undefined;
});

const dexChain = computed(() => {
  return store.getters[GlobalGetterTypes.API.getDexChain];
});

// TODO: Fetch from API the wallet available amount
const balances = computed(() => {
  return balancesByDenom(pool.value?.pool_coin_denom);
});

const needsTransferToHub = computed(() => {
  if (state.selectedAsset?.on_chain !== dexChain.value) {
    return true;
  }

  return false;
});

const hasSufficientFunds = computed(() => {
  if (!state.selectedAsset) {
    return false;
  }

  const precision =
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: state.selectedAsset.base_denom }) || 6;
  const amount = new BigNumber(state.amount || 0).shiftedBy(precision);
  const fee = feesAmount.value[state.selectedAsset.base_denom] || 0;

  return amount.plus(fee).isLessThanOrEqualTo(parseCoins(state.selectedAsset.amount)[0].amount);
});

const hasPrices = computed(() => {
  if (!reserveBaseDenoms.value?.length) {
    return false;
  }

  const priceA = store.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[0] });
  const priceB = store.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[1] });

  if (!priceA || !priceB) {
    return false;
  }

  return true;
});

const isValid = computed(() => {
  if (+state.amount <= 0) {
    return false;
  }

  if (!hasSufficientFunds.value) {
    return false;
  }

  return true;
});

const updateReceiveAmount = () => {
  if (!pool.value) {
    return;
  }

  if (!+state.receiveAmounts.coinA.amount && !+state.receiveAmounts.coinB.amount) {
    state.amount = '';
    return;
  }
  const amountA = state.receiveAmounts.coinA.amount;
  const amountB = state.receiveAmounts.coinB.amount;

  const result = usePoolInstance.value.calculateSupplyTokenAmount([
    {
      amount: new BigNumber(amountA).shiftedBy(isReverse.value ? precisionB.value : precisionA.value).toNumber(),
      denom: reserveBaseDenoms.value[0],
    },
    {
      amount: new BigNumber(amountB).shiftedBy(isReverse.value ? precisionA.value : precisionB.value).toNumber(),
      denom: reserveBaseDenoms.value[1],
    },
  ]);

  state.amount = new BigNumber(result).shiftedBy(-6).decimalPlaces(6).toString();
};

const closeModal = () => {
  router.push('/');
};

const updateTotalCurrencyPrice = () => {
  let total = new BigNumber(0);

  if (!hasPrices.value) {
    return;
  }

  const priceA = store.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[0] });
  total = total.plus(new BigNumber(priceA).multipliedBy(state.receiveAmounts.coinA.amount));

  const priceB = store.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[1] });
  total = total.plus(new BigNumber(priceB).multipliedBy(state.receiveAmounts.coinB.amount));

  state.totalEstimatedPrice = total.isFinite() ? total.toFixed(2) : '';
};

const currencyAmountHandler = () => {
  state.isMaximumAmountChecked = false;

  if (!state.totalEstimatedPrice || +!state.totalEstimatedPrice) {
    state.amount = '';
    state.receiveAmounts.coinA.amount = '';
    state.receiveAmounts.coinB.amount = '';
    return;
  }

  const isReverse = reserveBalances.value[0].base_denom !== reserveBaseDenoms.value[0];

  const priceA = store.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[0] });
  const priceB = store.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[1] });

  const totalA = new BigNumber(reserveBalances.value[isReverse ? 1 : 0].amount)
    .multipliedBy(priceA)
    .shiftedBy(isReverse ? -precisionB.value : -precisionA.value);
  const totalB = new BigNumber(reserveBalances.value[isReverse ? 0 : 1].amount)
    .multipliedBy(priceB)
    .shiftedBy(isReverse ? -precisionA.value : -precisionB.value);
  const pricePerCoin = new BigNumber(totalSupply.value).shiftedBy(-6).dividedBy(totalA.plus(totalB));
  const poolCoinAmount = new BigNumber(state.totalEstimatedPrice).multipliedBy(pricePerCoin);

  const result = usePoolInstance.value.getPoolWithdrawBalances(poolCoinAmount.shiftedBy(6).toNumber());

  state.receiveAmounts.coinA.amount = new BigNumber(result[isReverse ? 1 : 0].amount)
    .shiftedBy(isReverse ? -precisionB.value : -precisionA.value)
    .decimalPlaces(6)
    .toString();
  state.receiveAmounts.coinB.amount = new BigNumber(result[isReverse ? 0 : 1].amount)
    .shiftedBy(isReverse ? -precisionA.value : -precisionB.value)
    .decimalPlaces(6)
    .toString();
  updateReceiveAmount();
};

const coinAChangeHandler = () => {
  state.isMaximumAmountChecked = false;

  if (!exchangeAmount.value) {
    return;
  }

  const result = new BigNumber(exchangeAmount.value)
    .shiftedBy(-6)
    .multipliedBy(state.receiveAmounts.coinA.amount)
    .shiftedBy(isReverse.value ? precisionB.value : precisionA.value);
  state.receiveAmounts.coinB.amount = result.isFinite()
    ? result
        .shiftedBy(isReverse.value ? -precisionA.value : -precisionB.value)
        .decimalPlaces(6)
        .toString()
    : '';
  updateReceiveAmount();
  updateTotalCurrencyPrice();
};

const coinBChangeHandler = () => {
  state.isMaximumAmountChecked = false;

  if (!exchangeAmount.value) {
    return;
  }

  const result = new BigNumber(state.receiveAmounts.coinB.amount)
    .dividedBy(new BigNumber(exchangeAmount.value).shiftedBy(-6))
    .shiftedBy(isReverse.value ? precisionA.value : precisionB.value);
  state.receiveAmounts.coinA.amount = result.isFinite()
    ? result
        .shiftedBy(isReverse.value ? -precisionB.value : -precisionA.value)
        .decimalPlaces(6)
        .toString()
    : '';
  updateReceiveAmount();
  updateTotalCurrencyPrice();
};

const coinPoolChangeHandler = () => {
  state.isMaximumAmountChecked = false;
  const result = usePoolInstance.value.getPoolWithdrawBalances(new BigNumber(state.amount).shiftedBy(6).toNumber());

  state.receiveAmounts.coinA.amount = new BigNumber(result[isReverse.value ? 1 : 0].amount)
    .shiftedBy(isReverse.value ? -precisionB.value : -precisionA.value)
    .decimalPlaces(6)
    .toString();
  state.receiveAmounts.coinB.amount = new BigNumber(result[isReverse.value ? 0 : 1].amount)
    .shiftedBy(isReverse.value ? -precisionA.value : -precisionB.value)
    .decimalPlaces(6)
    .toString();
  updateTotalCurrencyPrice();
};

const toggleChainsModal = (asset?: EmerisAPI.Balance) => {
  if (asset) {
    state.selectedAsset = asset;
  }
  state.isChainsModalOpen = !state.isChainsModalOpen;
};

const onClose = () => {
  transactionsStore.setTransactionAsPending();
  router.push('/pools');
};

const goBack = () => {
  transactionsStore.removeTransaction(transactionsStore.currentId);
  const currentStepIndex = steps.findIndex((item) => item === state.step);

  if (currentStepIndex > 0) {
    state.step = steps[currentStepIndex - 1];
    return;
  }

  router.back();
};

const goToReview = () => {
  event('review_tx', {
    event_label: 'Reviewing withdraw liquidity tx',
    event_category: 'transactions',
  });

  goToStep('review');
};

const goToStep = (step: 'amount' | 'review' | 'send') => {
  state.step = step;
};

const generateActionsSteps = async () => {
  const action: WithdrawLiquidityAction = {
    name: 'withdrawliquidity',
    params: {
      pool_id: BigInt(pool.value.id),
      poolCoin: {
        denom: state.selectedAsset.base_denom,
        amount: new BigNumber(state.amount).shiftedBy(6).toString(),
        chain_name: state.selectedAsset.on_chain,
      },
    },
  };
  actionSteps.value = await actionHandler(action);
};

const resetHandler = () => {
  state.amount = '';
  actionSteps.value = [];
  updateTotalCurrencyPrice();

  goToStep('amount');
};

watch(
  balances,
  () => {
    if (!state.selectedAsset) {
      state.selectedAsset = balances.value[0];
    }
  },
  { immediate: true },
);

watch(
  () => [state.amount, state.selectedAsset, pool],
  () => {
    if (pool.value) {
      generateActionsSteps();
    }
  },
);

watch(
  () => [state.isMaximumAmountChecked, state.selectedAsset, state.fees],
  () => {
    if (state.isMaximumAmountChecked && state.selectedAsset) {
      const precision =
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: state.selectedAsset.base_denom }) || 6;
      const assetAmount = new BigNumber(parseCoins(state.selectedAsset.amount)[0].amount);
      const fee = feesAmount.value[state.selectedAsset.base_denom] || 0;

      state.amount = assetAmount.minus(fee).shiftedBy(-precision).decimalPlaces(precision).toString();
      const result = usePoolInstance.value.getPoolWithdrawBalances(new BigNumber(state.amount).shiftedBy(6).toNumber());

      state.receiveAmounts.coinA.amount = new BigNumber(result[isReverse.value ? 1 : 0].amount)
        .shiftedBy(isReverse.value ? -precisionB.value : -precisionA.value)
        .decimalPlaces(6)
        .toString();
      state.receiveAmounts.coinB.amount = new BigNumber(result[isReverse.value ? 0 : 1].amount)
        .shiftedBy(isReverse.value ? -precisionA.value : -precisionB.value)
        .decimalPlaces(6)
        .toString();
      updateTotalCurrencyPrice();
    }
  },
);
</script>

<style lang="scss"></style>
