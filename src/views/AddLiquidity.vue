<template>
  <div class="flex w-full min-h-screen justify-center">
    <div class="max-w-7xl mx-auto px-8 w-full flex-1 flex flex-col items-stretch">
      <header class="flex items-center justify-between py-6 h-24">
        <Button variant="link" :full-width="false" :disabled="state.step === 'send'" @click="goBack">
          <Icon name="ArrowLeftIcon" :icon-size="1.5" />
        </Button>

        <nav class="flex-1 flex items-center justify-center space-x-12">
          <span
            v-for="label of steps"
            :key="label"
            class="capitalize font-medium cursor-default"
            :class="state.step === label ? 'text-text' : 'text-inactive'"
          >
            {{ $t('components.addLiquidity.navigation.' + label) }}
          </span>
        </nav>

        <Button class="ml-auto" variant="link" @click="onClose">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </header>

      <main class="pt-8 pb-28 flex-1 flex flex-col items-center justify-center">
        <template v-if="state.step === 'amount'">
          <div class="w-full max-w-lg mx-auto">
            <template v-if="!state.isCreationConfirmationOpen">
              <div class="pt-8 mb-8 text-center">
                <h1 class="text-3 font-bold">
                  {{ pageTitle }}
                </h1>

                <p v-if="!hasPair" class="mt-3 text-muted">{{ $t('pages.addLiquidity.selectCTA') }}</p>
                <div v-else class="mt-3 text-muted">
                  <Ticker
                    :name="hasPool ? pool.reserve_coin_denoms[isReversePairName ? 1 : 0] : form.coinA.asset.base_denom"
                  />
                  <span class="mx-1">&middot;</span>
                  <Ticker
                    :name="hasPool ? pool.reserve_coin_denoms[isReversePairName ? 0 : 1] : form.coinB.asset.base_denom"
                  />
                  {{ $t('pages.addLiquidity.pool') }}
                </div>
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
                :show-subtitle="false"
                :assets="balances"
                :selected-denom="form[state.chainsModalSource].asset.base_denom"
                :func="() => toggleChainsModal()"
                @select="toggleChainsModal($event, state.chainsModalSource)"
              />

              <Alert v-if="hasPair && !hasPool" status="warning" class="my-6 max-w-sm mx-auto">
                <p class="font-bold">{{ $t('pages.addLiquidity.firstProvider') }}</p>
                <p class="mt-0.5">
                  {{ $t('pages.addLiquidity.firstProviderWarning', { tickerA, tickerB }) }}
                </p>
              </Alert>

              <fieldset class="bg-surface shadow-card rounded-2xl">
                <div class="w-full flex justify-between text-muted pt-6 px-5">
                  <span>{{ $t('pages.addLiquidity.supplyLbl') }}</span>

                  <span
                    v-if="form.coinA.asset && hasFunds.coinA"
                    :class="{ 'text-negative-text': !hasSufficientFunds.coinA }"
                  >
                    <AmountDisplay
                      :amount="{ amount: form.coinA.asset.amount || 0, denom: form.coinA.asset.base_denom }"
                    />
                    {{ $t('pages.addLiquidity.available') }}
                  </span>
                  <router-link
                    v-else-if="form.coinA.asset"
                    :to="{ name: 'Asset', params: { denom: form.coinA.asset.base_denom } }"
                    class="font-medium text-link hover:text-link-hover focus:text-link-hover active:opacity-70 transition"
                  >
                    <span>{{ $t('generic_cta.get') }}&nbsp;</span>
                    <Denom :name="form.coinA.asset.base_denom" /> &rarr;
                  </router-link>
                </div>
                <DenomSelect
                  v-model:amount="form.coinA.amount"
                  :input-header="`Pay`"
                  :selected-denom="form.coinA.asset"
                  :assets="balances"
                  :show-chain="false"
                  @select="coinSelectHandler('coinA', $event)"
                  @change="coinAChangeHandler"
                />

                <button
                  v-if="form.coinA.asset"
                  class="py-4 px-5 flex items-center justify-between w-full outline-none text-left group active:opacity-70 transition-opacity text-muted hover:text-text focus:text-text border-t border-border rounded-b-2xl"
                  @click="toggleChainsModal(null, 'coinA')"
                >
                  <div>
                    {{ $t('pages.addLiquidity.fromLbl') }}
                    <span class="font-medium text-text"><ChainName :name="form.coinA.asset.on_chain || '-'" /></span>
                  </div>
                  <Icon name="ChevronRightIcon" :icon-size="1" class="ml-2" />
                </button>
              </fieldset>

              <fieldset class="bg-surface shadow-card rounded-2xl mt-4">
                <div class="w-full flex justify-between text-muted pt-6 px-5">
                  <span>{{ $t('pages.addLiquidity.supplyLbl') }}</span>

                  <span
                    v-if="form.coinB.asset && hasFunds.coinB"
                    :class="{ 'text-negative-text': !hasSufficientFunds.coinB }"
                  >
                    <AmountDisplay
                      :amount="{ amount: form.coinB.asset.amount || 0, denom: form.coinB.asset.base_denom }"
                    />
                    {{ $t('pages.addLiquidity.available') }}
                  </span>
                  <router-link
                    v-else-if="form.coinB.asset"
                    :to="{ name: 'Asset', params: { denom: form.coinB.asset.base_denom } }"
                    class="font-medium text-link hover:text-link-hover focus:text-link-hover active:opacity-70 transition"
                  >
                    <span>{{ $t('generic_cta.get') }}&nbsp;</span>
                    <Denom :name="form.coinB.asset.base_denom" /> &rarr;
                  </router-link>
                </div>
                <DenomSelect
                  v-model:amount="form.coinB.amount"
                  :input-header="`Pay`"
                  :selected-denom="form.coinB.asset"
                  :assets="balancesForSecond"
                  :show-chain="false"
                  @select="coinSelectHandler('coinB', $event)"
                  @change="coinBChangeHandler"
                />

                <button
                  v-if="form.coinB.asset"
                  class="py-4 px-5 flex items-center justify-between w-full outline-none text-left group active:opacity-70 transition-opacity text-muted hover:text-text focus:text-text border-t border-border rounded-b-2xl"
                  @click="toggleChainsModal(null, 'coinB')"
                >
                  <div>
                    {{ $t('pages.addLiquidity.fromLbl') }}
                    <span class="font-medium text-text"><ChainName :name="form.coinB.asset.on_chain || '-'" /></span>
                  </div>
                  <Icon name="ChevronRightIcon" :icon-size="1" class="ml-2" />
                </button>
              </fieldset>

              <div class="mt-2 w-full max-w-sm mx-auto">
                <ListItem v-if="exchangeAmount" inset size="md" label="Price">
                  <AmountDisplay :amount="{ amount: exchangeAmount.coinA, denom: form.coinA.asset.base_denom }" />
                  &asymp;
                  <AmountDisplay :amount="{ amount: exchangeAmount.coinB, denom: form.coinB.asset.base_denom }" />
                </ListItem>
                <ListItem v-if="hasPair" inset size="md" label="Receive LP asset">
                  <div class="flex items-center justify-end text-left">
                    <div
                      v-tippy="{ placement: 'right' }"
                      className="flex items-center"
                      :content="$t('pages.addLiquidity.receiveLpAsset')"
                    >
                      <CircleSymbol
                        :denom="hasPool ? pool.pool_coin_denom : ''"
                        :pool-denoms="hasPool ? [] : [form.coinA.asset?.base_denom, form.coinB.asset?.base_denom]"
                        size="sm"
                        class="mr-3"
                      />
                      <span class="font-medium">
                        {{ state.receiveAmount }}
                        <span class="font-bold">
                          <Ticker :name="hasPool ? pool.pool_coin_denom : previewPoolCoinDenom" />
                        </span>
                      </span>
                    </div>
                  </div>
                </ListItem>

                <ListItem v-if="hasPair && !hasPool" inset size="md" label="Pool creation fee">
                  <AmountDisplay :amount="creationFee" />
                </ListItem>

                <div class="mt-6 mb-2">
                  <FeeLevelSelector
                    v-if="actionSteps.length > 0"
                    :steps="actionSteps"
                    @update:fees="state.fees = $event"
                  />
                </div>
                <Alert v-if="hasPair && needsTransferToHub" status="info" class="mb-6">
                  {{ $t('pages.addLiquidity.hubWarning') }}
                </Alert>
                <Button
                  v-tippy="{ trigger: submitButtonHint ? 'mouseenter focus' : 'manual' }"
                  :name="submitButtonName"
                  :disabled="!isValid"
                  :content="submitButtonHint"
                  @click="goToReview"
                />
              </div>
            </template>

            <template v-else-if="state.isCreationConfirmationOpen">
              <article class="flex flex-col items-center">
                <h2 class="text-3 font-bold pt-8 mb-8 whitespace-pre-line text-center">
                  {{ $t('pages.addLiquidity.createWarning') }}
                </h2>

                <img
                  src="@/assets/images/transfer-interstitial.png"
                  name="Create liquidity pool"
                  class="-mt-8 -mb-10 max-w-sm"
                />

                <p class="text-muted leading-copy max-w-md mx-auto">
                  {{ $t('pages.addLiquidity.arbitrageWarning') }}
                </p>

                <footer class="w-full max-w-md mx-auto flex justify-stretch mt-12 mb-8 gap-6">
                  <Button
                    :name="$t('generic_cta.cancel')"
                    variant="secondary"
                    class="flex-1"
                    @click="state.isCreationConfirmationOpen = false"
                  />
                  <Button :name="$t('generic_cta.understand')" class="flex-1" @click="goToReview" />
                </footer>
              </article>
            </template>
          </div>
        </template>

        <template v-else>
          <TransactionProcessCreator
            :steps="actionSteps"
            :action="hasPool ? 'addliquidity' : 'createpool'"
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
import { computed, reactive, Ref, ref, toRefs, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import ChainSelectModal from '@/components/common/ChainSelectModal.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Ticker from '@/components/common/Ticker.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import FlexibleAmountInput from '@/components/ui/FlexibleAmountInput.vue';
import Icon from '@/components/ui/Icon.vue';
import ListItem from '@/components/ui/List/ListItem.vue';
import useAccount from '@/composables/useAccount';
import useDenoms from '@/composables/useDenoms';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { AddLiquidityAction, CreatePoolAction, Step } from '@/types/actions';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { event, pageview } from '@/utils/analytics';
import { parseCoins } from '@/utils/basic';
import { featureRunning } from '@/utils/FeatureManager';
import { sortBalancesByAmount } from '@/utils/sorting';

const { t } = useI18n({ useScope: 'global' });

const route = useRoute();
const router = useRouter();
const store = useStore() as RootStoreTyped;
const { useDenom } = useDenoms();
const transactionsStore = useTransactionsStore();
const poolId = computed(() => route.params.id as string);

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

const creationFee = computed(() => {
  return store.getters['tendermint.liquidity.v1beta1/getParams']().params.pool_creation_fee[0];
});

pageview({ page_title: 'Add Liquidity', page_path: '/pools/add/' + route.params.id });
const hasPrices = computed(() => {
  if (!hasPool.value) {
    return false;
  }

  if (!hasPair.value) {
    return false;
  }

  const priceA = store.getters[GlobalGetterTypes.API.getPrice]({ denom: form.coinA.asset.base_denom });
  const priceB = store.getters[GlobalGetterTypes.API.getPrice]({ denom: form.coinB.asset.base_denom });

  if (!priceA || !priceB) {
    return false;
  }

  return true;
});

const form = reactive<Record<string, { asset: EmerisAPI.Balance; amount: string }>>({
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

const { getNextPoolId, pools, getReserveBaseDenoms } = usePools();

const previewPoolCoinDenom = computed(() => {
  return `G` + getNextPoolId();
});

const closeModal = () => {
  router.push('/');
};

const hasPair = computed(() => {
  return !!form.coinA.asset && !!form.coinB.asset;
});
const tickerA = ref('-');
const tickerB = ref('-');
watch(
  () => form.coinA.asset,
  (newDenom, oldDenom) => {
    if (newDenom?.base_denom && newDenom?.base_denom != oldDenom?.base_denom) {
      const { tickerName } = useDenom(newDenom.base_denom);
      watch(
        () => tickerName.value,
        (newTicker) => {
          tickerA.value = newTicker;
        },
        { immediate: true },
      );
    }
  },
  { immediate: true },
);

watch(
  () => form.coinB.asset,
  (newDenom, oldDenom) => {
    if (newDenom?.base_denom && newDenom?.base_denom != oldDenom?.base_denom) {
      const { tickerName } = useDenom(newDenom.base_denom);
      watch(
        () => tickerName.value,
        (newTicker) => {
          tickerB.value = newTicker;
        },
        { immediate: true },
      );
    }
  },
  { immediate: true },
);
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
const reserveBalances = computed(() => {
  return unref(usePoolInstance.value?.reserveBalances);
});
const totalSupply = computed(() => {
  return unref(usePoolInstance.value?.totalSupply);
});
const isReversePairName = computed(() => {
  return unref(usePoolInstance.value?.isReversePairName);
});
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

  return sortBalancesByAmount(result);
});

const balancesForSecond = computed(() => {
  return balances.value.filter((item) => item.base_denom !== form.coinA.asset?.base_denom);
});

const hasPool = computed(() => {
  return !!pool.value;
});

const pageTitle = computed(() => {
  return hasPair.value && !hasPool.value ? t('pages.addLiquidity.createNew') : t('pages.addLiquidity.addLiquidity');
});

const metaSource = computed(() => ({
  title: pageTitle.value,
}));
useMeta(metaSource);

const updateReceiveAmount = () => {
  if (!hasPool.value) {
    state.receiveAmount = '1';
    return;
  }

  if (!form.coinA.amount || !form.coinB.amount) {
    state.receiveAmount = '0';
    return;
  }

  const result = usePoolInstance.value.calculateSupplyTokenAmount([
    {
      amount: new BigNumber(form.coinA.amount).shiftedBy(precisions.value.coinA).toNumber(),
      denom: form.coinA.asset.base_denom,
    },
    {
      amount: new BigNumber(form.coinB.amount).shiftedBy(precisions.value.coinB).toNumber(),
      denom: form.coinB.asset.base_denom,
    },
  ]);
  state.receiveAmount = new BigNumber(result).shiftedBy(-6).decimalPlaces(6).toString();
};

const precisions = computed(() => {
  return {
    coinA: store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinA?.asset?.base_denom }) ?? 6,
    coinB: store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinB?.asset?.base_denom }) ?? 6,
  };
});

const exchangeAmount = computed(() => {
  const coinA = new BigNumber(1).shiftedBy(precisions.value.coinA).toNumber();
  const precisionDiff = precisions.value.coinA - precisions.value.coinB;
  if (!hasPair.value) {
    return;
  }

  if (!hasPool.value && (!form.coinB.amount || !form.coinA.amount)) {
    return;
  }

  if (!hasPool.value) {
    return {
      coinA,
      coinB: new BigNumber(form.coinB.amount || 1)
        .dividedBy(form.coinA.amount || 1)
        .shiftedBy(precisions.value.coinB + precisionDiff)
        .toNumber(),
    };
  }

  if (reserveBalances.value.length) {
    const baseDenomIndex = {};
    baseDenomIndex[state.poolBaseDenoms[0]] = pool.value.reserve_coin_denoms[0];
    baseDenomIndex[state.poolBaseDenoms[1]] = pool.value.reserve_coin_denoms[1];
    const amountA =
      baseDenomIndex[form.coinA.asset.base_denom] == reserveBalances.value[0].denom
        ? reserveBalances.value[0].amount
        : reserveBalances.value[1].amount;
    const amountB =
      baseDenomIndex[form.coinB.asset.base_denom] == reserveBalances.value[1].denom
        ? reserveBalances.value[1].amount
        : reserveBalances.value[0].amount;
    const precisionB =
      form.coinB.asset.base_denom == state.poolBaseDenoms[1] ? precisions.value.coinB : precisions.value.coinA;

    return {
      coinA,
      coinB: new BigNumber(amountB)
        .dividedBy(amountA)
        .shiftedBy(precisionB + precisionDiff)
        .toNumber(),
    };
  }

  return undefined;
});

const hasFunds = computed(() => {
  const isEmpty = !form.coinA.asset && !form.coinB.asset;
  const coinA = form.coinA.asset ? +parseCoins(form.coinA.asset.amount)[0].amount > 0 : false;
  const coinB = form.coinB.asset ? +parseCoins(form.coinB.asset.amount)[0].amount > 0 : false;

  return {
    coinA,
    coinB,
    all: isEmpty ? true : coinA && coinB,
  };
});

const hasSufficientFunds = computed(() => {
  let hasAssetFunds = hasFunds.value.all;
  let coinA = true;
  let coinB = true;

  if (form.coinA.asset && form.coinA.amount) {
    const precisionA =
      store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinA.asset.base_denom }) || 6;
    const amountA = new BigNumber(form.coinA.amount).shiftedBy(precisionA);
    const feeA = feesAmount.value[form.coinA.asset.base_denom] || 0;
    coinA = amountA.plus(feeA).isLessThanOrEqualTo(parseCoins(form.coinA.asset.amount)[0].amount);
  }

  if (form.coinB.asset && form.coinB.amount) {
    const precisionB =
      store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinB.asset.base_denom }) || 6;
    const amountB = new BigNumber(form.coinB.amount).shiftedBy(precisionB);
    const feeB = feesAmount.value[form.coinB.asset.base_denom] || 0;
    coinB = amountB.plus(feeB).isLessThanOrEqualTo(parseCoins(form.coinB.asset.amount)[0].amount);
  }

  return {
    coinA,
    coinB,
    total: coinA && coinB && hasAssetFunds,
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

  if (featureRunning('POOL_MIN_AMOUNT') && +state.receiveAmount <= 0) {
    return false;
  }

  return true;
});

const needsTransferToHub = computed(() => {
  const hubName = store.getters[GlobalGetterTypes.API.getDexChain];

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
    const priceA = store.getters[GlobalGetterTypes.API.getPrice]({ denom: form.coinA.asset.base_denom });
    total = total.plus(new BigNumber(priceA).multipliedBy(form.coinA.amount));
  }

  if (form.coinB.asset) {
    const priceB = store.getters[GlobalGetterTypes.API.getPrice]({ denom: form.coinB.asset.base_denom });
    total = total.plus(new BigNumber(priceB).multipliedBy(form.coinB.amount));
  }

  state.totalEstimatedPrice = total.isFinite() ? total.toFixed(2) : '';
};

const submitButtonHint = computed(() => {
  if (featureRunning('POOL_MIN_AMOUNT')) {
    let emptyFields = +form.coinA.amount <= 0 || +form.coinB.amount <= 0;
    let insufficientAmount = +state.receiveAmount <= 0;
    if (insufficientAmount && !emptyFields) {
      return t('pages.addLiquidity.insufficientAmountHint');
    }
  }

  return undefined;
});

const submitButtonName = computed(() => {
  let emptyFields = +form.coinA.amount <= 0 || +form.coinB.amount <= 0;
  let insufficientFunds = !hasSufficientFunds.value.total;
  let insufficientAmount = featureRunning('POOL_MIN_AMOUNT') && +state.receiveAmount <= 0;
  let invalidPool = !hasPool.value && (+form.coinA.amount < 1 || +form.coinB.amount < 1);

  if (emptyFields) {
    return t('generic_cta.continue');
  } else if (insufficientAmount) {
    return t('generic_cta.insufficientAmount');
  } else if (insufficientFunds) {
    return t('generic_cta.noFunds');
  } else if (!insufficientFunds && invalidPool) {
    return t('generic_cta.noSupply');
  } else {
    return t('generic_cta.continue');
  }
});

const generateActionSteps = async () => {
  let action: AddLiquidityAction | CreatePoolAction;
  const precisions = [
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinA.asset.base_denom }) || 6,
    store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinB.asset.base_denom }) || 6,
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
      amount: new BigNumber(form.coinA.amount).shiftedBy(precisions[0]).toString(),
      denom: coinAdenom,

      chain_name: form.coinA.asset.on_chain,
    },
    coinB: {
      amount: new BigNumber(form.coinB.amount).shiftedBy(precisions[1]).toString(),
      denom: coinBdenom,
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
    const denoms = [parseCoins(form.coinA.asset.amount)[0].denom, parseCoins(form.coinB.asset.amount)[0].denom].sort();
    if (pools.value) {
      for (const poolIterator of pools.value) {
        const reserveDenoms = await getReserveBaseDenoms(poolIterator);

        if (
          [...reserveDenoms].sort().join().toLowerCase() === baseDenoms.join().toLowerCase() ||
          poolIterator.reserve_coin_denoms.join().toLowerCase() === denoms.join().toLowerCase()
        ) {
          // original order is changed after below if statement ex) ["uxprt", "uatom"] => ["uatom" , "uxprt"]
          state.poolBaseDenoms = JSON.parse(JSON.stringify(reserveDenoms));
          if (poolIterator.id != route.params.id) {
            router.push('/pools/add/' + poolIterator.id);
          }
          return;
        }
      }
    }
    router.push('/pools/add');
  }
};

const onClose = () => {
  transactionsStore.setTransactionAsPending();
  router.push('/pools');
};

const coinSelectHandler = (key: 'coinA' | 'coinB', balance: EmerisAPI.Balance) => {
  state.isMaximumAmountChecked = false;
  form[key].asset = balance;
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
  if (state.isCreationConfirmationOpen) {
    if (hasPool.value) {
      event('review_tx', {
        event_label: 'Reviewing add liquidity tx',
        event_category: 'transactions',
      });
    } else {
      event('review_tx', { event_label: 'Reviewing create pool tx', event_category: 'transactions' });
    }
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

const toggleChainsModal = (asset?: EmerisAPI.Balance, source: 'coinA' | 'coinB' = 'coinA') => {
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

  const bigAmountA = new BigNumber(+form.coinA.amount);
  const result = new BigNumber(exchangeAmount.value.coinB).shiftedBy(-precisions.value.coinB).multipliedBy(bigAmountA);

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

  const bigAmountB = new BigNumber(+form.coinB.amount);
  const bigExchangeAmount = new BigNumber(exchangeAmount.value.coinB).shiftedBy(-precisions.value.coinB);
  const result = bigAmountB.dividedBy(bigExchangeAmount);

  form.coinA.amount = result.isFinite() ? result.decimalPlaces(6).toString() : '';
  updateTotalCurrencyPrice();
  updateReceiveAmount();
};

const currencyAmountHandler = () => {
  state.isMaximumAmountChecked = false;

  if (!state.totalEstimatedPrice || +!state.totalEstimatedPrice) {
    form.coinA.amount = undefined;
    form.coinB.amount = undefined;
    state.receiveAmount = undefined;
    return;
  }

  const precisions = {
    [form.coinA.asset.base_denom]:
      store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinA.asset.base_denom }) ?? 6,
    [form.coinB.asset.base_denom]:
      store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinB.asset.base_denom }) ?? 6,
  };

  const prices = {
    [form.coinA.asset.base_denom]: store.getters[GlobalGetterTypes.API.getPrice]({
      denom: form.coinA.asset.base_denom,
    }),
    [form.coinB.asset.base_denom]: store.getters[GlobalGetterTypes.API.getPrice]({
      denom: form.coinB.asset.base_denom,
    }),
  };

  const totalA = new BigNumber(reserveBalances.value[0].amount)
    .shiftedBy(-precisions[reserveBalances.value[0].base_denom])
    .multipliedBy(prices[reserveBalances.value[0].base_denom]);
  const totalB = new BigNumber(reserveBalances.value[1].amount)
    .shiftedBy(-precisions[reserveBalances.value[1].base_denom])
    .multipliedBy(prices[reserveBalances.value[1].base_denom]);
  const pricePerCoin = new BigNumber(totalSupply.value).shiftedBy(-6).dividedBy(totalA.plus(totalB));
  const poolCoinAmount = new BigNumber(state.totalEstimatedPrice).multipliedBy(pricePerCoin);

  const result = usePoolInstance.value.getPoolWithdrawBalances(poolCoinAmount.shiftedBy(6).toNumber());

  const resultA = result.find((item) => getBaseDenomSync(item.denom) === form.coinA.asset.base_denom);
  const resultB = result.find((item) => getBaseDenomSync(item.denom) === form.coinB.asset.base_denom);

  form.coinA.amount = new BigNumber(resultA.amount)
    .shiftedBy(-precisions[form.coinA.asset.base_denom])
    .decimalPlaces(6)
    .toString();
  form.coinB.amount = new BigNumber(resultB.amount)
    .shiftedBy(-precisions[form.coinB.asset.base_denom])
    .decimalPlaces(6)
    .toString();

  updateReceiveAmount();
};

watch(
  [poolId, pools, balances],
  async () => {
    if (!poolId.value) {
      return;
    }

    const poolFromRoute = pools.value?.find((item) => item.id === poolId.value);

    if (poolFromRoute) {
      const poolBaseDenoms = await getReserveBaseDenoms(poolFromRoute);
      state.poolBaseDenoms = poolBaseDenoms;
      const sortedBaseDenoms = [...poolBaseDenoms].sort();
      if (state.step != 'review' && state.step != 'send') {
        if (!form.coinA.asset) {
          const coinA = balances.value.find((item) => item.base_denom === sortedBaseDenoms[0]);
          form.coinA.asset = coinA;
        } else {
          const coinA = balances.value.find(
            (item) => item.base_denom === sortedBaseDenoms[0] && item.on_chain == form.coinA.asset.on_chain,
          );
          form.coinA.asset = coinA;
        }
        if (!form.coinB.asset) {
          const coinB = balances.value.find((item) => item.base_denom === sortedBaseDenoms[1]);
          form.coinB.asset = coinB;
        } else {
          const coinB = balances.value.find(
            (item) => item.base_denom === sortedBaseDenoms[1] && item.on_chain == form.coinB.asset.on_chain,
          );
          form.coinB.asset = coinB;
        }
      }
    }
  },
  { immediate: true },
);

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

watch(pools, findPoolByDenoms, { immediate: true });

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
        const precisionA =
          store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinA.asset.base_denom }) || 6;
        const amountA = parseCoins(form.coinA.asset.amount)[0].amount || 0;
        const feeA = feesAmount.value[form.coinA.asset.base_denom] || 0;

        const precisionB =
          store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: form.coinB.asset.base_denom }) || 6;
        const amountB = parseCoins(form.coinB.asset.amount)[0].amount || 0;
        const feeB = feesAmount.value[form.coinB.asset.base_denom] || 0;

        const precisionDiff = precisionA - precisionB;
        const bigExchangeAmount = new BigNumber(exchangeAmount.value.coinB).shiftedBy(-precisions.value.coinB);

        const bigAmountA = new BigNumber(amountA).minus(feeA).dividedBy(10 ** precisionDiff);
        const bigAmountB = new BigNumber(amountB).minus(feeB);
        const amountsPositive = bigAmountA.isPositive() && bigAmountB.isPositive();
        const bigAmountBToA = bigAmountB.dividedBy(bigExchangeAmount);

        const minAmount = BigNumber.minimum(bigAmountA, bigAmountBToA);

        if (minAmount.isEqualTo(bigAmountA) && amountsPositive) {
          form.coinA.amount = bigAmountA
            .shiftedBy(-precisionA + precisionDiff)
            .decimalPlaces(precisionA)
            .toString();
          coinAChangeHandler();
        } else if (minAmount.isEqualTo(bigAmountBToA) && amountsPositive) {
          form.coinB.amount = bigAmountB.shiftedBy(-precisionB).decimalPlaces(precisionB).toString();
          coinBChangeHandler();
        } else {
          form.coinA.amount = '0';
          form.coinB.amount = '0';
        }
      }

      updateReceiveAmount();
      updateTotalCurrencyPrice();
    }
  },
  { deep: true },
);
</script>

<style lang="scss">
.denom-select__coin-amount-type {
  display: none;
}
</style>
