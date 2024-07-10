<template>
  <div class="tickets">
    <Header title="Validar Aposta" />
    <div class="modal-modalities__items">
      <span class="modal-modalities__text">
        Digite o código de aposta para realizar a validação
      </span>
      <WInput
        class="modal-modalities__input"
        name="consult_ticket"
        placeholder="Ex.: EA5D-DG41"
        type="email"
      />
      <WButton
        id="btn-salvar"
        text="Consultar"
        value="salvar"
        name="btn-salvar"
      />
    </div>
  </div>
</template>

<script>
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import Header from '@/components/layouts/Header.vue';

export default {
  name: 'Tickets',
  components: { Header, WInput, WButton }
}
</script>

<style lang="scss" scoped>
.modal-modalities {

  &__items {
    padding: 17.35px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__text {
    color: var(--color-text-input);
    font-size: 14px;
    text-align: center;
  }

}

::v-deep .input__group,
::v-deep .input__field {
    background-color: var(--color-background);
}
</style>
