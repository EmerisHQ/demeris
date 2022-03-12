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
/*
export default defineComponent({

  props: {
    error: {
      type: [Object, String],
      required: true,
    },
  },
  computed: {
    title(): string {
      if (typeof this.error === 'object') {
        const error = this.error as GenericFetchError;
        if (error.response?.status === 404) {
          return 'Not Found';
        } else if (error?.message === 'Failed to fetch') {
          return 'Network Error';
        }
      }
      return 'Something gone wrong';
    },
    message(): string {
      if (typeof this.error === 'string') {
        return this.error;
      }
      const error = this.error as GenericFetchError;
      if (error.response?.status === 404) {
        return 'Sorry, the asked city was not found.';
      } else if (error.message === 'Failed to fetch') {
        return 'Sorry, we was not able to perform the request.';
      }
      return error.message;
    },
    isTryAgain(): boolean {
      const error = this.error as GenericFetchError;
      return !error.response || error.response.status !== 404;
    },
  },
});
*/
</script>
