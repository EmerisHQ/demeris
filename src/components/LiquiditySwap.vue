<template>
  <div class="card">
    <div class="title">Swap</div>
    <div class="sub-title">1000 ATOM (Cosmos Hub) available</div>

    <div class="amount">
      <button class="button__circle-big">Max</button>
      <div class="amount__input">
        <div class="amount__input-info">Estimate</div>
        <input type="number" class="amount__input-amount" value="1000" />
        <div class="amount__input-result">
          <div class="amount__input-result-coin">50 ATOM</div>
          <div class="amount__input-result-arrow">→</div>
          <div class="amount__input-result-coin">158 KAVA</div>
        </div>
      </div>
      <button class="button__circle-big">⤵</button>
    </div>

    <div class="coin">
      <div class="coin__pair">
        <div class="coin__pair-destination">From</div>
        <div class="coin__pair-image"></div>
        <div class="coin__pair-selected">ATOM</div>
        <div class="coin__pair-arrow">></div>
      </div>

      <div class="divider"></div>

      <div class="coin__pair">
        <div class="coin__pair-destination">To</div>
        <div class="coin__pair-image"></div>
        <div class="coin__pair-selected">ATOM</div>
        <div class="coin__pair-arrow">></div>
      </div>

      <button class="button__circle swap__button">↕</button>
    </div>
    <div class="preview-info">
      <div class="swap">
        <div class="swap__title">Estimated price</div>
        <div class="swap__detail">
          <div class="swap__detail-ele">1</div>
          <div class="swap__detail-ele">ATOM</div>
          <div class="swap__detail-ele">per</div>
          <div class="swap__detail-ele">3.17</div>
          <div class="swap__detail-ele">KAVA</div>
        </div>
      </div>

      <div class="swap">
        <div class="swap__title">Fees</div>
        <div class="swap__detail">
          <div class="swap__detail-ele">˅</div>
          <div class="swap__detail-ele">ATOM</div>
          <div class="swap__detail-ele">~0.02</div>
        </div>
      </div>
    </div>

    <button class="button__square-big">Preview swap</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Swap',
  props: {
    isDashBoard: Boolean,
  },

  //   setup() {},
});
</script>

<style lang="scss" scoped>
//card
.card {
  max-width: 500px;
  padding: 3rem 2rem 4rem;
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

    &-info {
      color: gray;
      font-size: 0.865rem;

      padding-bottom: 0.5rem;
    }

    &-amount {
      width: 100%;

      background-color: transparent;
      font-weight: bold;
      text-align: center;
      border: none;
      outline: none;

      font-size: 2rem;
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
}

.coin {
  position: relative;
  border: 2px solid gray;

  margin-top: 3rem;

  &__pair {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1rem;

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
    left: 2rem;
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
  font-weight: bold;
  padding: 0.5rem;
}

.button__circle {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.3rem;
  border-radius: 50%;

  margin-right: 1rem;

  border: 1px solid gray;
  background-color: #fff;
  font-size: 2rem;

  text-align: center;

  &-big {
    @extend .button__circle;
    min-width: 4rem;
    height: 4rem;
    font-size: 1rem;
    margin: 0;
  }
}

.button__square-big {
  background-color: rgb(82, 31, 221);
  width: 100%;
  padding: 1rem;
  font-size: 1.25rem;
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