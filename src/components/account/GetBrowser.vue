<template>
  <div class="get-browser">
    <div class="flex flex-col py-8 px-8 text-center">
      <div v-if="isLoading" class="connect-wallet__loading">
        <Spinner :size="3" />
      </div>
      <template v-else>
        <slot name="title">
          <h2 v-if="type === 'welcome'" class="text-3 font-bold">{{ $t('wallet.connect.modal3welcome.title') }}</h2>
          <h2 v-else class="text-3 font-bold">{{ $t('wallet.connect.modal3.title') }}</h2>
        </slot>

        <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
          <slot name="description">
            <p>
              {{ $t('wallet.connect.modal3.text') }}
            </p>
          </slot>
        </div>

        <div class="flex items-center flex-col mt-12">
          <Button :name="$t('wallet.connect.modal3.button1') + ' &rarr;'" variant="secondary" @click="openUrlChrome" />
          <Button
            class="mt-4"
            :name="$t('wallet.connect.modal3.button2') + ' &rarr;'"
            variant="secondary"
            @click="openUrlBrave"
          />
          <a
            class="mt-6 font-medium hover:text-text p-1.5 transition-colors active:opacity-70 cursor-pointer"
            data-cy="tryTheDemoButton"
            @click="emitTryDemo"
          >
            {{ $t('generic_cta.tryTheDemo') }}
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import Spinner from '@/components/ui/Spinner.vue';

interface Props {
  type?: string;
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), { type: undefined, isLoading: false });

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'try-demo'): void;
}>();

const emitTryDemo = () => {
  emit('try-demo');
};

const openUrlChrome = () => {
  window.open('https://www.google.com/chrome/', '_blank', 'noopener');
};
const openUrlBrave = () => {
  window.open('https://www.brave.com', '_blank', 'noopener');
};
</script>
