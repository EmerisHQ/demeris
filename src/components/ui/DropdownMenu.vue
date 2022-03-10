<template>
  <div ref="focusWindow" data-test="mainComponent">
    <tippy
      ref="tippyInstance"
      :placement="placement"
      :trigger="trigger"
      :delay="delay"
      :interactive="interactive"
      :arrow="arrow"
      :offset="offset"
    >
      <Button
        :full-width="false"
        variant="link"
        class="text-muted hover:text-text w-12 px-2"
        rounded
        data-test="openMenuButton"
      >
        <Icon v-if="icon" data-test="openMenuButtonIcon" :name="icon" :icon-size="iconSize" class="mt-2" />
        <span v-if="label" data-test="openMenuButtonLabel">{{ label }}</span>
      </Button>
      <template #content>
        <slot></slot>
      </template>
    </tippy>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
interface Props {
  placement?: 'right-start' | 'left-start';
  trigger?: string;
  delay?: number;
  interactive?: boolean;
  arrow?: boolean;
  offset?: number[];
}
</script>
