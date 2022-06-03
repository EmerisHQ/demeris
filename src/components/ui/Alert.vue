<template>
  <div
    role="alert"
    class="alert border border-solid flex items-start break-words"
    :class="[
      `alert--${status}`,
      { 'border-warning': status === 'warning' },
      { 'border-negative': status === 'error' },
      { 'border-border': status === 'info' },
      { 'py-3 px-4 rounded-lg': size === 'sm' },
      { 'py-5 px-6 rounded-xl': size === 'md' },
    ]"
  >
    <span
      v-if="showIcon"
      class="mt-0.5 mr-3"
      :class="[
        { 'text-inactive': status === 'info' },
        { 'text-warning': status === 'warning' },
        { 'text-negative': status === 'error' },
      ]"
    >
      <Icon :name="iconName" :icon-size="size === 'sm' ? 1 : 1.5" />
    </span>

    <div
      class="max-w-full grow leading-copy"
      :class="[status === 'info' ? 'text-muted' : 'text-text', { '-text-1': size === 'sm' }]"
    >
      <slot>
        <p>{{ message }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Icon from '@/components/ui/Icon.vue';

type AlertStatus = 'error' | 'info' | 'warning';
type AlertSize = 'sm' | 'md';

interface Props {
  status?: AlertStatus;
  message?: string;
  showIcon?: boolean;
  size?: AlertSize;
}

const props = withDefaults(defineProps<Props>(), {
  status: 'warning',
  message: '',
  showIcon: true,
  size: 'sm',
});

const iconName = computed(() => {
  switch (props.status) {
    case 'error':
      return 'WarningTriangleIcon';
      break;
    case 'warning':
      return 'ExclamationIcon';
      break;
    case 'info':
      return 'InformationIcon';
      break;
    default:
      return null;
      break;
  }
});
</script>

<style lang="scss" scoped></style>
