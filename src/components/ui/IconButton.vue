<template>
  <!-- Icon button implementation. Same specs as button only displays Icon instead of text using ./Icon.vue //-->
  <button
    :class="[type, status, type !== 'flat' ? 'elevation-button' : '', data?.isOver ? 'over' : '']"
    class="icon-button"
    @click="clickFunction"
  >
    <Icon v-if="isIcon" :name="name" :icon-size="iconSize" />
    <div v-else>
      <div style="display: flex" class="s-minus">
        <div
          v-if="buttonName.includes('Max')"
          style="max-width: 18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
        >
          {{ buttonName?.split('Max')[0] }}
        </div>
        <span> &nbsp;Max</span>
      </div>
    </div>
    <div v-if="showBadge" class="icon-button__badge" />
  </button>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import Icon from '@/components/ui/Icon.vue';
import useButton from '@/composables/useButton.vue';
import { ButtonFunctionData } from '@/types/setups';

export default defineComponent({
  name: 'IconButton',
  components: { Icon },
  props: {
    name: { type: String, required: true },
    iconSize: { type: Number, required: false, default: 2.4 },
    data: { type: Object as PropType<ButtonFunctionData>, default: undefined },
    type: {
      type: String,
      default: () => {
        return '';
      },
    },
    status: { type: String, required: true },
    showBadge: { type: Boolean, default: false },
  },
  emits: ['click'],
  // eslint-disable-next-line
  setup(props: any, { emit }) {
    const { buttonFunction } = useButton();
    const buttonName = computed(() => {
      return props.name;
    });

    let isIcon = true;

    if (!props.name.includes('Icon')) {
      isIcon = false;
    }

    function clickFunction() {
      if (props.data) {
        buttonFunction({
          type: props.data.type,
          function: props.data.function,
        });
      }

      emit('click');
    }

    return { isIcon, buttonName, clickFunction };
  },
});
</script>
<style lang="scss" scoped>
.icon-button {
  position: relative;
  outline: none;
  border: none;
  background-color: var(--surface);
  cursor: pointer;
  padding: 0;

  &__svg {
    svg {
      display: inline-block;
    }
  }

  &__badge {
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    top: -0.3rem;
    right: 0;
    content: '';
    background: #ff7d05;
    border-radius: 2.6rem;
  }
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
