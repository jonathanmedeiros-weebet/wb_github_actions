<template>
  <WModal :backdropClick="true" @close="handleCloseModal">
    <template #title>
      <span class="modal-modalities__title">Consultar bilhete</span>
    </template>
    <template #body>
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
  </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue';
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';

export default {
  name: 'ModalConsultTicket',
  components: { WModal, WInput, WButton },
  methods: {
    handleCloseModal() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-modalities {
  &__title {
    color: var(--color-text);
    font-size: 16px;
    font-weight: 500;
  }

  &__items {
    padding: 17.358px 24px 38.5px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__text {
    color: var(--color-text-input);
    font-size: 14px;
  }

}

::v-deep .input__group,
::v-deep .input__field{
    background-color: var(--color-background);
}
</style>