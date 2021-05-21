<template>
  <div class="card">
    <div class="title">Swap</div>
    <div class="sub-title">
      {{ availableAmountInfo?.amount }} {{ availableAmountInfo?.denom }} ({{ availableAmountInfo?.source }}) available
    </div>

    <div class="amount">
      <button class="button__circle-big" @click="setMaxAmount">Max</button>
      <div class="amount__input">
        <div class="amount__input-info">Estimate</div>
        <input v-model="swapAmount" type="number" class="amount__input-amount" />

        <div class="amount__input-result">
          <div class="amount__input-result-coin">{{ swapAmount }} {{ fromCoin }}</div>
          <div class="amount__input-result-arrow">→</div>
          <div class="amount__input-result-coin">{{ estimatedReturn }} {{ toCoin }}</div>
        </div>
      </div>
      <button class="button__circle-big">⤵</button>
    </div>

    <div class="coin">
      <div class="coin__pair">
        <div class="coin__pair-destination">From</div>
        <div class="coin__pair-image"></div>
        <div class="coin__pair-selected">{{ fromCoin }}</div>
        <div class="coin__pair-arrow">></div>
      </div>

      <div class="divider"></div>

      <div class="coin__pair">
        <div class="coin__pair-destination">To</div>
        <div class="coin__pair-image"></div>
        <div class="coin__pair-selected">{{ toCoin }}</div>
        <div class="coin__pair-arrow">></div>
      </div>

      <button class="button__circle swap__button" @click="changeFromTo">↕</button>
    </div>
    <div class="preview-info">
      <div class="swap">
        <div class="swap__title">Estimated price</div>
        <div class="swap__detail">
          <div class="swap__detail-ele">1</div>
          <div class="swap__detail-ele">{{ fromCoin }}</div>
          <div class="swap__detail-ele">per</div>
          <div class="swap__detail-ele">{{ price }}</div>
          <div class="swap__detail-ele">{{ toCoin }}</div>
        </div>
      </div>

      <div class="swap">
        <div class="swap__title">Fees</div>
        <div class="swap__detail">
          <div class="swap__detail-ele">˅</div>
          <div class="swap__detail-ele">{{ fromCoin }}</div>
          <div class="swap__detail-ele">~0.02</div>
        </div>
      </div>
    </div>

    <button class="button__square-big">Preview swap</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';

import { TEST_DATA } from '@/TEST_DATA';
export default defineComponent({
  name: 'Swap',
  setup() {
    const swap = reactive({
      swapAmount: 1000,
      fromCoin: 'ATOM',
      toCoin: 'KAVA',
      selectedPairPoolData: {
        reserveAmount: { ATOM: 100000, KAVA: 125000 },
      },
      price: computed(() => {
        return (
          swap.selectedPairPoolData.reserveAmount[swap.toCoin] / swap.selectedPairPoolData.reserveAmount[swap.fromCoin]
        );
      }),
      availableAmountInfo: computed(() => {
        return TEST_DATA.myBalance[swap.fromCoin];
      }),
      estimatedReturn: computed(() => {
        return swap.price * swap.swapAmount;
      }),
    });

    function setMaxAmount() {
      swap.swapAmount = swap.availableAmountInfo.amount;
    }

    function changeFromTo() {
      const originalFromCoin = swap.fromCoin;
      const originalToCoin = swap.toCoin;
      swap.fromCoin = originalToCoin;
      swap.toCoin = originalFromCoin;
    }

    return { ...toRefs(swap), setMaxAmount, changeFromTo };
  },
});
</script>

<style lang="scss" scoped>
//card
.card {
  max-width: 60rem;
  padding: 3rem 3rem 4rem;
  margin: 0 1rem;
  border: 2px solid gray;

  .title {
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
  }

  .sub-title {
    text-align: center;
    padding-top: 0.5rem;
    padding-bottom: 3rem;
  }
}

//swap

.amount {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__input {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    overflow: hidden;

    &-info {
      color: gray;
      font-size: 1.6rem;

      padding-bottom: 0.5rem;
    }

    &-amount {
      width: 100%;

      background-color: transparent;
      font-weight: bold;
      text-align: center;
      border: none;
      outline: none;

      font-size: 3.6rem;
      letter-spacing: 2px;
    }

    &-result {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;

      &-arrow {
        padding: 0 1rem;
      }
    }
  }

  .transparent {
    /* background-color: red; */
    position: absolute;
    top: 24px;
    padding-right: 20px;
    height: 38px;
  }
}

.coin {
  position: relative;
  border: 2px solid gray;

  margin-top: 3rem;

  &__pair {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 2.4rem;

    &-destination {
      flex: 1;
    }

    &-image {
      min-width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background-color: gray;
    }

    &-selected {
      flex: 3;
      padding-left: 1rem;
    }

    &-arrow {
      flex: 1;
      text-align: right;

      font-size: 2rem;
      font-weight: bold;
      color: gray;
    }
  }

  .swap__button {
    align-items: center;

    position: absolute;
    top: 0;

    transform: translate(-50%, -50%);
    top: 50%;
    left: 3.2rem;
  }
}

.divider {
  border: 1px solid gray;
}

.preview-info {
  margin: 4rem 0 3rem;
}

.swap {
  display: flex;
  font-weight: 600;

  &__title {
    flex: 1;
  }

  &__detail {
    display: flex;
    flex: 1;
    flex-flow: row-reverse;
    &-ele {
      padding: 0 0.25rem;
    }
  }

  &:first-child {
    margin-bottom: 1rem;
  }
}

//buttons
.button__square {
  background-color: rgb(209, 229, 243);
  border: none;
  font-size: 1.6rem;

  font-weight: bold;
  padding: 0.5rem;
}

.button__circle {
  width: 4rem;
  height: 4rem;
  padding: 0.3rem;
  border-radius: 50%;

  margin-right: 1rem;

  border: 1px solid gray;
  background-color: #fff;
  font-size: 2rem;

  text-align: center;

  &-big {
    @extend .button__circle;
    min-width: 6rem;
    height: 6rem;
    font-size: 1.6rem;
    margin: 0;
  }
}

.button__square-big {
  background-color: rgb(82, 31, 221);
  width: 100%;
  padding: 1rem;
  font-size: 2rem;
  color: #fff;
  font-weight: bold;

  border: none;
  border-radius: 8px;
}

//number inputs no scale
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
