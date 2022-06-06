<template>
  <div class="flex w-full items-center justify-start">
    <img class="list-item-icon ml-6 h-3 w-3" :src="iconUrl" />
    <span class="pl-4"> {{ text }} </span>
    <Checkbox
      :model-value="isChecked"
      class="checkbox mr-6 ml-auto"
      :is-gradient-only-theme="false"
      @update:modelValue="onUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Checkbox from '@/components/ui/Checkbox.vue';

interface Props {
  isChecked?: boolean;
  iconUrl: string;
  text: string;
}

const props = withDefaults(defineProps<Props>(), { isChecked: false });

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const listItemRef = ref({ iconUrl: props.iconUrl, isChecked: props.isChecked, text: props.text });

const onUpdate = (e) => {
  listItemRef.value = { ...listItemRef.value, isChecked: e };
  emit('update:modelValue', listItemRef.value);
};
</script>

<style lang="scss" scoped>
:deep(.checkbox) {
  padding: 0;
}
</style>
