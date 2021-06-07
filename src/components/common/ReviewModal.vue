<template>
  <div class="denom-select-modal-wrapper elevation-panel">
    <GobackWithClose @goback="emitHandler('goback')" @close="emitHandler('close')" />
    <div class="title s-2 w-bold">
      {{ currentData.title }}
    </div>
    <div class="amount-info">
      <div class="amount-info__type s-minus w-bold">{{ currentData.isSwap ? 'Pay' : 'Send' }}</div>
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
        <div v-show="currentData.isSwap" class="amount-info__type-subtitle w-normal">(estimated)</div>
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

    <div class="divider" />

    <div class="detail">
      <div class="detail__title s-minus w-bold">Price</div>
      <div class="detail__row s-minus w-normal">
        <div class="detail__row-key">
          <div>Min. received<br />(if 100% swapped)</div>
          <HintIcon />
        </div>
        <div class="detail__row-value">995.54 LUNA</div>
      </div>
      <div class="detail__row s-minus w-normal">
        <div class="detail__row-key">
          <div>Limit price</div>
          <HintIcon />
        </div>
        <div class="detail__row-value">1 ATOM = 1.91 LUNA</div>
      </div>
    </div>

    <div class="divider" />

    <div class="detail">
      <div class="detail__title s-minus w-bold">Fees</div>
      <div class="detail__row s-minus w-normal">
        <div class="detail__row-key">Transaction fee</div>
        <div class="detail__row-value">0.02 ATOM</div>
      </div>
      <div class="detail__row s-minus w-normal">
        <div class="detail__row-key">Swap fee</div>
        <div class="detail__row-value">0.02 ATOM</div>
      </div>
    </div>

    <div class="warn s-minus w-normal">Non-revertable transactions. Prices not guaranteed etc.</div>

    <div class="button-wrapper">
      <Button :name="'Confirm and continue'" :status="'normal'" :click-function="setStep" />
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';

import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'DenomSelectModal',
  components: {
    GobackWithClose,
    Button,
    HintIcon,
  },
  props: {
    data: { type: Array, required: true },
  },
  emits: ['goback', 'close'],
  setup(props, { emit }) {
    console.log(props);

    const processData = reactive({
      currentStep: 0,
      currentData: computed(() => {
        const currentStepData = props.data[processData.currentStep];
        const modifiedData = {
          isSwap: false,
          title: '',
        };
        switch (currentStepData.name) {
          case 'swap':
            modifiedData.isSwap = true;
            modifiedData.title = 'Review your swap details';
            break;
          default:
            modifiedData.isSwap = false;
            modifiedData.title = `Transfer ${'denom'}`;
            break;
        }

        return modifiedData;
      }),
      emitHandler: (event) => {
        emit(event);
      },
      setStep: () => {
        processData.currentStep += 1;
      },
    });

    return toRefs(processData);
  },
});
</script>

<style lang="scss" scoped>
.denom-select-modal-wrapper {
  position: relative;
  width: 100%;
  /* height: 55.8rem; */

  margin-bottom: 5rem;
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

  .divider {
    margin: 0 2.4rem;
    height: 1px;
    background-color: var(--border-trans);
  }

  .detail {
    padding: 0 2.4rem;
    &__title {
      color: var(--text);
      padding: 1.6rem 0;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      padding-bottom: 1.6rem;

      &-key {
        display: flex;
        align-items: center;
        color: var(--muted);

        div {
          margin-right: 0.4rem;
        }
      }

      &-value {
      }
    }
  }

  .warn {
    margin: 0 2.4rem;
    padding: 1.2rem;
    border: 1px solid var(--border-trans);
    color: var(--muted);
    border-radius: 8px;
  }

  .button-wrapper {
    padding: 2.8rem 2.4rem 2.4rem;
  }
}
</style>
