<template>
  <div class="connect-wallet">
    <div class="connect-wallet__wrapper">
      <div class="connect-wallet__content">
        <template v-if="!isConnecting">
          <slot name="title">
            <h2 class="connect-wallet__title">{{ $t('wallet.connect.modal1.title') }}</h2>
          </slot>

          <div class="connect-wallet__description">
            <slot name="description">
              <p>{{ $t('wallet.connect.modal1.text') }}</p>
            </slot>
          </div>

          <div class="connect-wallet__controls">
            <Button :name="$t('wallet.connect.modal1.button')" @click="signIn" />
            <Button :name="$t('generic_cta.cancel')" :is-outline="true" @click="emitCancel" />
          </div>
        </template>

        <div v-else class="connect-wallet__connecting">
          <div class="connect-wallet__connecting__main">
            <Spinner :size="3.2" />
            <span class="connect-wallet__connecting__main__label">{{ $t('wallet.connect.modal1.opening') }}</span>
            <p class="s-2">{{ $t('wallet.connect.modal1.connecting') }}</p>
          </div>

          <button class="connect-wallet__connecting__button" @click="cancel">
            {{ $t('generic_cta.cancel') }}
          </button>
        </div>
        <ConnectBanner />
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
import ConnectBanner from './ConnectBanner.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Button,
    ConnectBanner,
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
