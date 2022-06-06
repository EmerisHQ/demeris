<template>
  <!-- Displays an icon
		props:
		  type: string (the icon to display)
		//-->
  <div class="icon flex items-center justify-center" :style="`font-size:${iconSize}rem;`">
    <component :is="currentIcon" v-if="isReady" :style="`color: ${color}`" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, shallowRef } from 'vue';

interface Props {
  name: string;
  iconSize?: number;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), { iconSize: 1.5, color: 'inherit' });

const currentIcon = shallowRef('');
const isReady = ref(false);
onMounted(async () => {
  const icon = await defineAsyncComponent(() => import(`@/components/common/Icons/${props.name}.vue`));
  currentIcon.value = icon;
  isReady.value = true;
});
</script>
