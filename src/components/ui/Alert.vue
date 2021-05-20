<template>
  <div role="alert" class="alert" :class="`alert--${status}`">
    <span class="alert__icon w-6 h-6">
      <BanIcon v-if="status === 'error'" class="text-red-500" />
      <ExclamationIcon v-else-if="status === 'warning'" class="text-yellow-500" />
      <InformationIcon v-else-if="status === 'info'" class="text-gray-500" />
    </span>

    <div class="alert__content">
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
  },
});
</script>

<style lang="postcss" scoped>
.alert {
  @apply py-3 px-4 rounded-lg flex items-center space-x-3 border border-transparent text-gray-900;
}
.alert--error {
  background: linear-gradient(135deg, #ffc1cc 0%, #ffcfc9 100%);
}
.alert--info {
  @apply shadow-none border-gray-200 text-gray-600;
}
.alert--warning {
  background: linear-gradient(135deg, #ffe3c1 0%, #fffac9 100%);
}
</style>
