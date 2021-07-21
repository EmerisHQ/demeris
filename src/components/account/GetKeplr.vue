<template>
  <div class="get-keplr" :class="{ 'get-keplr--banner': showBanner }">
    <div class="get-keplr__wrapper">
      <div class="get-keplr__content">
        <slot name="title">
          <h2 class="get-keplr__title">Install Keplr</h2>
        </slot>

        <div class="get-keplr__description">
          <slot name="description">
            <p>You need to install the Keplr extension from the Chrome Web Store.</p>
          </slot>
        </div>

        <div class="get-keplr__controls">
          <Button
            :name="$t('wallet.connect.modal.button')"
            href="https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en"
            rel="noopener noreferrer"
            target="_blank"
          />
        </div>
      </div>
      <div v-if="showBanner" class="connect-keplr__banner">
        <img
          class="connect-keplr__banner__logo"
          :src="require('@/assets/images/keplr-wallet-logo.png')"
          title="Keplr Wallet"
        />
        <div class="connect-keplr__banner__surfer" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Button,
  },

  props: {
    showBanner: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['cancel', 'connect'],

  setup(_, { emit }) {
    const emitCancel = () => {
      emit('cancel');
    };

    return { emitCancel };
  },
});
</script>

<style lang="scss">
.get-keplr {
  min-height: inherit;

  &__wrapper {
    display: flex;
    min-height: inherit;
  }

  &--banner &__content {
    width: 50%;
  }

  &__content {
    width: 100%;
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
      display: block;
      text-align: center;
      padding: 0.6rem 0;
    }
  }

  &__banner {
    position: absolute;
    background-image: url('~@/assets/images/gradient-light-2.png');
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
