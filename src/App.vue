<template>
  <div id="app" ref="appElement">
    <SplashScreen v-if="showSplashScreen"/>
    <template v-else>
      <Toast />
      <KeepAlive>
        <RouterView :key="$route.fullPath"/>
      </KeepAlive>
      <WFooter />
    </template>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import { useConfigClient } from './stores'
import SplashScreen from './components/SplashScreen.vue'
import WFooter from './components/layouts/Footer.vue'
import Toast from './components/Toast.vue'

export default {
  name: 'app',
  components: {
    RouterView,
    WFooter,
    SplashScreen,
    Toast,
  },
  data() {
    return {
      configClientStore: useConfigClient(),
    }
  },
  computed: {
    showSplashScreen() {
      return !this.configClientStore.readyForUse;
    },
  },
  mounted() {
    const clientName = this.configClientStore.name;
    const slugName = this.configClientStore.slug;
    const link = document.createElement('link');
    link.id = `${clientName}-css`;
    link.rel = 'stylesheet';
    const timestamp = Math.floor(Date.now() / 1000);
    link.href = `https://weebet.s3.amazonaws.com/${slugName}/param/agent-colors.css?v=${timestamp}`;
    document.head.appendChild(link);
  },
}
</script>

<style lang="scss" scoped>
#app {
  overflow: hidden;
}
</style>