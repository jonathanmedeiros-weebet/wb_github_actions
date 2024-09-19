<template>
    <div class="copyright">
      <a class="copyright__item" target="_blank">Política de privacidade</a>
      <span class="copyright__item">©Copyright2024</span>
    </div>
</template>

<script>
export default {
  name: 'w-copyright',
}
</script>

<style lang="scss" scoped>
  .copyright {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 110px;
    padding: 24px;
    
    &__item {
      font-size: 12px;
      font-weight: 400;
      line-height: 14.09px;
      text-align: left;
      text-decoration: none;
      color: #FFFFFF;
      color: var(--foreground-league);
    }
  }
</style>