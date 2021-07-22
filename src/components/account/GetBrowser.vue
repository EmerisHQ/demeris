<template>
  <div class="get-browser">
    <div class="get-browser__wrapper">
      <div class="get-browser__content">
        <slot name="title">
          <h2 class="get-browser__title">{{ $t('wallet.connect.modal3.title') }}</h2>
        </slot>

        <div class="get-browser__description">
          <slot name="description">
            <p>
              {{ $t('wallet.connect.modal3.text') }}
            </p>
          </slot>
        </div>

        <div class="get-browser__controls">
          <Button :name="$t('wallet.connect.modal3.button1')" @click="openUrlChrome" />
          <Button :name="$t('wallet.connect.modal3.button2')" @click="openUrlBrave" />
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

  emits: ['cancel', 'connect'],

  setup(_, { emit }) {
    const emitCancel = () => {
      emit('cancel');
    };

    const openUrlChrome = () => {
      window.open('https://www.google.com/chrome/', '_blank', 'noopener');
    };
    const openUrlBrave = () => {
      window.open('https://www.brave.com', '_blank', 'noopener');
    };

    return { emitCancel, openUrlChrome, openUrlBrave };
  },
});
</script>

<style lang="scss">
.get-browser {
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

  &__controls {
    display: flex;
    flex-direction: column;
    margin-top: 5rem;

    div + div {
      margin-top: 1.6rem;
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
