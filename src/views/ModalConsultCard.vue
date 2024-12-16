<template>
  <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
    <template #title>
      <span class="modal-consult-ticket__title">Consultar cartão</span>
    </template>
    <template #body>
      <div class="modal-consult-ticket__items">
        <span class="modal-consult-ticket__text">
          
        </span>
            <w-input
                label="Chave do cartão"
                placeholder="Informe a chave do cartão"
                type="text"
                name="code"
                mask="XXX-XXX-XXX"
                v-model="code"
            >
            </w-input>
            
            <w-input
                label="PIN"
                placeholder="Informe o pin do cartão"
                type="password"
                name="pin"
                v-model="pin"
            >
            </w-input>
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
        code: '',
        pin: '',
    };
  },
  computed: {
    formValid() {
        return Boolean(this.code) && Boolean(this.pin);
    },
  },
  methods: {
    handleCloseModal() {
      this.$emit('close');
    },
    handleConsult() {
      this.$emit('consult', this.code, this.pin);
      this.$refs['wmodal'].handleClose();
    },
    
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

.modal__body {
  text-align: initial;

  .modal-consult-ticket__items {
    text-align: left;
  }
}
</style>