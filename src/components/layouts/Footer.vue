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
  name: 'home',
  components: {
    Tabs,
    Copyright
  },
  computed: {
    showTabs() {
      return !['/', '/login'].includes(this.$router.currentRoute.value.fullPath)
    },
    showCopyright() {
      return ['/', '/login'].includes(this.$router.currentRoute.value.fullPath)
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