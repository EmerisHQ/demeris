<template>
  <Collapse class="w-full border-b border-border" v-bind="$attrs">
    <template #handler="{ isOpen, onClick }">
      <button class="w-full py-4 flex justify-between" @click="onClick">
        <span class="transition-all" :class="{ 'font-medium': isOpen }">
          <slot name="title">
            <p>{{ title }}</p>
          </slot>
        </span>
        <div class="flex items-center">
          <span class="mr-3 font-medium transition-opacity duration-300 delay-200" :class="{ 'opacity-0': isOpen }">
            <slot name="label" />
          </span>
          <Icon
            :name="'CaretDownIcon'"
            :icon-size="1"
            class="transform transition-transform -ml-2"
            :class="{ 'rotate-180': isOpen }"
          />
        </div>
      </button>
    </template>

    <div :class="contentClass">
      <slot />
    </div>
  </Collapse>
</template>

<script lang="ts" setup>
import Collapse from '@/components/ui/Collapse.vue';
import Icon from '@/components/ui/Icon.vue';

interface Props {
  title: string;
  contentClass?: string;
}

defineProps<Props>();
</script>
