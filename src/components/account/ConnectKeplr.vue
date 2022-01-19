<template>
  <div class="connect-keplr">
    <div class="flex flex-col px-8 text-center" :class="type == 'welcome' ? 'py-8' : 'pb-8'">
      <template v-if="!isConnecting">
        <slot name="title">
          <img
            v-if="type !== 'welcome'"
            src="~@/assets/images/keplr-wallet-logo.png"
            alt="Keplr logo"
            class="w-12 mx-auto mb-8"
          />
          <h2 v-if="type === 'welcome'" class="text-3 font-bold">
            {{ $t('generic_cta.connectToEmeris') }}
          </h2>
          <h2 v-else class="text-3 font-bold">{{ $t('wallet.connect.modal1.title') }}</h2>
        </slot>

        <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
          <slot name="description">
            <p>{{ $t('wallet.connect.modal1.text') }}</p>
          </slot>
        </div>

        <div class="flex items-center flex-col mt-12">
          <Button :name="$t('wallet.connect.modal1.button')" @click="trySignIn" />
          <a
            v-if="type === 'welcome'"
            class="mt-4 font-medium hover:text-text p-1.5 transition-colors active:opacity-70"
            data-cy="tryTheDemoButton"
            @click="signInDemo"
          >
            {{ $t('generic_cta.tryTheDemo') }}
          </a>
          <a
            v-if="type !== 'welcome'"
            class="mt-4 font-medium hover:text-text p-1.5 transition-colors active:opacity-70"
            data-cy="tryTheDemoButton2"
            @click="emitCancel"
          >
            {{ $t('generic_cta.cancel') }}
          </a>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center h-full w-full">
        <div class="flex-1 flex flex-col items-center justify-center">
          <Spinner :size="3" />
          <span class="mt-6 text-muted">{{ $t('wallet.connect.modal1.opening') }}</span>
          <p class="text-3 font-bold mt-2">{{ $t('wallet.connect.modal1.connecting') }}</p>
          <span class="mt-6 text-muted">{{ $t('wallet.connect.modal1.connectingHelp') }}</span>
        </div>
        <Button variant="link" :name="$t('generic_cta.cancel')" :click-function="cancel" class="mt-12" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
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

  props: {
    type: {
      type: String,
      default: undefined,
    },
  },

  emits: ['cancel', 'connect', 'warning', 'try-demo'],

  setup(_, { emit }) {
    const store = useStore();
    const isConnecting = ref(false);
    const isWarningAgreed = ref(null);
    const isWarningNeeded = ref(null);

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

    const trySignIn = () => {
      if (isWarningAgreed.value) {
        signIn();
      } else {
        emit('warning');
      }
    };

    const signIn = () => {
      store.dispatch(GlobalDemerisActionTypes.SIGN_IN);
      isConnecting.value = true;
    };

    onMounted(() => {
      isWarningAgreed.value = window.localStorage.getItem('isWarningAgreed');
      isWarningNeeded.value = window.localStorage.getItem('isWarningNeeded');
    });

    const signInDemo = () => {
      store.dispatch(GlobalDemerisActionTypes.SIGN_IN_WITH_WATCHER);
      isConnecting.value = true;
    };
    watch(isSignedIn, () => {
      if (isSignedIn.value) {
        emit('connect');
      }
    });

    return { isConnecting, emitCancel, cancel, signIn, trySignIn, signInDemo };
  },
});
</script>
<style lang="scss" scoped>
a {
  cursor: pointer;
}
</style>
