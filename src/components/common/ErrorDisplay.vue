<template>
  <div
    :style="{ height: props.height, width: props.width }"
    class="h-full w-full bg-fg flex items-center justify-center flex-col"
  >
    <p class="text-center -text-1">
      {{ props.msg }}
      <br />
      {{ props.userActionMsg }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';

interface ErrorPanelProps {
  msg?: string;
  userActionMsg?: string;
  width?: string;
  height?: string;
}
const props = withDefaults(defineProps<ErrorPanelProps>(), {
  width: undefined,
  height: undefined,
  msg: "We couldn't load your data.",
  userActionMsg: 'Please wait.',
});
</script>
