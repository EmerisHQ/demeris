import './assets/scss/index.scss';
import 'tippy.js/dist/tippy.css';

import vueLib from '@starport/vue';
import mitt from 'mitt';
import { createApp } from 'vue';
import { VueCookieNext } from 'vue-cookie-next';
import VueGtag from 'vue-gtag';
import { createI18n } from 'vue-i18n';
import { createMetaManager } from 'vue-meta';
import VueTippy from 'vue-tippy';

import { messages } from '@/locales/en';

import App from './App.vue';
import router from './router';
import { store } from './store/setup';

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard',
      },
    },
  },
});
const emitter = mitt();

const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app.config.globalProperties._depsLoaded = true;
app
  .use(i18n)
  .use(store)
  .use(router)
  .use(vueLib)
  .use(VueTippy)
  .use(VueCookieNext)
  .use(createMetaManager())
  .use(VueGtag, {
    config: {
      id: 'UA-201374903-1',
      params: {
        anonymize_ip: true,
        send_page_view: false,
      },
    },
  })
  .mount('#app');

VueCookieNext.config({ expire: '180d', domain: '.emeris.com' });
