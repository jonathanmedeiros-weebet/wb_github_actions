<template>
  <RouterView />
  <Footer />
</template>

<script lang="ts">
import { RouterView } from 'vue-router'
import Footer from './components/layouts/Footer.vue'

export default {
  name: 'app',
  components: {
    RouterView,
    Footer
  },
  props: {},
}
</script>