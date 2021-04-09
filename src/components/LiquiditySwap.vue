<template>
  <div class="card">
    <div class="title">Swap</div>
    <div v-if="!isDashBoard" class="sub-title">1000 ATOM (Cosmos Hub) available</div>

    <!-- Swap Component for DashBoard page -->
    <div v-if="isDashBoard" class="dashboard">
      <div class="selector">
        <div class="selector__coin">
          <div class="selector__coin-info">
            <div class="selector__coin-info-name">ATOM</div>
            <div class="selector__coin-info-source">Cosmos Hub</div>
          </div>
          <div class="selector__coin-arrow">˅</div>
        </div>
        <div class="selector__amount">
          <button class="button__square">MAX</button>
          <div class="selector__amount-input">
            <input class="selector__amount-input-coin" type="number" value="100" />
            <div class="selector__amount-input-dollar">~1234.23$</div>
          </div>
        </div>
      </div>

      <div class="divider">
        <button class="button__circle">↕</button>
        <div class="price-info">1 ATOM= 0.021864 KAVA</div>
      </div>

      <div class="selector">
        <div class="selector__coin">
          <div class="selector__coin-info">
            <div class="selector__coin-info-name">ATOM</div>
            <div class="selector__coin-info-source">Cosmos Hub</div>
          </div>
          <div class="selector__coin-arrow">˅</div>
        </div>
        <div class="selector__amount">
          <div class="selector__amount-input">
            <input class="selector__amount-input-coin" type="number" value="100" />
            <div class="selector__amount-input-dollar">~1234.23$</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Swap Component for Swap page -->
    <div v-else class="swap">
      <div class="selector">
        <button class="button__circle-big">Max</button>
        <div class="selector__input">
          <div class="selector__input-info">Estimate</div>
          <input type="number" class="selector__input-amount" value="1000" />
          <div class="selector__input-result">
            <div class="selector__input-result-coin">50 ATOM</div>
            <div class="selector__input-result-arrow">→</div>
            <div class="selector__input-result-coin">158 KAVA</div>
          </div>
        </div>
        <button class="button__circle-big">⤵</button>
      </div>
    </div>

    <!-- Common Component -->
    <div class="fees">
      <div class="fees__title">Fees</div>
      <div class="fees__detail">
        <div class="fees__detail-arrow">˅</div>
        <div class="fees__detail-coin">ATOM</div>
        <div class="fees__detail-amount">~0.02</div>
      </div>
    </div>

    <button class="button__square-big">Start</button>
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
    margin-top: 1rem;
  }
}

//Dashboard components
.dashboard {
  margin-top: 2rem;

  .selector {
    display: flex;
    align-items: center;

    border: 2px solid gray;

    &__coin {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;

      &-info {
        &-name {
          font-size: 1.25rem;
          font-weight: 800;
        }

        /* &-source {
      } */
      }

      &-arrow {
        font-size: 2rem;
        font-weight: bold;
        padding: 1rem 1rem 0;
      }
    }

    &__amount {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;

      padding: 1rem;

      border-left: 2px solid gray;

      &-input {
        display: flex;
        flex-direction: column;
        background-color: transparent;
        &-coin {
          width: 100%;
          font-size: 2rem;
          background-color: transparent;
          font-weight: bold;
          text-align: right;
          border: none;
          outline: none;
        }

        &-dollar {
          text-align: right;
        }
      }
    }
  }

  .divider {
    display: flex;
    align-items: center;
    padding: 1rem;
  }

  .price-info {
    font-size: 1.25rem;
    font-weight: 500;
  }
}

//swap
.swap {
  padding-top: 3rem;
  .selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
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
}

//buttons
.button__square {
  background-color: rgb(209, 229, 243);
  border: none;
  font-weight: bold;
  padding: 0.5rem;
}

.button__circle {
  width: 3rem;
  height: 3rem;
  padding: 0.5rem;
  border-radius: 50%;

  margin-right: 1rem;

  border: 1px solid gray;
  background-color: #fff;
  font-size: 2rem;

  &-big {
    @extend .button__circle;
    width: 4rem;
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

//commons
.fees {
  display: flex;
  padding: 2rem 0;
  font-weight: 600;

  &__title {
    flex: 1;
  }

  &__detail {
    display: flex;
    flex: 1;
    flex-flow: row-reverse;

    &-coin {
      padding: 0 0.5rem;
    }

    &-arrow {
      font-size: 1.25rem;
    }
  }
}
</style>