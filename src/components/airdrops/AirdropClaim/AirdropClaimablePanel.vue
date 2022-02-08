<template>
  <div class="wrapper w-full relative">
    <div class="bg-bg rounded-2xl pb-6 shadow-card">
      <!-- Claim Header -->
      <div>
        <img
          src="~@/assets/images/airdrop-claimable-header-light.png"
          alt="Airdrop Claimable Header"
          class="rounded-t-2xl"
        />
        <!-- <img
          v-if="activeFilter === 'all'"
          src="~@/assets/images/airdrop-claimable-header-dark.png"
          alt="Airdrop Claimable Header"
          class="rounded-t-2xl"
        /> -->
      </div>

      <!-- Has Airdrop amount -->
      <div class="px-6 mb-6">
        <p class="-text-1 text-muted mb-2">Congratulations!</p>
        <p class="text-2 font-medium">You have 4 Airdrops to claim</p>
      </div>

      <!-- Claim button -->
      <div class="px-6">
        <Button name="Show eligible Airdrop" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, toRaw } from 'vue';
import { useStore } from 'vuex';

import Button from '@/components/ui/Button.vue';
import useTheme from '@/composables/useTheme';
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';

export default defineComponent({
  name: 'AirdropClaimablePanel',
  components: {
    Button,
  },
  props: {
    activeFilter: {
      type: String,
      default: 'all',
    },
  },

  setup() {
    const theme = useTheme();
    const apistore = useStore() as TypedAPIStore;

    const selectedAirdrop = computed(() => {
      return toRaw(apistore.getters[GlobalDemerisGetterTypes.API.getSelectedAirdrop]);
    });

    const buttonText = computed(() => {
      return '';
    });

    const titleText = computed(() => {
      return '';
    });

    return {
      theme,
      selectedAirdrop,
      buttonText,
      titleText,
    };
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  min-width: 20rem;
  /* min-height: 17rem; */
}
</style>
