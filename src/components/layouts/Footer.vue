<template>
  <footer class="footer">
    <Tabs v-if="showTabs" />
    <Copyright v-if="showCopyright" />
  </footer>
</template>

<script>
import Copyright from './Copyright.vue'
import Tabs from './Tabs.vue'

export default {
  name: 'w-footer',
  components: {
    Tabs,
    Copyright
  },
  data() {
    return {
      hideCopyrightWhenKeyboardWasDisplayed: true
    }
  },
  activated() {
    const userNameElement = document.getElementById('user_name');
    if(userNameElement) {
      userNameElement.addEventListener('focus', () => this.hideCopyrightWhenKeyboardWasDisplayed = true)
      userNameElement.addEventListener('blur', () => this.hideCopyrightWhenKeyboardWasDisplayed = false)
    }

    const userPasswordElement = document.getElementById('user_password');
    if(userPasswordElement) {
      userPasswordElement.addEventListener('focus', () => this.hideCopyrightWhenKeyboardWasDisplayed = true)
      userPasswordElement.addEventListener('blur', () => this.hideCopyrightWhenKeyboardWasDisplayed = false)
    }
  },
  computed: {
    showTabs() {
      return ![
        'login',
        'change-password',
        'game-detail',
        'config',
        'close-bet',
        'table',
        'detailed-card',
        'reckoning',
        'dashboard',
        'recharge-card',
        'create-card',
        'list-cards',
        'withdrawal-card',
        'movements',
        'results',
        'settings'
      ].includes(this.$route.name)
    },
    showCopyright() {
      return false;
      // return ['login'].includes(this.$route.name) && !this.hideCopyrightWhenKeyboardWasDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    z-index: 1;
    bottom: 0;
    position: fixed;
    width: 100%;
  }
</style>