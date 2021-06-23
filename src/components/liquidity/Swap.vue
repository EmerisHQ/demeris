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
    <ReviewModal v-if="isOpen" :data="actionHandlerResult" @close="reviewModalToggle" @goback="gobackFunc" />
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
              function: openSetting,
            }"
          />
        </div>
      </div>

      <!-- pay coin selector -->
      <DenomSelect
        v-model:amount="payCoinAmount"
        :input-header="`Pay ${getCoinDollarValue(payCoinData?.base_denom, payCoinAmount)}`"
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
            :name="`${getMaxAmount(payCoinData)} ${$filters.getCoinName(payCoinData.base_denom)} Max `"
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
        <Button :name="buttonName" :status="buttonStatus" :click-function="swap" :tooltip-text="buttonTooltipText" />
      </div>

      <div class="fees s-minus">
        <div>Fees (included)</div>
        <div class="total-fee">123 <Icon name="SmallDownIcon" :icon-size="1.6" :color="feeIconColor" /></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';

import DenomSelect from '@/components/common/DenomSelect.vue';
import ReviewModal from '@/components/common/TxStepsModal.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import useModal from '@/composables/useModal';
import usePrice from '@/composables/usePrice.vue';
import { useAllStores, useStore } from '@/store';
import { SWAP_TEST_DATA } from '@/TEST_DATA';
import { actionHandler } from '@/utils/actionHandler';

export default defineComponent({
  name: 'Swap',
  components: {
    DenomSelect,
    IconButton,
    Button,
    Icon,
    ReviewModal,
    Alert,
  },

  setup() {
    const { getCoinDollarValue, getPayCoinAmount, getReceiveCoinAmount } = usePrice();
    const { isOpen, toggleModal: reviewModalToggle } = useModal();

    const store = useStore();
    const stores = useAllStores();
    console.log('store', stores);

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
      userAssetList: computed(() => {
        console.log(
          'demeris/getBalances',
          store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }),
        );
        return store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }) || [];
      }),
      receiveAssetList: computed(() => {
        const chains = store.getters['demeris/getChains'];
        let receiveAvailableAssets = [];

        for (let chain in chains) {
          if (chains[chain]?.denoms) {
            receiveAvailableAssets.push({ base_denom: chains[chain]?.denoms[0].name, on_chain: 'cosmos-hub' });
          }
        }

        console.log('demeris/getChains', store.getters['demeris/getChains']);
        console.log('receiveAssetList', receiveAvailableAssets);

        return receiveAvailableAssets;
      }),
      actionHandlerResult: null,
      isOver: computed(() => (data.isBothSelected && data?.payCoinAmount > data?.payCoinData?.amount ? true : false)),
      //TODO: test
      isNotEnoughLiquidity: computed(() => (data?.payCoinAmount > 1500 ? true : false)),
      isBothSelected: computed(() => {
        return data.payCoinData && data.receiveCoinData;
      }),
      isChildModalOpen: false,
      isPriceChanged: true,
      isWallet: computed(() => {
        return store.getters['demeris/getKeplrAddress'] ? true : false;
      }),
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

    data.payCoinData = data?.userAssetList[0];
    watch(
      () => [data.isWallet, data.userAssetList],
      (watchValues) => {
        if (watchValues[0]) {
          data.payCoinData = watchValues[1][0];
        }
      },
      { immediate: true },
    );
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
      console.log(data.payCoinData);
      data.payCoinAmount = parseInt(data.payCoinData.amount);
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
      console.log('getChains', store.getters['demeris/getChains']);

      console.log(
        'getBalances',
        store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }),
      );
      return;
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
      getMaxAmount,
      setMax,
      swap,
      setChildModalOpenStatus,
      isOpen,
      reviewModalToggle,
      gobackFunc,
      setConterPairCoinAmount,
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

    .total-fee {
      display: flex;
    }
  }
}
</style>
