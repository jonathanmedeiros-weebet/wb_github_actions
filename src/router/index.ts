import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import CloseBetView from '@/views/CloseBetView.vue'
import HomeView from '@/views/HomeView/HomeView.vue'
import ValidationDetailView from '@/views/ValidationDetailView.vue'
import ValidationView from '@/views/ValidationView.vue'
import TicketsView from '@/views/TicketsView/TicketsView.vue'
import BetsView from '@/views/BetsView/BetsView.vue'
import MenuView from '@/views/MenuView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import MovementsView from '@/views/MovementsView/MovementsView.vue'
import ReckoningView from '@/views/ReckoningView.vue'
import ResultsView from '@/views/ResultsView/ResultsView.vue'
import ConfigView from '@/views/ConfigView.vue'
import GameDetailView from '@/views/GameDetailView/GameDetailView.vue'
import { localStorageService } from "@/services";
import DashboardView from '@/views/DashboardView/DashboardView.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'root',
      component: LoginView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: {
        auth: true
      }
    },
    {
      path: '/validation-detail',
      name: 'validation-detail',
      component: ValidationDetailView,
      meta: {
        auth: true
      }
    },
    {
      path: '/validation',
      name: 'validation',
      component: ValidationView,
      meta: {
        auth: true
      }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsView,
      meta: {
        auth: true
      }
    },
    {
      path: '/close-bet/:id',
      name: 'close-bet',
      component: CloseBetView,
      meta: {
        auth: true
      },
      props: true
    },
    {
      path: '/bets',
      name: 'bets',
      component: BetsView,
      meta: {
        auth: true
      }
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView,
      meta: {
        auth: true
      }
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePasswordView,
      meta: {
        auth: true
      }
    },
    {
      path: '/movements',
      name: 'movements',
      component: MovementsView,
      meta: {
        auth: true
      }
    },
    {
      path: '/reckoning',
      name: 'reckoning',
      component: ReckoningView,
      meta: {
        auth: true
      }
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
      meta: {
        auth: true
      }
    },
    {
      path: '/game-detail',
      name: 'game-detail',
      component: GameDetailView,
      meta: {
        auth: true
      }
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
      meta: {
        auth: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        auth: true
      }
    },
  ]
})

router.beforeEach(async (to, from, next) => {

  const tokenIsValid = localStorageService.get('token');

  if (to.meta?.auth) {
    if (tokenIsValid) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else if ((to.name === 'login' || to.name === 'root') && tokenIsValid) {
    next({ name: 'home' });
  } else {
    next();
  }
})

export default router
