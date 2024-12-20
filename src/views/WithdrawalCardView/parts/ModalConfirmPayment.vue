<template>
  <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
    <template #title>
      <span class="modal-consult-ticket__title">Deseja confirmar o pagamento?</span>
    </template>
    <template #body>
      <div class="modal-consult-ticket__items">
        <w-button
          id="btn-confirmar"
          text="Confirmar pagamento"
          value="confirmar"
          name="btn-confirmar"
          @click="handleConsult"
        />
        <w-button
          id="btn-fechar"
          text="Fechar"
          value="fechar"
          class="button--secondary"
          name="btn-fechar"
          @click="handleCloseModal"
        />
      </div>
    </template>
  </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue';
import WButton from '@/components/Button.vue';

export default {
  name: 'ModalConsultCard',
  components: { WModal, WButton },
  props: {
    id: { type: [String, Number], required: true }, 
    version: { type: [String, Number], required: true }, 
  },
  methods: {
    handleCloseModal() {
      this.$emit('close');
    },
    handleConsult() {
      this.$emit('consult', this.id, this.version); 
    },
  },
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
.modal__body {
  text-align: initial;
  .modal-consult-ticket__items {
    text-align: left;
  }
}
</style>