<template>{{ apr === '' ? '--.--' : apr }}%</template>

<script lang="ts" setup>
import { toRefs } from '@vue/reactivity';
import { ref, watch } from 'vue';

import useStaking from '@/composables/useStaking';

const { getStakingAPR } = useStaking();

const props = defineProps<{ chain: string }>();
const propsRef = toRefs(props);

const apr = ref('');

watch(
  () => propsRef.chain.value,
  async () => {
    const ret = await getStakingAPR(propsRef.chain.value);
    apr.value = ret;
  },
  { immediate: true },
);
</script>
