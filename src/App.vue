<template>
  <div id="app">
    <SplashScreen v-if="showSplashScreen"/>
    <template v-else>
      <Toast />
      <RouterView />
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
    Toast
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
      document.head.appendChild(link);
  },
}
</script>
