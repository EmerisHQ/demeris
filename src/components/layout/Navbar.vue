<template>
  <nav class="flex-1 max-w-7xl md:mx-auto lg:pl-4 xl:px-6 flex items-center text-muted">
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/"
    >
      {{ $t('navbar.portfolio') }}
    </router-link>
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/assets"
    >
      {{ $t('navbar.assets') }}
    </router-link>
    <router-link
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/pools"
    >
      {{ $t('navbar.pools') }}
    </router-link>
    <router-link
      v-if="isAirdropsFeatureRunning"
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70 airdrop-menu-item"
      exact-active-class="text-text font-medium"
      to="/airdrops"
    >
      {{ $t('navbar.airdrops') }}
      <span class="blinking"></span>

      <div class="airdrop-hover py-3 px-4 mt-3 rounded-lg">
        <div class="flex items-center">
          <StarsIcon />
          <p class="-text-1 ml-1">3 airdrops found</p>
        </div>
      </div>
    </router-link>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import StarsIcon from '@/components/common/Icons/StarsIcon.vue';
import { featureRunning } from '@/utils/FeatureManager';

export default defineComponent({
  name: 'Navbar',
  components: {
    StarsIcon,
  },
  setup() {
    const isAirdropsFeatureRunning = featureRunning('AIRDROPS_FEATURE');

    return {
      isAirdropsFeatureRunning,
    };
  },
});
</script>

<style scoped lang="scss">
.router-link-exact-active {
  color: var(--text);
}

.airdrop-menu-item {
  .airdrop-hover {
    display: none;
  }
  &:hover {
    .airdrop-hover {
      position: relative;
      left: -25%;
      background: black;
      color: white;
      display: block;
    }
  }
}

.blinking {
  height: 10px;
  width: 10px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  top: -10px;
  -webkit-animation: 1.3s blink ease infinite;
  -moz-animation: 1.3s blink ease infinite;
  -ms-animation: 1.3s blink ease infinite;
  -o-animation: 1.3s blink ease infinite;
  animation: 1.3s blink ease infinite;
}

@keyframes blink {
  from,
  to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
