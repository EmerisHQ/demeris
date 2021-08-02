<template>
  <div class="connect-wallet">
    <div class="connect-wallet__wrapper">
      <div class="connect-wallet__content">
        <slot name="title">
          <h2 class="connect-wallet__title">{{ $t('wallet.connect.modal2.title') }}</h2>
        </slot>

        <div class="connect-wallet__description">
          <slot name="description">
            <p>{{ $t('wallet.connect.modal2.text') }}</p>
          </slot>
        </div>

        <div class="connect-wallet__controls">
          <Button
            :name="$t('wallet.connect.modal2.button1')"
            class="connect-wallet__controls__button"
            @click="openUrl"
          />
          <Button
            :name="$t('wallet.connect.modal2.button2')"
            class="connect-wallet__controls__button"
            :is-outline="true"
            @click="reloadApp"
          />
        </div>
      </div>
      <ConnectBanner />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';

import ConnectBanner from './ConnectBanner.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Button,
    ConnectBanner,
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

    const openUrl = () => {
      window.open(
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en',
        '_blank',
        'noopener',
      );
    };
    const reloadApp = () => {
      location.reload();
    };

    return { emitCancel, openUrl, reloadApp };
  },
});
</script>

<style lang="scss">
.connect-wallet {
  &__controls {
    display: flex;
    flex-direction: column;

    &__button {
      & + & {
        margin-top: 1.6rem;
      }
    }
  }
}
</style>
