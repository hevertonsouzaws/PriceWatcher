import { createRouter, createWebHistory } from 'vue-router'
import MonitorPage from '@/pages/MonitorPage.vue';
import ProfitCalculatorPage from '@/pages/ProfitCalculatorPage.vue';
import PanelPage from '@/pages/PanelPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'simulador',
      component: PanelPage,
    },
    {
      path: '/calculo',
      name: 'bitcoin',
      component: ProfitCalculatorPage,
    },
    {
      path: '/home',
      name: 'monitor',
      component: MonitorPage,
    },

  ],
});

export default router;
