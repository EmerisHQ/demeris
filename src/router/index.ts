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
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/Welcome.vue'),
  },
  {
    path: '/assets/:tab?',
    name: 'Assets',
    component: () => import('@/views/Assets.vue'),
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
    name: 'Pools',
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
    component: () => import('@/components/assets/AssetsTable/LPAsset.vue'),
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
    path: '/redeem',
    name: 'Redeem',
    component: () => import('@/views/Redeem.vue'),
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
