<template>
  <button
    class="
      simplex-banner
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
      `simplex-banner--${size}`,
      size === 'small' ? 'theme-inverse dark:theme-inverse bg-app' : 'bg-surface dark:bg-fg',
    ]"
    @click="goSimplex"
  >
    <p class="text-text text-1 font-bold">{{ $t('components.simplexBanner.title', { asset: asset }) }}</p>
    <p class="text-muted -text-1 mt-14">{{ $t('components.simplexBanner.poweredBy') }}</p>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import useEmitter from '@/composables/useEmitter';
import { useStore } from '@/store';

export default defineComponent({
  name: 'SimplexBanner',

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
      return store.getters['demeris/isSignedIn'];
    });

    const isDemoAccount = computed(() => {
      return store.getters['demeris/isDemoAccount'];
    });

    const goSimplex = () => {
      if (isSignedIn.value && !isDemoAccount.value) {
        window.open(`${window.location.origin}/simplex?crypto=ATOM&fiat=USD&amount=1000`, '', 'height=500,width=500');
      } else {
        emitter.emit('toggle-settings-modal');
      }
    };
    return { isSignedIn, goSimplex, isDemoAccount };
  },
});
</script>

<style lang="scss" scoped>
.simplex-banner {
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
