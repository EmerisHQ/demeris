<template>
  <!-- Icon button implementation. Same specs as button only displays Icon instead of text using ./Icon.vue //-->
  <button
    :class="[type, status, type !== 'flat' ? 'elevation-button' : '', data?.isOver ? 'over' : '']"
    class="icon-button"
    @click="clickFunction"
  >
    <Icon v-if="isIcon" :name="name" />
    <div v-else class="s-minus">{{ buttonName }}</div>
  </button>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import Icon from '@/components/ui/Icon.vue';
import useButton from '@/setups/Button.vue';
import { ButtonFunctionData } from '@/types/setups';

export default defineComponent({
  name: 'IconButton',
  components: { Icon },
  props: {
    name: { type: String, required: true },
    data: { type: Object as PropType<ButtonFunctionData>, required: true },
    type: {
      type: String,
      default: () => {
        return '';
      },
    },
    status: { type: String, required: true },
  },
  // eslint-disable-next-line
  setup(props: any) {
    const { buttonFunction } = useButton();
    const buttonName = ref(props.name);

    let isIcon = true;

    if (!props.name.includes('Icon')) {
      isIcon = false;
    }

    function clickFunction() {
      buttonFunction({
        type: props.data.type,
        function: props.data.function,
      });
    }

    return { isIcon, buttonName, clickFunction };
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

.over {
  background-color: var(--danger);
  color: var(--negative-text);
}
</style>
