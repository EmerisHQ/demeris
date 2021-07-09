<template>
  <div class="wrapper">
    <SlippageSettingModal v-if="isSlippageSettingModalOpen" @goback="slippageSettingModalToggle" />
    <ReviewModal
      v-else-if="isOpen"
      :data="actionHandlerResult"
      :gas-price-level="gasPriceLevel"
      @close="reviewModalToggle"
      @goback="gobackFunc"
    />
    <div v-else class="swap-widget elevation-panel" :style="isChildModalOpen ? 'box-shadow:none;' : ''">
      <div class="swap-widget-header">
        <div class="s-2 w-bold">Swap</div>
        <div class="swap-widget-header__dot-button">
          <IconButton
            :name="'ThreeDotsIcon'"
            :type="'flat'"
            :status="'normal'"
            :data="{
              type: 'custom',
              function: slippageSettingModalToggle,
            }"
          />
        </div>
      </div>

      <!-- pay coin selector -->
      <DenomSelect
        v-model:amount="payCoinAmount"
        :input-header="`Pay ${getDisplayPrice(payCoinData?.base_denom, payCoinAmount).value ?? ''}`"
        :selected-denom="payCoinData"
        :assets="payAssetList"
        :is-over="isOver"
        @change="setCounterPairCoinAmount"
        @select="denomSelectHandler"
        @modalToggle="setChildModalOpenStatus"
      />

      <!-- button-divider -->
      <div class="swap-widget__controller">
        <div class="swap-widget__controller-divider" />
        <div class="swap-widget__controller-wrapper">
          <IconButton
            :name="'UpsideDownIcon'"
            :type="'circle'"
            :status="'normal'"
            :data="{
              type: 'custom',
              function: changePayToReceive,
            }"
          />
          <IconButton
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
        :input-header="`Receive ${getCoinDollarValue(receiveCoinData?.base_denom, receiveCoinAmount, '~')}`"
        :selected-denom="receiveCoinData"
        :assets="receiveAssetList"
        @change="setCounterPairCoinAmount"
        @select="denomSelectHandler"
        @modalToggle="setChildModalOpenStatus"
      />

      <!-- price change alert -->
      <div v-if="isPriceChanged && isBothSelected" class="price-alert-wrapper">
        <Alert status="warning" message="Prices have changed" />
      </div>

      <!-- swap button -->
      <div class="button-wrapper">
        <ActionButton
          :name="buttonName"
          :status="buttonStatus"
          :click-function="swap"
          :tooltip-text="buttonTooltipText"
        />
      </div>
      <FeeLevelSelector
        v-if="actionHandlerResult && actionHandlerResult.length > 0"
        v-model:gasPriceLevel="gasPriceLevel"
        :steps="actionHandlerResult"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { parseCoins } from '@cosmjs/amino';
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';

import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import ReviewModal from '@/components/common/TxStepsModal.vue';
import Alert from '@/components/ui/Alert.vue';
import ActionButton from '@/components/ui/Button.vue';
// import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useAccount from '@/composables/useAccount';
import useCalculation from '@/composables/useCalculation.vue';
import useModal from '@/composables/useModal';
import usePools from '@/composables/usePools';
import usePrice from '@/composables/usePrice';
import { store } from '@/store';
import { GasPriceLevel, SwapAction } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
import { getDisplayName } from '@/utils/actionHandler';
import { isNative } from '@/utils/basic';
export default defineComponent({
  name: 'Swap',
  components: {
    DenomSelect,
    IconButton,
    ActionButton,
    // Icon,
    ReviewModal,
    Alert,
    SlippageSettingModal,
    FeeLevelSelector,
  },

  setup() {
    const { getCoinDollarValue, getPayCoinAmount, getReceiveCoinAmount, getPrecisedAmount, calculateSlippage } =
      useCalculation();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
    const { pools, poolsByDenom, poolById, poolPriceById, reserveBalancesById, getReserveBaseDenoms } = usePools();
    const { getDisplayPrice } = usePrice();
    const { balances, userAccountBalances } = useAccount();
    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });
    //TEST
    const isConsole = false;
    // REFACTOR STARTS HERE
    const availablePairs = ref([]);
    watch(
      () => pools.value,
      async (newPools) => {
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
                'demeris/GET_VERIFY_TRACE',
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
                'demeris/GET_VERIFY_TRACE',
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
          pairs.push(pairAB);
          pairs.push(pairBA);
        }
        // console.log('Available Pairs:');
        // console.log(pairs);
        availablePairs.value = pairs;
      },
    );

    const availablePaySide = computed(() => {
      let paySide = availablePairs.value.filter(
        (x) => x.receive.denom == data.receiveCoinData?.denom || x.receive.denom == data.receiveCoinData?.base_denom,
      );
      // console.log('Calculated PayPair List ');
      // console.log(paySide);
      return paySide;
    });
    const availableReceiveSide = computed(() => {
      let receiveSide = availablePairs.value.filter((x) => x.pay.base_denom == data.payCoinData?.base_denom); // Chain name check optional since we only have unique verified denoms
      // console.log('Calculated ReceivePair List ');
      // console.log(receiveSide);
      return receiveSide;
    });
    const assetsToPay = computed(() => {
      let payAssets = balances.value.filter((x) => {
        return availablePaySide.value.find((y) => y.pay.base_denom == x.base_denom);
      });
      // console.log('Calculated Pay Asset List ');
      // console.log(payAssets);
      return payAssets;
    });
    const assetsToReceive = computed(() => {
      let assets = availableReceiveSide.value.map((x) => x.receive.denom);
      // console.log('Calculated Receive Asset List ');
      // console.log(assets);
      return assets;
    });

    const initialPairList = ref([]); // for default asset list
    watch(
      () => availablePairs.value,
      (pairs) => {
        const uniquePairList = JSON.parse(JSON.stringify(pairs))
          .map((pair) => {
            return pair.pay;
          })
          .reduce(function (acc, current) {
            if (acc.findIndex(({ denom }) => denom === current.denom) === -1) {
              acc.push(current);
            }
            return acc;
          }, []);

        initialPairList.value =
          //TODO: advanced user
          // localStorage.getItem('isAdvanced') === 'true'
          true ? uniquePairList : uniquePairList.filter((pair) => !pair.denom.includes('pool'));
        isConsole ? console.log('[INITIAL PAIR LIST]', initialPairList.value) : '';
      },
    );

    // TODO: Advanced option only advanced user can see pool token
    const payAssetList = ref([]);
    watch(
      () => [initialPairList.value, isSignedIn.value, assetsToPay.value, userAccountBalances.value],
      async (watchValues) => {
        const assetIndexer = {};
        const filteredList = [];
        if (isSignedIn.value && assetsToPay.value.length) {
          assetsToPay.value.forEach((asset) => {
            assetIndexer[`${asset.base_denom}/${asset.on_chain}`] = 'exist';
          });

          initialPairList.value.forEach((pair) => {
            // console.log('pair', `${pair.base_denom}/${pair.on_chain}`);
            if (assetIndexer[`${pair.base_denom}/${pair.chain_name}`]) {
              filteredList.push(pair);
            }
          });
        }

        //default list with needed properties (no-wallet)
        const assetList = filteredList.length > 0 ? filteredList : initialPairList.value;
        payAssetList.value = await Promise.all(
          assetList.map(async (pair) => {
            pair.amount = `0${pair.base_denom}`;
            pair.on_chain = pair.chain_name;
            pair.display_name = await getDisplayName(pair.denom, store.getters['demeris/getDexChain']); // need this as a string value for search function()
            return pair;
          }),
        );

        if (watchValues[1]) {
          //with wallet
          const walletVerifiedBalances = userAccountBalances.value.verified;
          // const walletUnverifiedBalances = userAccountBalances.value.unverified //future use

          const payAssetListWithBalance = [];
          payAssetList.value.forEach((pair) => {
            const assetWithBalance = walletVerifiedBalances.filter((asset) => {
              if (asset.base_denom === pair.base_denom && asset.on_chain === pair.on_chain) {
                asset.display_name = pair.display_name;
                asset.denom = pair.denom;
              }
              return asset.base_denom === pair.base_denom && asset.on_chain === pair.on_chain;
            });

            if (assetWithBalance.length) {
              payAssetListWithBalance.push(assetWithBalance[0]);
            }
          });

          payAssetList.value = JSON.parse(JSON.stringify(payAssetListWithBalance));
        }

        isConsole ? console.log('[PAY ASSET LIST]:', payAssetList.value) : '?';
      },
    );

    const receiveAssetList = ref([]);
    //토글에서 바꾸자 수량은
    watch(
      () => assetsToReceive.value,
      async () => {
        // console.log('assetsToReceive.value', assetsToReceive.value);
        if (assetsToReceive.value.length || isSignedIn.value) {
          const filteredList = initialPairList.value.filter((pair) => {
            return assetsToReceive.value.includes(pair.denom);
          });

          receiveAssetList.value = await Promise.all(
            filteredList.map(async (pair) => {
              return {
                ...pair,
                on_chain: store.getters['demeris/getDexChain'],
                display_name: await getDisplayName(pair.denom, store.getters['demeris/getDexChain']),
              };
            }),
          );
        } else {
          receiveAssetList.value = initialPairList.value.map((pair) => {
            pair.on_chain = store.getters['demeris/getDexChain'];
            return pair;
          });
        }

        isConsole ? console.log('[RECEIVE ASSET LIST]', receiveAssetList.value) : '';
      },
    );

    // for default payCoin set
    const isInit = ref(false);
    watch(
      () => {
        return [payAssetList.value, isSignedIn.value];
      },
      (watchValues, oldWatchValues) => {
        //when wallet connected/disconnected set again
        if (watchValues[1] !== oldWatchValues[1]) {
          isInit.value = false;
          data.payCoinAmount = null;
          data.receiveCoinAmount = null;
        }

        if (!isInit.value && watchValues[0].length) {
          data.receiveCoinData = null;
          data.payCoinData =
            payAssetList.value.filter((coin) => {
              return coin.base_denom === 'uatom';
            })[0] ?? payAssetList.value[0];

          isInit.value = true;
        }
      },
    );

    const slippage = ref(0);
    // REFACTOR ENDS HERE

    const data = reactive({
      //conditional-text-start
      buttonName: computed(() => {
        if (data.isBothSelected) {
          if (data.isNotEnoughLiquidity) {
            return 'Insufficient liquidity';
          } else if (data.isOver) {
            return 'Insufficent funds';
          } else {
            if (data.isPriceChanged) {
              return 'Update prices';
            } else {
              return 'Swap';
            }
          }
        } else {
          return 'Swap';
        }
      }),
      buttonTooltipText: computed(() => {
        if (data.buttonName === 'Insufficient liquidity') {
          return 'Insufficient liquidity available for this swap. Try swapping a smaller amount.';
        } else {
          return '';
        }
      }),
      buttonStatus: computed(() => {
        if (!data.isSwapReady) {
          return 'inactive';
        } else {
          return 'normal';
        }
      }),
      maxButtonText: computed(() => {
        if (data.payCoinData) {
          const amount = getPrecisedAmount(data.payCoinData?.base_denom, getMaxAmount(data.payCoinData));
          if (amount > 0) {
            return `${amount} ${data.payCoinData.display_name} Max`;
          } else {
            return 'Max';
          }
        } else {
          return 'Max';
        }
      }),
      //conditional-text-end

      //pay-receive-data-start
      payCoinData: null,
      payCoinAmount: null,
      receiveCoinData: null,
      receiveCoinAmount: null,
      //pay-receive-data-end
      selectedPoolData: null,
      verifiedDenoms: computed(() => {
        return store.getters['demeris/getVerifiedDenoms'];
      }),

      // permanent fee-level-setting
      gasPriceLevel: localStorage.getItem('demeris-fee-level') || GasPriceLevel.AVERAGE,
      // for swap action
      actionHandlerResult: null,

      // booleans-start(for various status check)
      isOver: computed(() => {
        if (isSignedIn.value) {
          return data.isBothSelected &&
            data.payCoinAmount >
              parseInt(payAssetList.value[0].amount) /
                Math.pow(
                  10,
                  parseInt(store.getters['demeris/getDenomPrecision']({ name: data.payCoinData?.base_denom })),
                )
            ? true
            : false;
        } else {
          return false;
        }
      }),
      isNotEnoughLiquidity: computed(() => (slippage.value >= 0.2 ? true : false)),
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
          !isSignedIn.value
        );
      }),
      isChildModalOpen: false,
      isPriceChanged: false,
      isAssetList: false,
      isFeesOpen: false,
      // booleans-end

      //programatically get inactive color
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

    //slippage check
    watch(
      () => data.payCoinAmount,
      () => {
        if (data.selectedPoolData) {
          const reserveCoin =
            data.selectedPoolData.reserves.findIndex((coin) => coin === data.payCoinData.denom) === 0
              ? 'balanceA'
              : 'balanceB';

          slippage.value = calculateSlippage(
            data.payCoinAmount *
              Math.pow(10, parseInt(store.getters['demeris/getDenomPrecision']({ name: data.payCoinData.base_denom }))),
            data.selectedPoolData.reserveBalances[reserveCoin],
          );
        }
      },
    );

    //get pool price
    watch(
      () => {
        return [data.payCoinData, data.receiveCoinData];
      },
      async (watchValues) => {
        if (watchValues[0] && watchValues[1]) {
          try {
            const id = poolsByDenom(data.payCoinData.denom).find((pool) => {
              return (
                pool.reserve_coin_denoms.find((denom) => {
                  return denom === data.receiveCoinData.denom;
                })?.length > 0
              );
            })?.id;

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
            console.table('selectedPoolData', data.selectedPoolData);
          } catch (e) {
            data.selectedPoolData = null;
          }
        }
      },
    );

    watch(
      () => data.isSwapReady,
      async () => {
        if (data.isSwapReady) {
          console.log('[SWAP READY]');
          console.log(data.payCoinData, data.payCoinAmount);
          console.log(data.receiveCoinData, data.receiveCoinAmount);

          const fromPrecision = store.getters['demeris/getDenomPrecision']({ name: data.payCoinData.base_denom });
          const toPrecision = store.getters['demeris/getDenomPrecision']({ name: data.receiveCoinData.base_denom });

          const swapParams = {
            name: 'swap',
            params: {
              from: {
                amount: {
                  amount: String(parseFloat(data.payCoinAmount) * Math.pow(10, parseInt(fromPrecision))),
                  denom: parseCoins(data.payCoinData.amount)[0].denom,
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
        } else {
          data.actionHandlerResult = null;
        }
      },
    );

    function changePayToReceive() {
      const originPayCoinData = JSON.parse(JSON.stringify(data.payCoinData));
      if (originPayCoinData) {
        originPayCoinData.on_chain = store.getters['demeris/getDexChain']; // receive assets should only have cosmos-hub for on_chain value
      }
      const originReceiveCoinData = JSON.parse(JSON.stringify(data.receiveCoinData));
      // const originReceiveCoinAmount = JSON.parse(JSON.stringify(data.receiveCoinAmount));

      data.payCoinData = originReceiveCoinData;
      data.receiveCoinData = originPayCoinData;
      // data.payCoinAmount = originReceiveCoinAmount;
      // data.receiveCoinAmount = getReceiveCoinAmount(data.payCoinAmount, 100000000000, 100000000000);
      // TEST
      data.payCoinAmount = 0;
      data.receiveCoinAmount = 0;
    }

    function setMax() {
      const precisionDecimal = Math.pow(
        10,
        parseInt(
          store.getters['demeris/getDenomPrecision']({
            name: data.payCoinData.base_denom,
          }),
        ),
      );
      data.payCoinAmount = parseInt(data.payCoinData.amount) / Number(precisionDecimal);
      setCounterPairCoinAmount('Pay');
    }

    function getMaxAmount(payCoinData) {
      const selectedCoinData = payAssetList?.value.find((asset) => {
        if (asset.base_denom === payCoinData.base_denom && asset.on_chain === payCoinData.on_chain) {
          return true;
        }
      });
      return parseInt(selectedCoinData?.amount) || 0;
    }

    function denomSelectHandler(payload) {
      if (payload.type === 'Receive') {
        data.receiveCoinData = payload;
        data.payCoinAmount = null;
        data.receiveCoinAmount = null;
      } else {
        data.payCoinData = payload;
        data.payCoinAmount = null;
        data.receiveCoinAmount = null;
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
        //TEST
        // data.selectedPoolData.reserveBalances.balanceA = 318000000;
        // data.selectedPoolData.reserveBalances.balanceB = 159000000;
        const balanceA = isReverse
          ? data.selectedPoolData.reserveBalances.balanceA
          : data.selectedPoolData.reserveBalances.balanceB;
        const balanceB = isReverse
          ? data.selectedPoolData.reserveBalances.balanceB
          : data.selectedPoolData.reserveBalances.balanceA;
        console.log(balanceA, balanceB);
        if (e.includes('Pay')) {
          data.receiveCoinAmount = getReceiveCoinAmount(data.payCoinAmount, balanceA, balanceB);
        } else {
          data.payCoinAmount = getPayCoinAmount(data.receiveCoinAmount, balanceB, balanceA);
        }
      }
    }

    async function swap() {
      console.log('SWAP Button Result', data.actionHandlerResult);
      reviewModalToggle();
    }

    return {
      ...toRefs(data),
      getCoinDollarValue,
      changePayToReceive,
      denomSelectHandler,
      getMaxAmount,
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
      //new
      payAssetList,
      receiveAssetList,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 32rem;
  /* height: 42.6rem; */
}

.swap-widget {
  padding-bottom: 2.4rem;
  background-color: var(--surface);

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem 2.4rem;

    color: var(--text);
    /* &__dot-button {
      width: 2.4rem;
      height: 2.4rem;
    } */
  }

  &__controller {
    position: relative;
    display: flex;
    align-items: center;

    height: 3.6rem;

    &-divider {
      width: 100%;
      height: 1px;
      background-color: var(--border-trans);
    }

    &-wrapper {
      position: absolute;
      display: flex;
      justify-content: space-between;

      width: 100%;
      padding: 0 18px;
    }
  }

  .price-alert-wrapper {
    padding: 0.8rem 2.4rem;
  }

  .button-wrapper {
    padding: 1.6rem 2.4rem 2.4rem;
  }

  .fees {
    display: flex;
    padding: 0 2.4rem 2.4rem;
    justify-content: space-between;
    color: var(--muted);

    &-total {
      display: flex;
      align-items: center;
    }

    &-detail {
      padding: 0 2.4rem;
      color: var(--text);

      &__info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin: 1.6rem 0;

        &:last-child {
          margin-bottom: 0;
          .fees-detail__info-value {
            font-weight: bold;
          }
        }

        &:first-child {
          margin-top: 0;
        }
      }

      &__selector {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-block {
          width: 8.3rem;
          height: 4.9rem;
          color: var(--text);

          background-color: var(--fg-trans);

          border-radius: 8px;

          outline: none;
        }

        .selected {
          background: linear-gradient(100.01deg, #aae3f9 -9.61%, #fbcbb8 96.61%);
        }
      }
    }
  }

  .alert--warning {
    margin-top: 1.6rem;
  }

  .fees-detail-open {
    font-weight: bold;
    color: var(--text);

    .icon {
      color: var(--text) !important;
    }
  }
}
</style>
