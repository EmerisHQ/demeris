<template>
  <div class="agree-warning">
    <div class="flex flex-col py-8 px-8 text-center">
      <slot name="title">
        <h2 class="text-3 font-bold">{{ $t('wallet.connect.modal4.title') }}</h2>
      </slot>

      <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
        <div class="scrollable">
          <div class="scrollable-content">
            <slot name="description">
              <p>{{ $t('wallet.connect.modal4.text1') }}</p>
              <a href="https://emeris.com/terms" rel="noopener noreferral" target="_blank">
                {{ $t('components.settingsMenu.tos') }}
              </a>
            </slot>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-12">
        <a class="mt-2 font-medium hover:text-text p-1.5 transition-colors active:opacity-70" @click="emitCancel">
          {{ $t('generic_cta.cancel') }}
        </a>
        <Button :name="$t('generic_cta.agree')" @click="emitAgree" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'agree'): void;
}>();

const emitCancel = () => {
  emit('cancel');
};
const emitAgree = () => {
  emit('agree');
};
</script>

<style lang="scss" scoped>
.scrollable {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 1rem;
  height: 14rem;
  overflow: hidden;

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: -2rem;
    height: 4rem;
    width: 100%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
    pointer-events: none;
  }
}

.scrollable-content {
  padding: 1rem 1.5rem;
  height: 100%;

  text-align: left;
  line-height: 1.625;
  overflow-y: scroll;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    text-decoration: underline;
  }
}
</style>
