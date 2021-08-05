<template>
  <div class="connect-wallet connect-keplr">
    <div class="connect-wallet__wrapper">
      <div class="connect-wallet__content">
        <template v-if="!isConnecting">
          <slot name="title">
            <h2 v-if="type === 'welcome'" class="connect-wallet__title">
              {{ $t('generic_cta.connectToEmeris') }}
            </h2>
            <h2 v-else class="connect-wallet__title">{{ $t('wallet.connect.modal1.title') }}</h2>
          </slot>

          <div class="connect-wallet__description">
            <slot name="description">
              <p>{{ $t('wallet.connect.modal1.text') }}</p>
            </slot>
          </div>

          <div class="connect-wallet__controls">
            <Button :name="$t('wallet.connect.modal1.button1')" @click="trySignIn" />
            <Button
              v-if="type === 'welcome'"
              :name="$t('generic_cta.tryTheDemo')"
              :is-outline="true"
              @click="emitTryDemo"
            />
            <Button v-else :name="$t('generic_cta.cancel')" :is-outline="true" @click="emitCancel" />
          </div>
        </template>

        <div v-else class="connect-wallet__connecting">
          <div class="connect-wallet__connecting__main">
            <span class="connect-wallet__connecting__main__label">{{ $t('wallet.connect.modal1.opening') }}</span>
            <h2 class="connect-wallet__title">{{ $t('wallet.connect.modal1.connecting') }}</h2>
            <Spinner :size="3.2" />
            <p>{{ $t('wallet.connect.modal1.connectingHelp') }}</p>
          </div>

          <Button :name="$t('generic_cta.cancel')" :is-outline="true" @click="cancel"> </Button>
        </div>
        <ConnectBanner />
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
import ConnectBanner from './ConnectBanner.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Button,
    ConnectBanner,
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

    const emitTryDemo = () => {
      emit('try-demo');
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

    watch(isSignedIn, () => {
      if (isSignedIn.value) {
        emit('connect');
      }
    });

    return { isConnecting, emitCancel, cancel, signIn, trySignIn, emitTryDemo };
  },
});
</script>

<style lang="scss" scoped>
.connect-wallet__connecting__main {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  .spinner {
    margin-top: 1.6rem;
    margin-bottom: 3.2rem;
  }
  p {
    margin-bottom: 1.6rem;
    color: var(--muted);
  }
}
</style>
