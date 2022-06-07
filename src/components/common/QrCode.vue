<template>
  <canvas ref="canvas" class="qr-code">
    <slot />
  </canvas>
</template>

<script setup lang="ts">
import { toCanvas } from 'qrcode';
import { onMounted, ref, watch } from 'vue';

interface Props {
  value?: string;
  width?: number | string;
  background?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  width: 100,
  background: '#0000', // Transparent
  color: '#000000ff',
});

const canvas = ref(null);

const generate = () => {
  const options = {
    margin: 0,
    width: props.width,
    color: {
      dark: props.color,
      light: props.background,
    },
  };

  toCanvas(canvas.value, props.value, options);
};

onMounted(generate);
watch(props, generate);
</script>
