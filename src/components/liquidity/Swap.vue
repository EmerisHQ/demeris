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
    <ReviewModal
      v-if="isOpen && !isSlippageSettingModalOpen"
      :data="actionHandlerResult"
      :gas-price-level="gasPrice"
      action-name="swap"
      variant="widget"
      @close="reviewModalToggle"
      @reset="
        () => {
          reviewModalToggle();
          reset();
        }
      "
      @goback="gobackFunc"
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
              function: changePayToReceive,
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
        <FeeLevelSelector
          v-if="actionHandlerResult && actionHandlerResult.length > 0"
          v-model:gasPriceLevel="gasPrice"
          :steps="actionHandlerResult"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, toRefs, watch } from 'vue';

import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import ReviewModal from '@/components/common/TxStepsModal.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useAccount from '@/composables/useAccount';
import useCalculation from '@/composables/useCalculation.vue';
import useModal from '@/composables/useModal';
import usePools from '@/composables/usePools';
import usePrice from '@/composables/usePrice';
import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { GasPriceLevel, SwapAction } from '@/types/actions';
import { getTicker } from '@/utils/actionHandler';
import { actionHandler, getFeeForChain } from '@/utils/actionHandler';
import { isNative } from '@/utils/basic';
export default defineComponent({
  name: 'Swap',
  components: {
    Button,
    DenomSelect,
    Icon,
    IconButton,
    ReviewModal,
    Alert,
    SlippageSettingModal,
    FeeLevelSelector,
  },

  setup() {
    //SETTINGS-START
    const priceUpdateTerm = 10; //price update term (sec)
    //SETTINGS-END
    const { getPayCoinAmount, getReceiveCoinAmount, getPrecisedAmount, calculateSlippage } = useCalculation();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
    const { pools, poolsByDenom, poolById, poolPriceById, reserveBalancesById, getReserveBaseDenoms } = usePools();
    const { getDisplayPrice } = usePrice();
    const { balances } = useAccount();
    const isInit = ref(false);
    const slippage = ref(0);
    const store = useStore();
    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });
    const dexStatus = computed(() => {
      return store.getters['demeris/getChainStatus']({ chain_name: store.getters['demeris/getDexChain'] });
    });
    const gasPrice = ref('');
    watch(
      () => store.getters['demeris/getPreferredGasPriceLevel'],
      () => {
        gasPrice.value = store.getters['demeris/getPreferredGasPriceLevel'] || GasPriceLevel.AVERAGE;
      },
      { immediate: true },
    );

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'] ?? [];
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
          reserveCoinA.chain_name = store.getters['demeris/getDexChain'];
        } else {
          const verifyTraceA =
            store.getters['demeris/getVerifyTrace']({
              chain_name: store.getters['demeris/getDexChain'],
              hash: pool.reserve_coin_denoms[0].split('/')[1],
            }) ??
            (await store.dispatch(
              GlobalDemerisActionTypes.GET_VERIFY_TRACE,
              {
                subscribe: false,
                params: {
                  chain_name: store.getters['demeris/getDexChain'],
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
          reserveCoinB.chain_name = store.getters['demeris/getDexChain'];
        } else {
          const verifyTraceB =
            store.getters['demeris/getVerifyTrace']({
              chain_name: store.getters['demeris/getDexChain'],
              hash: pool.reserve_coin_denoms[1].split('/')[1],
            }) ??
            (await store.dispatch(
              GlobalDemerisActionTypes.GET_VERIFY_TRACE,
              {
                subscribe: false,
                params: {
                  chain_name: store.getters['demeris/getDexChain'],
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
              reserveCoinA.chain_name = store.getters['demeris/getDexChain'];
            } else {
              const verifyTraceA =
                store.getters['demeris/getVerifyTrace']({
                  chain_name: store.getters['demeris/getDexChain'],
                  hash: pool.reserve_coin_denoms[0].split('/')[1],
                }) ??
                (await store.dispatch(
                  GlobalDemerisActionTypes.GET_VERIFY_TRACE,
                  {
                    subscribe: false,
                    params: {
                      chain_name: store.getters['demeris/getDexChain'],
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
              reserveCoinB.chain_name = store.getters['demeris/getDexChain'];
            } else {
              const verifyTraceB =
                store.getters['demeris/getVerifyTrace']({
                  chain_name: store.getters['demeris/getDexChain'],
                  hash: pool.reserve_coin_denoms[1].split('/')[1],
                }) ??
                (await store.dispatch(
                  GlobalDemerisActionTypes.GET_VERIFY_TRACE,
                  {
                    subscribe: false,
                    params: {
                      chain_name: store.getters['demeris/getDexChain'],
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
      let payAssets = allBalances.value.filter((x) => {
        return availablePaySide.value.find((y) => y.pay.base_denom == x.base_denom);
      });
      return payAssets;
    });
    const assetsToReceive = computed(() => {
      let assets = availableReceiveSide.value.map((x) => {
        const denomInfo = availablePairs.value.find((pair) => pair.pay.denom === x.receive.denom);
        return {
          denom: x.receive.denom,
          base_denom: denomInfo.pay.base_denom,
          on_chain: store.getters['demeris/getDexChain'],
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
        if (isInPayAssets === undefined && asset.base_denom !== data.receiveCoinData?.base_denom) {
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
          on_chain: store.getters['demeris/getDexChain'],
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

        if (!isInit.value && watchValues[0].length) {
          data.receiveCoinData = null;
          if (!isSignedIn.value) {
            //no-wallet
            data.payCoinData = {
              amount: '0uatom',
              base_denom: 'uatom',
              denom: 'uatom',
              display_name: 'ATOM',
              on_chain: store.getters['demeris/getDexChain'],
            };
          } else {
            //with-wallet
            data.payCoinData =
              assetsToPay.value.filter((coin) => {
                return coin.base_denom === 'uatom' && coin.on_chain === store.getters['demeris/getDexChain'];
              })[0] ?? assetsToPay.value[0];
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
          if (data.selectedPoolData === null) {
            return 'No pool for this pair';
          } else if (data.isNotEnoughLiquidity) {
            return 'Swap limit reached';
          } else if (data.isOver) {
            return 'Insufficent funds';
          } else if (!dexStatus.value) {
            return 'Swap unavailable';
          } else {
            if (data.isPriceChanged) {
              return 'Update prices';
            } else {
              if (data.buttonStatus === 'active' && !data.buttonDisabled) {
                return 'Review';
              }
              return 'Swap';
            }
          }
        } else {
          return 'Swap';
        }
      }),
      buttonTooltipText: computed(() => {
        if (data.buttonName === 'Swap limit reached') {
          return `You cannot swap more than 10% of the pool's available liquidity. Try swapping a smaller amount.`;
        } else {
          if (!dexStatus.value) {
            return 'Cosmos Hub appears to be down, swap is temporarily unavailable';
          } else {
            return '';
          }
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
        const maxBalance = parseInt(
          allBalances.value.filter((coin) => {
            return coin.denom === data.payCoinData?.denom;
          })[0]?.amount,
        );
        const swapFeeRate =
          parseFloat(String(store.getters['tendermint.liquidity.v1beta1/getParams']().params?.swap_fee_rate / 2)) ??
          0.0015;

        if (maxBalance > Math.ceil(maxBalance * swapFeeRate) + txFee.value) {
          return maxBalance - Math.ceil(maxBalance * swapFeeRate) - txFee.value ?? 0;
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
          // data.isBothSelected &&
          return Number(data.payCoinAmount) + Number(data.fees) >
            parseInt(assetsToPay?.value.find((asset) => asset?.denom === data.payCoinData?.denom)?.amount) /
              Math.pow(10, parseInt(store.getters['demeris/getDenomPrecision']({ name: data.payCoinData?.base_denom })))
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
      () => data.payCoinData,
      async () => {
        if (data.payCoinData) {
          const fees = await getFeeForChain(data.payCoinData.on_chain);
          if (
            data.payCoinData.denom === 'uatom' ||
            (!data.payCoinData.denom.startsWith('ibc') &&
              data.payCoinData.on_chain !== store.getters['demeris/getDexChain'])
          ) {
            txFee.value =
              fees[0].amount[gasPrice.value] *
              10 ** store.getters['demeris/getDenomPrecision']({ name: data.payCoinData.base_denom });
          } else {
            return 0;
          }
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
            10 ** (store.getters['demeris/getDenomPrecision']({ name: data.payCoinData.base_denom }) ?? 6);

          if (amount > 0) {
            const ticker = await getTicker(data.payCoinData.base_denom, store.getters['demeris/getDexChain']);
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
      () => data.payCoinAmount,
      () => {
        if (data.selectedPoolData) {
          const minimalDecimal = Math.pow(
            10,
            parseInt(store.getters['demeris/getDenomPrecision']({ name: data.payCoinData.base_denom })),
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
              payDenom = data.payCoinData.denom;
            }
          }
          data.isLoading = true;
          try {
            const id = poolsByDenom(payDenom).find((pool) => {
              return (
                pool.reserve_coin_denoms.find((denom) => {
                  return denom === receiveDenom;
                })?.length > 0
              );
            })?.id;

            poolId.value = id;

            const pool = poolById(id);
            const reserves = await getReserveBaseDenoms(pool);
            const reserveBalances = await reserveBalancesById(id);
            const poolPrice = await poolPriceById(id);

            data.selectedPoolData = {
              pool,
              poolPrice,
              reserves,
              reserveBalances,
            };
            setCounterPairCoinAmount('Pay');
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
            const pool = poolById(id);
            const poolPrice = await poolPriceById(id);
            const reserves = await getReserveBaseDenoms(pool);
            const reserveBalances = await reserveBalancesById(id);

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
    onUnmounted(() => {
      clearInterval(setIntervalId.value);
    });

    //set actionHandlerResult when swapable
    watch(
      () => data.payCoinAmount,
      async () => {
        if (data.isSwapReady) {
          // Note, I added || 6 as a quick fix in case no precision can be obtained, but we should instead have better error handling
          const fromPrecision = store.getters['demeris/getDenomPrecision']({ name: data.payCoinData.base_denom }) || 6;
          const toPrecision =
            store.getters['demeris/getDenomPrecision']({ name: data.receiveCoinData.base_denom }) || 6;
          const swapParams = {
            name: 'swap',
            params: {
              from: {
                amount: {
                  amount: String(parseFloat(data.payCoinAmount) * Math.pow(10, parseInt(fromPrecision))),
                  denom: data.payCoinData.denom,
                },
                chain_name: data.payCoinData.on_chain,
              },
              to: {
                amount: {
                  amount: String(parseFloat(data.receiveCoinAmount) * Math.pow(10, parseInt(toPrecision))),
                  denom: data.receiveCoinData.denom,
                },
                chain_name: store.getters['demeris/getDexChain'],
              },
            },
          };
          data.actionHandlerResult = await actionHandler(swapParams as SwapAction);
          console.log('actionHandlerResult', data.actionHandlerResult);
        } else {
          data.actionHandlerResult = null;
        }
      },
    );

    function changePayToReceive() {
      const originPayCoinData = JSON.parse(JSON.stringify(data.payCoinData));
      let originReceiveCoinData = null;
      if (originPayCoinData) {
        originPayCoinData.on_chain = store.getters['demeris/getDexChain']; // receive assets should only have cosmos-hub for on_chain value
      }
      if (data.receiveCoinData) {
        originReceiveCoinData = JSON.parse(JSON.stringify(data.receiveCoinData));
      }

      data.payCoinData = originReceiveCoinData;
      data.receiveCoinData = assetsToReceive.value.find((asset) => {
        return asset?.base_denom === originPayCoinData?.base_denom;
      });
      data.payCoinAmount = null;
      data.receiveCoinAmount = null;
      // setCounterPairCoinAmount('');
    }

    function setMax() {
      const precisionDecimal = Math.pow(
        10,
        parseInt(
          store.getters['demeris/getDenomPrecision']({
            name: data.payCoinData.base_denom,
          }) ?? 6,
        ),
      );

      data.payCoinAmount = data.maxAmount / precisionDecimal;
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

    function gobackFunc() {
      alert('goback');
    }

    function setCounterPairCoinAmount(e) {
      if (data.isBothSelected) {
        const isReverse = data.payCoinData.base_denom !== data.selectedPoolData.reserves[0];
        const balanceA = isReverse
          ? data.selectedPoolData.reserveBalances.balanceA
          : data.selectedPoolData.reserveBalances.balanceB;
        const balanceB = isReverse
          ? data.selectedPoolData.reserveBalances.balanceB
          : data.selectedPoolData.reserveBalances.balanceA;

        if (e.includes('Pay')) {
          data.receiveCoinAmount = getReceiveCoinAmount(
            { base_denom: data.payCoinData.base_denom, amount: data.payCoinAmount },
            balanceA,
            balanceB,
          );
          if (data.payCoinAmount + data.receiveCoinAmount === 0) {
            slippage.value = 0;
          }
        } else {
          data.payCoinAmount = getPayCoinAmount(
            { base_denom: data.receiveCoinData.base_denom, amount: data.receiveCoinAmount },
            balanceB,
            balanceA,
          );
        }
      }
    }

    async function swap() {
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
      changePayToReceive,
      denomSelectHandler,
      getPrecisedAmount,
      setMax,
      swap,
      assetsToPay,
      assetsToReceive,
      setChildModalOpenStatus,
      isOpen,
      reviewModalToggle,
      gobackFunc,
      setCounterPairCoinAmount,
      isSlippageSettingModalOpen,
      slippageSettingModalToggle,
      getDisplayPrice,
      gasPrice,
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
