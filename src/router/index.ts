import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView/HomeView.vue'
import ValidationView from '@/views/ValidationView.vue'
import TicketsView from '@/views/TicketsView.vue'
import BetsView from '@/views/BetsView.vue'
import MenuView from '@/views/MenuView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import MovementsView from '@/views/MovementsView.vue'

const router = new VueRouter({
  mode: 'history',
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
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePasswordView,
    },
    {
      path: '/movements',
      name: 'movements',
      component: MovementsView,
    },
  ]
})
export default router
