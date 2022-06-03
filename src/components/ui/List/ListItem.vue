<template>
  <div
    :key="label || description"
    class="flex justify-between w-full"
    :class="[
      `flex-${direction}`,
      {
        'items-center': direction === 'col',
        'py-3': !inset && size === 'xs',
        'py-6': !inset && size === 'sm',
        'py-8': !inset && size === 'md',
        'pt-3': inset && size === 'xs',
        'pt-4': inset && size === 'sm',
        'pt-6': inset && size === 'md',
      },
    ]"
  >
    <template v-if="label || description">
      <div :class="[firstCellClass, { 'flex items-start justify-between gap-x-3': direction === 'col' }]">
        <div
          v-if="label"
          class="text-left flex items-center"
          :class="{
            'font-normal': labelFontWeight == 'normal',
            'font-medium': labelFontWeight == 'medium',
          }"
        >
          <span>{{ label }}</span>
          <span v-if="hint" v-tippy :content="hint" class="text-muted hover:text-current ml-2">
            <Icon name="HintIcon" :icon-size="1" />
          </span>
        </div>

        <div class="text-left text-muted mt-0.5">
          <slot name="description">
            <p v-if="description" class="list-item__description__text -text-1">{{ description }}</p>
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
      :class="[
        secondCellClass,
        {
          'text-right': direction === 'row',
        },
      ]"
    >
      <slot>
        <p v-if="value">{{ value }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

interface Props {
  direction?: 'row' | 'col';
  collapsible?: boolean;
  collapsed?: boolean;
  description?: string;
  disclosureShowText?: string;
  disclosureHideText?: string;
  firstCellClass?: string;
  hint?: string;
  inset?: boolean;
  label?: string;
  secondCellClass?: string;
  value?: string;
  labelFontWeight?: 'light' | 'normal' | 'medium';
  size?: 'xs' | 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'row',
  collapsible: false,
  collapsed: false,
  description: '',
  disclosureShowText: 'Show',
  disclosureHideText: 'Hide',
  firstCellClass: 'w-full',
  hint: undefined,
  inset: false,
  label: undefined,
  secondCellClass: 'w-full',
  value: undefined,
  labelFontWeight: 'medium',
  size: 'md',
});

const isCollapsed = ref(props.collapsed);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style lang="scss" scoped></style>
