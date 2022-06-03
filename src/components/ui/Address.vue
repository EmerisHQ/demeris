<template>
  <label
    class="address block relative w-full max-w-lg"
    :class="{
      'address--readonly border border-solid border-border rounded-xl': readonly,
      'address--editable': !readonly,
      'address--invalid': invalid,
    }"
  >
    <textarea
      v-model="model"
      rows="1"
      class="address__field relative z-10 block w-full px-4 pt-3 pb-20 text-0 leading-copy font-normal text-text border-none rounded-xl appearance-none"
      :class="[
        { 'bg-fg focus:bg-surface focus:rounded-lg': !readonly },
        { 'bg-transparent': readonly },
        { 'text-negative-text': invalid },
      ]"
      :placeholder="placeholder"
      :readonly="readonly"
      v-bind="$attrs"
      spellcheck="false"
    />
    <div v-if="!readonly" class="focus-border absolute z-0 -inset-0.5 rounded-xl invisible bg-gold-circular"></div>
    <div class="address__controls absolute z-10 px-4 pb-4 left-0 bottom-0 w-full flex justify-between items-end">
      <span class="text-muted -text-1"><ChainName :name="chainName" /></span>
      <Clipboard v-if="readonly" :text="address" />
      <Button v-else name="Paste" size="sm" variant="secondary" :click-function="pasteClip" />
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Button from '@/components/ui/Button.vue';
import Clipboard from '@/components/ui/Clipboard.vue';

interface Props {
  invalid?: boolean;
  readonly?: boolean;
  placeholder?: string;
  address?: string;
  chainName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  invalid: false,
  readonly: false,
  placeholder: 'Enter an address',
  address: undefined,
  chainName: '',
});

const emit = defineEmits<{
  (e: 'update:address', value: any): void;
}>();

const model = computed({
  get: () => props.address,
  set: (value) => emit('update:address', value),
});
const pasteClip = () => {
  navigator.clipboard.readText().then((clipText) => (model.value = clipText));
};
</script>

<style lang="scss" scoped>
textarea {
  outline: none;
  resize: none;
}

textarea::placeholder {
  transition: color 150ms ease-out;
}

textarea:hover::placeholder {
  color: var(--muted);
}

textarea::placeholder,
textarea:focus::placeholder {
  color: var(--inactive);
}

.focus-border {
  z-index: 7;
}

textarea:focus ~ .focus-border {
  visibility: visible;
}
</style>
