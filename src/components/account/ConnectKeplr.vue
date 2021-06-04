<template>
  <Modal :open="open" class="connect-keplr" body-class="elevation-panel" width="72rem" @close="emitClose">
    <div class="connect-keplr__wrapper">
      <div class="connect-keplr__content">
        <div v-if="!isConnecting">
          <h2 class="connect-keplr__title">Connect to Keplr</h2>

          <div class="connect-keplr__description">
            <p>Install Keplr in your browser and connect your wallet to start using Demeris.</p>
            <p>Demeris will support other wallets in the near future.</p>
          </div>

          <div class="connect-keplr__controls">
            <Button name="Connect to Keplr" @click="signIn" />

            <button class="connect-keplr__controls__help s-minus">Don’t have Keplr installed?</button>
          </div>
        </div>

        <div v-else class="connect-keplr__connecting">
          <div class="connect-keplr__connecting__main">
            <Spinner :size="3.2" />
            <span class="connect-keplr__connecting__main__label">Opening Keplr</span>
            <p class="s-2">Connecting</p>
          </div>

          <button class="connect-keplr__connecting__button" @click="cancel">Cancel</button>
        </div>
      </div>

      <div class="connect-keplr__banner">
        <img
          class="connect-keplr__banner__logo"
          :src="require('@/assets/images/keplr-wallet-logo.png')"
          title="Keplr Wallet"
        />
        <div class="connect-keplr__banner__surfer" />
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';

import Spinner from '../ui/Spinner.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Modal,
    Button,
    Spinner,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  setup(_, { emit }) {
    const store = useStore();
    const isConnecting = ref(false);

    const emitClose = () => {
      cancel();
      emit('close');
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
        emitClose();
      }
    });

    return { isConnecting, emitClose, cancel, signIn };
  },
});
</script>

<style lang="scss">
.connect-keplr {
  .modal__body {
    position: relative;
    overflow: hidden;
    padding: 0;
    min-height: 48rem;
  }

  .modal__close {
    position: absolute;
    top: 2rem;
    right: 2rem;
  }

  &__wrapper {
    display: flex;
    min-height: inherit;
  }

  &__content {
    width: 50%;
    min-height: inherit;
    padding: 4.8rem;
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
    }
  }

  &__banner {
    position: absolute;
    background-image: url('~@/assets/images/gradient-light-1.png');
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: cover;
    width: 50%;
    height: 100%;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding: 4.8rem;

    &__surfer {
      content: '';
      flex: 1 1 0%;
      background-image: url('~@/assets/images/silver-surfer-1.png');
      background-repeat: no-repeat;
      background-position: center;
      width: 100%;
      display: block;
    }

    &__logo {
      width: 11rem;
      margin: 0 auto;
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
