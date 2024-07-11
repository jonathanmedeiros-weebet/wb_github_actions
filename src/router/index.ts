import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView/HomeView.vue'
import ValidationView from '@/views/ValidationView.vue'
import TicketsView from '@/views/TicketsView.vue'
import BetsView from '@/views/BetsView/BetsView.vue'
import MenuView from '@/views/MenuView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import MovementsView from '@/views/MovementsView/MovementsView.vue'
import ReckoningView from '@/views/ReckoningView.vue'
import TicketView from '@/views/TicketView/TicketView.vue'
import ResultsView from '@/views/ResultsView/ResultsView.vue'
import ConfigView from '@/views/ConfigView.vue'
import GameDetailView from '@/views/GameDetailView/GameDetailView.vue'
import DashboardView from '@/views/DashboardView/DashboardView.vue'

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
    {
      path: '/reckoning',
      name: 'reckoning',
      component: ReckoningView,
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: TicketView,
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
    },
    {
      path: '/game-detail',
      name: 'game-detail',
      component: GameDetailView,
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
  ]
})
export default router
