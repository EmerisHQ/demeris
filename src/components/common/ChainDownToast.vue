<template>
  <transition name="fade" appear>
    <div
      v-if="isToastVisible"
      class="warning_banner max-w-xs theme-inverse dark:theme-inverse fixed left-8 bottom-8 center mx-auto"
    >
      <div
        class="warning_banner__inner bg-surface dark:border border-border text-text -text-1 rounded-xl flex items-center"
      >
        <div class="pl-4 py-3">
          {{ $t('components.chainDown.appearsDown', { chain: displayChain }) }}
          <br />
          {{ $t('components.chainDown.assetsUnavailable') }}
        </div>
        <Button
          variant="link"
          size="sm"
          class="mx-5 text-link mt-auto py-3"
          :full-width="false"
          :click-function="hideToast"
          name="OK"
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { userstore } from '@/store/setup';

const apistore = useStore() as TypedAPIStore;
const buttonPressed = ref(false);

const dexChain = ref(apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]);

const displayChain = computed(() => {
  const displayName = userstore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({ name: dexChain.value });
  return displayName || dexChain.value;
});

const isHubDown = computed(() => {
  return true;
  const status = apistore.getters[GlobalDemerisGetterTypes.API.getChainStatus]({ chain_name: dexChain });
  return status === false;
});

const isToastVisible = computed(() => isHubDown && !buttonPressed.value);

const hideToast = () => {
  buttonPressed.value = true;
};
</script>
<style lang="scss" scoped>
.warning_banner {
  z-index: 1000;
}

.warning_banner__inner {
  line-height: 150%;
  box-shadow: -8px 24px 48px rgba(0, 0, 0, 0.2);
  .dark & {
    box-shadow: -8px 24px 48px rgba(0, 0, 0, 0.6);
  }
}

.fade-enter-active {
  transition: opacity 0.2s ease-out, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.32, 0, 0.67, 0), transform 0.3s cubic-bezier(0.32, 0, 0.67, 0);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
