<template>
  <div role="alert" class="alert" :class="`alert--${status}`">
    <span class="alert__icon">
      <BanIcon v-if="status === 'error'" />
      <ExclamationIcon v-else-if="status === 'warning'" />
      <InformationIcon v-else-if="status === 'info'" />
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

<style lang="scss" scoped>
.alert {
  padding: 1.4rem 1.6rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  border: 1px solid transparent;

  &--error {
    background: linear-gradient(135deg, #ffc1cc 0%, #ffcfc9 100%);
  }

  &--error &__icon {
    color: rgba(202, 8, 101, 1);
  }

  &--info {
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: none;
    color: rgba(0, 0, 0, 0.667);
  }

  &--info &__icon {
    color: rgba(0, 0, 0, 0.33);
  }

  &--warning {
    background: linear-gradient(135deg, #ffe3c1 0%, #fffac9 100%);
  }

  &--warning &__icon {
    color: rgba(255, 125, 5, 1);
  }

  &__icon {
    width: 1.8rem;
    height: 1.8rem;
  }

  &__content {
    margin-left: 1.2rem;
    font-size: 1.2rem;
  }
}
</style>
