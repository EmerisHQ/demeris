<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);

const format = (value: string) => {
  let newValue = value;
  // Replace commas
  newValue = newValue.replace(',', '.');
  // Only numbers
  newValue = newValue.replace(/[^0-9.]/g, '');

  if (newValue.startsWith('.')) {
    newValue = '0' + newValue;
  }

  if (newValue.split('').filter((char) => char === '.').length > 1) {
    // Remove subsequent separators
    newValue = newValue.replace(/(?<=\..*)\./g, '');
  }

  return newValue;
};

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!inputRef.value) {
      return;
    }

    let currentValue = value;

    if (parseFloat(currentValue) > Number.MAX_SAFE_INTEGER) {
      currentValue = Number.MAX_SAFE_INTEGER.toString();
    }

    const formatted = format(currentValue);
    emit('update:modelValue', formatted);
    inputRef.value.value = formatted;
  },
});
</script>

<template>
  <input
    ref="inputRef"
    v-model="model"
    type="text"
    inputmode="decimal"
    pattern="^[0-9]*[.,]?[0-9]*$"
    autocomplete="off"
    minlength="1"
    spellcheck="false"
  />
</template>
