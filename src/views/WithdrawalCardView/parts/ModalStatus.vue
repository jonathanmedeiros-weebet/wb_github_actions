<template>
  <WModal ref="wmodal" :backdropClick="true" @close="closeModal">
    <template #title>
      <span class="modal-status__title">Selecione o status</span>
    </template>

    <template #body>
      <div class="modal-status__items">
        <a
          v-for="item in filteredItems"
          :key="item.id"
          class="modal-status__item"
          @click="selectStatus(item.id)"
        >
          {{ item.name }}
          <IconCheck v-if="item.checked" class="modal-status__icon" />
        </a>
      </div>
    </template>
  </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue';
import IconCheck from '@/components/icons/IconCheck.vue';

export default {
  name: 'modal-status',
  components: { WModal, IconCheck },
  props: {
    statusId: {
      type: [Number],
      default: 1
    }
  },
  computed: {
    filteredItems() {
        const options = [
            { id: 1, name: 'Aprovado', checked: this.statusId === 1 },
            { id: 0, name: 'Não Aprovado', checked: this.statusId === 0 }
        ];
        return options.filter(option => option.id !== undefined); 
    }
  },
  methods: {
    closeModal() {
        this.$emit('closeModal');
    },
    selectStatus(statusId) {
        this.$refs.wmodal.handleClose();
        this.$emit('click', statusId);
    }
  }
};
</script>


<style lang="scss" scoped>
.modal-status {
    &__title {
        color: #FFFFFF80;
        color: var(--foreground-inputs-odds);
        font-size: 16px;
        font-weight: 500;
    }

    &__items {
        padding: 0 20px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 30px;
        margin-top: 20px;
        color: #ffffff;
        color: var(--foreground-header);
        font-size: 16px;
        font-weight: 400;
    }

    &__item img {
        width: 18px;
        height: 18px;
        margin-left: 10px;
    }

    &__icon {
        margin-bottom: 10px;
        margin-left: 10px;
    }
}
</style>