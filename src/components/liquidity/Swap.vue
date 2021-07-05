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
        :assets="excludeSelectedAsset(receiveCoinData, userAssetList)"
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
            :name="`${getPrecisedAmount(payCoinData.base_denom, getMaxAmount(payCoinData))} ${$filters.getCoinName(
              payCoinData.base_denom,
            )} Max `"
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
      {{ baseAssetList }}
      <!-- swap button -->
      <div class="button-wrapper">
        <ActionButton
          :name="buttonName"
          :status="buttonStatus"
          :click-function="swap"
          :tooltip-text="buttonTooltipText"
        />
      </div>

      <div
        class="fees s-minus"
        :class="isFeesOpen ? 'fees-detail-open' : ''"
        @click="
          () => {
            isFeesOpen = !isFeesOpen;
          }
        "
      >
        <div>Fees (included)</div>
        <div class="fees-total">
          <span v-show="!isFeesOpen">~$12.3</span>
          <Icon v-show="!isFeesOpen" name="CaretDownIcon" :icon-size="1.6" :color="feeIconColor" />
          <Icon v-show="isFeesOpen" name="CaretUpIcon" :icon-size="1.6" :color="feeIconColor" />
        </div>
      </div>
      <div v-if="isFeesOpen" class="fees-detail">
        <div class="fees-detail__info s-minus">
          <div class="fees-detail__info-key">Transaction fee(x3)</div>
          <div class="fees-detail__info-value">$0.06</div>
        </div>

        <div class="fees-detail__selector s-minus">
          <button
            class="fees-detail__selector-block"
            :class="gasPriceLevel === 'slow' ? 'selected' : ''"
            @click="setGasPriceLevel('slow')"
          >
            <div class="fees-detail__selector-block-level">Slow</div>
            <div class="fees-detail__selector-block-value">$0.01</div>
          </button>
          <button
            class="fees-detail__selector-block"
            :class="gasPriceLevel === 'normal' ? 'selected' : ''"
            @click="setGasPriceLevel('normal')"
          >
            <div class="fees-detail__selector-block-level">Normal</div>
            <div class="fees-detail__selector-block-value">$0.02</div>
          </button>
          <button
            class="fees-detail__selector-block"
            :class="gasPriceLevel === 'fast' ? 'selected' : ''"
            @click="setGasPriceLevel('fast')"
          >
            <div class="fees-detail__selector-block-level">Fast</div>
            <div class="fees-detail__selector-block-value">$0.04</div>
          </button>
        </div>

        <Alert
          v-if="gasPriceLevel === 'slow'"
          status="warning"
          message="Your transaction may take longer to be processed."
        />

        <div class="fees-detail__info s-minus">
          <div class="fees-detail__info-key">Swap fee</div>
          <div class="fees-detail__info-value">$0.21</div>
        </div>
        <div class="fees-detail__info s-minus">
          <div class="fees-detail__info-key">Estimated total fees</div>
          <div class="fees-detail__info-value">$0.27</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';

import DenomSelect from '@/components/common/DenomSelect.vue';
import ReviewModal from '@/components/common/TxStepsModal.vue';
import Alert from '@/components/ui/Alert.vue';
import ActionButton from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useCalculation from '@/composables/useCalculation.vue';
import useModal from '@/composables/useModal';
import usePools from '@/composables/usePools';
import usePrice from '@/composables/usePrice';
import { store } from '@/store';
import { SWAP_TEST_DATA } from '@/TEST_DATA';
import { actionHandler } from '@/utils/actionHandler';

export default defineComponent({
  name: 'Swap',
  components: {
    DenomSelect,
    IconButton,
    ActionButton,
    Icon,
    ReviewModal,
    Alert,
    SlippageSettingModal,
  },

  setup() {
    const { getCoinDollarValue, getPayCoinAmount, getReceiveCoinAmount, getPrecisedAmount } = useCalculation();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();
    const { denomListByPools, pools } = usePools();
    const { getDisplayPrice } = usePrice();

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
      baseAssetList: [],
      userAssetList: computed(() => {
        if (data.isWallet) {
          return store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }) || [];
        } else {
          return data.receiveAssetList;
        }
      }),

      receiveAssetList: computed(() => {
        let receiveAvailableAssets = [];

        for (let i in data.baseAssetList) {
          const coin = data.baseAssetList[i];
          // user login => set amount else set amount => 0
          receiveAvailableAssets.push({ ...coin, amount: 0 });
        }

        return receiveAvailableAssets;
      }),
      gasPriceLevel: localStorage.getItem('demeris-fee-level') || 'normal',
      setGasPriceLevel: (level) => {
        data.gasPriceLevel = level;
        localStorage.setItem('demeris-fee-level', level);
      },
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
        data.baseAssetList = await denomListByPools();
        console.log(data.baseAssetList);
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
