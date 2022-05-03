<template>
  {{ apr === '' ? '--.--' : apr }}%
  <span v-if="props.showLabel">APR</span>
</template>

<script lang="ts" setup>
import { toRefs } from '@vue/reactivity';
import { ref, watch } from 'vue';

import useStaking from '@/composables/useStaking';

const { getStakingAPR } = useStaking();

// Interfaces
interface Props {
  showLabel?: boolean;
  chain: string;
}

// Props
const props = withDefaults(defineProps<Props>(), {
  showLabel: false,
  chain: '',
});
const propsRef = toRefs(props);

const apr = ref('');

watch(
  () => propsRef.chain.value,
  async () => {
    apr.value = await getStakingAPR(propsRef.chain.value);
  },
  { immediate: true },
);
</script>
