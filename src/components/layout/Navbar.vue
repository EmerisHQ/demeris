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
      <div class="flex items-center">
        {{ $t('navbar.airdrops') }}
        <span v-if="airdropsLoading">
          <Icon name="LoadingIcon" :icon-size="0.8" class="ml-2" />
        </span>
        <span v-if="showBlinker" class="blinking"></span>
      </div>

      <div v-if="showBlinker" class="airdrop-hover bg-text text-inverse py-2 px-3 mt-3 rounded-lg">
        <div class="flex items-center">
          <Icon name="StarsIcon" />
          <p class="-text-1 ml-1">3 airdrops found</p>
        </div>
      </div>
    </router-link>
  </nav>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { LoadingState } from '@/types/util';
import { featureRunning } from '@/utils/FeatureManager';

export default defineComponent({
  name: 'Navbar',
  components: {
    Icon,
  },
  setup() {
    const route = useRoute();
    const isAirdropsFeatureRunning = featureRunning('AIRDROPS_FEATURE');
    const typedstore = useStore() as RootStoreTyped;
    const airdrops = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getAirdrops];
    });

    const onAirdropsPage = computed(() => {
      return route.fullPath.includes('/airdrops');
    });

    const airdropsLoading = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getAirdropsStatus] === LoadingState.LOADING;
    });

    const showBlinker = computed(() => {
      return !onAirdropsPage.value && !airdropsLoading.value;
    });

    return {
      isAirdropsFeatureRunning,
      airdrops,
      onAirdropsPage,
      airdropsLoading,
      showBlinker,
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
      display: block;
      animation: 0.5s zoom-in-zoom-out ease;
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

@keyframes zoom-in-zoom-out {
  0% {
    transform: scale(0.7, 0.7);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
