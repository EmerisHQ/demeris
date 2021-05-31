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
    path: '/assets/chains',
    name: 'Chains',
    component: () => import('@/views/Chains.vue'),
  },
  {
    path: '/send/:type?',
    name: 'Send',
    component: () => import('@/views/Send.vue'),
  },
  {
    path: '/receive',
    name: 'Receive',
    component: () => import('@/views/Receive.vue'),
  },
  {
    path: '/pools',
    name: 'Pool',
    component: () => import('@/views/Pools.vue'),
  },
  {
    path: '/playground',
    component: () => import('../views/Playground.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
