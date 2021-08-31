<template>
  <div v-if="!consented" class="consent_banner">
    <div class="consent_banner__message text-muted -text-1 px-5 py-3 rounded-xl flex">
      <div class="consent_banner__message__text">
        {{ $t('components.cookieConsent.message') }}
        <a href="https://www.cookiesandyou.com/" target="_blank" rel="noopener">{{
          $t('components.cookieConsent.linkText')
        }}</a>
      </div>
      <div class="consent_banner__message__close ml-2" @click="acceptCookies">
        <Icon name="CloseIcon" :icon-size="1.25" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCookie } from 'vue-cookie-next';

import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'CookieConsent',
  components: { Icon },
  setup() {
    const { setCookie, getCookie } = useCookie();
    const consented = ref(getCookie('cookie-consent-accepted'));
    const acceptCookies = () => {
      setCookie('cookie-consent-accepted', 'true', { domain: '.emeris.com' });
      consented.value = 'true';
    };
    return { consented, acceptCookies };
  },
});
</script>

<style lang="scss" scoped>
.consent_banner {
  position: fixed;
  z-index: 1200;
  left: 50%;
  transform: translateX(-50%);
  margin: 0 auto;
  bottom: 10vh;
  text-align: center;

  &__message {
    background: black;
    color: white;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    a {
      color: var(--secondary);
    }
  }
}
</style>
