<template>
  <button
    class="
      moonpay-banner
      text-left
      shadow-card
      rounded-2xl
      transition
      transform
      hover:-translate-y-px
      focus:-translate-y-px
      active:transform-none active:opacity-70
    "
    :class="[
      `moonpay-banner--${size}`,
      size === 'small' ? 'theme-inverse dark:theme-inverse bg-app' : 'bg-surface dark:bg-fg',
    ]"
    @click="goMoon"
  >
    <p class="moonpay-banner__title text-text text-1 font-bold">{{ title }}</p>
    <p class="moonpay-banner__info text-muted -text-1 mt-14">Powered by Moonpay</p>
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
    size: {
      type: String as PropType<'large' | 'small'>,
      default: 'large',
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
  border-radius: 1rem;
  overflow: hidden;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 5rem;
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
}
</style>
