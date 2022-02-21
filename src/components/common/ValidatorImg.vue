<template>
  <template v-if="imgUrl !== ''">
    <img :src="imgUrl" :alt="validator.moniker" class="w-full h-full rounded-full relative z-10" />
  </template>
  <template v-else>
    <div class="w-full h-full rounded-full relative z-10 flex items-center justify-center">
      <p class="font-medium">{{ monikerFirst }}</p>
    </div>
  </template>
  <img alt="Logo glow" :src="imgUrl" class="logo-glow absolute w-full h-full opacity-50 filter" />
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue';

import { getFirstAlphabet } from '@/utils/basic';
export default defineComponent({
  name: 'ValidatorImg',
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const { validator } = toRefs(props);
    const imgUrl = ref('');
    const monikerFirst = ref('');
    watch(
      () => validator.value,
      async (newValue) => {
        imgUrl.value = await fetchValidatorImg(newValue.identity);
        monikerFirst.value = getFirstAlphabet(newValue.moniker);
      },
    );

    onMounted(async () => {
      if (!validator.value) return;
      imgUrl.value = await fetchValidatorImg(validator.value.identity);
      monikerFirst.value = getFirstAlphabet(validator.value.moniker);
    });
    return {
      imgUrl,
      monikerFirst,
    };
  },
});

async function fetchValidatorImg(identity: string) {
  try {
    const res = await axios.get(
      'https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=' + identity + '&fields=pictures',
    );
    const url = res.data?.them[0]?.pictures?.primary?.url ?? '';
    return url;
  } catch (e) {
    return '';
  }
}
</script>

<style lang="scss" scoped>
.logo-glow {
  filter: blur(calc(0.4 * var(--symbol-size)));
  top: 12.5%;
}
</style>
