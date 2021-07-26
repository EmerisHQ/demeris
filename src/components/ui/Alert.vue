<template>
  <div
    role="alert"
    class="alert border border-solid rounded-lg flex items-start py-3 px-4"
    :class="[
      `alert--${status}`,
      { 'border-warning': status === 'warning' },
      { 'border-negative': status === 'error' },
      { 'border-border': status === 'info' },
    ]"
  >
    <span
      v-if="showIcon"
      class="alert__icon mt-0.5 mr-3"
      :class="[
        { 'text-inactive': status === 'info' },
        { 'text-warning': status === 'warning' },
        { 'text-negative': status === 'error' },
      ]"
    >
      <BanIcon v-if="status === 'error'" />
      <ExclamationIcon v-else-if="status === 'warning'" />
      <InformationIcon v-else-if="status === 'info'" />
    </span>

    <div class="alert__content -text-1 leading-copy" :class="[status === 'info' ? 'text-muted' : 'text-text']">
      <slot>
        <p>{{ message }}</p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import BanIcon from '@/components/common/Icons/BanIcon.vue';
import ExclamationIcon from '@/components/common/Icons/ExclamationIcon.vue';
import InformationIcon from '@/components/common/Icons/InformationIcon.vue';

type AlertStatus = 'error' | 'info' | 'warning';

export default defineComponent({
  name: 'Alert',

  components: {
    BanIcon,
    ExclamationIcon,
    InformationIcon,
  },

  props: {
    status: {
      type: String as PropType<AlertStatus>,
      default: 'warning',
    },
    message: {
      type: String,
      default: '',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style lang="scss" scoped></style>
