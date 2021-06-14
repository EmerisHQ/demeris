import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Portfolio from '@/views/Portfolio.vue';

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
    path: '/asset/:denom',
    name: 'Asset',
    component: () => import('@/views/Asset.vue'),
  },
  {
    path: '/pool/:id?',
    name: 'Pool',
    component: () => import('@/views/Pool.vue'),
  },
  {
    path: '/pools/add/:id?',
    name: 'AddLiquidity',
    component: () => import('@/views/AddLiquidity.vue'),
  },
  {
    path: '/pools/withdraw/:id',
    name: 'WithdrawLiquidity',
    component: () => import('@/views/WithdrawLiquidity.vue'),
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
