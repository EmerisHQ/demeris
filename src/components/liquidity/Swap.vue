<template>
  <div :style="isInit ? '' : 'pointer-events: none'" class="wrapper w-full relative">
    <SlippageSettingModal
      v-if="isSlippageSettingModalOpen"
      :swap-data="{
        pay: {
          denom: payCoinData?.base_denom,
          amount: payCoinAmount,
        },
        receive: { denom: receiveCoinData?.base_denom, amount: receiveCoinAmount },
        isReverse: isReverse,
        poolPrice: selectedPoolData?.poolPrice,
      }"
      @goback="slippageSettingModalToggle"
    />
    <QuotesList
      v-if="isQuotesListModalOpen"
      :routes="daggRoutes"
      @selectedQuoteIndex="(e) => selectedQuoteIndexEvent(e)"
      @goback="quotesListModalToggle"
    />

    <template v-if="isOpen && !isSlippageSettingModalOpen">
      <TransactionProcessCreator
        :steps="actionHandlerResult"
        action="swap"
        class="swap-process overflow-hidden bg-surface dark:bg-fg-solid shadow-panel rounded-2xl flex flex-col"
        @pending="
          () => {
            reviewModalToggle();
            reset();
          }
        "
        @close="
          () => {
            reviewModalToggle();
            reset();
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
        isChildModalOpen ? 'shadow-none' : 'shadow-panel',
      ]"
    >
      <div class="flex justify-between items-center py-6 px-6 h-24">
        <div class="text-2 font-bold">{{ $t('components.swap.title') }}</div>
        <Button variant="link" rounded :click-function="slippageSettingModalToggle">
          <Icon name="ThreeDotsIcon" :icon-size="1.5" />
        </Button>
      </div>

      <!-- pay coin selector -->
      <DenomSelect
        v-model:amount="payCoinAmount"
        size="sm"
        show-chain
        :input-header="
          $t('components.swap.payHeader', {
            amount: getDisplayPrice(payCoinData?.base_denom, payCoinAmount).value ?? '',
          })
        "
        :selected-denom="payCoinData"
        :counter-denom="receiveCoinData"
        :assets="assetsToPay"
        :is-over="isOver"
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
            :name="maxButtonText"
            :type="'text'"
            :status="'normal'"
            :data="{
              type: 'custom',
              function: setMax,
              isOver: isOver,
            }"
          />
          <!-- TODO: change hardcoded osmosis -->
          <IconButton
            v-else
            class="mr-0.5 bg-surface"
            :name="'Osmosis'"
            :type="'text'"
            :status="'normal'"
            :data="{
              type: 'custom',
              function: quotesListModalToggle,
            }"
          />
        </div>
      </div>

      <!-- receive coin selector -->
      <DenomSelect
        v-model:amount="receiveCoinAmount"
        size="sm"
        show-chain
        :input-header="
          $t('components.swap.receiveHeader', {
            amount: getDisplayPrice(receiveCoinData?.base_denom, receiveCoinAmount).value ?? '',
          })
        "
        :selected-denom="receiveCoinData"
        :counter-denom="payCoinData"
        :assets="assetsToReceive"
        @change="setCounterPairCoinAmount"
        @select="denomSelectHandler"
        @modalToggle="setChildModalOpenStatus"
      />

      <!-- price change alert -->
      <div v-if="isPriceChanged && isBothSelected" class="mt-4 py-2 px-6">
        <Alert status="warning" :message="$t('components.swap.priceAlert')" />
      </div>

      <!-- swap button -->
      <div class="pt-4 px-6 pb-6">
        <Button
          :name="buttonName"
          :status="buttonStatus"
          :disabled="buttonDisabled"
          :click-function="swap"
          :tooltip-text="buttonTooltipText"
        />
      </div>

      <div class="-text-1 px-6">
        <FeeLevelSelector v-if="actionHandlerResult && actionHandlerResult.length > 0" :steps="actionHandlerResult" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable */
import { EmerisAPI } from '@emeris/types';
import axios from 'axios';
import { computed, defineComponent, onMounted, onUnmounted, PropType, reactive, ref, toRefs, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { actionHandler } from '@/actionhandler';
import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import QuotesList from '@/components/common/QuotesList.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useAccount from '@/composables/useAccount';
import useCalculation from '@/composables/useCalculation';
import useModal from '@/composables/useModal';
import usePrice from '@/composables/usePrice';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { getTransactionOffset } from '@/features/transactions/transactionProcessHelpers';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { SwapAction } from '@/types/actions';
import { getTicker } from '@/utils/actionHandler';
import { getFeeForChain } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';
import { isNative, parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'Swap',
  components: {
    Button,
    DenomSelect,
    Icon,
    IconButton,
    Alert,
    SlippageSettingModal,
    FeeLevelSelector,
    TransactionProcessCreator,
    QuotesList,
  },

  props: {
    defaultAsset: {
      type: Object as PropType<EmerisAPI.Balance>,
      default: undefined,
    },
  },
  // todo:  filter routes with "insufficient funds" in response, filter gravity out?, filter NaN in api response,

  //what if quotes list is 0.. what if api returns {error: 'The denom 'uosmo' is not present in any available swap'.. ensure clicking on visualize deosn't select quote.
  //pay denom select on {pay,receive, denom,amount} set messes payamount (needs dagg api change.. accepting amountout)
  setup(props) {
    //SETTINGS-START
    const priceUpdateTerm = 10; //price update term (sec)
    //SETTINGS-END
    const { getPrecisedAmount, calculateSlippage } = useCalculation();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
    const { isOpen: isQuotesListModalOpen, toggleModal: quotesListModalToggle } = useModal();

    const { getDisplayPrice } = usePrice();
    const { balances, orderBalancesByPrice } = useAccount();
    const isInit = ref(false);
    const slippage = ref(0);
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const transactionsStore = useTransactionsStore();
    const isFinished = ref(false); // keep track of txstepsmodal status
    const isSignedIn = computed(() => {
      return store.getters[GlobalGetterTypes.USER.isSignedIn];
    });

    const isReverse = ref(false);

    const dexStatus = computed(() => {
      return store.getters[GlobalGetterTypes.API.getChainStatus]({
        chain_name: store.getters[GlobalGetterTypes.API.getDexChain],
      });
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

    onUnmounted(() => {
      if (setIntervalId.value) {
        clearInterval(setIntervalId.value);
      }

      if (transactionsStore.currentId) {
        const snapshot = transactionsStore.getCurrentService().getSnapshot();
        const cursor = getTransactionOffset(snapshot.context);
        if (snapshot.matches('transacting') || (cursor && cursor.total > cursor.offset)) {
          transactionsStore.setTransactionAsPending();
        }
      }
    });

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
      let payAssets = allBalances.value.filter((balance) => {
        return (
          balance.base_denom !== data.receiveCoinData?.base_denom &&
          verifiedDenoms.value.find(
            (verifiedDenom) =>
              verifiedDenom.base_denom == balance.base_denom &&
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
          .filter((receiveAsset) => receiveAsset.base_denom !== data.payCoinData.base_denom),
      );
    });

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
                assetsToReceive.value.find((coin) => coin.base_denom === props.defaultAsset.base_denom) || defaultAsset;
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
    // REFACTOR ENDS HERE

    //fee info
    const txFee = ref(0);

    const data = reactive({
      //conditional-text-start
      buttonName: computed(() => {
        if (data.isBothSelected) {
          // if (!data.selectedPoolData) {
          //   return t('components.swap.noPool');
          // }

          // else
          // if (data.isNotEnoughLiquidity) {
          //   return t('components.swap.swapLimit');
          // }
          // else
          if (data.isOver) {
            return t('components.swap.insufficentFunds');
          } else if (!dexStatus.value) {
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
        // if (data.isNotEnoughLiquidity) {
        //   return t('components.swap.tooltipSwapLimit');
        // } else
        if (data.isBothSelected) {
          // if (!data.selectedPoolData) {
          //   return t('components.swap.tooltipNoPool');
          // } else
          if (!dexStatus.value) {
            return t('components.swap.tooltipChainDown');
          } else {
            return '';
          }
        } else {
          return '';
        }
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
          parseFloat(String(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate / 2)) ??
          0.0015;

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
          parseFloat(String(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate / 2)) ??
          0.0015;
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
          return Number(data.payCoinAmount) + Number(data.fees) >
            parseInt(allBalances?.value.find((asset) => asset?.denom === data.payCoinData?.denom)?.amount ?? '0') /
              Math.pow(
                10,

                store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.payCoinData?.base_denom }),
              )
            ? true
            : false;
        } else {
          return false;
        }
      }),
      isBothSelected: computed(() => {
        return data.payCoinData && data.receiveCoinData;
      }),
      isSwapReady: computed(() => {
        return !(data.isOver || !data.isBothSelected || !isAmount.value || !isSignedIn.value || !dexStatus.value);
      }),
      isChildModalOpen: false,
      isPriceChanged: false,
      isAssetList: false,
      isFeesOpen: false,
      // booleans-end
      reset: () => {
        data.payCoinData = null;
        data.payCoinAmount = null;
        data.receiveCoinData = null;
        data.receiveCoinAmount = null;
        // data.selectedPoolData = null;
        isInit.value = false;
        isFinished.value = false; // reset for new swap
      },
      //programatically get inactive color
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

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
            10 ** (store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom }) ?? 6);

          if (amount > 0) {
            const ticker = await getTicker(
              data.payCoinData.base_denom,
              store.getters[GlobalGetterTypes.API.getDexChain],
            );
            const formattedAmount = Math.trunc(amount * 100) / 100;
            data.maxButtonText = `${formattedAmount} ${ticker} Max`;
          } else {
            data.maxButtonText = 'Max';
          }
        } else {
          data.maxButtonText = 'Max';
        }
      },
    );

    const setIntervalId = ref(null);

    //set actionHandlerResult when swappable
    watch(
      () => [data.payCoinAmount, data.receiveCoinAmount, data.payCoinData, data.receiveCoinData],
      async () => {
        if (data.isSwapReady) {
          // Note, I added || 6 as a quick fix in case no precision can be obtained, but we should instead have better error handling
          const fromPrecision =
            store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom }) || 6;
          const toPrecision =
            store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.receiveCoinData.base_denom }) || 6;
          const swapParams: SwapAction = {
            name: 'swap',
            params: {
              from: {
                amount: String(Math.trunc(parseFloat(data.payCoinAmount) * Math.pow(10, fromPrecision))),
                denom: data.payCoinData.denom,

                chain_name: data.payCoinData.on_chain,
              },
              to: {
                amount: String(Math.trunc(parseFloat(data.receiveCoinAmount) * Math.pow(10, toPrecision))),
                denom: data.receiveCoinData.denom,

                chain_name: store.getters[GlobalGetterTypes.API.getDexChain],
              },
            },
          };
          // data.actionHandlerResult = await actionHandler(swapParams);
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
      const precisionDecimal = Math.pow(
        10,
        store.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: data.payCoinData.base_denom,
        }) ?? 6,
      );
      data.payCoinAmount = data.maxAmount / precisionDecimal;
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

    async function getRoutes({ denomIn, denomOut, amountIn }) {
      try {
        //change url
        const response = await axios.post('https://dev.demeris.io/v1' + '/daggregation/routing', {
          denomIn: denomIn,
          denomOut: denomOut,
          amountIn: amountIn,
        });
        return response.data;
      } catch (e) {
        const error = e.response?.data?.error || e.message;
        console.log(error);
      }
    }
    const daggRoutes = ref('');

    async function setCounterPairCoinAmount(e) {
      if (data.isBothSelected) {
        const fromPrecision =
          store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom }) || 6;
        const toPrecision = store.getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: data.receiveCoinData.base_denom,
        });
        //if receive use amountout
        let { routes } = await getRoutes({
          denomIn: data.payCoinData?.base_denom,
          denomOut: data.receiveCoinData?.base_denom,
          amountIn: data.payCoinAmount * 10 ** fromPrecision,
        });
        //something's off.. check if gravity and osmosis have uniform ibc's.. (osmosis first returns an ibc but gravity doesn't so check.. osmosis is unavailable on dexinfo so check when it's there)
        // if (
        //   data.payCoinData?.on_chain === routes[0].steps[0].data.protocol?.chainId ||
        //   data.payCoinData?.on_chain === 'cosmos-hub'
        // ) {
        //   //move to types -- enum. may not be needed if chain-id is present in routing response
        //   routes = await getRoutes({
        //     denomIn: routes[0].steps[0].data.to.denom,
        //     denomOut: data.receiveCoinData?.base_denom,
        //     amountIn: data.payCoinAmount * 10 ** fromPrecision,
        //   });
        // }
        daggRoutes.value = routes;
        const len = routes[0]?.steps.length;
        const precisionDiff = +fromPrecision - +toPrecision;
        let equalizer = 1;
        if (precisionDiff !== 0) {
          equalizer = 10 ** Math.abs(precisionDiff);
        }

        if (e.includes('Pay') && !!data.payCoinAmount) {
          const receiveCoinPrecisionDecimalDigits = Math.pow(
            10,
            store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: data.receiveCoinData?.base_denom }),
          );
          if (routes[0]?.steps[len - 1]?.data?.to?.amount) {
            data.receiveCoinAmount = (
              routes[0]?.steps[len - 1]?.data?.to?.amount / receiveCoinPrecisionDecimalDigits
            )?.toFixed(4);
          }

          // if (data.payCoinAmount + data.receiveCoinAmount === 0) {
          //   slippage.value = 0;
          // }
        } else {
          if (routes[0]?.steps[len - 1]?.data?.to?.amount) {
            data.payCoinAmount = (
              routes[0]?.steps[len - 1]?.data?.to?.amount * (isReverse.value ? equalizer : 1 / equalizer)
            )?.toFixed(4);
          }
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

    function selectedQuoteIndexEvent(e) {
      console.log('e', e);
    }

    return {
      ...toRefs(data),
      isInit,
      switchPayToReceive,
      denomSelectHandler,
      getPrecisedAmount,
      setMax,
      swap,
      assetsToPay,
      assetsToReceive,
      setChildModalOpenStatus,
      isOpen,
      reviewModalToggle,
      setCounterPairCoinAmount,
      isSlippageSettingModalOpen,
      slippageSettingModalToggle,
      getDisplayPrice,
      dexStatus,
      isFinished,
      isReverse,
      isQuotesListModalOpen,
      quotesListModalToggle,
      isAmount,
      selectedQuoteIndexEvent,
      daggRoutes,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
  /* min-height: 17rem; */
}

.swap-widget,
.swap-process {
  min-height: 24rem;
}
</style>
