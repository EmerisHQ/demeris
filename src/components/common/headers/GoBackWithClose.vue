<template>
  <div class="flex items-center justify-between gap-x-6 py-7 px-4">
    <button class="w-10 flex items-center justify-evenly cursor-pointer" @click="clickIcon('go-back')">
      <Icon :name="'ArrowLeftIcon'" :icon-size="1.5" />
    </button>
    <button
      v-if="props.showClose"
      class="w-10 flex items-center justify-evenly cursor-pointer"
      @click="clickIcon('close')"
    >
      <Icon :name="'CloseIcon'" :icon-size="1.5" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/ui/Icon.vue';

interface Props {
  showClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showClose: true,
});

interface Events {
  (e: 'go-back'): void;
  (e: 'close'): void;
}

const emit = defineEmits<Events>();

const clickIcon = (event) => {
  emit(event);
};
</script>
