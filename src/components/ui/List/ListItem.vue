<template>
  <div
    :key="label || description"
    class="list-item"
    :class="[
      `list-item--${direction}`,
      {
        'list-item--descripted': !label,
        'list-item--inset': inset,
        'list-item--collapsed': isCollapsed,
      },
    ]"
  >
    <template v-if="label || description">
      <div class="list-item__info">
        <div v-if="label" class="list-item__label">
          <span class="list-item__label__text">{{ label }}</span>
          <span v-if="hint" class="list-item__label__hint">
            <Icon name="HintIcon" :icon-size="1.5" />
          </span>
        </div>

        <div class="list-item__description">
          <slot name="description">
            <p v-if="description" class="list-item__description__text">{{ description }}</p>
          </slot>
        </div>

        <button v-if="collapsable" class="list-item__collapse-button" @click="toggleCollapse">
          <Icon :name="'CaretUpIcon'" :icon-size="1.5" class="list-item__collapse-button__icon" />
        </button>
      </div>
    </template>

    <div v-show="!isCollapsed" class="list-item__content">
      <slot>
        <p v-if="value" class="list-item__content__value">{{ value }}</p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'ListItem',
  components: {
    Icon,
  },
  props: {
    direction: {
      type: String as PropType<'row' | 'column'>,
      default: 'row',
    },
    collapsable: {
      type: Boolean,
      default: false,
    },
    inset: {
      type: Boolean,
      default: false,
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: undefined,
    },
    value: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const isCollapsed = ref(props.collapsed);

    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    return { isCollapsed, toggleCollapse };
  },
});
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0;

  &--descripted {
    align-items: center;
  }

  &--inset {
    padding: 0.375rem 0;
  }

  &--row {
    flex-direction: row;
  }

  &--column {
    flex-direction: column;
  }

  &__label {
    font-size: 0.8125rem;
    font-weight: 600;
  }

  &--row > &__content {
    text-align: right;
  }

  &--column > &__content {
    margin-top: 1rem;
  }

  &__description {
    font-size: 0.8125rem;
    color: var(--muted);
  }

  &--column > &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__info {
    width: 100%;

    &__label {
      text-align: left;
    }
  }

  &__content {
    width: 100%;

    &__value {
      font-size: 0.8125rem;
    }
  }

  &--collapsed &__collapse-button {
    &__icon {
      transform: rotate(180deg);
    }
  }

  &__collapse-button {
    padding: 0.25rem;
  }
}
</style>
