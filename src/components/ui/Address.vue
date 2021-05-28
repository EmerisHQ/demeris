<template>
  <div class="address" :class="{ 'address--readonly': readonly }">
    <textarea v-model="model" rows="2" class="address__field" :readonly="readonly" />
    <div class="address__controls">
      <span class="address__chain">{{ chainName }}</span>
      <Clipboard :text="address" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import Clipboard from '@/components/ui/Clipboard.vue';

export default defineComponent({
  name: 'Address',

  components: {
    Clipboard,
  },

  props: {
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
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;

  &--readonly {
    background: rgba(0, 0, 0, 0.03);
  }

  &__field {
    width: 100%;
    flex: 1 1 0%;
    appearance: none;
    outline: none;
    background: transparent;
    font-size: 1.6rem;
  }

  &__controls {
    margin-top: 1.6rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__chain {
    font-size: 1.2rem;
    color: rgba(0, 0, 0, 0.667);
  }
}
</style>
