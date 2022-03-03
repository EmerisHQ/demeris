<template>
  <canvas ref="canvas" class="qr-code">
    <slot />
  </canvas>
</template>

<script lang="ts">
import { toCanvas } from 'qrcode'
import { defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  name: 'QrCode',

  props: {
    value: {
      type: String,
      default: undefined,
    },
    width: {
      type: [Number, String],
      default: 100,
    },
    background: {
      type: String,
      default: '#0000', // Transparent
    },
    color: {
      type: String,
      default: '#000000ff',
    },
  },

  setup(props) {
    const canvas = ref(null)

    const generate = () => {
      const options = {
        margin: 0,
        width: props.width,
        color: {
          dark: props.color,
          light: props.background,
        },
      }

      toCanvas(canvas.value, props.value, options)
    }

    onMounted(generate)
    watch(props, generate)

    return { canvas }
  },
})
</script>
