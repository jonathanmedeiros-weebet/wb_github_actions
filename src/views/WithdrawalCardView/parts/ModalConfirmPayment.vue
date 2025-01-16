<template>
  <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
    <template #title>
      <span class="modal-confirm-payment__title">Deseja confirmar o pagamento?</span>
    </template>
    <template #body>
      <div class="modal-confirm-payment__items">
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
          class="button--secondary-light"
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
  name: 'ModalConfirmPayment',
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
.modal-confirm-payment {
  &__title {
    color: #ffffff;
    color: var(--game-foreground);
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
    color: rgba(255, 255, 255, .5);
    color: rgba(var(--game-foreground-rgb), .5);
    font-size: 14px;
  }
}
.modal__body {
  text-align: initial;
}

.modal-confirm-payment__items {
  text-align: left;
}
</style>