<template>
  <div class="flex items-center" :class="{ 'py-3 px-6': walletName }">
    <div class="avatar relative w-8 h-8">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="absolute rounded-full overflow-hidden w-full h-full opacity-50 filter blur-md top-1"
        v-html="getAvatar(keplrAccountName)"
      />
      <div
        class="avatar__gradient relative rounded-full overflow-hidden w-full h-full"
        v-html="getAvatar(keplrAccountName)"
      ></div>
    </div>

    <div class="ml-3 flex-grow" :class="{ 'hidden sm:block': !walletName }">
      <div class="-text-1 slashed-zero" :class="[walletName ? 'font-bold mb-0.5' : 'leading-none mb-1']">
        {{ keplrAccountName }}
      </div>
      <div :class="[walletName ? '-text-1 text-muted' : 'text-0 font-medium leading-none']">
        <TotalPrice class="inline" :balances="balances" />
        <span v-if="walletName" class="ml-1">&middot; {{ walletName }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import MD5 from 'crypto-js/md5';
import avatar from 'gradient-avatar';
import { computed, defineComponent } from 'vue';

import TotalPrice from '@/components/common/TotalPrice.vue';
import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';

export default defineComponent({
  name: 'AvatarBalance',

  components: {
    TotalPrice,
  },
  props: {
    walletName: { type: String, required: false, default: '' },
  },

  setup() {
    const store = useStore();

    const { balances } = useAccount();

    const keplrAccountName = computed(() => {
      return store.getters['demeris/getKeplrAccountName'];
    });
    const keplrAddress = computed(() => {
      return store.getters['demeris/getKeplrAddress'];
    });

    return {
      balances,
      keplrAddress,
      keplrAccountName,
    };
  },
  methods: {
    getAvatar: function (name: string): string {
      return avatar(MD5(name) + '', 64);
    },
  },
});
</script>

<style lang="scss">
.avatar {
  &__gradient {
    &:before {
      content: '';
      display: block;
      background: url('../../assets/images/rectangle-avatar.png');
      background-size: 1.25rem;
      background-repeat: no-repeat;
      width: 1.25rem;
      height: 1.25rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -0.6125rem;
      margin-left: -0.6125rem;
    }
  }

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
