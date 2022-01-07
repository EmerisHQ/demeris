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

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import CopyIcon from '@/components/common/Icons/CopyIcon.vue';
import Button from '@/components/ui/Button.vue';
import useClipboard from '@/composables/useClipboard';

export default defineComponent({
  name: 'Clipboard',

  components: {
    Button,
    CopyIcon,
  },

  props: {
    text: {
      type: String,
      default: '',
    },
  },

  setup() {
    const { copy, isSupported, hasCopied } = useClipboard();
    const tippyRef = ref(null);

    watch(hasCopied, () => {
      hasCopied.value ? tippyRef.value.show() : tippyRef.value.hide();
    });

    return { copy, isSupported, hasCopied, tippyRef };
  },
});
</script>

<style lang="scss" scoped></style>
