<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';

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

const sizeElementRef = ref(null);
const prefixElementRef = ref(null);
const suffixElementRef = ref(null);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const state = reactive({
  width: 0,
  scale: 0,
});

watch(
  [sizeElementRef, prefixElementRef, suffixElementRef, model, props],
  ([sizeEl, prefixEl, suffixEl]) => {
    if (!sizeEl) {
      return;
    }

    nextTick(() => {
      const extraWidth = (prefixEl?.offsetWidth || 0) + (suffixEl?.offsetWidth || 0);
      const width = Math.max(props.minWidth, sizeEl.offsetWidth + 1);
      const fullWidth = width + extraWidth;

      const scale = fullWidth >= props.maxWidth ? props.maxWidth / fullWidth : 1;

      state.width = width;
      state.scale = scale;
    });
  },
  { immediate: true },
);

const containerStyle = computed(() => {
  return {
    transform: `scale(${state.scale})`,
    maxWidth: `${props.maxWidth}px`,
  };
});
</script>

<template>
  <div class="flexible-input" :style="containerStyle" :class="{ 'flexible-input--empty': !model }">
    <div class="flexible-input__container">
      <span ref="prefixElementRef" class="flexible-input__prefix">{{ prefix }}</span>
      <AmountInput
        v-model="model"
        :placeholder="placeholder"
        :style="{ width: `${state.width}px` }"
        type="text"
        class="flexible-input__input"
      />
      <span ref="suffixElementRef" class="flexible-input__suffix">{{ suffix }}</span>
      <span ref="sizeElementRef" class="flexible-input__size-reference">
        {{ model }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flexible-input {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0%;

  &--empty &__prefix {
    color: var(--inactive);
  }

  &--empty &__suffix {
    color: var(--inactive);
  }

  &__container {
    display: flex;
    align-items: center;
    text-align: left;
  }

  &__prefix {
    color: inherit;
    font-size: 0.56em;
    align-self: flex-start;
    line-height: 1.8;
  }

  &__input {
    overflow: hidden;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    padding: 0;
    margin: 0;
    border: 0;
    outline: none;
    text-align: left;
    background: transparent;

    &::placeholder {
      color: var(--inactive);
    }
  }

  &__size-reference {
    visibility: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
