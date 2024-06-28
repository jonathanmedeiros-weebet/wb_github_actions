<template>
  <div class="menu">
    <section class="menu__container">
    </section>
  </div>
</template>

<script>

export default {
  components: {},
  name: 'menu',
}
</script>


<style lang="scss" scoped>
.menu {
  color: #ffffff;
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 25px;

    margin: 0;
    padding: 0 20px;
    padding-top: 70px;
  }
}

</style>
