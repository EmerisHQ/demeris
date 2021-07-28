<template>
  <div class="modal__button" @mouseenter="toggleToolTip('show')" @mouseleave="toggleToolTip('hide')">
    <!-- Basic button implementation. At minimum primary/secondary types, busy and disabled states, can be a link,router_link or trigger a custom clickHandler //-->
    <button :class="[status, 'button']" :disabled="disabled" @click="clickFunction">
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
  name: 'ModalButton',
  props: {
    name: { type: String, required: true },
    status: { type: String, required: false, default: 'normal' },
    clickFunction: { type: Function, required: false, default: null },
    tooltipText: { type: String, required: false, default: '' },
    disabled: { type: Boolean, default: false },
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
.modal__button {
  flex-grow: 1;
  &:last-child {
    .button {
      border: none;
    }
  }
}
.button {
  width: 100%;
  background: none;
  color: var(--text);
  padding: 2.4rem;
  border: none;
  outline: none;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  border-right: 1px solid rgba(0, 0, 0, 0.17);
  &::last-child {
    border: none;
  }
  &:disabled {
    background-color: var(--inactive);
    cursor: not-allowed;
  }
}

.inactive {
  background-color: var(--inactive);
  pointer-events: none;
}

.button-tooltip {
  display: block;
  height: 0;
}
</style>
