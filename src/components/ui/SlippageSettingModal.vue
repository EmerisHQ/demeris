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
        <button class="setting__sections-block" :class="slippage === 0.1 ? 'selected' : ''" @click="setSlippage(0.1)">
          0.1%
        </button>
        <button class="setting__sections-block" :class="slippage === 0.5 ? 'selected' : ''" @click="setSlippage(0.5)">
          0.5%
        </button>
        <button class="setting__sections-block" :class="slippage === 1 ? 'selected' : ''" @click="setSlippage(1)">
          1%
        </button>
        <input
          :value="customSlippage"
          class="setting__sections-block"
          type="number"
          placeholder="Custom"
          @input="setCustomSlippage"
        />
      </div>
    </div>

    <div v-if="alertStatus" class="alert-wrapper">
      <Alert :status="alertStatus" :message="alertText" />
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
import { computed, defineComponent, reactive, toRefs } from 'vue';

import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';
import Alert from '@/components/ui/Alert.vue';

export default defineComponent({
  name: 'SlippageSettingModal',
  components: {
    TitleWithGoback,
    HintIcon,
    Alert,
  },

  emits: ['goback'],
  setup(props, { emit }) {
    const state = reactive({
      slippage: null,
      customSlippage: null,
      alertStatus: computed(() => {
        if (state.slippage) {
          if (state.slippage === 0.1) {
            return 'warning';
          } else {
            return null;
          }
        } else {
          if (state.customSlippage <= 0.1) {
            if (state.customSlippage < 0) {
              return 'error';
            } else {
              return 'warning';
            }
          } else if (state.customSlippage >= 3) {
            return 'error';
          } else {
            return null;
          }
        }
      }),
      alertText: computed(() => {
        if (state.alertStatus === 'warning') {
          return 'With a low slippage, only a very small part of your swap may be fulfilled';
        } else if (state.alertStatus === 'error') {
          if (state.customSlippage < 0) {
            return 'Please enter a valid slippage rate.';
          } else {
            return 'Your swap price may be significantly above the market price. ';
          }
        } else {
          return '';
        }
      }),
      emitHandler: (event) => {
        emit(event);
      },
      setSlippage: (slippage) => {
        state.validSlippageUpdater(slippage);
        state.slippage = slippage;
        state.customSlippage = null;
      },
      setCustomSlippage: (e) => {
        state.validSlippageUpdater(e.target.value);
        state.customSlippage = Number(e.target.value);
        state.slippage = null;
      },
      validSlippageUpdater(value) {
        const slippage = Number(value);
        console.log(slippage);
        if (slippage > 0 && slippage <= 100) {
          localStorage.setItem('demeris-slippage', String(slippage));
        }
      },
    });

    const slippage = Number(localStorage.getItem('demeris-slippage')) || 0.5;
    if (slippage > 1 || slippage < 0.1) {
      state.customSlippage = slippage;
    } else {
      state.slippage = slippage;
    }

    return { ...toRefs(state) };
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

        outline: none;

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
    margin-top: 3.2rem;
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

  .selected {
    background: linear-gradient(100.01deg, #aae3f9 -9.61%, #fbcbb8 96.61%), linear-gradient(0deg, #9ff9ff, #9ff9ff);
  }

  .alert-wrapper {
    padding: 0 2.4rem;
  }
}
</style>
