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
    </div>

    <div class="details">
      <div class="details__row">
        <div class="details__row-left s-minus w-medium">
          Limit price
          <tippy :max-width="192">
            <HintIcon />
            <template #content> Assets will not be swapped at a higher rate than the limit rate. </template>
          </tippy>
        </div>
        <div class="details__row-right s-minus w-normal">1 ATOM = 3.13 RUNE</div>
      </div>
      <div class="details__row">
        <div class="details__row-left s-minus w-medium">
          <div>Min. received<br />(if 100% swapped)</div>
          <tippy :max-width="192">
            <HintIcon />
            <template #content> Minimum total received if your entire swap is fulfilled. </template>
          </tippy>
        </div>
        <div class="details__row-right s-minus w-normal">13.21 RUNE</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';

export default defineComponent({
  name: 'SlippageSettingModal',
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

  .details {
    padding: 0 2.4rem 2.4rem;
    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-bottom: 1.6rem;

      &-left {
        display: flex;
        align-items: center;

        span {
          margin-left: 0.45rem;
        }
      }
    }
  }
}
</style>
