import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/HomePage.vue';
import MonitorPage from '@/pages/MonitorPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/',
      name: 'monitor',
      component: MonitorPage,
    },
  ],
});

export default router;
