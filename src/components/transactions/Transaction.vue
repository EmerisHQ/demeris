<template>
  <div>
    <!-- 
		Displays a transaction direction/type icon
		Transaction title
		Transaction datetime
		Chain avatar & chainName (using ../common/ChainName.vue)
		in/out addresses
		further details (amounts/denoms etc.)
		props: transaction
		dependencies:
		vuex getter to obtain user's preferred UI lang (i18n texts)?

		We should agree/decide on what types of transactions we're going to support/display
		//-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Transactions'
})
</script>