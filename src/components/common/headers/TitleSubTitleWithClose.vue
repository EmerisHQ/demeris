<template>
  <div>
    <div class="flex items-center text-2 font-bold">
      {{ title }}
      <Button
        v-if="showCloseButton"
        class="ml-auto pr-6"
        variant="link"
        :click-function="
          () => {
            func();
          }
        "
      >
        <Icon :name="'CloseIcon'" size="1.5" />
      </Button>
    </div>
    <div class="text-0 text-muted">{{ subTitle }}</div>
  </div>
</template>
<script lang="ts" setup>
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  func: {
    type: Function,
    required: false,
    default() {
      return () => {
        return '';
      };
    },
  },
});
</script>
<style lang="scss" scoped></style>
