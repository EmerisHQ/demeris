<template>
  <template v-if="imgUrl">
    <img :src="imgUrl" :alt="validator.moniker" class="w-full h-full block rounded-full relative z-10" />
  </template>
  <template v-else>
    <div class="w-full h-full rounded-full relative z-10 flex items-center justify-center">
      <p class="font-medium">{{ monikerFirst }}</p>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';

import { getFirstAlphabet } from '@/utils/basic';
interface Validator {
  moniker: string;
  avatar?: string;
}
interface Props {
  validator: Validator;
}
const props = withDefaults(defineProps<Props>(), {
  validator: () => ({ moniker: '' }),
});
const { validator } = toRefs(props);
const imgUrl = ref<string>(validator.value?.avatar);
const monikerFirst = ref<string>(getFirstAlphabet(validator.value?.moniker));
</script>
