<template>
  <div class="slippage-modal elevation-panel">
    <TitleWithGoback
      :title="'Price'"
      :func="
        () => {
          emitHandler('goback');
        }
      "
    />
    <div class="setting">
      <div class="s-minus w-medium">Slippage tolerance</div>
      <div class="setting__sections">
        <button class="setting__sections-block">0.1%</button>
        <button class="setting__sections-block">0.5%</button>
        <button class="setting__sections-block">1%</button>
        <input class="setting__sections-block" type="number" placeholder="Custom" />
      </div>
      <tippy :max-width="192">
        <HintIcon />

        <template #content> Minimum total received if your entire swap is fulfilled. </template>
      </tippy>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';

export default defineComponent({
  name: 'TxStepsModal',
  components: {
    TitleWithGoback,

    HintIcon,
  },

  emits: ['goback'],
  setup(props, { emit }) {
    const processData = reactive({
      emitHandler: (event) => {
        emit(event);
      },
    });

    return toRefs(processData);
  },
});
</script>

<style lang="scss" scoped>
.slippage-modal {
  position: relative;
  width: 100%;
  /* height: 55.8rem; */

  margin-bottom: 5rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  .setting {
    padding: 0 2.4rem;

    &__sections {
      display: flex;
      justify-content: space-between;

      margin: 1.6rem 0;

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
      &-block {
        width: 5.2rem;
        height: 4rem;
        background-color: var(--fg-trans);

        border-radius: 8px;

        &:last-child {
          width: 9.2rem;
          padding: 0.6rem 1.2rem;
          text-align: center;

          &:focus {
            background: linear-gradient(100.01deg, #aae3f9 -9.61%, #fbcbb8 96.61%),
              linear-gradient(0deg, #9ff9ff, #9ff9ff);
            outline: none;
            &::placeholder {
              color: transparent;
            }
          }
        }
      }
    }
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
    }
  }

  .detail-transfer {
    @extend .detail;

    .detail__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .icon {
      font-size: 1.6rem;
      color: var(--muted);
    }
  }

  .warn {
    margin: 0 2.4rem;
    padding: 1.2rem;
    border: 1px solid var(--border-trans);
    color: var(--muted);
    border-radius: 8px;
  }

  .warn-transfer {
    border: none;
    padding: 0 1.2rem;
  }

  .button-wrapper {
    padding: 2.8rem 2.4rem 2.4rem;
  }
}
</style>
