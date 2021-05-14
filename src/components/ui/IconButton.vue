<template>
  <div>
    <!-- Icon button implementation. Same specs as button only displays Icon instead of text using ./Icon.vue //-->
    <Icon :icon_name="icon_name"></Icon>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'IconButton',
  components: { Icon },
  props: {
    icon_name: String
  },
});
</script>