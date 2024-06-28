<template>
    <WModal :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-modalities__title">Selecione uma modalidade</span>
      </template>

      <template #body>
        <div class="modal-modalities__items">
            <template v-for="(item, index) in items">
                <a
                    type="button"
                    class="modal-modalities__item"
                    :key="index"
                    @click="handleSelect(item.id)"
                >
                    {{ item.name }}
                    <IconCheck v-if="item.checked" class="modal-modalities__icon"/>
                </a>
            </template>
        </div>
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import { modalityList } from '@/constants';

export default {
    name: 'modal-modalities',
    components: { WModal, IconCheck },
    props: {
        modalityId: {
            type: Number | String,
            default: 1
        }
    },
    data() {
        return {
            items: modalityList.map((modalitiy) => ({
                ...modalitiy,
                checked: modalitiy.id === this.modalityId
            }))
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(modalityId) {
            this.$emit('click', modalityId);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-modalities {
    &__title {
        color: #FFFFFF80;
        font-size: 16px;
        font-weight: 500;
    }

    &__items {
        padding: 0 20px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;

        color: var(--color-text);
        font-size: 16px;
        font-weight: 400;
    }

    &__item img {
        width: 18px;
        height: 18px;
    }

    &__icon {
        margin-bottom: 10px;
    }
}
</style>