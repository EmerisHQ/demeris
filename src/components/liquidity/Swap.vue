<template>
  <!-- 
		Displays a swap building component:
		title, chose denom balance
		Max Icon button (using ../ui/Icon.vue)
		Reset Icon Button (using ../ui/Icon.vue)
		from Denom selector (using ../common/DenomSelect.vue)
		to Denom selector (using ../common/DenomSelect.vue)
		switch Icon Button (using ../ui/Icon.vue)
		price compoonent (using ../common/Price.vue)

		dependencies:
				vuex getter to obtain user's preferred UI lang (i18n texts)?
	-->
  <div class="swap-widget elevation-card">
    <div class="swap-widget-header">
      <div class="s-2 w-bold">Swap</div>
      <div class="swap-widget-header__dot-button"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Swap',
});
</script>

<style lang="scss" scoped>
.swap-widget {
  width: 320px;

  padding: 3rem 2.4rem 2.4rem;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__dot-button {
      width: 2.4rem;
      height: 2.4rem;

      border: 1px solid gray;
    }
  }
}
</style>