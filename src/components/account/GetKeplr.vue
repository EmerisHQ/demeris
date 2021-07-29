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
          <Button :name="$t('wallet.connect.modal2.button1')" class="get-keplr__controls__button" @click="openUrl" />
          <Button
            :name="$t('wallet.connect.modal2.button2')"
            class="get-keplr__controls__button"
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
.get-keplr {
  min-height: inherit;

  &__wrapper {
    display: flex;
    min-height: inherit;
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 50%;
    min-height: inherit;
    padding: 4.8rem;
    text-align: center;
  }

  &__controls {
    display: flex;
    flex-direction: column;

    &__button {
      & + & {
        margin-top: 1.6rem;
      }
    }
  }

  &__description {
    flex: 1 1 0%;
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
