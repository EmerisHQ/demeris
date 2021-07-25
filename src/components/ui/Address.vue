<template>
  <div
    class="address"
    :class="{ 'address--readonly': readonly, 'address--invalid': invalid, 'elevation-button': !readonly }"
  >
    <textarea v-model="model" rows="2" class="address__field" :readonly="readonly" v-bind="$attrs" spellcheck="false" />
    <div class="address__controls">
      <span class="address__chain"><ChainName :name="chainName" /></span>
      <Clipboard v-if="readonly" :text="address" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import Clipboard from '@/components/ui/Clipboard.vue';

export default defineComponent({
  name: 'Address',

  components: {
    ChainName,
    Clipboard,
  },

  inheritAttrs: false,

  props: {
    invalid: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: undefined,
    },
    chainName: {
      type: String,
      default: '',
    },
  },

  emits: ['update:address'],

  setup(props, { emit }) {
    const model = computed({
      get: () => props.address,
      set: (value) => emit('update:address', value),
    });

    return { model };
  },
});
</script>

<style lang="scss" scoped>
.address {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.625rem;

  &--invalid {
    color: var(--negative-text);
  }

  &--readonly {
    background: rgba(0, 0, 0, 0.03);
  }

  &__field {
    width: 100%;
    flex: 1 1 0%;
    appearance: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    resize: none;

    &::placeholder {
      color: var(--inactive);
    }
  }

  &__controls {
    margin-top: 1rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__chain {
    font-size: 0.8125rem;
    color: rgba(0, 0, 0, 0.667);
  }
}
</style>
