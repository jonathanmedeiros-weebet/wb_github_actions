import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import ValidationView from '@/views/ValidationView.vue'
import TicketsView from '@/views/TicketsView.vue'
import BetsView from '@/views/BetsView.vue'
import MenuView from '@/views/MenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/validation',
      name: 'validation',
      component: ValidationView,
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsView,
    },
    {
      path: '/bets',
      name: 'bets',
      component: BetsView,
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView,
    },
  ]
})

export default router
