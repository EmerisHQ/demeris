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
    <ReviewModal v-if="isOpen" @close="reviewModalToggle" @goback="gobackFunc" />
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
        :assets="userBalances"
        :is-over="isOver"
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
        @select="denomSelectHandler"
        @modalToggle="setChildModalOpenStatus"
      />

      <!-- swap button -->
      <div class="button-wrapper">
        <Button :name="buttonName" :status="buttonStatus" :click-function="swap" />
      </div>

      <div class="fees s-minus">
        <div>Fees (included)</div>
        <div class="total-fee">123 <Icon name="SmallDownIcon" :icon-size="1.6" :color="feeIconColor" /></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';

import DenomSelect from '@/components/common/DenomSelect.vue';
import ReviewModal from '@/components/common/ReviewModal.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import IconButton from '@/components/ui/IconButton.vue';
import usePrice from '@/composables/usePrice.vue';
import useModal from '@/composables/useModal'
import { TEST_DATA } from '@/TEST_DATA';
import { actionHandler } from '@/utils/actionHandler';

export default defineComponent({
  name: 'Swap',
  components: {
    DenomSelect,
    IconButton,
    Button,
    Icon,
    ReviewModal,
  },

  setup() {
    const { getCoinDollarValue, getPayCoinAmount, getReceiveCoinAmount } = usePrice();
    const {isOpen, toggleModal: reviewModalToggle,} = useModal();

    const data = reactive({
      buttonName: computed(() => {
        return data.isOver ? 'Insufficent funds' : 'Swap';
      }),
      buttonStatus: computed(() => {
        return data.isOver ? 'inactive' : 'normal';
      }),
      payCoinData: null,
      payCoinAmount: null,
      receiveCoinData: null,
      receiveCoinAmount: computed({
        //2 eventually become pool price with bigInt type calculation
        get: () => (data.receiveCoinData?.base_denom ? getReceiveCoinAmount(data.payCoinAmount, 300000, 400000) : null),
        set: (value) =>
          data.receiveCoinData?.base_denom ? (data.payCoinAmount = getPayCoinAmount(value, 300000, 400000)) : null,
      }),
      userBalances: TEST_DATA.balances,
      receiveAvailableDenom: computed(() => {
        const payCoinRemovedDenoms = TEST_DATA.receiveAvailableDenoms.filter((denomInfo) => {
          return denomInfo.base_denom !== data.payCoinData.base_denom;
        });
        return payCoinRemovedDenoms;
      }),
      isOver: computed(() => (data?.payCoinAmount > data?.payCoinData?.amount ? true : false)),
      isChildModalOpen: false,
      feeIconColor: getComputedStyle(document.body).getPropertyValue('--inactive'),
    });

    data.payCoinData = data?.userBalances[0];

    function changePayToReceive() {
      const originPayCoinData = data.payCoinData;
      const originReceiveCoinData = data.receiveCoinData;

      const originPayCoinAmount = data.payCoinAmount;
      const originReceiveCoinAmount = data.receiveCoinAmount;

      data.payCoinData = originReceiveCoinData;
      data.receiveCoinData = originPayCoinData;
      data.payCoinAmount = originReceiveCoinAmount;
      data.receiveCoinAmount = originPayCoinAmount;
    }

    function setMax() {
      data.payCoinAmount = data.payCoinData.amount;
    }

    function denomSelectHandler(payload) {
      if (payload.type === 'Receive') {
        data.receiveCoinData = payload;
      } else {
        data.payCoinData = payload;
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

    function swap() {
      // const swapParams = {
      //   from: {
      //     amount: {
      //       denom: 'uatom',
      //       amount: 2000000,
      //     },
      //     chain_name: 'gaia',
      //   },
      //   to: {
      //     amount: {
      //       denom: 'uluna',
      //       amount: 2000000,
      //     },
      //     chain_name: 'gaia',
      //   },
      // };
      reviewModalToggle()

      const swapParams = {
        from: {
          amount: {
            denom: data.payCoinData.base_denom,
            amount: data.payCoinAmount,
          },
          chain_name: data.payCoinData.on_chain,
        },
        to: {
          amount: {
            denom: data.receiveCoinData.base_denom,
            amount: data.receiveCoinAmount,
          },
          chain_name: 'gaia',
        },
      };

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
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 32rem;
  height: 42.6rem;
}
.swap-widget {
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

  .button-wrapper {
    padding: 1.6rem 2.4rem 2.4rem;
  }

  .fees {
    display: flex;
    padding: 0 2.4rem;
    justify-content: space-between;
    color: var(--muted);

    .total-fee {
      display: flex;
    }
  }
}
</style>
