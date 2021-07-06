<template>
  <!-- 
		Displays a swap building component:
		title, chose denom balance
		Max Icon button (using ../ui/Icon.vue)
		Reset Icon Button (using ../ui/Icon.vue)
		from Denom selector (using ../common/DenomSelect.vue)
		to Denom selector (using ../common/DenomSelect.vue)
		switch Icon Button (using ../ui/Icon.vue)
		price compoonent (using ../common/Price.vue)

		dependencies:
				vuex getter to obtain user's preferred UI lang (i18n texts)?
	-->
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
        :assets="userAssetList"
        :is-over="isOver"
        @change="setConterPairCoinAmount"
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
            v-if="payCoinData"
            :name="`${getPrecisedAmount(payCoinData.base_denom, getMaxAmount(payCoinData))} ${
              payCoinData.display_name
            } Max `"
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
        :assets="baseAssetList"
        @change="setConterPairCoinAmount"
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
        v-model:gasPriceLevel="gasPriceLevel"
        :transaction-count="1"
        :base-dollar-fee="0.2"
        :swap-dollar-fee="0.1"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';

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
import { SWAP_TEST_DATA } from '@/TEST_DATA';
import { GasPriceLevel } from '@/types/actions';
import { actionHandler } from '@/utils/actionHandler';
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
    const { getCoinDollarValue, getPayCoinAmount, getReceiveCoinAmount, getPrecisedAmount } = useCalculation();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
    const { denomListByPools, pools } = usePools();
    const { getDisplayPrice } = usePrice();
    const { userAccountBalances } = useAccount();

    const data = reactive({
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
        if (data.isOver || !data.isBothSelected || data.isNotEnoughLiquidity) {
          return 'inactive';
        } else {
          return 'normal';
        }
      }),
      payCoinData: null,
      payCoinAmount: null,
      receiveCoinData: null,
      receiveCoinAmount: null,
      baseAssetList: [], // generated by pools info
      verifiedDenoms: computed(() => {
        return store.getters['demeris/getVerifiedDenoms'];
      }),
      userAssetList: computed(() => {
        if (data.isWallet) {
          if (userAccountBalances?.value?.verified.length + userAccountBalances?.value?.unverified.length > 0) {
            //wallet with assets
            const userVerifiedBalances = userAccountBalances.value.verified;
            // console.log('userAccountBalances', userAccountBalances.value.verified);
            // console.log('data.baseAssetList', data.baseAssetList)
            const tempIndexer = {};
            const tempArray = [...data.baseAssetList];
            data.baseAssetList.forEach((coin, index) => {
              tempIndexer[coin.base_denom] = index;
            });
            // console.log('indexer',tempIndexer)

            userVerifiedBalances.forEach((coin) => {
              if (tempIndexer[coin.base_denom]) {
                tempArray[tempIndexer[coin.base_denom]].amount = coin.amount;
              } else {
                coin.display_name = 'AKT';
                tempArray.push(coin);
              }
            });

            return tempArray;
          } else {
            // wallet without assets
            // at here, we can set open modal for moonpay?
            return data.baseAssetList;
          }
        } else {
          // wallet
          return data.baseAssetList;
        }
      }),

      receiveAssetList: computed(() => {
        let receiveAvailableAssets = [];

        for (let i in data.baseAssetList) {
          // later, to filter some coins
          const coin = data.baseAssetList[i];
          receiveAvailableAssets.push({ ...coin });
        }

        return receiveAvailableAssets;
      }),
      gasPriceLevel: localStorage.getItem('demeris-fee-level') || GasPriceLevel.AVERAGE,
      actionHandlerResult: null,
      isOver: computed(() => (data.isBothSelected && data?.payCoinAmount > data?.payCoinData?.amount ? true : false)),
      isNotEnoughLiquidity: computed(() => (data?.payCoinAmount > 1500 ? true : false)),
      isBothSelected: computed(() => {
        return data.payCoinData && data.receiveCoinData;
      }),
      isChildModalOpen: false,
      isPriceChanged: true,
      isWallet: computed(() => {
        return store.getters['demeris/getKeplrAddress'] ? true : false;
      }),
      isReceiveAssetList: computed(() => {
        return data.receiveAssetList.length !== 0 ? true : false;
      }),
      isUserAssetList: computed(() => {
        return data.userAssetList.length !== 0 ? true : false;
      }),
      initStatus: 'none',
      isFeesOpen: false,
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

    watch(
      () => {
        return [data.isWallet, data.isReceiveAssetList, data.isUserAssetList, data.initStatus];
      },
      (watchValues) => {
        if (watchValues[0]) {
          if (watchValues[2]) {
            if (watchValues[3] !== 'walletInit') {
              data.payCoinData = data.userAssetList[0];
              data.initStatus = 'walletInit';
            }
          }
        } else {
          if (watchValues[1]) {
            if (watchValues[3] !== 'noWalletInit') {
              data.payCoinData = data.receiveAssetList[0];
              data.initStatus = 'noWalletInit';
            }
          }
        }
      },
      { immediate: true },
    );

    watch(pools, () => {
      (async () => {
        data.baseAssetList = await denomListByPools(false); // boolean param for isPoolCoin included
      })();
    });

    function changePayToReceive() {
      const originPayCoinData = data.payCoinData;
      const originReceiveCoinData = data.receiveCoinData;
      const originReceiveCoinAmount = data.receiveCoinAmount;

      data.payCoinData = originReceiveCoinData;
      data.receiveCoinData = originPayCoinData;
      data.payCoinAmount = originReceiveCoinAmount;
      data.receiveCoinAmount = getReceiveCoinAmount(data.payCoinAmount, 100000000000, 100000000000);
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
      data.receiveCoinAmount = getReceiveCoinAmount(data.payCoinAmount, 100000000000, 100000000000);
    }

    function getMaxAmount(payCoinData) {
      const selectedCoinData = data.userAssetList.find((asset) => {
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

    function setConterPairCoinAmount(e) {
      if (data.isBothSelected) {
        if (e.includes('Pay')) {
          data.receiveCoinAmount = getReceiveCoinAmount(data.payCoinAmount, 100000000000, 100000000000);
        } else {
          data.payCoinAmount = getPayCoinAmount(data.receiveCoinAmount, 100000000000, 100000000000);
        }
      }
    }

    function excludeSelectedAsset(asset, list) {
      return list?.filter((item) => {
        return item?.base_denom !== asset?.base_denom || item?.on_chain !== asset?.on_chain;
      });
    }

    function swap() {
      console.log('getChains', store.getters['demeris/getChains']);

      console.log(
        'getBalances',
        store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }),
      );
      // return;
      const swapParams = {
        from: {
          amount: {
            denom: 'uatom',
            amount: '2000000',
          },
          chain_name: 'cosmos-hub',
        },
        to: {
          amount: {
            denom: 'uluna',
            amount: '2000000',
          },
          chain_name: 'cosmos-hub',
        },
      };

      // const swapParams = {
      //   from: {
      //     amount: {
      //       denom: data.payCoinData.base_denom,
      //       amount: data.payCoinAmount,
      //     },
      //     chain_name: data.payCoinData.on_chain,
      //   },
      //   to: {
      //     amount: {
      //       denom: data.receiveCoinData.base_denom,
      //       amount: data.receiveCoinAmount,
      //     },
      //     chain_name: 'gaia',
      //   },
      // };

      console.log(SWAP_TEST_DATA);
      data.actionHandlerResult = SWAP_TEST_DATA;
      reviewModalToggle();

      console.log('PAY', data.payCoinData, data.payCoinAmount);
      console.log('RECEIVE', data.receiveCoinData, data.receiveCoinAmount);
      console.log('SWAP', swapParams);
      actionHandler({ name: 'swap', params: swapParams });
    }

    return {
      ...toRefs(data),
      getCoinDollarValue,
      changePayToReceive,
      denomSelectHandler,
      getMaxAmount,
      getPrecisedAmount,
      excludeSelectedAsset,
      setMax,
      swap,
      setChildModalOpenStatus,
      isOpen,
      reviewModalToggle,
      gobackFunc,
      setConterPairCoinAmount,
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
