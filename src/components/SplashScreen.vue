<template>
  <div class="splash-screen">
    <img class="splash-screen__image" src="@/assets/images/weebet_logo_verde_lg.png">
    <SpinnerLoading />
  </div>
</template>

<script>
import SpinnerLoading from '@/components/SpinnerLoading.vue'

export default {
  components: { SpinnerLoading },
  name: 'splash-screen',
}
</script>

<style lang="scss" scoped>
.splash-screen {
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
}
</style>