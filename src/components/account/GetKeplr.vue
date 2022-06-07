<template>
  <div class="get-keplr">
    <div class="flex flex-col py-8 px-8 text-center">
      <slot name="title">
        <h2 v-if="type === 'welcome'" class="text-3 font-bold">
          {{ $t('generic_cta.connectToEmeris') }}
        </h2>
        <h2 v-else class="text-3 font-bold">{{ $t('wallet.connect.modal2.title') }}</h2>
      </slot>

      <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
        <slot name="description">
          <p>{{ $t('wallet.connect.modal2.text') }}</p>
        </slot>
      </div>

      <div class="flex items-center flex-col mt-12">
        <Button :name="$t('wallet.connect.modal2.button')" class="connect-wallet__controls__button" @click="openUrl" />
        <a
          class="mt-4 font-medium hover:text-text p-1.5 transition-colors active:opacity-70 cursor-pointer"
          data-cy="tryTheDemoButtonInstall"
          @click="signInDemo"
        >
          {{ $t('generic_cta.tryTheDemo') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';

interface Props {
  type?: string;
}

withDefaults(defineProps<Props>(), { type: undefined });

const emit = defineEmits<{
  (e: 'connect'): void;
}>();

const store = useStore() as RootStoreTyped;
const signInDemo = () => {
  store.dispatch(GlobalActionTypes.USER.SIGN_IN_WITH_WATCHER);
};

const isSignedIn = computed(() => {
  return store.getters[GlobalGetterTypes.USER.isSignedIn];
});
watch(isSignedIn, () => {
  if (isSignedIn.value) {
    emit('connect');
  }
});
const openUrl = () => {
  window.open(
    'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en',
    '_blank',
    'noopener',
  );
};
</script>

<style lang="scss" scoped>
.get-keplr {
  &__controls {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;

    &__button {
      & + & {
        margin-top: 1rem;
      }
    }
  }
}
</style>
