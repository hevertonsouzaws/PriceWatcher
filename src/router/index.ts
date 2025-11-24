import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/HomePage.vue';
import MonitorPage from '@/pages/MonitorPage.vue';
import ProfitCalculatorPage from '@/pages/ProfitCalculatorPage.vue';
import InvestmentScenarioPage from '@/pages/InvestmentScenarioPage.vue';

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
    {
      path: '/bitcoin',
      name: 'bitcoin',
      component: ProfitCalculatorPage,
    },
    {
      path: '/calculo',
      name: 'calculo',
      component: InvestmentScenarioPage,
    },
  ],
});

export default router;
