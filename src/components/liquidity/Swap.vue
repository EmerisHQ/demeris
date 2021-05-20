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
      <div class="swap-widget-header__dot-button">
        <IconButton :name="'ThreeDotsIcon'" :shape="'flat'" :status="'normal'" />
      </div>
    </div>

    <!-- pay coin selector -->
    <DenomSelect />

    <!-- button-divider -->
    <div class="swap-widget__controller">
      <div class="swap-widget__controller-divider" />
      <div class="swap-widget__controller-wrapper">
        <IconButton
          :name="'UpsideDownIcon'"
          :shape="'circle'"
          :status="'normal'"
          :data="{
            type: 'custom',
            function: changePayToReceive,
          }"
        />
        <IconButton
          :name="'Max'"
          :shape="'text'"
          :status="'normal'"
          :data="{
            type: 'custom',
            function: setMax,
          }"
        />
      </div>
    </div>

    <!-- receive coin selector -->
    <DenomSelect />

    <!-- swap button -->
    <div class="button-wrapper">
      <Button :name="buttonName" :status="buttonStatus" :clickFunction="swap" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { actionHandler } from '@/utils/actionHandler';
import useButton from '@/setups/Button.vue';
import DenomSelect from '@/components/common/DenomSelect.vue';
import IconButton from '@/components/ui/IconButton.vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'Swap',
  components: {
    DenomSelect,
    IconButton,
    Button,
  },
  setup() {
    const { buttonFunction } = useButton();
    const buttonName = computed(() => 'Swap');
    const buttonStatus = computed(() => 'normal');

    function changePayToReceive() {
      alert('change Pay coin to Receive coin');
    }

    function setMax() {
      alert('setMax');
    }

    function swap() {
      const swapParams = {
        from: {
          denom: {
            denom: 'uatom',
            chain_name: 'cosmos',
          },
          amount: 2000000,
        },
        to: {
          denom: {
            denom: 'uluna',
            chain_name: 'terra',
          },
          amount: 2000000,
        },
      };

      buttonFunction({
        type: 'custom',
        function: () => {
          actionHandler({ name: 'swap', params: swapParams });
        },
      });
    }

    return { swap, buttonName, buttonStatus, changePayToReceive, setMax };
  },
});
</script>

<style lang="scss" scoped>
.swap-widget {
  width: 32rem;

  background-color: var(--surface);

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3rem 2.4rem;

    color: var(--text);
    /* &__dot-button {
      width: 2.4rem;
      height: 2.4rem;
    } */
  }

  &__controller {
    position: relative;
    display: flex;
    align-items: center;

    height: 3.6rem;

    &-divider {
      width: 100%;
      height: 1px;
      background-color: var(--border-trans);
    }

    &-wrapper {
      position: absolute;
      display: flex;
      justify-content: space-between;

      width: 100%;
      padding: 0 18px;
    }
  }

  .button-wrapper {
    padding: 1.6rem 2.4rem 2.4rem;
  }
}
</style>