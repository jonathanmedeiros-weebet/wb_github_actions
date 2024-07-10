<template>
  <div class="tickets">
    <Header title="Bilhetes" />
  </div>
  
  <div class="modal-modalities__items">
    <span class="modal-modalities__text">
      Digite o código de aposta para realizar a consulta do bilhete
    </span>
    <w-input
      class="modal-modalities__input"
      name="consult_ticket"
      placeholder="Ex.: EA5D-DG41"
      type="email"
    />
    <w-button
      id="btn-salvar"
      text="Consultar"
      value="salvar"
      name="btn-salvar"
    />
  </div>
  
</template>

<script>
import Header from '@/components/layouts/Header.vue'

export default {
  name: 'tickets',
  components: { Header }
}
</script>

<style lang="scss" scoped>
</style>