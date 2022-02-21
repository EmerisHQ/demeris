<template>
  <div
    class="circle-symbol relative flex items-center justify-center flex-shrink-0 rounded-full"
    :class="[`circle-symbol--validator`, `circle-symbol--${size}`]"
  >
    <div
      v-if="validator.jailed"
      v-tippy
      :content="'Validator jailed'"
      class="flex items-center justify-center w-3 h-3 border-1 border-bg bg-negative rounded-full absolute z-50 -right-1 -top-1 font-medium -text-1 text-text"
    ></div>
    <template v-if="logoUrl != ''">
      <img :src="logoUrl" :alt="validator.moniker" class="w-full h-full rounded-full relative z-10" />
      <img alt="Logo glow" :src="logoUrl" class="circle-symbol__logo-glow absolute w-full h-full opacity-50 filter" />
    </template>
    <svg class="absolute w-0 h-0">
      <defs>
        <clipPath :id="clipPathId" clipPathUnits="objectBoundingBox">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.5,0.938 C0.742,0.938,0.938,0.742,0.938,0.5 C0.938,0.258,0.742,0.063,0.5,0.063 C0.258,0.063,0.063,0.258,0.063,0.5 C0.063,0.742,0.258,0.938,0.5,0.938 M0.5,1 C0.776,1,1,0.776,1,0.5 C1,0.224,0.776,0,0.5,0 C0.224,0,0,0.224,0,0.5 C0,0.776,0.224,1,0.5,1"
          />
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, onMounted, PropType, ref, toRefs, watch } from 'vue';

type CircleSymbolSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export default defineComponent({
  name: 'ValidatorBadge',
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
    size: {
      type: String as PropType<CircleSymbolSize>,
      default: 'md',
    },
  },
  setup(props) {
    const { validator } = toRefs(props);
    const logoUrl = ref('');

    const clipPathId =
      'clip-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(2, 10); // Generates random ID for svg clippath
    watch(
      () => validator.value,
      async (newVal) => {
        try {
          const kb = await axios.get(
            'https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=' + newVal.identity + '&fields=pictures',
          );
          logoUrl.value = kb.data?.them[0]?.pictures?.primary?.url ?? '';
        } catch (e) {}
      },
    );
    onMounted(async () => {
      if (validator.value) {
        try {
          const kb = await axios.get(
            'https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=' + validator.value.identity + '&fields=pictures',
          );
          logoUrl.value = kb.data?.them[0]?.pictures?.primary?.url ?? '';
        } catch (e) {}
      }
    });
    return {
      logoUrl,
      clipPathId,
    };
  },
});
</script>

<style lang="scss" scoped>
.circle-symbol {
  width: var(--symbol-size);
  height: var(--symbol-size);

  &--xs {
    --symbol-size: 1rem;
  }

  &--sm {
    --symbol-size: 1.5rem;
  }

  &--md {
    --symbol-size: 2rem;
  }

  &--lg {
    --symbol-size: 2.5rem;
  }

  &--xl {
    --symbol-size: 6rem;
  }

  &__logo-glow {
    filter: blur(calc(0.4 * var(--symbol-size)));
    top: 12.5%;
  }

  &__logo-container {
    padding: 12.5%;
  }
}
</style>
