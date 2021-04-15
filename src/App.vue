<template>
  <div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import '@starport/vue/lib/starport-vue.css';
export default defineComponent({
  name: 'App',
	data() {
		return {
			initialized: false
		}
	},
	computed: {
		hasWallet() {
			return this.$store.hasModule([ 'common', 'wallet'])
		}
	},
	async created() {
		await this.$store.dispatch('common/env/init',{
				starportUrl: '',
				apiNode: 'https://api.testnet1.test.gravitydex.io',
				rpcNode: 'https://rpc.testnet1.test.gravitydex.io',
				wsNode: 'wss://rpc.testnet1.test.gravitydex.io/websocket',
				chainId: 'swap-testnet-2003',
				addrPrefix: 'cosmos',
				chainName: 'Gravity DEX testnet',
				sdkVersion: 'Stargate',
				getTXApi: 'https://rpc.testnet1.test.gravitydex.io/tx?hash=0x'
			})
		this.initialized = true
	},
	errorCaptured(err) {
		console.log(err)
		return false
	}
});
</script>

<style lang="scss">
</style>
