<template>
  <div class="list-item" :class="[`list-item--${direction}`, { 'list-item--labeled': !!label }]">
    <template v-if="label || description">
      <div class="list-item__start">
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
      </div>
    </template>

    <div class="list-item__content">
      <slot>
        <p v-if="value" class="list__item__value">{{ value }}</p>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

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
});
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 0.6rem 0;

  &--labeled {
    padding: 1.6rem 0;
  }

  &--row {
    flex-direction: row;
  }

  &--column {
    flex-direction: column;
  }

  &__label {
    font-size: 1.2rem;
    font-weight: 600;
  }

  &--row > &__content {
    text-align: right;
  }

  &--column > &__content {
    margin-top: 1.6rem;
  }

  &__description {
    font-size: 1.2rem;
    color: var(--muted);
  }

  &__start {
    width: 100%;
    text-align: left;
  }

  &__content {
    width: 100%;
  }

  &__value {
    font-size: 1.2rem;
  }
}
</style>
