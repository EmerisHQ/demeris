<template>
  <div class="clipboard">
    <tippy ref="tippyRef" :trigger="hasCopied ? 'manual' : 'mouseenter focus'" duration="250 0">
      <button name="clipboard-button" class="clipboard__button" @click="copy(text)">
        <CopyIcon :class="{ 'animate-wobble': hasCopied }" />
      </button>

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
import useClipboard from '@/composables/useClipboard';

export default defineComponent({
  name: 'Clipboard',

  components: {
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

<style lang="scss" scoped>
.clipboard {
  font-size: 1.125rem;

  &__button {
    outline: none;
    padding: 0.25rem;
  }
}
</style>
