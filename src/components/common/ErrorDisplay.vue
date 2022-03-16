<template>
  <div
    :style="{ height: props.height, width: props.width }"
    class="h-full w-full bg-fg flex items-center justify-center flex-col rounded-xl"
  >
    <p class="text-center text-muted">
      {{ $t(`generic_error.${props.msgType}.msg`) }}
      <br />
      {{ $t(`generic_error.${props.msgType}.userActionMsg`) }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';

interface ErrorPanelProps {
  msgType?: string;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<ErrorPanelProps>(), {
  width: undefined,
  height: undefined,
  msgType: 'default',
});
</script>
