<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-search-lottery-bet__title">Replicar aposta</span>
      </template>
      <template #body>
        <div class="modal-search-lottery-bet__items">
          <w-input
            v-model="ticketCode"
            class="modal-search-lottery-bet__input"
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
    name: 'modal-search-lottery-bet',
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
  .modal-search-lottery-bet {
    &__title {
      color: rgba(255, 255, 255, .5);
      color: rgba(var(--game-foreground-rgb), .5);
      font-size: 16px;
      font-weight: 500;
    }
  
    &__items {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-bottom: 20px;
    }
  }

  ::v-deep .input__group,
  ::v-deep .input__field {
    background-color: var(--background) !important;
    color: var(--foreground) !important;
  }
  </style>