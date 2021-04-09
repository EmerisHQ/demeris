<template>
  <div class="card">
    <div class="title">Swap</div>

    <!-- Swap Component for DashBoard page -->
    <div v-if="isDashBoard">
      <div class="selector">
        <div class="selector__coin">
          <div class="selector__coin-info">
            <div class="selector__coin-info-name">ATOM</div>
            <div class="selector__coin-info-source">Cosmos Hub</div>
          </div>
          <div class="selector__coin-arrow">˅</div>
        </div>
        <div class="selector__amount">
          <button class="button-input">MAX</button>
          <div class="selector__amount-input">
            <input class="selector__amount-input-coin" type="number" value="100" />
            <div class="selector__amount-input-dollar">~1234.23$</div>
          </div>
        </div>
      </div>

      <div class="divider">
        <button class="button-change">↕</button>
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
    <div v-else>swap page component</div>

    <!-- Common Component -->
    <div class="fees">
      <div class="fees__title">Fees</div>
      <div class="fees__detail">
        <div class="fees__detail-arrow">˅</div>
        <div class="fees__detail-coin">ATOM</div>
        <div class="fees__detail-amount">~0.02</div>
      </div>
    </div>

    <button class="button-action">Start</button>
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
.card {
  padding: 3rem 2rem 4rem;
  margin: 0 1rem;
  border: 2px solid gray;
}

.title {
  font-weight: bold;
  font-size: 2rem;
  text-align: center;

  margin-bottom: 3rem;
}

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

      &-coin {
        width: 100%;
        font-size: 2rem;
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

.button-input {
  background-color: rgb(209, 229, 243);
  border: none;
  font-weight: bold;
  padding: 0.5rem;
}

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

.divider {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.button-change {
  width: 3rem;
  height: 3rem;
  padding: 0.5rem;
  border-radius: 50%;

  margin-right: 1rem;

  border: 1px solid gray;
  background-color: #fff;

  font-size: 2rem;
}

.price-info {
  font-size: 1.25rem;
  font-weight: 500;
}

.button-action {
  background-color: rgb(82, 31, 221);
  width: 100%;
  padding: 1rem;
  font-size: 1.25rem;
  color: #fff;
  font-weight: bold;

  border: none;
  border-radius: 8px;
}

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