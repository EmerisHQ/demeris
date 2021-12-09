<template>
  <div class="get-keplr">
    <div class="flex flex-col py-8 px-8 text-center">
      <slot name="title">
        <h2 v-if="type === 'welcome'" class="text-3 font-bold">
          {{ $t('generic_cta.connectToEmeris') }}
        </h2>
        <h2 v-else class="text-3 font-bold">{{ $t('wallet.connect.modal2.title') }}</h2>
      </slot>

      <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
        <slot name="description">
          <p>{{ $t('wallet.connect.modal2.text') }}</p>
        </slot>
      </div>

      <div class="flex items-center flex-col mt-12">
        <Button :name="$t('wallet.connect.modal2.button')" class="connect-wallet__controls__button" @click="openUrl" />
        <a class="`" @click="emitTryDemo">
          {{ $t('generic_cta.tryTheDemo') }}
        </a>
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
    type: {
      type: String,
      default: undefined,
    },
  },

  emits: ['cancel', 'try-demo'],

  setup(_, { emit }) {
    const emitCancel = () => {
      emit('cancel');
    };

    const emitTryDemo = () => {
      emit('try-demo');
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

    return { emitCancel, openUrl, reloadApp, emitTryDemo };
  },
});
</script>

<style lang="scss" scoped>
.get-keplr {
  &__controls {
    display: flex;
    flex-direction: column;
    margin-top: 3rem;

    &__button {
      & + & {
        margin-top: 1rem;
      }
    }
  }
}
</style>
