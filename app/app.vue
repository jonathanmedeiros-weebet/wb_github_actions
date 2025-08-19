<template>
  <div class="wee-wrapper">
    <WNavbar />
    <NuxtPage />
    <WFooter class="wee-wrapper__footer" />
  </div>
</template>

<script lang="ts" setup>    
import { WNavbar, WFooter } from 'wee-ui-library';

</script>

<style scoped lang="scss">
.wee-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  &__footer {
    margin-top: auto;
  }
}
</style>
