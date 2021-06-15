<template>
  <div @mouseenter="toggleToolTip('show')" @mouseleave="toggleToolTip('hide')">
    <!-- Basic button implementation. At minimum primary/secondary types, busy and disabled states, can be a link,router_link or trigger a custom clickHandler //-->
    <button
      :class="[status, isOutline ? 'outline-theme' : '']"
      class="button s-0 w-medium elevation-button"
      @click="clickFunction"
    >
      {{ name }}
    </button>
    <tippy ref="buttonTooltipRef" class="button-tooltip" placement="bottom" :max-width="240">
      <template #content>{{ tooltipText }} </template>
    </tippy>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    name: { type: String, required: true },
    status: { type: String, required: false, default: 'normal' },
    clickFunction: { type: Function, required: false, default: null },
    tooltipText: { type: String, required: false, default: '' },
    isOutline: { type: Boolean, required: false, default: false },
  },
  setup(props) {
    const buttonTooltipRef = ref(null);
    function toggleToolTip(type) {
      if (props.tooltipText) {
        if (type === 'show') {
          buttonTooltipRef.value.show();
        } else {
          buttonTooltipRef.value.hide();
        }
      }
    }

    return { buttonTooltipRef, toggleToolTip };
  },
});
</script>
<style lang="scss" scoped>
.button {
  width: 100%;
  padding: 1.6rem 2rem;
  color: var(--bg);

  border-radius: 8px;
  border: none;
  outline: none;
  cursor: pointer;
}

.normal {
  background-color: var(--text);
}

.muted {
  background-color: var(--muted);
}

.inactive {
  background-color: var(--inactive);
  pointer-events: none;
}

.button-tooltip {
  display: block;
  height: 0;
}

.outline-theme {
  color: var(--text);
  border: 1px solid var(--border-trans);
  background-color: transparent;
}
</style>
