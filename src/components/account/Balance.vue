<template>
  <div>
    <!-- 
			Single balance object. 
			props: [] of balances with same base_denom
			Displays base_enom badge,  base_denom name, props.balances.length.
			if props.balances.length>1 display accordion arrow which opens to reveal breakdown of individual balances per chain.
			amounts displayed using ../common/Amount.vue component to avoid a vuex dependency here.
			chain names displayed using ../common/ChainName.vue component to avoid a vuex dependency here.
			On hover, displays send/receive links
			dependencies:
			vuex getter to obtain user's preferred UI lang (i18n texts)?
		 //-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Balance'
})
</script>