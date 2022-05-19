import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { featureRunning } from '@/utils/FeatureManager';
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
    component: () => import('../views/Welcome.vue'),
    props: true,
  },
  {
    path: '/assets/:tab?',
    name: 'Assets',
    component: () => import('../views/Assets.vue'),
  },
  {
    path: '/send/:type?',
    name: 'Send',
    component: () => import('../views/Send.vue'),
  },
  {
    path: '/receive',
    name: 'Receive',
    component: () => import('../views/Receive.vue'),
  },
  {
    path: '/pools',
    name: 'Pools',
    component: () => import('../views/Pools.vue'),
  },
  {
    path: '/airdrop/:airdrop',
    name: 'Airdrop',
    component: () => import('../views/Airdrop.vue'),
  },
  {
    path: '/asset/:denom',
    name: 'Asset',
    component: () => import('../views/Asset.vue'),
  },
  {
    path: '/pool/:id?',
    name: 'Pool',
    component: () => import('../views/Pool.vue'),
  },
  {
    path: '/pools/add/:id?',
    name: 'AddLiquidity',
    component: () => import('../views/AddLiquidity.vue'),
  },
  {
    path: '/pools/withdraw/:id',
    name: 'WithdrawLiquidity',
    component: () => import('../views/WithdrawLiquidity.vue'),
  },
  {
    path: '/redeem',
    name: 'Redeem',
    component: () => import('../views/Redeem.vue'),
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
    path: '/playground',
    component: () => import('../views/Playground.vue'),
  },
];
if (featureRunning('STAKING')) {
  routes.push({
    path: '/staking/:denom/:action/:validator?',
    name: 'Staking',
    component: () => import('../views/Staking.vue'),
  });
}
if (featureRunning('STAKING_PORTFOLIO')) {
  routes.push({
    path: '/staking/stake-asset',
    name: 'Stake Asset',
    component: () => import('../views/StakeAsset.vue'),
  });
}
if (featureRunning('AIRDROPS_FEATURE')) {
  routes.push({
    path: '/airdrops',
    name: 'Airdrops',
    component: () => import('../views/Airdrops.vue'),
  });
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
