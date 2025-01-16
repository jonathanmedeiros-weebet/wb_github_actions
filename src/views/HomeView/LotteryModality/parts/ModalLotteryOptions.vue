<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-lottery-options__title">Selecione o sorteio</span>
      </template>

      <template #body>
        <div class="modal-lottery-options__items">
            <a
                v-for="({label, id, selected}) of options"
                type="button"
                class="modal-lottery-options__item"
                :key="id"
                @click="handleSelect(id)"
            >
                {{ label }}
                <IconCheck v-if="selected" class="modal-lottery-options__icon"/>
            </a>
        </div>
      </template>
    </WModal>
</template>

<script>
import IconCheck from '@/components/icons/IconCheck.vue';
import WModal from '@/components/Modal.vue'

export default {
    name: 'modal-lottery-options',
    components: {
        WModal,
        IconCheck
    },
    props: {
        lotteryList: {
            type: Array,
            required: true
        },
        lotterySelected: {
            type: String | Number,
            required: true
        }
    },
    computed: {
        options() {
            const options = [...this.lotteryList];
            return options.map((option) => ({
                id: option.id,
                label: option.nome,
                selected: this.lotterySelected == option.id
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
.modal-lottery-options {
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
        fill: #ffffff;
        fill: var(--game-foreground);
    }
}
</style>