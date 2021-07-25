<template>
  <div class="get-browser">
    <div class="get-browser__wrapper">
      <div class="get-browser__content">
        <div v-if="isLoading" class="get-browser__loading">
          <Spinner :size="4.2" />
        </div>
        <template v-else>
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
        </template>
      </div>
      <ConnectBanner />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Spinner from '@/components/ui/Spinner.vue';

import ConnectBanner from './ConnectBanner.vue';

export default defineComponent({
  name: 'ConnectKeplr',

  components: {
    Button,
    ConnectBanner,
    Spinner,
  },

  props: {
    isLoading: {
      type: Boolean,
      required: false,
    },
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

  &__loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    width: 50%;
    min-height: inherit;
    padding: 3rem;
    text-align: center;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;

    div + div {
      margin-top: 1rem;
    }
  }

  &__description {
    margin-top: 2.5rem;
    line-height: 1.8;
    color: var(--muted);

    p:first-child {
      margin-bottom: 1.125rem;
    }
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 600;
  }
}
</style>
