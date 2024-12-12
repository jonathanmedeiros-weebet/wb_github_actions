<template>
  <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
    <template #title>
      <span class="modal-shared-options__title">Como deseja compartilhar?</span>
    </template>
    <template #body>
      <div class="modal-shared-options__items">
        <w-button
          text="Link"
          color="secondary-light"
          @click="handleShared('link')"
        />
        <w-button
          text="Imagem"
          color="secondary-light"
          @click="handleShared('image')"
        />
      </div>
    </template>
  </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue';
import WButton from '@/components/Button.vue';

export default {
  name: 'modal-shared-options',
  components: { WModal, WButton },
  methods: {
    handleCloseModal() {
      this.$emit('close');
    },
    handleShared(type) {
      this.$emit('click', type);
      this.$refs['wmodal'].handleClose();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-shared-options {
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