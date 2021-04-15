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
				apiNode: 'http://gravity.bharvest.io:1317',
				rpcNode: 'http://gravity.bharvest.io:26657',
				wsNode: 'ws://gravity.bharvest.io:26657/websocket',
				chainId: 'swap-testnet-2003',
				addrPrefix: 'cosmos',
				chainName: 'Gravity DEX testnet',
				sdkVersion: 'Stargate',
				getTXApi: 'http://gravity.bharvest.io:26657/tx?hash=0x'
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
