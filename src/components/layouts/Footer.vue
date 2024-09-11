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
      hideCopyrightWhenKeyboardWasDisplayed: false
    }
  },
  mounted() {
    document.getElementById('user_name').addEventListener('focus', () => this.hideCopyrightWhenKeyboardWasDisplayed = true)
    document.getElementById('user_name').addEventListener('blur', () => this.hideCopyrightWhenKeyboardWasDisplayed = false)

    document.getElementById('user_password').addEventListener('focus', () => this.hideCopyrightWhenKeyboardWasDisplayed = true)
    document.getElementById('user_password').addEventListener('blur', () => this.hideCopyrightWhenKeyboardWasDisplayed = false)
  },
  computed: {
    showTabs() {
      return ![
        'login',
        'change-password',
        'game-detail',
        'config',
        'close-bet'
      ].includes(this.$route.name)
    },
    showCopyright() {
      return ['login'].includes(this.$route.name) && !this.hideCopyrightWhenKeyboardWasDisplayed
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    bottom: 0;
    position: fixed;
    width: 100%;
  }
</style>