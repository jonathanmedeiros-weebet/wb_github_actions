<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-modalities__title">Selecione o status</span>
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
import { modalitiesBetList, modalityList } from '@/constants';

export default {
    name: 'modal-modalities',
    components: { WModal, IconCheck },
    props: {
        modalityId: {
            type: Number | String,
            default: 1
        },
        isLive: {
            type: Boolean,
            default: false
        },
        isBetsModality: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            options: [
            { id: 1, name: 'Aprovado', checked: this.modalityId === 1 },
            { id: 2, name: 'Não Aprovado', checked: this.modalityId === 2 }
        ]
    }
    },
    computed: {
        items() {
            if(this.isLive){
                return this.options.filter(option => Boolean(option.hasLive));
            }
            return this.options;
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(modalityId) {
            this.$refs['wmodal'].handleClose();
            this.$emit('click', modalityId);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-modalities {
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