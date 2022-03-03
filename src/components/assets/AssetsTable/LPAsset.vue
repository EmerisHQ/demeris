<template>
  <div v-if="validPool && pool">
    <p class="-text-1 font-normal text-muted">
      LP <Ticker :name="pool.reserve_coin_denoms[0]" /> &middot; <Ticker :name="pool.reserve_coin_denoms[1]" />
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import { useStore } from 'vuex'

import Ticker from '@/components/common/Ticker.vue'
import usePools from '@/composables/usePools'
import { GlobalDemerisGetterTypes } from '@/store'
import { VerifiedDenoms } from '@/types/api'

export default defineComponent({
  name: 'LPAsset',
  components: {
    Ticker,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const store = useStore()
    const propsRef = toRefs(props)
    const verifiedDenoms = computed<VerifiedDenoms>(() => {
      return store.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms] ?? []
    })
    const validPool = computed(() => {
      return verifiedDenoms.value.find((x) => x.name == propsRef.name.value) ?? false
    })
    const { pools } = usePools()
    const pool = computed(() => {
      return pools.value?.find((x) => x.pool_coin_denom == propsRef.name.value)
    })
    return {
      validPool,
      pool,
    }
  },
})
</script>
<style lang="scss" scoped></style>
