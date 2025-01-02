<template>
  <div class="tabs">
    <RouterLink
      class="tabs__item"
      active-class="tabs__item--actived"
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.route"
    >
      <component
        :is="tab.icon"
        :color="tab.actived ? useHexColors : 'var(--foreground-bottom-bar)'"
        :count="itemCount"
      />
      {{ tab.name }} 
    </RouterLink>
  </div>
</template>


<script>
import { RouterLink } from 'vue-router'
import IconArticle from '../icons/IconArticle.vue'
import IconHome from '../icons/IconHome.vue'
import IconMenu from '../icons/IconMenu.vue'
import IconTicket from '../icons/IconTicket.vue'
import IconValidation from '../icons/IconValidation.vue'
import { useTicketStore } from '@/stores'
import { isAndroid5 } from '@/utilities'

export default {
  name: 'w-tabs',
  components: {
    RouterLink,
    IconHome,
    IconValidation,
    IconTicket,
    IconArticle,
    IconMenu
  },
  data() {
    return {
      ticketStore: useTicketStore()
    }
  },
  computed: {
    tabs() {
      return [
        {
          icon: IconHome,
          name: 'Home',
          route: '/home',
          actived: this.verifyIfRouteIsActived('/home')        },
        {
          icon: IconValidation,
          name: 'Validação',
          route: '/validation',
          actived: this.verifyIfRouteIsActived('/validation')
        },
        {
          icon: IconTicket,
          name: 'Bilhete',
          route: '/tickets',
          actived: this.verifyIfRouteIsActived('/tickets')
        },
        {
          icon: IconArticle,
          name: 'Apostas',
          route: '/bets',
          actived: this.verifyIfRouteIsActived('/bets')
        },
        {
          icon: IconMenu,
          name: 'Menu',
          route: '/menu',
          actived: this.verifyIfRouteIsActived('/menu')
        }
      ]
    },
    itemCount() {
      return Object.keys(this.ticketStore.items).length;
    },
    useHexColors() {
      return isAndroid5() ? '#35cd96' : 'var(--highlight)';
    }
  },
  methods: {
    verifyIfRouteIsActived(routerName) {
      return this.$route.path === routerName;
    }
  }
}
</script>


<style lang="scss" scoped>
.tabs {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #FFFFFF1A;
  background: #282828;
  background: var(--bottom-bar);

  &__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    height: 41px;
    color: #ffffff;
    color: var(--foreground-bottom-bar);
    font-size: 12px;
    font-weight: 400;
    line-height: 14.06px;
    text-decoration: none;

    &--actived {
      color: #35cd96;
      color: var(--highlight);
    }
  }
}
</style>