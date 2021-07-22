<template>
  <div class="connect-keplr">
    <div class="connect-keplr__wrapper">
      <div class="connect-keplr__content">
        <div v-if="!isConnecting">
          <slot name="title">
            <h2 class="connect-keplr__title">{{ $t('wallet.connect.modal1.title') }}</h2>
          </slot>

          <div class="connect-keplr__description">
            <slot name="description">
              <p>{{ $t('wallet.connect.modal1.text') }}</p>
            </slot>
          </div>

          <div class="connect-keplr__controls">
            <Button :name="$t('wallet.connect.modal1.button')" @click="signIn" />

            <a
              href="https://t.me/EmerisHQ"
              rel="noopener noreferrer"
              target="_blank"
              class="connect-keplr__controls__help s-minus"
            >
              {{ $t('wallet.connect.modal1.needHelp') }}
            </a>
          </div>
        </div>

        <div v-else class="connect-keplr__connecting">
          <div class="connect-keplr__connecting__main">
            <Spinner :size="3.2" />
            <span class="connect-keplr__connecting__main__label">{{ $t('wallet.connect.modal1.opening') }}</span>
            <p class="s-2">{{ $t('wallet.connect.modal1.connecting') }}</p>
          </div>

          <button class="connect-keplr__connecting__button" @click="cancel">
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

<style lang="scss">
.connect-keplr {
  min-height: inherit;

  &__wrapper {
    display: flex;
    min-height: inherit;
  }

  &__content {
    width: 50%;
    min-height: inherit;
    padding: 4.8rem;
    text-align: center;
  }

  &__connecting {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    &__main {
      flex: 1 1 0%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &__label {
        margin-top: 2.6rem;
        color: var(--muted);
      }
    }

    &__button {
      width: 100%;
      padding: 1.6rem 2rem;
      border: 1px solid #e6e6e6;
      border-radius: 0.8rem;
      font-weight: 600;
    }
  }

  &__controls {
    display: flex;
    flex-direction: column;
    margin-top: 5rem;

    &__help {
      margin-top: 1.6rem;
      color: var(--muted);
      display: block;
      text-align: center;
      padding: 0.6rem 0;
    }
  }

  &__description {
    margin-top: 4rem;
    line-height: 1.8;
    color: var(--muted);

    p:first-child {
      margin-bottom: 1.8rem;
    }
  }

  &__title {
    font-size: 2.8rem;
    font-weight: 600;
  }
}
</style>
