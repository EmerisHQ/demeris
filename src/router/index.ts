import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Portfolio from '../views/Portfolio.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Portfolio',
    component: Portfolio,
    meta: {
      layout: 'DefaultLayout',
    },
  },
  {
    path: '/assets',
    name: 'Assets',
    component: () => import('@/views/Assets.vue'),
  },
  {
    path: '/pool',
    name: 'Pool',
    component: () => import('@/views/Pools.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
