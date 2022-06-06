<template>
  <div class="flex items-center justify-between py-7 px-4">
    <button class="w-10 flex items-center justify-evenly cursor-pointer" @click="clickIcon('goback')">
      <Icon :name="'ArrowLeftIcon'" :icon-size="1.5" />
    </button>
    <div class="w-6"></div>
    <button v-if="showClose" class="w-10 flex items-center justify-evenly cursor-pointer" @click="clickIcon('close')">
      <Icon :name="'CloseIcon'" :icon-size="1.5" />
    </button>
  </div>
</template>
<script setup lang="ts">
import Icon from '@/components/ui/Icon.vue';

interface Props {
  showClose?: boolean;
}

withDefaults(defineProps<Props>(), { showClose: true });

const emit = defineEmits<{
  (e: 'goback'): void;
  (e: 'close'): void;
}>();

function clickIcon(event) {
  emit(event);
}
</script>
