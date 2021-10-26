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
    path: '/redeem',
    name: 'Redeem',
    component: () => import('@/views/Redeem.vue'),
  },
  {
    path: '/styles',
    component: () => import('../views/Styles.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'Portfolio' },
  },
  {
    path: '/stake/:denom',
    name: 'Stake',
    component: () => import('@/views/Stake.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // @ts-ignore
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        selector: to.hash,
      };
    } else {
      return { left: 0, top: 0 };
    }
  },
});

export default router;
