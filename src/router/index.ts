import VueRouter from 'vue-router'
import LoginView from '@/views/LoginView.vue'
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
import { LocalStorageKey, localStorageService, prepareConfigClient } from "@/services";
import DashboardView from '@/views/DashboardView/DashboardView.vue'
import CloseBetView from '@/views/CloseBetView/CloseBetView.vue'
import PopularLotteryView from '@/views/PopularLotteryView.vue'
import RechargeCardView from '@/views/RechargeCardView.vue'
import RechargeReceiptView from '@/views/RechargeReceiptView.vue'
import WithdrawalCardView from '@/views/WithdrawalCardView/WithdrawalCardView.vue'
import CardListView from '@/views/CardListView.vue'
import CreateCardView from '@/views/CreateCardView.vue'
import DetailedCardView from '@/views/DetailedCardView.vue'

const production = !import.meta.env.VITE_MODE_DEVELOPMENT;

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
      meta: {
        auth: production
      }
    },
    {
      path: '/validation-detail/:id',
      name: 'validation-detail',
      component: ValidationDetailView,
      meta: {
        auth: production
      },
      props: true
    },
    {
      path: '/validation',
      name: 'validation',
      component: ValidationView,
      meta: {
        auth: production
      }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsView,
      meta: {
        auth: production
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
        auth: production
      }
    },
    {
      path: '/menu',
      name: 'userMenu',
      component: MenuView,
      meta: {
        auth: production
      }
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePasswordView,
      meta: {
        auth: production
      }
    },
    {
      path: '/movements/:dateIni?/:dateEnd?',
      name: 'movements',
      component: MovementsView,
      meta: {
        auth: production
      },
      props: true
    },
    {
      path: '/reckoning',
      name: 'reckoning',
      component: ReckoningView,
      meta: {
        auth: production
      }
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
      meta: {
        auth: production
      }
    },
    {
      path: '/game-detail/:id',
      name: 'game-detail',
      component: GameDetailView,
      meta: {
        auth: production
      }
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigView,
      meta: {
        auth: production
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        auth: production
      }
    },
    {
      path: '/list-cards',
      name: 'list-cards',
      component: CardListView,
      meta: {
        auth: production
      }

    },
    {
      path: '/recharge-card',
      name: 'recharge-card',
      component: RechargeCardView,
      meta: {
        auth: production
      }
    },
    {
      path: '/recharge-receipt/:cardBet',
      name: 'recharge-receipt',
      component: RechargeReceiptView,
      meta: {
        auth: production
      },
      props: true
    },
    {
      path: '/withdrawal',
      name: 'withdrawal-card',
      component: WithdrawalCardView,
    },
    {
      path: '/create-card',
      name: 'create-card',
      component: CreateCardView,
      meta: {
        auth: production
      }
    },
    {
      path: '/detailed-card/:code/:pin',
      name: 'detailed-card',
      component: DetailedCardView,
      meta: {
        auth: production
      },
      props: true
    },
    {
      path: '/popular-lottery',
      name: 'popular-lottery',
      component: PopularLotteryView,
      meta: {
        auth: production
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const hasToken = localStorageService.get(LocalStorageKey.TOKEN);
  window.scrollTo(0,0);

  if(!Boolean(from.name)) {
    prepareConfigClient(to)
  }

  if (Boolean(to.meta?.auth)) {
    if (hasToken) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else if ((to.name === 'login') && hasToken) {
    next({ name: 'home' });
  } else {
    next();
  }
})

export default router
