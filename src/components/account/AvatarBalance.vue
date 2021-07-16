<template>
  <div class="avatar-balance" :class="{ 'avatar-balance--wallet': walletName }">
    <div class="avatar-balance__avatar">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="avatar-balance__avatar__gradient" v-html="getAvatar(keplrAccountName)"></div>
      <div class="avatar-balance__avatar__glow" />
    </div>

    <div class="avatar-balance__details">
      <div class="avatar-balance__details__account-name">{{ keplrAccountName }}</div>
      <div class="avatar-balance__details__value">
        <TotalPrice :balances="balances" variant="none" />
        <span v-if="walletName">&middot; {{ walletName }}</span>
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
.avatar-balance {
  display: flex;

  &__avatar {
    width: 3.2rem;
    height: 3.2rem;

    &__gradient {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 1.6rem;
      overflow: hidden;
      z-index: 1;
      position: relative;

      &:before {
        content: '';
        display: block;
        background: url(../../assets/images/rectangle-avatar.png);
        background-size: 20px;
        background-repeat: no-repeat;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -10px;
        margin-left: -10px;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  &__details {
    flex: 1;
    margin-left: 1.2rem;
    &__account-name {
      font-size: 1.3rem;
      line-height: 100%;
      font-feature-settings: 'zero' on;
      margin-bottom: 0.3rem;
    }
    &__value {
      font-size: 1.6rem;
      line-height: 100%;
      font-weight: bold;
      display: flex;
    }
  }
}
.avatar-balance.avatar-balance--wallet {
  padding: 1.4rem 2.4rem;

  .avatar-balance__details {
    &__account-name {
      font-size: 1.3rem;
      font-weight: 600;
      line-height: 1.5rem;
      margin-bottom: 0.2rem;
    }
    &__value {
      font-size: 1.3rem;
      font-weight: 400;
      color: var(--muted);
      line-height: 1.5rem;
    }
    .total-price {
      padding-right: 0.25em;
    }
  }
}
</style>
