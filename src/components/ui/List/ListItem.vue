<template>
  <div
    :key="label || description"
    class="flex justify-between w-full"
    :class="[
      `flex-${direction}`,
      {
        'items-center': direction === 'col',
        'py-6': !inset && size === 'sm',
        'py-8': !inset && size === 'md',
        'pt-4': inset && size === 'sm',
        'pt-6': inset && size === 'md',
      },
    ]"
  >
    <template v-if="label || description">
      <div class="w-full" :class="{ 'flex items-start justify-between gap-x-3': direction === 'col' }">
        <div v-if="label" class="font-medium text-left">
          <span class="list-item__label__text">{{ label }}</span>
          <span v-if="hint" class="list-item__label__hint">
            <Icon name="HintIcon" :icon-size="1.5" />
          </span>
        </div>

        <div class="text-muted">
          <slot name="description">
            <p v-if="description" class="list-item__description__text">{{ description }}</p>
          </slot>
        </div>

        <Button
          v-if="collapsible"
          variant="link"
          :name="isCollapsed ? disclosureShowText : disclosureHideText"
          :click-function="toggleCollapse"
        >
          <template #right>
            <Icon
              :name="'CaretUpIcon'"
              :icon-size="1"
              class="transform transition-transform -ml-2"
              :class="{ 'rotate-180': isCollapsed }"
            />
          </template>
        </Button>
      </div>
    </template>

    <div
      v-show="!isCollapsed"
      class="w-full"
      :class="{
        'text-right': direction === 'row',
      }"
    >
      <slot>
        <p v-if="value">{{ value }}</p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'ListItem',
  components: {
    Button,
    Icon,
  },
  props: {
    direction: {
      type: String as PropType<'row' | 'col'>,
      default: 'row',
    },
    collapsible: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    disclosureShowText: {
      type: String,
      default: 'Show',
    },
    disclosureHideText: {
      type: String,
      default: 'Hide',
    },
    hint: {
      type: String,
      default: '',
    },
    inset: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: undefined,
    },
    value: {
      type: String,
      default: undefined,
    },
    size: {
      type: String as PropType<'sm' | 'md'>,
      default: 'md',
    },
  },
  setup(props) {
    const isCollapsed = ref(props.collapsed);

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    return { isCollapsed, toggleCollapse };
  },
});
</script>

<style lang="scss" scoped></style>
