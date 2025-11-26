import { createRouter, createWebHistory } from 'vue-router'
import MonitorPage from '@/pages/MonitorPage.vue';
import ProfitCalculatorPage from '@/pages/ProfitCalculatorPage.vue';
import SimuladorView from '@/pages/SimuladorView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'monitor',
      component: MonitorPage,
    },
    {
      path: '/bitcoin',
      name: 'bitcoin',
      component: ProfitCalculatorPage,
    },
    {
      path: '/simulador',
      name: 'simulador',
      component: SimuladorView,
    },
  ],
});

export default router;
