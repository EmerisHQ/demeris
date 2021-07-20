<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  maxDecimals: {
    type: Number,
    default: 6,
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

  const [integerDigits, fractionDigits] = newValue.split('.');

  if (fractionDigits?.length > props.maxDecimals) {
    newValue = `${integerDigits}.${fractionDigits.slice(0, props.maxDecimals)}`;
  }

  return newValue;
};

const model = computed({
  get: () => props.modelValue.toString(),
  set: (value) => {
    if (!inputRef.value) {
      return;
    }

    let currentValue = value;

    while (parseFloat(currentValue) > Number.MAX_SAFE_INTEGER) {
      currentValue = currentValue.slice(0, -1);
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
