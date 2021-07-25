<template>
  <button
    class="moonpay-banner theme-inverse dark:theme-inverse bg-app text-left"
    :class="[`moonpay-banner--${variant}`, { 'elevation-button': variant === 'banner' }]"
    @click="goMoon"
  >
    <p class="moonpay-banner__title text-text">{{ title }}</p>
    <p class="moonpay-banner__info text-muted">Powered by Moonpay</p>
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
        apiKey: 'pk_live_C5H29zimSfFDzncZqYM4lQjuqZp2NNke',
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
  border-radius: 1.6rem;
  overflow: hidden;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 13.5rem;
  width: 100%;
  background-image: url('~@/assets/images/buy-atom-card-big.png');
  background-repeat: no-repeat;
  background-position: top 30% left 100%;
  background-size: 70% auto;

  &--widget {
    background-position: left 13rem top 0%;
    background-size: 95% auto;
    border: none;
  }

  &__title {
    font-size: 2.1rem;
    font-weight: 700;
  }

  &__info {
    font-size: 1.2rem;
  }
}
</style>
