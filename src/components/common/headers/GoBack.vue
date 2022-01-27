<template>
  <div class="flex items-center py-8">
    <Button v-if="showBackButton" variant="link">
      <Icon :name="'ArrowLeftIcon'" icon-size="1" />
    </Button>
    <div class="ml-4">{{ title }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'Goback',
  components: { Button, Icon },
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
    showBackButton: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
});
</script>
