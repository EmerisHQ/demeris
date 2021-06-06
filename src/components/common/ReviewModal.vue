<template>
  <div class="denom-select-modal-wrapper elevation-panel">
    <GobackWithClose @goback="emitHandler('goback')" @close="emitHandler('close')" />
    <div class="title s-2 w-bold">Review your swap details</div>
    <div class="amount-info">
      <div class="amount-info__type s-minus w-bold">Pay</div>
      <div class="amount-info__detail">
        <div class="amount-info__detail__coin">
          <img class="amount-info__detail__coin-image" :src="require(`@/assets/coins/atom.png`)" alt="pay coin" />
          <div class="amount-info__detail__coin-amount s-0 w-medium">500.2</div>
          <div class="amount-info__detail__coin-denom s-0 w-medium">ATOM</div>
        </div>
        <div class="amount-info__detail-chain s-minus">Cosmos Hub</div>
      </div>
    </div>
    <div class="amount-info">
      <div class="amount-info__type s-minus w-bold">
        Receive
        <div class="amount-info__type-subtitle w-normal">(estimated)</div>
      </div>
      <div class="amount-info__detail">
        <div class="amount-info__detail__coin">
          <img class="amount-info__detail__coin-image" :src="require(`@/assets/coins/luna.png`)" alt="receive coin" />
          <div class="amount-info__detail__coin-amount s-0 w-medium">500.2</div>
          <div class="amount-info__detail__coin-denom s-0 w-medium">ATOM</div>
        </div>
        <div class="amount-info__detail-chain s-minus">Cosmos Hub</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';

export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    GobackWithClose,
  },
  emits: ['goback', 'close'],
  setup(props, { emit }) {
    function emitHandler(event) {
      emit(event);
    }
    return {
      emitHandler,
    };
  },
});
</script>

<style lang="scss" scoped>
.denom-select-modal-wrapper {
  position: absolute;
  width: 100%;
  height: 55.8rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  .title {
    padding: 0 2.4rem 2.4rem;
    text-align: left;
  }

  .amount-info {
    display: flex;
    justify-content: space-between;

    color: var(--text);

    padding: 0 2.4rem;
    margin-bottom: 1.6rem;
    &__type {
      &-subtitle {
        color: var(--muted);
      }
    }
    &__detail {
      color: var(--text);
      &__coin {
        display: flex;
        align-items: center;
        &-image {
          width: 2rem;
          height: 2rem;
        }
        &-amount {
          padding: 0 0.8rem;
        }
      }
      &-chain {
        text-align: right;
      }
    }
  }
}
</style>
