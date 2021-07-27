<template>
  <button
    class="moonpay-banner"
    :class="[`moonpay-banner--${variant}`, { 'elevation-button': variant === 'banner' }]"
    @click="goMoon"
  >
    <p class="moonpay-banner__title">{{ title }}</p>
    <div class="moonpay-banner__info">
      <!-- <div class="moonpay-banner__info__icon">
        <Icon name="LockClosedIcon" :icon-size="1" />
      </div> -->
      <div class="moonpay-banner__info__wrapper">
        <p class="moonpay-banner__info__label">Powered by Moonpay</p>
        <!-- <span class="moonpay-banner__info__hint">100% secure</span> -->
      </div>
    </div>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

import useEmitter from '@/composables/useEmitter';
import { useStore } from '@/store';

export default defineComponent({
  name: 'MoonpayBanner',

  props: {
    title: {
      type: String,
      default: 'Purchase ATOM',
    },
    variant: {
      type: String as PropType<'banner' | 'widget'>,
      default: 'banner',
    },
  },
  setup() {
    const store = useStore();
    const emitter = useEmitter();

    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });

    const mpDomain = ref('https://buy.moonpay.io');
    const mpParams = computed(() => {
      return {
        // key currently from Cosmostation
        apiKey: 'pk_live_zbG1BOGMVTcfKibboIE2K3vduJBTuuCn',
        currencyCode: 'atom',
        walletAddress: store.getters['demeris/getOwnAddress']({ chain_name: 'cosmos-hub' }),
        baseCurrencyCode: 'usd',
        // baseCurrencyAmount: '50',
      };
    });
    const mpQuery = computed(() => {
      return new URLSearchParams(mpParams.value).toString();
    });
    const mpUrl = computed(() => {
      return mpDomain.value + '/?' + mpQuery.value;
    });

    const goMoon = () => {
      if (isSignedIn.value) {
        window.open(mpUrl.value, '', 'height=480,width=320');
      } else {
        emitter.emit('toggle-settings-modal');
      }
    };
    return { isSignedIn, goMoon };
  },
});
</script>

<style lang="scss" scoped>
.moonpay-banner {
  background: var(--bg);
  border-radius: 1.6rem;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 13.5rem;
  width: 100%;
  background-color: var(--bg);
  background-image: url('~@/assets/images/buy-atom-card-big.png');
  background-repeat: no-repeat;
  background-position: top 30% left 100%;
  background-size: 70% auto;

  &--widget {
    background-color: var(--fg-trans);
    background-position: left 13rem top 0%;
    background-size: 95% auto;
    border: none;
  }

  &__title {
    font-size: 2.1rem;
    font-weight: 700;
  }

  &__info {
    display: inline-flex;
    align-items: center;
    font-size: 1.2rem;

    &__wrapper {
      text-align: left;
    }

    &__icon {
      width: 2.4rem;
      height: 2.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--bg);
      background: var(--text);
      border-radius: 2.6rem;
      margin-right: 0.8rem;
    }

    &__label {
      color: var(--muted);
    }

    &__hint {
      margin-top: 0rem;
      color: var(--muted);
    }
  }
}
</style>
