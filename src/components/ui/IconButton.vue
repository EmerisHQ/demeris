<script lang="ts">
/* eslint-disable vue/no-static-inline-styles */
</script>
<template>
  <!-- Icon button implementation. Same specs as button only displays Icon instead of text using ./Icon.vue //-->
  <button
    :class="[
      type,
      status,
      type !== 'flat' ? 'bg-surface shadow-button rounded-xl' : '',
      data?.isOver ? 'text-negative-text' : '',
    ]"
    class="icon-button"
    @click="clickFunction"
  >
    <slot>
      <Icon v-if="isIcon" :name="name" :icon-size="iconSize" />
      <div v-else>
        <div class="flex -text-1">
          <div
            v-if="buttonName.includes('Max')"
            style="max-width: 11.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
          >
            {{ buttonName?.split('Max')[0] }}
          </div>
          <span v-if="buttonName.includes('Max')"> &nbsp;Max</span>
          <span v-else>{{ buttonName }}</span>
        </div>
      </div>
      <div v-if="showBadge" class="icon-button__badge" />
    </slot>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import Icon from '@/components/ui/Icon.vue';
import useButton from '@/composables/useButton';
import { ButtonFunctionData } from '@/types/util';

interface Props {
  name?: string;
  iconSize?: number;
  data?: ButtonFunctionData;
  type?: string;
  status?: string;
  showBadge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  iconSize: 1.5,
  data: undefined,
  type: '',
  status: '',
  showBadge: false,
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const { buttonFunction } = useButton();
const buttonName = computed(() => {
  return props.name;
});

let isIcon = true;

if (!props.name.includes('Icon')) {
  isIcon = false;
}

function clickFunction() {
  if (props.data) {
    buttonFunction({
      type: props.data.type,
      function: props.data.function,
    });
  }

  emit('click');
}
</script>
<style lang="scss" scoped>
.icon-button {
  position: relative;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &__svg {
    svg {
      display: inline-block;
    }
  }

  &__badge {
    position: absolute;
    width: 0.75rem;
    height: 0.75rem;
    top: -0.1875rem;
    right: 0;
    content: '';
    background: #ff7d05;
    border-radius: 1.5rem;
  }
}

.flat {
  height: 2.5rem;
  width: 2.5rem;
}

.circle {
  height: 2.25rem;
  width: 2.25rem;
  padding: 0.375rem;
  border-radius: 24px;
}

.text {
  padding: 0.625rem 1rem;
  border-radius: 24px;
}
</style>
