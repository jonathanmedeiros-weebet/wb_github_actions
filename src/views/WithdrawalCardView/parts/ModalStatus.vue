<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-status__title">Selecione o status</span>
      </template>

      <template #body>
        <div class="modal-status__items">
            <template v-for="(item, index) in items">
                <a
                    type="button"
                    class="modal-status__item"
                    :key="index"
                    @click="handleSelect(item.id)"
                >
                    {{ item.name }}
                    <IconCheck v-if="item.checked" class="modal-status__icon"/>
                </a>
            </template>
        </div>
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import IconCheck from '@/components/icons/IconCheck.vue'

export default {
    name: 'modal-status',
    components: { WModal, IconCheck },
    props: {
        statusId: {
            type: Number | String,
            default: 1
        }
    },
    data() {
        return {
            options: [
                { id: 1, name: 'Aprovado', checked: this.statusId === 1 },
                { id: 0, name: 'Não Aprovado', checked: this.statusId === 0 }
            ]
        }
    },
    computed: {
        items() {
            if(this.isStatus){
                return this.options.filter(option => Boolean(option.status));
            }
            return this.options;
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(statusId) {
            this.$refs['wmodal'].handleClose();
            this.$emit('click', statusId);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-status {
    &__title {
        color: #FFFFFF80;
        color: var(--foreground-league-input);
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
        color: var(--foreground-league);
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