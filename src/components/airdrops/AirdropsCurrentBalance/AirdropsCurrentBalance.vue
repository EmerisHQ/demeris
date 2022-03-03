<template>
  <div class="bg-fg p-4 rounded-2xl">
    <p class="-text-1 text-muted mb-4">Current Balance</p>
    <div class="flex justify-between items-center">
      <div class="w-10 h-10 mr-4">
        <img :src="selectedAirdrop.tokenIcon" alt="Airdrop Logo" />
      </div>
      <div class="w-10/12">
        <p class="font-medium">$1,234.56</p>
        <p class="-text-1 text-muted">1,234.56 LIKE</p>
      </div>
      <CaretRightIcon />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRaw } from 'vue'
import { useStore } from 'vuex'

import CaretRightIcon from '@/components/common/Icons/CaretRightIcon.vue'
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store'

export default defineComponent({
  name: 'AirdropsCurrentBalance',
  components: {
    CaretRightIcon,
  },

  setup() {
    const apistore = useStore() as TypedAPIStore

    const selectedAirdrop = computed(() => {
      return toRaw(apistore.getters[GlobalDemerisGetterTypes.API.getSelectedAirdrop])
    })

    return { selectedAirdrop }
  },
})
</script>
