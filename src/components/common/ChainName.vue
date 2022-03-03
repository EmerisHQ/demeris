<template>
  {{ displayChain }}
</template>
<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { useStore } from 'vuex'

import { GlobalDemerisGetterTypes } from '@/store'
export default defineComponent({
  name: 'ChainName',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const store = useStore()
    const name = toRefs(props).name
    const displayChain = computed(() => {
      const displayName = store.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({ name: name.value })
      return displayName || name.value
    })
    return { displayChain }
  },
})
</script>
