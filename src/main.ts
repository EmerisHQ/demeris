import './assets/scss/index.scss';
import 'tippy.js/dist/tippy.css';

import { BrowserTracing } from '@sentry/tracing';
import * as Sentry from '@sentry/vue';
import vueLib from '@starport/vue';
import mitt from 'mitt';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { VueCookieNext } from 'vue-cookie-next';
import VueGtag from 'vue-gtag';
import { createI18n } from 'vue-i18n';
import { createMetaManager } from 'vue-meta';
import VueTippy from 'vue-tippy';
import VueApexCharts from 'vue3-apexcharts';

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
app.use(VueApexCharts);

Sentry.init({
  app,
  dsn: 'https://062027a7ae3c4e85b35fed27465f9615@o1152630.ingest.sentry.io/6232236',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'app.emeris.com', /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: parseFloat(process.env.VUE_APP_SENTRY_TRACES_SAMPLE_RATE),
});

app
  .use(i18n)
  .use(store)
  .use(router)
  .use(vueLib)
  .use(VueTippy)
  .use(VueCookieNext)
  .use(createMetaManager())
  .use(createPinia())
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
