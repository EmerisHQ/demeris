<template>
  <div class="clipboard">
    <tippy ref="tippyRef" :trigger="hasCopied ? 'manual' : 'mouseenter focus'" duration="250 0">
      <Button
        :click-function="
          () => {
            copy(text);
          }
        "
        variant="secondary"
        size="sm"
      >
        <CopyIcon class="text-0" :class="{ 'animate-pop': hasCopied }" />
      </Button>

      <template #content>
        <span v-if="hasCopied">{{ $t('components.clipBoard.copied') }}</span>
        <span v-else>{{ $t('components.clipBoard.copy') }}</span>
      </template>
    </tippy>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import CopyIcon from '@/components/common/Icons/CopyIcon.vue';
import Button from '@/components/ui/Button.vue';
import useClipboard from '@/composables/useClipboard';

interface Props {
  text?: string;
}

withDefaults(defineProps<Props>(), { text: '' });

const { copy, hasCopied } = useClipboard();
const tippyRef = ref(null);

watch(hasCopied, () => {
  hasCopied.value ? tippyRef.value.show() : tippyRef.value.hide();
});
</script>

<style lang="scss" scoped></style>
