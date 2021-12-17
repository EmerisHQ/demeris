<template>
  <button
    class="
      moonpay-banner
      text-left
      w-full
      flex flex-col
      justify-between
      shadow-card
      rounded-2xl
      p-6
      transition
      transform
      overflow-hidden
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
    <p class="text-text text-1 font-bold">{{ $t('components.moonpayBanner.title', { asset: asset }) }}</p>
    <p class="text-muted -text-1 mt-14">{{ $t('components.moonpayBanner.poweredBy') }}</p>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { useStore } from 'vuex';

import useEmitter from '@/composables/useEmitter';

export default defineComponent({
  name: 'MoonpayBanner',

  props: {
    asset: {
      type: String,
      default: 'ATOM',
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
      return store.getters['demerisUSER/isSignedIn'];
    });

    const isDemoAccount = computed(() => {
      return store.getters['demerisUSER/isDemoAccount'];
    });

    const mpDomain = ref('https://buy.moonpay.io');
    const mpParams = computed(() => {
      return {
        apiKey: 'pk_live_C5H29zimSfFDzncZqYM4lQjuqZp2NNke',
        currencyCode: 'atom',
        walletAddress: store.getters['demerisAPI/getOwnAddress']({ chain_name: 'cosmos-hub' }),
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
      if (isSignedIn.value && !isDemoAccount.value) {
        window.open(mpUrl.value, '', 'height=480,width=320');
      } else {
        emitter.emit('toggle-settings-modal');
      }
    };
    return { isSignedIn, goMoon, isDemoAccount };
  },
});
</script>

<style lang="scss" scoped>
.moonpay-banner {
  min-height: 5rem;
  background-image: url('~@/assets/images/buy-atom-card-big.png');
  background-repeat: no-repeat;
  background-position: top 30% left 120%;
  background-size: 70% auto;

  &--small {
    background-position: left 6rem top 0%;
    background-size: 95% auto;
    border: none;
  }
}
</style>
