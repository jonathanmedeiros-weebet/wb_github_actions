<template>
  <div id="app">
    <RouterView />
    <WFooter />
  </div>
</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import WFooter from './components/layouts/Footer.vue'

export default {
  name: 'app',
  components: {
    RouterView,
    WFooter
  },
  props: {},
}
</script>