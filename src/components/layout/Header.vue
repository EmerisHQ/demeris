<template>
  <header class="header">
    <router-link to="/" class="header__logo">
      <Logo />
    </router-link>

    <Navbar />

    <div class="space"></div>
    <div class="header__wallet">
      <router-link v-if="redeemableBalances.length > 0" :to="{ name: 'Redeem' }">
        <IconButton v-tippy :content="tip" name="RedeemIcon" status="circle" :show-badge="showBadge" />
      </router-link>

      <router-link class="header__wallet-button" to="/receive">
        <div class="header__wallet-button__icon">
          <ReceiveIcon />
        </div>
        {{ $t('navbar.receive') }}
      </router-link>

      <router-link class="header__wallet-button" to="/send">
        <div class="header__wallet-button__icon">
          <SendIcon />
        </div>
        {{ $t('navbar.send') }}
      </router-link>

      <Settings />
    </div>
  </header>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import Logo from '@/components/common/Logo.vue';
import Settings from '@/components/common/Settings.vue';
import Navbar from '@/components/layout/Navbar.vue';
import useAccount from '@/composables/useAccount';
import { useStore } from '@/store';

import ReceiveIcon from '../common/Icons/ReceiveIcon.vue';
import SendIcon from '../common/Icons/SendIcon.vue';
import IconButton from '../ui/IconButton.vue';
export default defineComponent({
  name: 'Header',
  components: {
    Logo,
    Navbar,
    ReceiveIcon,
    SendIcon,
    Settings,
    IconButton,
  },
  setup() {
    const { redeemableBalances } = useAccount();
    const store = useStore();
    let tip = computed(() => {
      return redeemableBalances.value.length == 1
        ? (tip = 'You have 1 asset to redeem')
        : (tip = 'You have ' + redeemableBalances.value.length + ' assets to redeem');
    });
    const showBadge = computed(() => {
      return store.getters['demeris/hasSeenReedem'] ? false : true;
    });
    return { redeemableBalances, tip, showBadge };
  },
});
</script>

<style scoped lang="scss">
.space {
  flex: 1;
}

.header {
  padding: 0 2rem;
  display: flex;
  height: 5rem;
  align-items: center;
  justify-content: space-between;

  &__wallet {
    display: flex;
    align-items: center;

    &-button {
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 1rem;
      line-height: 3rem;

      &__icon {
        margin-right: 0.625rem;
      }
    }

    &__account {
      &-name {
        margin-bottom: 4px;

        font-size: 15px;
        font-weight: 500;
      }

      &-value {
        font-size: 12px;
      }
    }
  }

  &__settings-menu {
    margin: 0 1rem 0 0.625rem;
  }
}
</style>
