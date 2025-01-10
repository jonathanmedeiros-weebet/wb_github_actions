<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-lottery-numbers__title">Selecione o tipo</span>
      </template>

      <template #body>
        <div class="modal-lottery-numbers__items">
            <a
                v-for="({name, id, selected}) of types"
                type="button"
                class="modal-lottery-numbers__item"
                :key="id"
                @click="handleSelect(id)"
            >
                {{ name }}
                <IconCheck v-if="selected" class="modal-lottery-numbers__icon"/>
            </a>
        </div>
      </template>
    </WModal>
</template>

<script>
import IconCheck from '@/components/icons/IconCheck.vue';
import WModal from '@/components/Modal.vue'
import { lotteryTypeList } from '@/constants';
import { useLotteryStore } from '@/stores';

export default {
    name: 'modal-lottery-types',
    components: {
        WModal,
        IconCheck
    },
    data() {
        return {
            lotteryStore: useLotteryStore()
        }
    },
    computed: {
        types() {
            let types = lotteryTypeList();
            return types.map((type) => ({
                ...type,
                selected: this.lotteryStore.lotteryTypeSelected == type.id
            }))
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(item) {
            this.$refs['wmodal'].handleClose();
            this.$emit('click', item);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-lottery-numbers {
    &__title {
        color: rgba(255, 255, 255, .5);
        color: rgba(var(--game-foreground-rgb), .5);
        font-size: 16px;
        font-weight: 500;
        min-height: 26px;
    }

    &__items {
        padding: 0 0 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        overflow-y: auto;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 30px;

        color: #ffffff;
        color: var(--game-foreground);
        font-size: 16px;
        font-weight: 400;
        text-align: left;

        margin-top: 10px;
        margin-bottom: 10px;
    }

    &__icon {
        margin-bottom: 10px;
        margin-left: 10px;
    }
}
</style>