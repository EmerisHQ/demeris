<template>
  <!-- Icon button implementation. Same specs as button only displays Icon instead of text using ./Icon.vue //-->
  <button class="icon-button" :class="[shape, status, shape !== 'flat' ? 'elevation-button' : '']">
    <Icon v-if="isIcon" :name="name" />
    <div v-else class="s-minus">{{ buttonName }}</div>
  </button>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
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
  setup(props) {
    const name = String(props.name);
    const buttonName = ref(props.name);
    let isIcon = true;

    if (!name.includes('Icon')) {
      isIcon = false;
    }

    return { isIcon, buttonName };
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
  border-radius: 24px;
}

.text {
  padding: 1rem 1.6rem;
  border-radius: 24px;
}
</style>