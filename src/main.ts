import './assets/scss/index.scss';
import 'tippy.js/dist/tippy.css';

import vueLib from '@starport/vue';
import { createApp } from 'vue';
import VueTippy from 'vue-tippy';

import App from './App.vue';
import router from './router';
import { store } from './store';

const app = createApp(App);
app.config.globalProperties._depsLoaded = true;
app
  .use(store)
  .use(router)
  .use(vueLib)
  .use(VueTippy)
  .mount('#app');
