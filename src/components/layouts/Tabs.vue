<template>
    <div class="tabs">
        <RouterLink
            class="tabs__item"
            activeClass="tabs__item--actived"
            v-slot="{ isActive }"
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.route"
        >
            <component :is="tab.icon" :color="isActive ? '#0be58e' : '#ffffff80'"/>
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
      tabs: [
        {
          icon: IconHome,
          name: 'Home',
          route: '/home',
          actived: false
        },
        {
          icon: IconValidation,
          name: 'Validação',
          route: '/validation',
          actived: false
        },
        {
          icon: IconTicket,
          name: 'Bilhete',
          route: '/tickets',
          actived: false
        },
        {
          icon: IconArticle,
          name: 'Apostas',
          route: '/bets',
          actived: false
        },
        {
          icon: IconMenu,
          name: 'Menu',
          route: '/menu',
          actived: false
        }
      ]
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
    background: var(--color-background);

    &__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;

        height: 41px;
        color: var(--color-text-input);
        font-size: 12px;
        font-weight: 400;
        line-height: 14.06px;
        text-decoration: none;

        &--actived {
            color: var(--color-primary);
        }
    }
}
</style>