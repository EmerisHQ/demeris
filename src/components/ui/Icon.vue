<template>
  <!-- Displays an icon
		props:
		  type: string (the icon to display)
		//-->
  <div class="icon flex items-center justify-center" :style="`font-size:${iconSize}rem;`">
    <component :is="currentIcon" v-if="isReady" :style="`color: ${color}`" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue'

export default defineComponent({
  name: 'Icon',

  props: {
    name: {
      type: String,
      required: true,
    },
    iconSize: { type: Number, required: false, default: 1.5 },
    color: { type: String, required: false, default: 'inherit' },
  },

  setup(props) {
    const currentIcon = shallowRef('')
    const isReady = ref(false)
    import(`@/components/common/Icons/${props.name}.vue`).then((val) => {
      currentIcon.value = val.default
      isReady.value = true
    })

    return {
      currentIcon,
      isReady,
    }
  },
})
</script>
