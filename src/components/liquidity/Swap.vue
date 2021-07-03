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
    <ReviewModal v-else-if="isOpen" :data="actionHandlerResult" @close="reviewModalToggle" @goback="gobackFunc" />
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
        :input-header="`Pay ${getCoinDollarValue(payCoinData?.base_denom, payCoinAmount)}`"
        :selected-denom="payCoinData"
        :assets="userBalances"
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
            :name="`${payCoinData.amount} ${$filters.getCoinName(payCoinData.base_denom)} Max `"
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
        :assets="receiveAvailableDenom"
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
import { computed, defineComponent, reactive, toRefs } from 'vue';

import DenomSelect from '@/components/common/DenomSelect.vue';
import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import ReviewModal from '@/components/common/TxStepsModal.vue';
import Alert from '@/components/ui/Alert.vue';
import ActionButton from '@/components/ui/Button.vue';
// import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import SlippageSettingModal from '@/components/ui/SlippageSettingModal.vue';
import useModal from '@/composables/useModal';
import usePrice from '@/composables/usePrice.vue';
import { SWAP_TEST_DATA, TEST_DATA } from '@/TEST_DATA';
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
    const { getCoinDollarValue, getPayCoinAmount, getReceiveCoinAmount } = usePrice();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();
    const { isOpen: isSlippageSettingModalOpen, toggleModal: slippageSettingModalToggle } = useModal();

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
      userBalances: TEST_DATA.balances,
      receiveAvailableDenom: computed(() => {
        const payCoinRemovedDenoms = TEST_DATA.receiveAvailableDenoms.filter((denomInfo) => {
          return denomInfo?.base_denom !== data.payCoinData?.base_denom;
        });
        return payCoinRemovedDenoms;
      }),
      gasPriceLevel: localStorage.getItem('demeris-fee-level') || 'average',
      actionHandlerResult: null,
      isOver: computed(() => (data.isBothSelected && data?.payCoinAmount > data?.payCoinData?.amount ? true : false)),
      //TODO: test
      isNotEnoughLiquidity: computed(() => (data?.payCoinAmount > 1500 ? true : false)),
      isBothSelected: computed(() => {
        return data.payCoinData && data.receiveCoinData;
      }),
      isChildModalOpen: false,
      isPriceChanged: true,
      isFeesOpen: false,
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

    data.payCoinData = data?.userBalances[0];

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
      data.payCoinAmount = data.payCoinData.amount;
      data.receiveCoinAmount = getReceiveCoinAmount(data.payCoinAmount, 100000000000, 100000000000);
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

    function openSetting() {
      alert('open setting');
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

    function swap() {
      const swapParams = {
        from: {
          amount: {
            denom: 'uatom',
            amount: '2000000',
          },
          chain_name: 'gaia',
        },
        to: {
          amount: {
            denom: 'uluna',
            amount: '2000000',
          },
          chain_name: 'gaia',
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
      openSetting,
      changePayToReceive,
      denomSelectHandler,
      setMax,
      swap,
      setChildModalOpenStatus,
      isOpen,
      reviewModalToggle,
      gobackFunc,
      setConterPairCoinAmount,
      isSlippageSettingModalOpen,
      slippageSettingModalToggle,
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
