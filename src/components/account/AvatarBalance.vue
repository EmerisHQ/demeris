<template>
  <div class="avatar-balance" :class="{ 'avatar-balance--wallet': walletName }">
    <div class="avatar-balance__avatar">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="avatar-balance__avatar__gradient" v-html="getAvatar(keplrAccountName)"></div>
      <div class="avatar-balance__avatar__glow" v-html="getAvatar(keplrAccountName)" />
    </div>

    <div class="avatar-balance__details">
      <div class="avatar-balance__details__account-name -text-1" :class="{ 'font-bold leading-none': walletName }">
        {{ keplrAccountName }}
      </div>
      <div
        class="avatar-balance__details__value"
        :class="[walletName ? '-text-1 text-muted' : 'text-0 font-bold leading-none']"
      >
        <TotalPrice :balances="balances" />
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
    width: 2rem;
    height: 2rem;
    position: relative;

    &__gradient,
    &__glow {
      width: 2rem;
      height: 2rem;
      border-radius: 1rem;
      overflow: hidden;
    }
    &__gradient {
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
    &__glow {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.5;
      filter: blur(0.8rem);
      top: 12.5%;
    }
  }

  &__details {
    flex: 1;
    margin-left: 0.75rem;
    &__account-name {
      font-feature-settings: 'zero' on;
      margin-bottom: 0.1875rem;
    }
    &__value {
      display: flex;
    }
  }
}
.avatar-balance.avatar-balance--wallet {
  padding: 0.875rem 1.5rem;

  .avatar-balance__details {
    &__account-name {
      margin-bottom: 0.125rem;
    }
    .total-price {
      padding-right: 0.25em;
    }
  }
}
</style>
