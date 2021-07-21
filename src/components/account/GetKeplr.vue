<template>
  <div class="get-keplr">
    <div class="get-keplr__wrapper">
      <div class="get-keplr__content">
        <slot name="title">
          <h2 class="get-keplr__title">{{ $t('wallet.connect.modal2.title') }}</h2>
        </slot>

        <div class="get-keplr__description">
          <slot name="description">
            <p>{{ $t('wallet.connect.modal2.text') }}</p>
          </slot>
        </div>

        <div class="get-keplr__controls">
          <Button :name="$t('wallet.connect.modal2.button1')" @click="openUrl" />
          <Button :name="$t('wallet.connect.modal2.button2')" :is-outline="true" @click="reloadApp" />
        </div>
      </div>
      <KeplrBanner />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';

import KeplrBanner from './KeplrBanner.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Button,
    KeplrBanner,
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
.get-keplr {
  min-height: inherit;

  &__wrapper {
    display: flex;
    min-height: inherit;
  }

  &__content {
    width: 50%;
    min-height: inherit;
    padding: 4.8rem;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    margin-top: 5rem;

    button {
      margin-bottom: 1.6rem;
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
