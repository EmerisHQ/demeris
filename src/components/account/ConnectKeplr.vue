<template>
  <div class="connect-keplr">
    <div class="flex flex-col pb-8 px-8 text-center">
      <template v-if="!isConnecting">
        <slot name="title">
          <img src="~@/assets/images/keplr-wallet-logo.png" alt="Keplr logo" class="w-12 mx-auto mb-8" />
          <h2 class="text-3 font-bold">{{ $t('wallet.connect.modal1.title') }}</h2>
        </slot>

        <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
          <slot name="description">
            <p>{{ $t('wallet.connect.modal1.text') }}</p>
          </slot>
        </div>

        <div class="flex flex-col mt-12">
          <Button :name="$t('wallet.connect.modal1.button')" @click="signIn" />

          <a
            href="https://t.me/EmerisHQ"
            target="_blank"
            rel="noreferrer noopener"
            class="mt-4 text-muted hover:text-text -text-1 p-1.5 transition-colors active:opacity-70"
          >
            {{ $t('wallet.connect.modal1.needHelp') }}
          </a>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center h-full w-full">
        <div class="flex-1 flex flex-col items-center justify-center">
          <Spinner :size="3" />
          <span class="mt-6 text-muted">{{ $t('wallet.connect.modal1.opening') }}</span>
          <p class="text-3 font-bold mt-2">{{ $t('wallet.connect.modal1.connecting') }}</p>
        </div>
        <Button variant="link" :name="$t('generic_cta.cancel')" :click-function="cancel" class="mt-12" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

import Spinner from '../ui/Spinner.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Button,
    Spinner,
  },

  emits: ['cancel', 'connect'],

  setup(_, { emit }) {
    const store = useStore();
    const isConnecting = ref(false);

    const emitCancel = () => {
      cancel();
      emit('cancel');
    };

    const cancel = () => {
      isConnecting.value = false;
    };

    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });

    const signIn = () => {
      store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
      isConnecting.value = true;
    };

    watch(isSignedIn, () => {
      if (isSignedIn.value) {
        emit('connect');
      }
    });

    return { isConnecting, emitCancel, cancel, signIn };
  },
});
</script>

<style lang="scss"></style>
