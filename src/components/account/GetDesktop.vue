<template>
  <div class="connect-wallet">
    <div class="connect-wallet__wrapper">
      <div class="connect-wallet__content">
        <slot name="title">
          <h2 class="connect-wallet__title">{{ $t('wallet.connect.modal5.title') }}</h2>
        </slot>

        <div class="connect-wallet__description">
          <slot name="description">
            <p>{{ $t('wallet.connect.modal5.text') }}</p>
          </slot>
        </div>

        <div class="connect-wallet__controls">
          <Button
            :name="$t('wallet.connect.modal5.button')"
            class="connect-wallet__controls__button"
            @click="openUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'GetDesktop',

  components: {
    Button,
  },

  setup() {
    const openUrl = () => {
      window.open('https://emeris.com');
    };

    return { openUrl };
  },
});
</script>
