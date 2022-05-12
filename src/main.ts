import './assets/scss/index.scss';
import 'tippy.js/dist/tippy.css';

import { BrowserTracing } from '@sentry/tracing';
import * as Sentry from '@sentry/vue';
import { Buffer } from 'buffer';
import mitt from 'mitt';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { VueCookieNext } from 'vue-cookie-next';
import VueGtag from 'vue-gtag';
import { createI18n } from 'vue-i18n';
import { createMetaManager } from 'vue-meta';
import VueTippy from 'vue-tippy';
import VueApexCharts from 'vue3-apexcharts';

import messages from '@/locales/en.json';

import App from './App.vue';
import router from './router';
import { store } from './store/setup';
import { featureRunning } from './utils/FeatureManager';

if (!window.Buffer) {
  window.Buffer = Buffer;
}

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

const messageRegex = /(Network Error)|(dynamically imported module)/;
if (featureRunning('SENTRY')) {
  Sentry.init({
    app,
    dsn: 'https://062027a7ae3c4e85b35fed27465f9615@o1152630.ingest.sentry.io/6232236',
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['app.emeris.com'],
      }),
    ],
    beforeSend(event) {
      if (messageRegex.test(event.message)) {
        window.alert(`A new version of the website was detected! The page will now refresh.`);
        window.location.reload();
      }
      return event;
    },

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE as string),

    // Changing the error sample rate requires re-deployment.
    // In addition, setting an SDK sample rate limits visibility into the source of events.
    // Setting a rate limit for your project (which only drops events when volume is high) may better suit your needs.
    sampleRate: parseFloat(import.meta.env.VITE_SENTRY_SAMPLE_RATE as string),
  });
}

app
  .use(i18n)
  .use(store)
  .use(router)
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
