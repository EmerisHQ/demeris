<template>
  <div :style="isInit ? '' : 'pointer-events: none;'" class="wrapper w-full relative">
    <SlippageSettingModal
      v-if="isSlippageSettingModalOpen"
      :swap-data="{
        pay: {
          denom: payCoinData?.base_denom,
          amount: payCoinAmount,
        },
        receive: { denom: receiveCoinData?.base_denom, amount: receiveCoinAmount },
        isReverse: selectedPoolData?.reserves[0] !== payCoinData?.base_denom,
        poolPrice: selectedPoolData?.poolPrice,
      }"
      @goback="slippageSettingModalToggle"
    />
    <TransactionProcessCreator
      v-if="isOpen && !isSlippageSettingModalOpen"
      :steps="actionHandlerResult"
      action="swap"
      class="overflow-hidden bg-surface dark:bg-fg-solid shadow-panel rounded-2xl"
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
      @previous="reviewModalToggle"
    />
    <div
      class="swap-widget bg-surface dark:bg-fg rounded-2xl"
      :class="[
        { hidden: !(!isSlippageSettingModalOpen && !isOpen) },
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
        :other-assets="otherAssetsToPay"
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
        :other-assets="otherAssetsToReceive"
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
import { computed, defineComponent, onMounted, onUnmounted, PropType, reactive, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useAccount from '@/composables/useAccount';
import useCalculation from '@/composables/useCalculation';
import useModal from '@/composables/useModal';
import usePools from '@/composables/usePools';
import usePrice from '@/composables/usePrice';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { useTransactionsStore } from '@/features/transactions/transactionsStore';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes } from '@/store';
import { SwapAction } from '@/types/actions';
import { Balance } from '@/types/api';
import { getTicker } from '@/utils/actionHandler';
import { actionHandler, getFeeForChain } from '@/utils/actionHandler';
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
  },

  props: {
    defaultAsset: {
      type: Object as PropType<Balance>,
      default: undefined,
    },
  },

  setup(props) {
    //SETTINGS-START
    const priceUpdateTerm = 10; //price update term (sec)
    //SETTINGS-END
    const { getPayCoinAmount, getReceiveCoinAmount, getPrecisedAmount, calculateSlippage } = useCalculation();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
    const {
      pools,
      filterPoolsByDenom,
      getPoolById,
      getPoolPrice,
      getReserveBalances,
      getReserveBaseDenoms,
      updatePool,
    } = usePools();
    const { getDisplayPrice } = usePrice();
    const { balances, orderBalancesByPrice } = useAccount();
    const isInit = ref(false);
    const slippage = ref(0);
    const { t } = useI18n({ useScope: 'global' });
    const store = useStore();
    const transactionsStore = useTransactionsStore();

    const isSignedIn = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.USER.isSignedIn];
    });

    const dexStatus = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getChainStatus]({
        chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
      });
    });

    const gasPriceLevel = computed(() => store.getters[GlobalDemerisGetterTypes.USER.getPreferredGasPriceLevel]);

    const verifiedDenoms = computed(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms] ?? [];
    });

    onUnmounted(() => {
      if (setIntervalId.value) {
        clearInterval(setIntervalId.value);
      }

      if (transactionsStore.currentId) {
        const snapshot = transactionsStore.getCurrentService().getSnapshot();
        if (snapshot.matches('transacting')) {
          transactionsStore.setTransactionAsPending();
        }
      }
    });

    // REFACTOR STARTS HERE
    const availablePairs = ref([]);
    onMounted(async () => {
      const pairs = [];
      const newPools = pools.value;
      for (let pool of newPools) {
        let reserveCoinA = { denom: pool.reserve_coin_denoms[0], base_denom: '', chain_name: '' };
        let reserveCoinB = { denom: pool.reserve_coin_denoms[1], base_denom: '', chain_name: '' };

        if (isNative(pool.reserve_coin_denoms[0])) {
          reserveCoinA.base_denom = reserveCoinA.denom;
          reserveCoinA.chain_name = store.getters[GlobalDemerisGetterTypes.API.getDexChain];
        } else {
          const verifyTraceA =
            store.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
              chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
              hash: pool.reserve_coin_denoms[0].split('/')[1],
            }) ??
            (await store.dispatch(
              GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
              {
                subscribe: false,
                params: {
                  chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                  hash: pool.reserve_coin_denoms[0].split('/')[1],
                },
              },
              { root: true },
            ));
          reserveCoinA.base_denom = verifyTraceA.base_denom;
          reserveCoinA.chain_name = verifyTraceA.trace[verifyTraceA.trace.length - 1].counterparty_name;
        }

        if (isNative(pool.reserve_coin_denoms[1])) {
          reserveCoinB.base_denom = reserveCoinB.denom;
          reserveCoinB.chain_name = store.getters[GlobalDemerisGetterTypes.API.getDexChain];
        } else {
          const verifyTraceB =
            store.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
              chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
              hash: pool.reserve_coin_denoms[1].split('/')[1],
            }) ??
            (await store.dispatch(
              GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
              {
                subscribe: false,
                params: {
                  chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                  hash: pool.reserve_coin_denoms[1].split('/')[1],
                },
              },
              { root: true },
            ));
          reserveCoinB.base_denom = verifyTraceB.base_denom;
          reserveCoinB.chain_name = verifyTraceB.trace[verifyTraceB.trace.length - 1].counterparty_name;
        }
        const pairAB = {
          pool_id: pool.id,
          pay: reserveCoinA,
          receive: { denom: reserveCoinB.denom },
        };
        const pairBA = {
          pool_id: pool.id,
          pay: reserveCoinB,
          receive: { denom: reserveCoinA.denom },
        };

        // TODO: get isAdvanced from local storage
        const isAdvanced = true;

        //Pool coin included(advanced) or excluded
        if (isAdvanced) {
          pairs.push(pairAB);
          pairs.push(pairBA);
        } else {
          if (!hasPoolCoin(pairAB)) {
            pairs.push(pairAB);
            pairs.push(pairBA);
          }
        }

        //helper
        function hasPoolCoin(pair) {
          const poolPrefix = 'pool';
          return pair.pay.denom.startsWith(poolPrefix) || pair.receive.denom.startsWith(poolPrefix);
        }
      }
      availablePairs.value = pairs;
    });
    watch(
      () => pools.value,
      async (newPools, oldPools) => {
        if (JSON.stringify(newPools) != JSON.stringify(oldPools)) {
          const pairs = [];
          for (let pool of newPools) {
            let reserveCoinA = { denom: pool.reserve_coin_denoms[0], base_denom: '', chain_name: '' };
            let reserveCoinB = { denom: pool.reserve_coin_denoms[1], base_denom: '', chain_name: '' };

            if (isNative(pool.reserve_coin_denoms[0])) {
              reserveCoinA.base_denom = reserveCoinA.denom;
              reserveCoinA.chain_name = store.getters[GlobalDemerisGetterTypes.API.getDexChain];
            } else {
              const verifyTraceA =
                store.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
                  chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                  hash: pool.reserve_coin_denoms[0].split('/')[1],
                }) ??
                (await store.dispatch(
                  GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
                  {
                    subscribe: false,
                    params: {
                      chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                      hash: pool.reserve_coin_denoms[0].split('/')[1],
                    },
                  },
                  { root: true },
                ));
              reserveCoinA.base_denom = verifyTraceA.base_denom;
              reserveCoinA.chain_name = verifyTraceA.trace[verifyTraceA.trace.length - 1].counterparty_name;
            }

            if (isNative(pool.reserve_coin_denoms[1])) {
              reserveCoinB.base_denom = reserveCoinB.denom;
              reserveCoinB.chain_name = store.getters[GlobalDemerisGetterTypes.API.getDexChain];
            } else {
              const verifyTraceB =
                store.getters[GlobalDemerisGetterTypes.API.getVerifyTrace]({
                  chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                  hash: pool.reserve_coin_denoms[1].split('/')[1],
                }) ??
                (await store.dispatch(
                  GlobalDemerisActionTypes.API.GET_VERIFY_TRACE,
                  {
                    subscribe: false,
                    params: {
                      chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
                      hash: pool.reserve_coin_denoms[1].split('/')[1],
                    },
                  },
                  { root: true },
                ));
              reserveCoinB.base_denom = verifyTraceB.base_denom;
              reserveCoinB.chain_name = verifyTraceB.trace[verifyTraceB.trace.length - 1].counterparty_name;
            }
            const pairAB = {
              pool_id: pool.id,
              pay: reserveCoinA,
              receive: { denom: reserveCoinB.denom },
            };
            const pairBA = {
              pool_id: pool.id,
              pay: reserveCoinB,
              receive: { denom: reserveCoinA.denom },
            };

            // TODO: get isAdvanced from local storage
            const isAdvanced = true;

            //Pool coin included(advanced) or excluded
            if (isAdvanced) {
              pairs.push(pairAB);
              pairs.push(pairBA);
            } else {
              if (!hasPoolCoin(pairAB)) {
                pairs.push(pairAB);
                pairs.push(pairBA);
              }
            }

            //helper
            function hasPoolCoin(pair) {
              const poolPrefix = 'pool';
              return pair.pay.denom.startsWith(poolPrefix) || pair.receive.denom.startsWith(poolPrefix);
            }
          }
          availablePairs.value = pairs;
        }
      },
    );

    const availablePaySide = computed(() => {
      if (data?.receiveCoinData) {
        let paySide = availablePairs.value.filter(
          (x) => x.receive.denom == data.receiveCoinData?.denom || x.receive.denom == data.receiveCoinData?.base_denom,
        );
        return paySide;
      } else {
        return availablePairs.value;
      }
    });
    const availableReceiveSide = computed(() => {
      if (data?.payCoinData) {
        let receiveSide = availablePairs.value.filter((x) => x.pay.base_denom == data.payCoinData?.base_denom); // Chain name check optional since we only have unique verified denoms
        return receiveSide;
      } else {
        return availablePairs.value.filter(
          (pair, index, self) => index === self.findIndex((p) => p.receive.denom === pair.receive.denom),
        );
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
      let payAssets = allBalances.value.filter((x) => {
        return availablePaySide.value.find(
          (y) => y.pay.base_denom == x.base_denom && (parseInt(parseCoins(x.amount)[0].amount) > 0 || !hasBalance),
        );
      });
      return payAssets;
    });
    const assetsToReceive = computed(() => {
      let assets = availableReceiveSide.value.map((x) => {
        const denomInfo = availablePairs.value.find((pair) => pair.pay.denom === x.receive.denom);
        return {
          denom: x.receive.denom,
          base_denom: denomInfo.pay.base_denom,
          on_chain: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        };
      });
      return sortAssetList(assets);
    });

    const otherAssetsToPay = computed(() => {
      if (!data.receiveCoinData) {
        return [];
      }

      let assets = allBalances.value.filter((x) => {
        return availablePairs.value.find((y) => y.pay.base_denom == x.base_denom);
      });

      return assets.filter((asset) => {
        const isInPayAssets = assetsToPay.value.find((payAsset) => payAsset.denom === asset.denom);
        if (
          isInPayAssets === undefined &&
          parseInt(parseCoins(asset.amount)[0].amount) > 0 &&
          asset.base_denom !== data.receiveCoinData?.base_denom
        ) {
          return true;
        } else {
          return false;
        }
      });
    });

    const otherAssetsToReceive = computed(() => {
      if (!data.payCoinData) {
        return [];
      }

      let receivalbePairs = availablePairs.value.filter(
        (pair, index, self) => index === self.findIndex((p) => p.pay.denom === pair.pay.denom),
      );

      let assets = receivalbePairs.map((x) => {
        return {
          denom: x.pay.denom,
          base_denom: x.pay.base_denom,
          on_chain: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
        };
      });
      return assets.filter((asset) => {
        const isInPayAssets = assetsToReceive.value.find((payAsset) => payAsset.denom === asset.denom);
        if (isInPayAssets === undefined && asset.base_denom !== data.payCoinData?.base_denom) {
          return true;
        } else {
          return false;
        }
      });
    });

    // default pay coin set
    watch(
      () => {
        return [assetsToPay.value, balances.value];
      },
      (watchValues, oldWatchValues) => {
        //when wallet connected/disconnected set again
        if (watchValues[1].length !== oldWatchValues[1].length) {
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
            on_chain: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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
              defaultAsset.on_chain = store.getters[GlobalDemerisGetterTypes.API.getDexChain];
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
          if (!data.selectedPoolData) {
            return t('components.swap.noPool');
          } else if (data.isNotEnoughLiquidity) {
            return t('components.swap.swapLimit');
          } else if (data.isOver) {
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
        if (data.isNotEnoughLiquidity) {
          return t('components.swap.tooltipSwapLimit');
        } else if (data.isBothSelected) {
          if (!data.selectedPoolData) {
            return t('components.swap.tooltipNoPool');
          } else if (!dexStatus.value) {
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
                parseInt(
                  store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.payCoinData?.base_denom }),
                ),
              )
            ? true
            : false;
        } else {
          return false;
        }
      }),
      isNotEnoughLiquidity: computed(() => {
        if (slippage.value >= 0.2 || (data.payCoinAmount === 0 && data.receiveCoinAmount > 0)) {
          return true;
        } else {
          return false;
        }
      }),
      isBothSelected: computed(() => {
        return data.payCoinData && data.receiveCoinData;
      }),
      isAmount: computed(() => {
        if (data.payCoinAmount > 0 && data.receiveCoinAmount > 0) {
          return true;
        } else {
          return false;
        }
      }),
      isSwapReady: computed(() => {
        return !(
          data.isOver ||
          !data.isBothSelected ||
          data.isNotEnoughLiquidity ||
          !data.isAmount ||
          !isSignedIn.value ||
          data.selectedPoolData === null ||
          !dexStatus.value
        );
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
        data.selectedPoolData = null;
        isInit.value = false;
      },
      //programatically get inactive color
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

    //tx fee setting
    watch(
      () => data.payCoinData?.denom,
      async () => {
        if (data.payCoinData?.denom.startsWith('ibc') || data.payCoinData?.denom === 'uatom') {
          const fees = await getFeeForChain(data.payCoinData.on_chain);
          txFee.value =
            fees[0].amount[gasPriceLevel.value] *
            10 ** store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom });
        } else {
          return (txFee.value = 0);
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
            10 **
              (store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom }) ??
                6);

          if (amount > 0) {
            const ticker = await getTicker(
              data.payCoinData.base_denom,
              store.getters[GlobalDemerisGetterTypes.API.getDexChain],
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

    //calculate slippage and set
    watch(
      () => [data.payCoinAmount, data.receiveCoinAmount],
      () => {
        if (data.selectedPoolData) {
          const minimalDecimal = Math.pow(
            10,
            parseInt(
              store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom }),
            ),
          );

          const reserveCoin =
            data.selectedPoolData.reserves.findIndex((coin) => coin === data.payCoinData.base_denom) === 0
              ? 'balanceA'
              : 'balanceB';

          slippage.value = calculateSlippage(
            data.payCoinAmount * minimalDecimal,
            data.selectedPoolData.reserveBalances[reserveCoin],
          );
        }
      },
    );

    //set selecte pair pool info
    const poolId = ref(null); // for price update
    watch(
      () => {
        return [data.payCoinData?.denom, data.receiveCoinData?.denom];
      },
      async (watchValues) => {
        if (watchValues[0] && watchValues[1]) {
          let payDenom = data.payCoinData.base_denom;
          const receiveDenom = data.receiveCoinData.denom;

          if (
            !data.payCoinData.denom.startsWith('ibc') &&
            data.payCoinData.denom !== 'uatom' &&
            !data.payCoinData.denom.startsWith('pool')
          ) {
            // nativeDenomToIBCDenom
            payDenom = availablePairs.value.find((pair) => {
              return pair.pay.denom.startsWith('ibc') && pair.pay.base_denom === data.payCoinData.denom;
            }).pay.denom;
          } else if (data.payCoinData.denom.startsWith('ibc')) {
            const isPoolReserveIBCCoin = availablePairs.value.find((pair) => {
              return pair.pay.denom.startsWith('ibc') && pair.pay.base_denom === data.payCoinData.base_denom;
            })?.pay?.denom;

            if (isPoolReserveIBCCoin) {
              payDenom = isPoolReserveIBCCoin;
            }
          }
          data.isLoading = true;
          try {
            const pool = filterPoolsByDenom(payDenom).find((pool) => {
              return (
                pool.reserve_coin_denoms.find((denom) => {
                  return denom === receiveDenom;
                })?.length > 0
              );
            });

            if (pool) {
              poolId.value = pool.id;
              const reserves = await getReserveBaseDenoms(pool);
              const reserveBalances = await getReserveBalances(pool);
              const poolPrice = await getPoolPrice(pool);

              data.selectedPoolData = {
                pool,
                poolPrice,
                reserves,
                reserveBalances,
              };
              setCounterPairCoinAmount('Pay');
            } else {
              poolId.value = null;
              data.selectedPoolData = null;
            }

            data.isLoading = false;
          } catch (e) {
            poolId.value = null;
            data.selectedPoolData = null;
            data.isLoading = false;
          }
        }
      },
    );

    //pool price updater
    const setIntervalId = ref(null);
    watch(
      () => poolId.value,
      (newValue, oldValue) => {
        if (newValue !== oldValue && poolId.value) {
          clearInterval(setIntervalId.value);
          setIntervalId.value = setInterval(async () => {
            const id = poolId.value;
            const pool = getPoolById(id);
            await updatePool(pool);
            const poolPrice = await getPoolPrice(pool);
            const reserves = await getReserveBaseDenoms(pool);
            const reserveBalances = await getReserveBalances(pool);
            data.selectedPoolData = {
              pool,
              poolPrice,
              reserves,
              reserveBalances,
            };
            // setCounterPairCoinAmount('Pay');
          }, priceUpdateTerm * 1000);
        }
      },
    );

    //set actionHandlerResult when swapable
    watch(
      () => [data.payCoinAmount, data.receiveCoinAmount, data.payCoinData, data.receiveCoinData],
      async () => {
        if (data.isSwapReady) {
          // Note, I added || 6 as a quick fix in case no precision can be obtained, but we should instead have better error handling
          const fromPrecision =
            store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom }) || 6;
          const toPrecision =
            store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.receiveCoinData.base_denom }) ||
            6;
          const swapParams = {
            name: 'swap',
            params: {
              from: {
                amount: {
                  amount: String(Math.trunc(parseFloat(data.payCoinAmount) * Math.pow(10, parseInt(fromPrecision)))),
                  denom: data.payCoinData.denom,
                },
                chain_name: data.payCoinData.on_chain,
              },
              to: {
                amount: {
                  amount: String(Math.trunc(parseFloat(data.receiveCoinAmount) * Math.pow(10, parseInt(toPrecision)))),
                  denom: data.receiveCoinData.denom,
                },
                chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
              },
            },
          };
          data.actionHandlerResult = await actionHandler(swapParams as SwapAction);
        } else {
          data.actionHandlerResult = null;
        }
      },
    );

    function switchPayToReceive() {
      const originPayCoinData = JSON.parse(JSON.stringify(data.payCoinData));
      const originReceiveCoinData = JSON.parse(JSON.stringify(data.receiveCoinData));
      if (originPayCoinData) {
        originPayCoinData.on_chain = store.getters[GlobalDemerisGetterTypes.API.getDexChain];
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

      // reset amount, TODO: apply setCounterPairCoinAmount('');
      data.payCoinAmount = null;
      data.receiveCoinAmount = null;
    }

    function setMax() {
      const precisionDecimal = Math.pow(
        10,
        parseInt(
          store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
            name: data.payCoinData.base_denom,
          }) ?? 6,
        ),
      );

      if (data.selectedPoolData) {
        const payCoinReserveAmount = Number(
          data.selectedPoolData.reserves.indexOf(data.payCoinData.base_denom) == 0
            ? data.selectedPoolData.reserveBalances.balanceA
            : data.selectedPoolData.reserveBalances.balanceB,
        );

        if (Math.trunc(payCoinReserveAmount / 10) > data.maxAmount) {
          data.payCoinAmount = data.maxAmount / precisionDecimal;
        } else {
          data.payCoinAmount = Math.trunc(payCoinReserveAmount / 10) / precisionDecimal;
        }
      } else {
        data.payCoinAmount = data.maxAmount / precisionDecimal;
      }
      setCounterPairCoinAmount('Pay');
    }

    function denomSelectHandler(payload) {
      if (payload.type === 'Receive') {
        data.receiveCoinData = payload;
      } else {
        data.payCoinData = payload;
      }
    }

    function setChildModalOpenStatus(payload) {
      data.isChildModalOpen = payload;
    }

    function setCounterPairCoinAmount(e) {
      if (data.isBothSelected) {
        const isReverse = data.payCoinData.base_denom !== data.selectedPoolData?.reserves[0];
        const fromPrecision =
          store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.payCoinData.base_denom }) || 6;
        const toPrecision = store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({
          name: data.receiveCoinData.base_denom,
        });
        const precisionDiff = +fromPrecision - +toPrecision;
        let equalizer = 1;
        if (precisionDiff !== 0) {
          equalizer = 10 ** Math.abs(precisionDiff);
        }

        const balanceA = isReverse
          ? data.selectedPoolData.reserveBalances.balanceA
          : data.selectedPoolData.reserveBalances.balanceB;
        const balanceB = isReverse
          ? data.selectedPoolData.reserveBalances.balanceB
          : data.selectedPoolData.reserveBalances.balanceA;
        if (e.includes('Pay')) {
          const receiveCoinPrecisionDecimalDigits = Math.pow(
            10,
            parseInt(
              store.getters[GlobalDemerisGetterTypes.API.getDenomPrecision]({ name: data.receiveCoinData?.base_denom }),
            ),
          );
          data.receiveCoinAmount = parseFloat(
            String(
              Math.trunc(
                (getReceiveCoinAmount(
                  { base_denom: data.payCoinData.base_denom, amount: data.payCoinAmount },
                  balanceA,
                  balanceB,
                ) /
                  receiveCoinPrecisionDecimalDigits) *
                  10 ** 4,
              ) /
                10 ** 4,
            ),
          );

          if (data.payCoinAmount + data.receiveCoinAmount === 0) {
            slippage.value = 0;
          }
        } else {
          data.payCoinAmount = parseFloat(
            (
              getPayCoinAmount(
                { base_denom: data.receiveCoinData.base_denom, amount: data.receiveCoinAmount },
                balanceB,
                balanceA,
              ) * (isReverse ? equalizer : 1 / equalizer)
            ).toFixed(4),
          );
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
      availablePaySide,
      otherAssetsToPay,
      otherAssetsToReceive,
      dexStatus,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
  /* min-height: 17rem; */
}
</style>
