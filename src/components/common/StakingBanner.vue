<template>
  <router-link
    class="staking-banner shadow-card w-full flex flex-col items-stretch p-6 relative rounded-2xl bg-cover transform hover:-translate-y-px active:transform-none active:opacity-70 transition text-text"
    to="/staking/uatom/stake"
  >
    <h5 class="font-medium text-1">{{ $t('components.stakingBanner.title') }}</h5>
    <p class="staking-banner__text -text-1 leading-5 mt-3 text-muted">
      {{ $t('components.stakingBanner.text') }}
      <span class="text-text"> {{ apy }}% {{ $t('components.stakingBanner.textAPY') }} </span>
    </p>
    <p className="mt-3 ">{{ $t('components.stakingBanner.cta') }}</p>
    <img :src="require(`@/assets/images/stake-panel.png`)" class="right-0 absolute top-0" />
  </router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    return {
      apy: '13.49',
    };
  },
});
</script>
<style lang="scss">
.staking-banner {
  background: #171717;
  height: 160px;
  &__text {
    width: 189px;
  }
}
</style>
