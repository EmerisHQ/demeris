<template>
  <div :style="isInit ? '' : 'pointer-events: none'" class="wrapper w-full relative">
    <SlippageSettingModal
      v-if="isSlippageSettingModalOpen"
      :swap-data="{
        pay: {
          denom: data?.payCoinData?.base_denom,
          amount: data?.payCoinAmount,
        },
        receive: { denom: data?.receiveCoinData?.base_denom, amount: data?.receiveCoinAmount },
        isReverse: isReverse,
        poolPrice: data?.selectedPoolData?.poolPrice,
      }"
      @goback="slippageSettingModalToggle"
    />
    <QuotesList
      v-if="isQuotesListModalOpen"
      :routes="daggRoutes"
      :selected-quote-index="selectedQuoteIndex"
      :type-changed="typeChanged"
      @selectedQuoteIndex="(e) => selectedQuoteIndexEvent(e)"
      @goback="quotesListModalToggle"
    />

    <template v-if="isOpen && !isSlippageSettingModalOpen">
      <TransactionProcessCreator
        :steps="data.actionHandlerResult"
        action="swap"
        class="swap-process overflow-hidden bg-surface dark:bg-fg-solid shadow-panel rounded-2xl flex flex-col"
        @pending="
          () => {
            reviewModalToggle();
            data.reset();
          }
        "
        @close="
          () => {
            reviewModalToggle();
            data.reset();
          }
        "
        @finish="
          () => {
            isFinished = true;
          }
        "
        @previous="reviewModalToggle"
      />
    </template>

    <div
      class="swap-widget bg-surface dark:bg-fg rounded-2xl"
      :class="[
        { hidden: !(!isSlippageSettingModalOpen && !isOpen && !isQuotesListModalOpen) },
        data?.isChildModalOpen ? 'shadow-none' : 'shadow-panel',
      ]"
    >
      <div class="flex justify-between items-center py-6 px-6 h-24">
        <div class="text-2 font-bold">{{ $t('components.swap.title') }}</div>
        <Button variant="link" rounded :click-function="slippageSettingModalToggle">
          <Icon name="ThreeDotsIcon" :icon-size="1.5" />
        </Button>
      </div>
      <!-- pay coin header -->
      <div v-if="!isDefaultState" class="denom-select-header flex -text-1 font-medium px-6">
        Pay
        <button
          class="ml-auto font-normal text-muted"
          :class="{ 'text-negative-text': data?.isOver, 'hover:text-link': !data?.isOver }"
          @click="setMax"
        >
          {{ data?.maxButtonText }}
        </button>
      </div>
      <!-- pay coin selector -->
      <DenomSelect
        v-model:amount="data.payCoinAmount"
        size="sm"
        show-chain
        :input-header="
          $t('components.swap.payHeader', {
            amount: getDisplayPrice(data?.payCoinData?.base_denom, data?.payCoinAmount).value ?? '',
          })
        "
        :selected-denom="data?.payCoinData"
        :counter-denom="data?.receiveCoinData"
        :assets="assetsToPay"
        :is-over="data?.isOver"
        :is-default-state="isDefaultState"
        :is-amount-loading="isPayAmountLoading"
        @change="setCounterPairCoinAmount"
        @select="denomSelectHandler"
        @modalToggle="setChildModalOpenStatus"
      />

      <!-- button-divider -->
      <div class="relative flex items-center h-12">
        <div class="w-full border-t border-border" />
        <div class="absolute flex justify-between w-full px-4">
          <IconButton
            class="ml-0.5 text-text bg-surface"
            :name="'UpsideDownIcon'"
            :type="'circle'"
            :icon-size="1"
            :status="'normal'"
            :data="{
              type: 'custom',
              function: switchPayToReceive,
            }"
          />
          <IconButton
            v-if="!isAmount"
            class="mr-0.5 bg-surface"
            :name="data.maxButtonText"
            :type="'text'"
            :status="'normal'"
            :data="{
              type: 'custom',
              function: setMax,
              isOver: data?.isOver,
            }"
          />
          <!-- TODO: change hardcoded osmosis -->
          <IconButton
            v-else
            class="mr-0.5 bg-surface"
            :name="dex"
            :type="'text'"
            :status="'normal'"
            :data="{
              type: 'custom',
              function: quotesListModalToggle,
            }"
          />
        </div>
      </div>
      <!-- pay coin header -->
      <div
        v-if="!isDefaultState"
        class="denom-select-header no-default-tippy-padding flex -text-1 font-medium px-6 pt-6"
      >
        Receive
        <tippy class="ml-auto" placement="bottom-start" delay="0" :interactive="true" :arrow="false">
          <span v-if="selectedQuoteIndex === 0" class="flex ml-auto font-normal text-muted"
            >Best price <Icon class="ml-1.5" name="StarIcon" :icon-size="0.875"
          /></span>
          <template #content>
            <BestPrice
              :number-of-exchanges-searched="2"
              :dex="dex"
              :expected-rate="expectedRate"
              :limit-price="limitPrice"
              :denom="data?.receiveCoinData?.displayName || ''"
              :max-slippage="slippage"
              :min-received="data?.receiveCoinAmount"
            />
          </template>
        </tippy>
      </div>
      <!-- receive coin selector -->
      <DenomSelect
        v-model:amount="data.receiveCoinAmount"
        size="sm"
        show-chain
        :input-header="
          $t('components.swap.receiveHeader', {
            amount: getDisplayPrice(data?.receiveCoinData?.base_denom, data?.receiveCoinAmount).value ?? '',
          })
        "
        :selected-denom="data?.receiveCoinData"
        :counter-denom="data?.payCoinData"
        :assets="assetsToReceive"
        :is-default-state="isDefaultState"
        :is-amount-loading="isReceiveAmountLoading"
        @change="setCounterPairCoinAmount"
        @select="denomSelectHandler"
        @modalToggle="setChildModalOpenStatus"
      />

      <!-- price change alert -->
      <div v-if="data?.isPriceChanged && data?.isBothSelected" class="mt-4 py-2 px-6">
        <Alert status="warning" :message="$t('components.swap.priceAlert')" />
      </div>

      <!-- swap button -->
      <div class="pt-4 px-6 pb-6">
        <Button
          :name="data.buttonName"
          :status="data.buttonStatus"
          :disabled="data.buttonDisabled"
          :click-function="swap"
          :tooltip-text="data.buttonTooltipText"
        />
      </div>

      <div class="-text-1 px-6">
        <FeeLevelSelector
          v-if="data.actionHandlerResult && data.actionHandlerResult.length > 0"
          :steps="data.actionHandlerResult"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import axios from 'axios';
import { computed, onUnmounted, PropType, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import BestPrice from '@/components/common/BestPrice.vue';
import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import QuotesList from '@/components/common/QuotesList.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useAccount from '@/composables/useAccount';
import useModal from '@/composables/useModal';
import usePrice from '@/composables/usePrice';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { getTransactionOffset } from '@/features/transactions/transactionProcessHelpers';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { GlobalGetterTypes } from '@/store';
import { getTicker } from '@/utils/actionHandler';
import { getFeeForChain } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';
import { capitalizeFirstLetter, parseCoins } from '@/utils/basic';

const props = defineProps({
  defaultAsset: {
    type: Object as PropType<EmerisAPI.Balance>,
    default: undefined,
  },
});
const isInit = ref(false);
const isReverse = ref(false);
const isPayAmountLoading = ref(false);
const isReceiveAmountLoading = ref(false);
const isFinished = ref(false); // keep track of txstepsmodal status
const selectedQuoteIndex = ref(0);
const daggRoutes = ref(null);
const setIntervalId = ref(null);
const txFee = ref(0);
const slippage = ref(0);
const typeChanged = ref('Pay');
const { isOpen, toggleModal: reviewModalToggle } = useModal();
const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
const { isOpen: isQuotesListModalOpen, toggleModal: quotesListModalToggle } = useModal();
const { getDisplayPrice } = usePrice();
const { balances, orderBalancesByPrice } = useAccount();
const { t } = useI18n({ useScope: 'global' });
const store = useStore();
const transactionsStore = useTransactionsStore();

const data = reactive({
  //conditional-text-start
  buttonName: computed(() => {
    if (data.isBothSelected) {
      if (data.isOver) {
        return t('components.swap.insufficentFunds');
      } else if ((!!data.payCoinAmount || !!data.receiveCoinAmount) && !(daggRoutes.value && daggRoutes.value.length)) {
        return t('components.swap.unAvailable');
      } else {
        if (data.isPriceChanged) {
          return t('components.swap.updatePrice');
        } else {
          if (data.buttonStatus === 'active' && !data.buttonDisabled) {
            return t('components.swap.review');
          }
          return t('components.swap.swap');
        }
      }
    } else {
      return t('components.swap.swap');
    }
  }),
  buttonTooltipText: computed(() => {
    return '';
  }),
  buttonStatus: computed(() => {
    if (!isInit.value || data.isLoading) {
      return 'loading';
    } else {
      return 'active';
    }
  }),
  buttonDisabled: computed(() => {
    return !data.isSwapReady;
  }),
  maxButtonText: 'Max',
  maxAmount: computed(() => {
    const selectedCoinBalance = parseInt(
      allBalances.value.filter((coin) => {
        return coin.denom === data.payCoinData?.denom;
      })[0]?.amount,
    );
    const swapFeeRate =
      parseFloat(String(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate / 2)) ?? 0.0015;

    if (selectedCoinBalance > Math.ceil(selectedCoinBalance * swapFeeRate) + txFee.value) {
      return selectedCoinBalance - Math.ceil(selectedCoinBalance * swapFeeRate) - txFee.value ?? 0;
    } else {
      return 0;
    }
  }),
  //conditional-text-end

  //pay-receive-data-start
  payCoinData: null,
  payCoinAmount: null,
  receiveCoinData: null,
  receiveCoinAmount: null,
  //pay-receive-data-end

  //selectedPoolData for various calculation(pool price, swap price ...etc)
  selectedPoolData: null,

  //fees(swap + tx)
  fees: computed(() => {
    const swapFeeRate =
      parseFloat(String(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate / 2)) ?? 0.0015;
    const fee = data.payCoinAmount * swapFeeRate;
    return Math.ceil(fee * 1000000) / 1000000 ?? 0;
  }),
  // pool search loading
  isLoading: false,

  // for swap action
  actionHandlerResult: null,

  // booleans-start(for various status check)
  isOver: computed(() => {
    if (isSignedIn.value && data.payCoinData) {
      return (
        Number(data.payCoinAmount) + Number(data.fees) >
        parseInt(allBalances?.value.find((asset) => asset?.denom === data.payCoinData?.denom)?.amount ?? '0') /
          Math.pow(10, store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.payCoinData?.base_denom }))
      );
    } else {
      return false;
    }
  }),
  isBothSelected: computed(() => {
    return data.payCoinData && data?.receiveCoinData;
  }),
  isSwapReady: computed(() => {
    return !(
      data.isOver ||
      !data.isBothSelected ||
      !isAmount.value ||
      !isSignedIn.value ||
      !daggRoutes.value ||
      !daggRoutes.value.length
    );
  }),
  isChildModalOpen: false,
  isPriceChanged: false,
  // booleans-end
  reset: () => {
    data.payCoinData = null;
    data.payCoinAmount = null;
    data.receiveCoinData = null;
    data.receiveCoinAmount = null;
    isInit.value = false;
    isFinished.value = false; // reset for new swap
  },
  //programatically get inactive color
  feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
});

const isSignedIn = computed(() => {
  return store.getters[GlobalGetterTypes.USER.isSignedIn];
});

const verifiedDenoms = computed(() => {
  return (
    store.getters[GlobalGetterTypes.API.getVerifiedDenoms].map((denom) => {
      return { base_denom: denom.name, ...denom };
    }) ?? []
  );
});

const isAmount = computed(() => {
  if (data.payCoinAmount > 0 && data.receiveCoinAmount > 0) {
    return true;
  } else {
    return false;
  }
});

const fromPrecision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data?.payCoinData?.base_denom }),
);
const toPrecision = computed(() =>
  store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data?.receiveCoinData?.base_denom }),
);

const isDefaultState = computed(
  () =>
    !(data.payCoinAmount && data.payCoinData && data.receiveCoinData && daggRoutes.value && daggRoutes.value.length),
);

const allBalances = computed(() => {
  //add denom to use generally
  const userBalance = balances.value.map((coin) => {
    return { ...coin, denom: coin.ibc.hash ? `ibc/${coin.ibc.hash}` : coin.base_denom };
  });

  const verifiedBalances = [
    ...verifiedDenoms.value.map((denom) => ({
      base_denom: denom.name,
      denom: denom.name,
      on_chain: denom.chain_name,
      amount: 0 + denom.name,
    })),
  ];

  //merge if userBalance exist
  if (userBalance.length) {
    userBalance.forEach((coin) => {
      const duplicatedCoin = verifiedBalances.find((asset) => {
        return asset.denom === coin.denom;
      });

      //if duplicated replace amount
      if (duplicatedCoin?.denom) {
        duplicatedCoin.amount = coin.amount;
      } else {
        //if not, just add user coin to the balance
        verifiedBalances.push(coin);
      }
    });
  }
  return sortAssetList(verifiedBalances);
});
const assetsToPay = computed(() => {
  const hasBalance = balances.value.length > 0;
  const payAssets = allBalances.value.filter((balance) => {
    return (
      balance?.base_denom !== data?.receiveCoinData?.base_denom &&
      verifiedDenoms.value.find(
        (verifiedDenom) =>
          verifiedDenom?.base_denom == balance?.base_denom &&
          (parseInt(parseCoins(balance.amount)[0].amount) > 0 || !hasBalance),
      )
    );
  });
  return payAssets;
});

const assetsToReceive = computed(() => {
  return sortAssetList(
    verifiedDenoms.value
      .map((denom) => ({
        base_denom: denom.name,
        denom: denom.name,
        on_chain: denom.chain_name,
      }))
      .filter((receiveAsset) => receiveAsset?.base_denom !== data.payCoinData?.base_denom),
  );
});

const dex = computed(() => capitalizeFirstLetter(daggRoutes.value[selectedQuoteIndex.value]?.steps[0]?.protocol));
const expectedRate = computed(() =>
  ((data?.receiveCoinAmount * 10 ** toPrecision.value) / (data?.payCoinAmount * 10 ** fromPrecision.value)).toFixed(8),
);
const limitPrice = computed(() => Number(expectedRate.value) * (1 - slippage.value));

// default pay coin set
watch(
  () => {
    return [assetsToPay.value, balances.value];
  },
  (watchValues, oldWatchValues) => {
    //when wallet connected/disconnected set again
    if (watchValues[1].length !== oldWatchValues[1].length && !isFinished.value) {
      //Do not reset everything if we're in the finished state (view tx receipt)
      isOpen.value = false;
      isInit.value = false;
      data.payCoinAmount = null;
      data.receiveCoinAmount = null;
    }

    if (!isInit.value) {
      const defaultPayCoin = {
        amount: '0uatom',
        base_denom: 'uatom',
        denom: 'uatom',
        display_name: 'ATOM',
        on_chain: store.getters[GlobalGetterTypes.API.getDexChain],
      };
      data.receiveCoinData = null;

      if (!isSignedIn.value) {
        //no-wallet
        data.payCoinData = defaultPayCoin;
      } else {
        //with-wallet
        let assetToReceive = null;

        if (props.defaultAsset) {
          const defaultAsset = JSON.parse(JSON.stringify(props.defaultAsset));
          defaultAsset.on_chain = store.getters[GlobalGetterTypes.API.getDexChain];
          assetToReceive =
            assetsToReceive.value.find((coin) => coin?.base_denom === props.defaultAsset.base_denom) || defaultAsset;
        }

        if (assetsToPay.value.length > 0) {
          data.payCoinData = orderBalancesByPrice(assetsToPay.value)[0];
          if (data.payCoinData?.base_denom !== assetToReceive?.base_denom) {
            data.receiveCoinData = assetToReceive;
          }
        } else {
          data.payCoinData = defaultPayCoin;
        }
      }
      isInit.value = true;
    }
  },
);

//tx fee setting

watch(
  () => [
    data.payCoinData?.denom,
    store.getters[GlobalGetterTypes.API.getFeeTokens]({
      chain_name: data.payCoinData?.on_chain,
    }),
    store.getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel],
  ],
  async ([denom, feeTokens, gasPriceLevel]) => {
    if (!denom || feeTokens.length === 0 || !gasPriceLevel) {
      return;
    }

    if (
      denom.startsWith('pool') ||
      (denom.startsWith('ibc') && data.payCoinData?.on_chain == store.getters[GlobalGetterTypes.API.getDexChain])
    ) {
      txFee.value = 0;
    } else {
      const fees = await getFeeForChain(data.payCoinData?.on_chain);
      txFee.value =
        fees[0].amount[gasPriceLevel] *
        10 ** store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.payCoinData?.base_denom });
    }
  },
);

//max button text set
watch(
  () => data.payCoinData,
  async () => {
    if (data.payCoinData) {
      const amount =
        data.maxAmount /
        10 ** (store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.payCoinData?.base_denom }) ?? 6);

      if (amount > 0) {
        const ticker = await getTicker(data?.payCoinData?.base_denom, store.getters[GlobalGetterTypes.API.getDexChain]);
        const formattedAmount = Math.trunc(amount * 100) / 100;
        data.maxButtonText = `Max ${formattedAmount} ${ticker}`;
      } else {
        data.maxButtonText = 'Max';
      }
    } else {
      data.maxButtonText = 'Max';
    }
  },
);

//set actionHandlerResult when swappable
watch(
  () => [data.payCoinAmount, data.receiveCoinAmount, data.payCoinData, data.receiveCoinData],
  async () => {
    if (data.isSwapReady) {
      // Note, I added || 6 as a quick fix in case no precision can be obtained, but we should instead have better error handling
      //   const swapParams: SwapAction = {
      //     name: 'swap',
      //     params: {
      //       from: {
      //         amount: String(Math.trunc(parseFloat(data.payCoinAmount) * Math.pow(10, fromPrecision.value))),
      //         denom: data.payCoinData.denom,
      //         chain_name: data.payCoinData.on_chain,
      //       },
      //       to: {
      //         amount: String(Math.trunc(parseFloat(data.receiveCoinAmount) * Math.pow(10, toPrecision.value))),
      //         denom: data.receiveCoinData.denom,
      //         chain_name: store.getters[GlobalGetterTypes.API.getDexChain],
      //       },
      //     },
      //   };
      //   data.actionHandlerResult = await actionHandler(swapParams);
    } else {
      if (!isOpen.value) {
        // do not reset steps while steps modal is open
        data.actionHandlerResult = null;
      }
    }
  },
);

function switchPayToReceive() {
  const originPayCoinData = JSON.parse(JSON.stringify(data.payCoinData));
  const originReceiveCoinData = JSON.parse(JSON.stringify(data.receiveCoinData));
  if (originPayCoinData) {
    originPayCoinData.on_chain = store.getters[GlobalGetterTypes.API.getDexChain];
  }

  const sortedBalance =
    allBalances.value
      .filter((asset) => asset?.base_denom === originReceiveCoinData?.base_denom)
      .sort((a, b) => {
        const amountA = parseInt(a.amount);
        const amountB = parseInt(b.amount);
        if (amountA > amountB) {
          return -1;
        } else {
          return 0;
        }
      }) ?? [];

  if (sortedBalance.length > 0) {
    data.payCoinData = sortedBalance[0];
  } else {
    data.payCoinData = originReceiveCoinData;
  }

  data.receiveCoinData =
    assetsToReceive.value.find((asset) => {
      return asset?.base_denom === originPayCoinData?.base_denom;
    }) ?? originPayCoinData;

  setCounterPairCoinAmount('Pay');
  isReverse.value = !isReverse.value;
}

function setMax() {
  const precisionDecimal = 10 ** fromPrecision.value;
  data.payCoinAmount = (data.maxAmount / precisionDecimal).toFixed(4);
  setCounterPairCoinAmount('Pay');
}

function denomSelectHandler(payload) {
  if (payload.type === 'Receive') {
    data.receiveCoinData = payload;
    setCounterPairCoinAmount('Pay'); //update receive amount
  } else {
    data.payCoinData = payload;
    setCounterPairCoinAmount('Receive');
  }
}

function setChildModalOpenStatus(payload) {
  data.isChildModalOpen = payload;
}

async function getRoutes({ denomIn, denomOut, amountIn, amountOut, chainIn, chainOut }) {
  try {
    const endpoint = useStore().getters[GlobalGetterTypes.API.getEndpoint];
    const response = await axios.post(`${endpoint}/daggregation/routing`, {
      denomIn: denomIn,
      denomOut: denomOut,
      amountIn: amountIn,
      amountOut: amountOut,
      chainIn: chainIn,
      chainOut: chainOut,
    });
    return response.data;
  } catch (e) {
    const error = e.response?.data?.error || e.message;
    console.log(error);
    return { routes: [] };
  }
}

async function setCounterPairCoinAmount(e) {
  typeChanged.value = e.includes('Receive') ? 'Receive' : 'Pay';
  if (data.isBothSelected && (!!data.payCoinAmount || !!data.receiveCoinAmount)) {
    selectedQuoteIndex.value = 0;
    if (e.includes('Pay') && !!data.payCoinAmount) {
      isReceiveAmountLoading.value = true;
      let { routes } = await getRoutes({
        denomIn: data.payCoinData?.base_denom,
        denomOut: data?.receiveCoinData?.base_denom,
        amountIn: data.payCoinAmount * 10 ** fromPrecision.value,
        amountOut: null,
        chainIn: data.payCoinData?.on_chain,
        chainOut: data.receiveCoinData?.on_chain,
      });
      //filters NaN (comes as a string) and Insufficient funds and other text
      routes = routes?.filter((route) => {
        return !isNaN(route?.steps[route?.steps?.length - 1]?.data?.to?.amount);
      });
      daggRoutes.value = routes;
      if (routes && routes.length) {
        const len = routes[0]?.steps.length;

        if (routes[0]?.steps[len - 1]?.data?.to?.amount) {
          data.receiveCoinAmount = (routes[0]?.steps[len - 1]?.data?.to?.amount / 10 ** toPrecision.value)?.toFixed(4);
        }
      } else {
        data.receiveCoinAmount = 0;
      }
      isReceiveAmountLoading.value = false;
      // if (data.payCoinAmount + data.receiveCoinAmount === 0) {
      //   slippage.value = 0;
      // }
    } else {
      isPayAmountLoading.value = true;
      let { routes } = await getRoutes({
        denomIn: data.payCoinData?.base_denom,
        denomOut: data?.receiveCoinData?.base_denom,
        amountIn: null,
        amountOut: data.receiveCoinAmount * 10 ** toPrecision.value,
        chainIn: data.payCoinData?.on_chain,
        chainOut: data.receiveCoinData?.on_chain,
      });
      routes = routes?.filter((route) => {
        return !isNaN(route?.steps[0]?.data?.from?.amount);
      });
      daggRoutes.value = routes;
      if (routes && routes.length) {
        // routes comes out in reverse order.. lowest payamount should be first..
        if (routes[0]?.steps[0]?.data?.from?.amount) {
          data.payCoinAmount = (routes[0]?.steps[0]?.data?.from?.amount / 10 ** fromPrecision.value)?.toFixed(4);
        }
      } else {
        data.payCoinAmount = 0;
      }
      isPayAmountLoading.value = false;
    }
  }
}

async function swap() {
  event('review_tx', { event_label: 'Reviewing swap tx', event_category: 'transactions' });
  reviewModalToggle();
}

//helper
function sortAssetList(list) {
  const poolCoinPairList = [];
  const coinPairList = [];
  list.forEach((pair) => {
    if (pair.denom.startsWith('pool')) {
      poolCoinPairList.push(pair);
    } else {
      coinPairList.push(pair);
    }
  });
  return [...coinPairList, ...poolCoinPairList];
}

function selectedQuoteIndexEvent(index) {
  selectedQuoteIndex.value = index;
  isQuotesListModalOpen.value = !isQuotesListModalOpen.value;
  const numberOfSteps = daggRoutes.value[index]?.steps.length;
  if (typeChanged.value === 'Receive') {
    if (daggRoutes.value[index]?.steps[0]?.data?.from?.amount) {
      data.payCoinAmount = (daggRoutes.value[index]?.steps[0]?.data?.from?.amount / 10 ** fromPrecision.value)?.toFixed(
        4,
      );
    }
  } else {
    if (daggRoutes.value[index]?.steps[numberOfSteps - 1]?.data?.to?.amount) {
      data.receiveCoinAmount = (
        daggRoutes.value[index]?.steps[numberOfSteps - 1]?.data?.to?.amount /
        10 ** toPrecision.value
      )?.toFixed(4);
    }
  }
}

onUnmounted(() => {
  if (setIntervalId.value) {
    clearInterval(setIntervalId.value);
  }

  if (transactionsStore.currentId) {
    const snapshot = transactionsStore.getCurrentService()?.getSnapshot();
    if (!snapshot) return;
    const cursor = getTransactionOffset(snapshot.context);
    if (snapshot.matches('transacting') || (cursor && cursor.total > cursor.offset)) {
      transactionsStore.setTransactionAsPending();
    }
  }
});
</script>

<style lang="scss">
.wrapper {
  min-width: 20rem;
  /* min-height: 17rem; */
}

.swap-widget,
.swap-process {
  min-height: 24rem;
}

.denom-select-header {
  margin-bottom: -0.75rem;
}
.no-default-tippy-padding .tippy-content {
  padding: 0 !important;
}
</style>
