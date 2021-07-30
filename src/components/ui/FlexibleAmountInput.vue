<script setup lang="ts">
import { computed, nextTick, reactive, ref, toRef, unref, watch } from 'vue';

import AmountInput from './AmountInput.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: Number,
    required: true,
  },
  minWidth: {
    type: Number,
    default: 30,
  },
  prefix: {
    type: String,
    default: undefined,
  },
  suffix: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);

const containerElementRef = ref(null);
const sizeElementRef = ref(null);
const prefixElementRef = ref(null);
const suffixElementRef = ref(null);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const state = reactive({
  width: 0,
  maxWidth: '100%',
  scale: 1,
});

watch(
  [containerElementRef, sizeElementRef, prefixElementRef, suffixElementRef, model, props],
  ([containerEl, sizeEl, prefixEl, suffixEl]) => {
    if (!sizeEl) {
      return;
    }

    nextTick(() => {
      const extraWidth = (prefixEl?.offsetWidth || 0) + (suffixEl?.offsetWidth || 0);
      const width = Math.max(props.minWidth, sizeEl.offsetWidth + 1);
      const fullWidth = width + extraWidth;
      const maxWidth = containerEl?.offsetWidth;

      const scale = fullWidth >= maxWidth ? maxWidth / fullWidth : 1;

      state.width = width;
      state.maxWidth = maxWidth;
      state.scale = scale;
    });
  },
  { immediate: true },
);

const innerStyle = computed(() => {
  return {
    transform: `scale(${state.scale})`,
    maxWidth: `512px`, // ${props.maxWidth}px`,
  };
});

const inputProps = computed(() => {
  return {
    style: { width: `${state.width}px` },
    width: state.width,
    placeholder: props.placeholder,
    class: `flexible-input__input appearance-none overflow-hidden p-0 m-0 w-auto text-left border-none outline-none bg-transparent transition-colors`,
  };
});
</script>

<template>
  <label
    ref="containerElementRef"
    class="flexible-input relative flex items-center justify-center mx-auto w-full cursor-text"
    :class="{ 'text-inactive hover:text-muted': !model }"
  >
    <div class="flex-1 relative flex justify-center" :style="innerStyle">
      <div class="flex items-baseline">
        <span
          ref="prefixElementRef"
          class="flexible-input__prefix self-start whitespace-nowrap leading-copy mt-1 mr-1"
        >{{ prefix }}</span>
        <slot :model="model" v-bind="inputProps" @update:modelValue="model = $event">
          <AmountInput
            v-model="model"
            :placeholder="inputProps.placeholder"
            :style="inputProps.style"
            :class="inputProps.class"
            :width="inputProps.width"
            type="text"
          />
        </slot>
        <span ref="suffixElementRef" class="flexible-input__suffix whitespace-nowrap">
          <slot name="suffix">
            {{ suffix }}
          </slot>
        </span>
        <span ref="sizeElementRef" class="invisible absolute right-0 bottom-0">{{ model }}</span>
      </div>
    </div>
  </label>
</template>

<style lang="scss">
.flexible-input {
  &__prefix {
    font-size: 0.56em;
  }

  &__suffix {
    margin-left: 0.15em;
  }

  &:hover &__input::placeholder {
    color: var(--muted);
  }

  &__input {
    min-width: 0.66em;
    font: inherit;
    letter-spacing: inherit;
    outline: none;

    &::placeholder,
    &:focus::placeholder {
      color: var(--inactive);
    }
  }
}
</style>
