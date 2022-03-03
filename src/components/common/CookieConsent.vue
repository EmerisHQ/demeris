<template>
  <div v-if="!consented" class="consent_banner fixed left-8 bottom-8 center mx-auto">
    <div
      class="consent_banner__inner bg-surface dark:border border-border text-muted -text-1 rounded-xl flex items-center"
    >
      <div class="px-5 py-3 border-r border-border">
        {{ $t('components.cookieConsent.message') }}
        <a class="text-link" href="https://emeris.com/privacy" target="_blank" rel="noopener">{{
          $t('components.cookieConsent.linkText')
        }}</a>
      </div>
      <Button
        variant="link"
        size="sm"
        class="mx-5 text-link"
        :full-width="false"
        :click-function="acceptCookies"
        :name="$t('components.cookieConsent.acceptText')"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useCookie } from 'vue-cookie-next'

import Button from '@/components/ui/Button.vue'

export default defineComponent({
  name: 'CookieConsent',
  components: { Button },
  setup() {
    const { setCookie, getCookie } = useCookie()
    const consented = ref(getCookie('cookie-consent-accepted'))
    const acceptCookies = () => {
      setCookie('cookie-consent-accepted', 'true', { domain: '.emeris.com' })
      consented.value = 'true'
    }
    return { consented, acceptCookies }
  },
})
</script>

<style lang="scss" scoped>
.consent_banner {
  z-index: 1200;
}

.consent_banner__inner {
  box-shadow: -8px 24px 48px rgba(0, 0, 0, 0.2);
  .dark & {
    box-shadow: -8px 24px 48px rgba(0, 0, 0, 0.6);
  }
}
</style>
