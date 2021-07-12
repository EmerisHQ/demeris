<template>
  <div class="wrapper">
    <SlippageSettingModal
      v-show="isSlippageSettingModalOpen"
      :swap-data="{
        pay: {
          denom: payCoinData?.base_denom,
          amount: payCoinAmount,
        },
        receive: { denom: receiveCoinData?.base_denom, amount: receiveCoinAmount },
      }"
      @goback="slippageSettingModalToggle"
    />
    <ReviewModal
      v-if="isOpen && !isSlippageSettingModalOpen"
      :data="actionHandlerResult"
      :gas-price-level="gasPriceLevel"
      @close="reviewModalToggle"
      @goback="gobackFunc"
    />
    <div
      class="swap-widget elevation-panel"
      :style="[!isSlippageSettingModalOpen ? '' : 'display:none', isChildModalOpen ? 'box-shadow:none;' : '']"
    >
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
        :input-header="`Receive ${getDisplayPrice(receiveCoinData?.base_denom, receiveCoinAmount, '~').value ?? ''}`"
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
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useAccount from '@/composables/useAccount';
import useCalculation from '@/composables/useCalculation.vue';
import useModal from '@/composables/useModal';
import usePools from '@/composables/usePools';
import usePrice from '@/composables/usePrice';
import { store } from '@/store';
import { SwapAction } from '@/types/actions';
import { getDisplayName } from '@/utils/actionHandler';
import { actionHandler } from '@/utils/actionHandler';
import { isNative } from '@/utils/basic';
export default defineComponent({
  name: 'Swap',
  components: {
    DenomSelect,
    IconButton,
    ActionButton,
    ReviewModal,
    Alert,
    SlippageSettingModal,
    FeeLevelSelector,
  },

  setup() {
    const { getPayCoinAmount, getReceiveCoinAmount, getPrecisedAmount, calculateSlippage } = useCalculation();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
    const { pools, poolsByDenom, poolById, poolPriceById, reserveBalancesById, getReserveBaseDenoms } = usePools();
    const { getDisplayPrice } = usePrice();
    const { balances } = useAccount();
    const slippage = ref(0);

    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'] ?? [];
    });

    //TEST
    const isConsole = true;

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

          // TODO: get isAdvanced from local storage
          const isAdvanced = false;

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
        // console.log('Available Pairs:');
        // console.log(pairs);
        availablePairs.value = pairs;
      },
    );

    const availablePaySide = computed(() => {
      if (data?.receiveCoinData) {
        let paySide = availablePairs.value.filter(
          (x) => x.receive.denom == data.receiveCoinData?.denom || x.receive.denom == data.receiveCoinData?.base_denom,
        );
        // console.log('Calculated PayPair List ');
        // console.log(paySide);
        return paySide;
      } else {
        return availablePairs.value;
      }
    });
    const availableReceiveSide = computed(() => {
      if (data?.payCoinData) {
        let receiveSide = availablePairs.value.filter((x) => x.pay.base_denom == data.payCoinData?.base_denom); // Chain name check optional since we only have unique verified denoms
        // console.log('Calculated ReceivePair List ');
        // console.log(receiveSide);
        return receiveSide;
      } else {
        return availablePairs.value;
      }
    });
    const allBalances = computed(() => {
      // TODO : augment balances array with 0amount entries from verifiedDenoms
      return balances.value;
    });
    const assetsToPay = computed(() => {
      let payAssets = allBalances.value.filter((x) => {
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

    const payAssetList = ref([]);
    watch(
      () => [availablePairs.value, isSignedIn.value, assetsToPay.value, availablePaySide.value],
      async () => {
        if (isSignedIn.value) {
          //with-wallet
          if (data.receiveCoinData) {
            // when receive coin selected => show assetToPay
            payAssetList.value = assetsToPay.value;
          } else {
            //recevie coin not selcted => show user balance
            payAssetList.value = balances.value;
          }
        } else {
          //no-wallet => show availablePairs
          const availablePayDenoms = availablePairs.value.map((pair) => {
            return pair.pay.denom;
          });

          const formattedVerifiedDenoms = verifiedDenoms.value.map((denom) => ({
            base_denom: denom.name,
            denom: denom.name,
            on_chain: denom.chain_name,
            display_name: denom.display_name,
            amount: `0${denom.name}`,
          }));

          //when payCoin: not selcted , receiveCoin: selceted by toggle initial status
          payAssetList.value = (
            availablePaySide.value.length > 0
              ? availablePaySide.value.map((pair) => {
                  return pair.pay.denom;
                })
              : availablePayDenoms
          ).map((asset) => {
            if (isNative(asset)) {
              return formattedVerifiedDenoms.filter((coin) => {
                return coin.base_denom === asset;
              })[0];
            } else {
              const verifyTrace = store.getters['demeris/getVerifyTrace']({
                chain_name: store.getters['demeris/getDexChain'],
                hash: asset.split('/')[1],
              });
              verifyTrace.on_chain = verifyTrace.trace[0].chain_name;
              verifyTrace.denom = asset;
              verifyTrace.amount = `0${verifyTrace.base_denom}`;
              return verifyTrace;
            }
          });
        }

        isConsole ? console.log('[PAY ASSET LIST]:', payAssetList.value) : '?';
      },
    );

    const receiveAssetList = ref([]);
    watch(
      () => assetsToReceive.value,

      async () => {
        // no need to divide 2 cases(with-wallet / no-wallet) since there are no balance and different on_chain
        const formattedVerifiedDenoms = verifiedDenoms.value.map((denom) => ({
          base_denom: denom.name,
          on_chain: denom.chain_name,
          display_name: denom.display_name,
        }));

        //when payCoin: not selcted , receiveCoin: selceted by toggle initial status
        receiveAssetList.value = (
          assetsToReceive.value.length > 0
            ? assetsToReceive.value
            : availablePairs.value.map((pair) => {
                return pair.pay.denom;
              })
        ).map((asset) => {
          if (isNative(asset)) {
            return formattedVerifiedDenoms.filter((coin) => {
              coin.denom = asset;
              return coin.base_denom === asset;
            })[0];
          } else {
            const verifyTrace = store.getters['demeris/getVerifyTrace']({
              chain_name: store.getters['demeris/getDexChain'],
              hash: asset.split('/')[1],
            });
            verifyTrace.on_chain = verifyTrace.trace[0].chain_name;
            return verifyTrace;
          }
        });

        isConsole ? console.log('[RECEIVE ASSET LIST]', receiveAssetList.value) : '';
      },
    );

    // default pay coin set
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
              payAssetList.value.filter((coin) => {
                return coin.base_denom === 'uatom' && coin.on_chain === store.getters['demeris/getDexChain'];
              })[0] ?? payAssetList.value[0];
          }

          isInit.value = true;
          console.log('[DEFAULT PAY COIN SET] : RECEIVE ASSET LIST will be recalculated');
        }
      },
    );
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
        if (data.isSwapReady) {
          return 'normal';
        } else {
          return 'inactive';
        }
      }),
      maxButtonText: 'Max',
      maxAmount: computed(() => {
        return (
          parseInt(
            balances.value.filter((coin) => {
              return coin.base_denom === data.payCoinData?.base_denom && coin.on_chain === data.payCoinData.on_chain;
            })[0]?.amount,
          ) ?? 0
        );
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

      //tx fee level
      gasPriceLevel: store.getters['getPreferredGasPriceLevel'],

      // for swap action
      actionHandlerResult: null,

      // booleans-start(for various status check)
      isOver: computed(() => {
        if (isSignedIn.value) {
          return data.isBothSelected &&
            data.payCoinAmount >
              parseInt(payAssetList?.value[0]?.amount) /
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

    //max button text set
    watch(
      () => data.payCoinData,
      async () => {
        if (data.payCoinData) {
          const amount = getPrecisedAmount(data.payCoinData.base_denom, data.maxAmount);
          if (amount > 0) {
            const displayName = await getDisplayName(data.payCoinData.base_denom, store.getters['demeris/getDexChain']);
            const formattedAmount = Math.floor(amount * 100) / 100;
            data.maxButtonText = `${formattedAmount} ${displayName} Max`;
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

    //set selecte pair pool info
    watch(
      () => {
        return [data.payCoinData, data.receiveCoinData];
      },
      async (watchValues) => {
        if (watchValues[0] && watchValues[1]) {
          const payDenom =
            (data.payCoinData.ibc?.ibc_denom || data.payCoinData.ibc_denom) ?? data.payCoinData.base_denom;
          const receiveDenom =
            (data.receiveCoinData.ibc?.ibc_denom || data.receiveCoinData.ibc_denom) ?? data.receiveCoinData.base_denom;
          console.group('[SELECTD POOL DENOMS]');
          console.log('PAY COIN DENOM: ', payDenom);
          console.log('RECEIVE COIN DENOM: ', receiveDenom);
          console.groupEnd();
          try {
            const id = poolsByDenom(payDenom).find((pool) => {
              return (
                pool.reserve_coin_denoms.find((denom) => {
                  console.log(denom, receiveDenom);
                  return denom.toLowerCase() === receiveDenom;
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
            console.table('SELECTED POOL DATA : ', data.selectedPoolData);
          } catch (e) {
            console.log('error', e);
            data.selectedPoolData = null;
          }
        }
      },
    );

    //set actionHandlerResult when swapable
    watch(
      () => data.payCoinAmount,
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

      if (isSignedIn.value) {
        //with wallet
        const newPayCoinUserBalance = balances.value.filter((coin) => {
          return (
            coin.base_denom === originReceiveCoinData?.base_denom &&
            coin.on_chain === store.getters['demeris/getDexChain']
          );
        });
        if (newPayCoinUserBalance.length) {
          //with wallet, user has this asset on cosmos_hub
          data.payCoinData = newPayCoinUserBalance[0];
          data.receiveCoinData = originPayCoinData;
        } else {
          //with wallet, user doesn't has this asset on cosmos_hub
          data.payCoinData = null;
          data.receiveCoinData = originPayCoinData;
        }
      } else {
        data.payCoinData = originReceiveCoinData;
        data.receiveCoinData = originPayCoinData;
      }

      data.payCoinAmount = 0;
      data.receiveCoinAmount = 0;

      // TEST
      // data.receiveCoinAmount = getReceiveCoinAmount(data.payCoinAmount, 100000000000, 100000000000);
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

    function denomSelectHandler(payload) {
      if (payload.type === 'Receive') {
        console.log('payload', payload);
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
      changePayToReceive,
      denomSelectHandler,
      getPrecisedAmount,
      setMax,
      swap,
      assetsToPay,
      assetsToReceive,
      payAssetList,
      receiveAssetList,
      setChildModalOpenStatus,
      isOpen,
      reviewModalToggle,
      gobackFunc,
      setCounterPairCoinAmount,
      isSlippageSettingModalOpen,
      slippageSettingModalToggle,
      getDisplayPrice,
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
