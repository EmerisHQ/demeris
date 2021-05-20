import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import DashBoard from '../views/DashBoard.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'DashBoard',
    component: DashBoard,
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
    component: () => import('../views/Pool.vue'),
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
