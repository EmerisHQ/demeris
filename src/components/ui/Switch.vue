<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), { modelValue: false });

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <label class="switch">
    <input v-model="model" type="checkbox" class="switch__input" />
    <span class="switch__track">
      <span class="switch__thumb" />
    </span>
  </label>
</template>

<style lang="scss">
.switch {
  display: inline-flex;

  &__input {
    position: absolute;
    width: 1px;
    height: 1px;
    clip: rect(0, 0, 0, 0);
  }

  &__input:checked ~ &__track {
    background: linear-gradient(102.36deg, #64dbfc -2.26%, #30ffdf 34.48%, #fffe39 92.77%);
  }

  &__input:checked ~ &__track &__thumb {
    transform: translate(calc(100% - 0.125rem), -50%);
  }

  &__track {
    transition: background ease-in-out 150ms;
    position: relative;
    display: inline-flex;
    height: 1.5rem;
    min-width: 2.5rem;
    border-radius: 0.75rem;
    background: var(--fg);
    cursor: pointer;
    shrink: 0;
    padding: 0.1875rem;
  }

  &__thumb {
    transition: all ease-in-out 150ms;
    position: absolute;
    border-radius: 1.125rem;
    width: 1.125rem;
    height: 1.125rem;
    top: 50%;
    transform: translate(0%, -50%);
    background: conic-gradient(
      from 180deg at 50% 50%,
      #cea851 -41.21deg,
      #fff1c3 0.05deg,
      #9b7c3a 74.45deg,
      #fff0ca 115.85deg,
      #d3ad5f 143.94deg,
      #ffecc4 176.48deg,
      #997736 232.74deg,
      #fff2c0 284.83deg,
      #cea851 318.79deg,
      #fff1c3 360.05deg
    );
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.12);
  }
}
</style>
