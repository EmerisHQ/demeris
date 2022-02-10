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
      class="h-12 py-3.5 px-2 md:px-3 leading-5 hover:text-text active:opacity-70"
      exact-active-class="text-text font-medium"
      to="/airdrops"
    >
      {{ $t('navbar.airdrops') }}
      <svg height="100" width="100" class="blinking">
        <circle cx="70" cy="20" r="5" fill="red" />
      </svg>
    </router-link>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import { featureRunning } from '@/utils/FeatureManager';

export default defineComponent({
  name: 'Navbar',

  setup() {
    const isAirdropsFeatureRunning = featureRunning('AIRDROPS_FEATURE') ? true : false;

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

.blinking {
  position: relative;
  top: -40px;
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

@-moz-keyframes blink {
  from,
  to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-webkit-keyframes blink {
  from,
  to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-ms-keyframes blink {
  from,
  to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@-o-keyframes blink {
  from,
  to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
