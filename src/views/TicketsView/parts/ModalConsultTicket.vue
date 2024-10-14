<template>
  <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
    <template #title>
      <span class="modal-consult-ticket__title">Consultar bilhete</span>
    </template>
    <template #body>
      <div class="modal-consult-ticket__items">
        <span class="modal-consult-ticket__text">
          Digite o código de aposta para realizar a consulta do bilhete
        </span>
        <w-input
          v-model="ticketCode"
          class="modal-consult-ticket__input"
          name="consult_ticket"
          placeholder="Ex.: EA5D-DG41"
          type="text"
          mask="XXXX-XXXX"
        />
        <w-button
          id="btn-salvar"
          text="Consultar"
          value="salvar"
          name="btn-salvar"
          @click="handleConsult"
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
  name: 'modal-consult-ticket',
  components: { WModal, WInput, WButton },
  data() {
    return {
      ticketCode: ''
    };
  },
  methods: {
    handleCloseModal() {
      
      this.$emit('close');
    },
    handleConsult() {
      this.$emit('consult', this.ticketCode);
      this.$refs['wmodal'].handleClose();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-consult-ticket {
  &__title {
    color: var(--foreground-header);
    font-size: 16px;
    font-weight: 500;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 20px;
  }

  &__text {
    color: var(--foreground-league-input);
    font-size: 14px;
  }
}


</style>