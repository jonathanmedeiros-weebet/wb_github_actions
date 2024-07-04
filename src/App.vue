<template>
  <div id="app">
    <SplashScreen v-if="showSplashScreen"/>
    <template v-else>
      <RouterView />
      <WFooter />
    </template>
  </div>
</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import { useConfigClient } from './stores'
import SplashScreen from './components/SplashScreen.vue'
import WFooter from './components/layouts/Footer.vue'

export default {
  name: 'app',
  components: {
    RouterView,
    WFooter,
    SplashScreen
  },
  data() {
    return {
      configClientStore: useConfigClient()
    }
  },
  computed: {
    showSplashScreen() {
      return !this.configClientStore.readyForUse;
    }
  }
}
</script>