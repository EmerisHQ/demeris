<template>
  <div class="connect-wallet">
    <div class="connect-wallet__wrapper">
      <div class="connect-wallet__content">
        <slot name="title">
          <h2 class="connect-wallet__title">{{ $t('wallet.connect.modal4.title') }}</h2>
          <h3 class="connect-wallet__subtitle title-1-normal">{{ $t('wallet.connect.modal4.subtitle') }}</h3>
        </slot>

        <div class="connect-wallet__description">
          <div class="scrollable">
            <div class="scrollable-content">
              <slot name="description">
                <p>{{ $t('wallet.connect.modal4.text1') }}</p>
                <p>{{ $t('wallet.connect.modal4.text2') }}</p>
                <p>{{ $t('wallet.connect.modal4.text3') }}</p>
              </slot>
            </div>
          </div>
        </div>

        <div class="connect-wallet__controls">
          <Button :name="$t('generic_cta.cancel')" :is-outline="true" @click="emitCancel" />
          <Button :name="$t('generic_cta.agree')" @click="emitAgree" />
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
  name: 'AgreeWarning',

  components: {
    Button,
    ConnectBanner,
  },

  emits: ['cancel', 'agree'],

  setup(_, { emit }) {
    const emitCancel = () => {
      emit('cancel');
    };
    const emitAgree = () => {
      emit('agree');
    };

    return { emitCancel, emitAgree };
  },
});
</script>

<style lang="scss" scoped>
.scrollable {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 1rem;
  height: 22.5rem;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: -2.4rem;
    height: 6.4rem;
    width: 100%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
  }
}

.scrollable-content {
  padding: 2rem 2.4rem 0;
  height: 100%;

  text-align: left;
  line-height: 1.625;
  overflow-y: scroll;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
}

.connect-wallet {
  &__controls {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 3.2rem;

    div + div {
      margin-top: 0;
    }
  }
}
</style>
