<template>
  <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
    <template #title>
      <span class="modal-consult-card__title">Consultar cartão</span>
    </template>
    <template #body>
      <div class="modal-consult-card__items">
        <w-input
          class="modal-consult-card__input"
          label="Chave do cartão"
          placeholder="Informe a chave do cartão"
          type="text"
          name="code"
          mask="XXX-XXX-XXX"
          v-model="code"
        >
        </w-input>

        <w-input
          class="modal-consult-card__input"
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
          :disabled="!formValid"
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
  name: ' modal-consult-card',
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
    },
  }
};
</script>

<style lang="scss" scoped>
.modal-consult-card {

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
    color: rgba(var(--game-foreground-rgb), 0.5);
    font-size: 14px;
  }

  &__input ::v-deep .input__group,
  &__input ::v-deep .input__field {
    background-color: var(--background) !important;
    color: var(--foreground) !important;
  }

  &__input ::v-deep .input__label {
    color: var(--game-foreground) !important;
  }

  &__input ::v-deep .input__group input::placeholder {
    color: var(--foreground) !important;
  }
}

.modal__body {
  text-align: initial;

  .modal-consult-card__items {
    text-align: left;
  }
}
</style>