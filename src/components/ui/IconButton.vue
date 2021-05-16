<template>
  <!-- Icon button implementation. Same specs as button only displays Icon instead of text using ./Icon.vue //-->
  <button class="icon-button" :class="[shape, status, shape !== 'flat' ? 'elevation-button' : '']">
    <Icon :name="name" />
  </button>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'IconButton',
  components: { Icon },
  props: {
    name: { type: String, required: true },
    shape: {
      type: String,
      default: () => {
        return '';
      },
    },
    status: { type: String, required: true },
  },
});
</script>
<style lang="scss" scoped>
.icon-button {
  outline: none;
  border: none;
  background-color: var(--surface);
  cursor: pointer;
  padding: 0;
}

.flat {
  height: 4rem;
  width: 4rem;
}

.circle {
  height: 3.6rem;
  width: 3.6rem;
  padding: 0.6rem;
  border-radius: 50%;
}
</style>