<template>
  <div class="connect-wallet">
    <div class="connect-wallet__wrapper">
      <div class="connect-wallet__content">
        <div v-if="isLoading" class="connect-wallet__loading">
          <Spinner :size="4.2" />
        </div>
        <template v-else>
          <slot name="title">
            <h2 class="connect-wallet__title">{{ $t('wallet.connect.modal3.title') }}</h2>
          </slot>

          <div class="connect-wallet__description">
            <slot name="description">
              <p>
                {{ $t('wallet.connect.modal3.text') }}
              </p>
            </slot>
          </div>

          <div class="connect-wallet__controls">
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
