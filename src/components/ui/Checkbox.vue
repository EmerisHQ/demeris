<template>
  <label class="checkbox inline-flex items-start p-4 rounded-xl border border-solid border-border cursor-pointer">
    <input
      v-model="model"
      class="checkbox__control-light dark:checkbox__control-dark appearance-none border-2 border-solid border-inactive flex-shrink-0 w-6 h-6 rounded-md transition select-none"
      type="checkbox"
    />
    <span v-if="label" class="checkbox__label ml-4 text-0 leading-copy">{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
interface Props {
  modelValue?: boolean;
  label?: string;
  isGradientOnlyTheme?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: '',
  isGradientOnlyTheme: true,
});
const emit = defineEmits(['update:modelValue']);
const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});
</script>

<style lang="scss" scoped>
.checkbox__control-light:checked {
  border: none;
  background: center / contain no-repeat url('@/assets/svg/checkMarkBlack.svg'),
    center / cover no-repeat url('@/assets/images/gradient-primary.jpg');
}
.checkbox__control-dark:checked {
  border: none;
  background: center / contain no-repeat url('@/assets/svg/checkMarkWhite.svg'),
    center / cover no-repeat url('@/assets/images/gradient-primary.jpg');
}
</style>
