<template>
  <div class="splash-screen">
    <img class="splash-screen__image" :src="imageClient" alt="Logo do cliente">
    <SpinnerLoading />
  </div>
</template>

<script>
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import { useConfigClient } from "@/stores";

export default {
  components: { SpinnerLoading },
  name: 'splash-screen',

  computed: {
    imageClient(){
      const configClient =  useConfigClient();
      const slug = configClient.slug;
      return `https://weebet.s3.amazonaws.com/${slug}/logos/logo_banca.png`;
    }
  }
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
  
  &__image {
    margin-bottom: 40px;
    width: 102px;
    height: auto;
  }
}
</style>