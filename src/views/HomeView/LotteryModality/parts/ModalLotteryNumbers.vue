<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-lottery-numbers__title">Selecione a quantidade</span>
      </template>

      <template #body>
        <div class="modal-lottery-numbers__items">
            <a
                v-for="number of numbers"
                type="button"
                class="modal-lottery-numbers__item"
                :class="{'modal-lottery-numbers__item--disabled': isDisabled(number.value)}"
                :key="number.value"
                @click="handleSelect(number)"
            >
                {{ number.label }}
                <IconCheck v-if="number.selected" class="modal-lottery-numbers__icon"/>
            </a>
        </div>
      </template>
    </WModal>
</template>

<script>
import IconCheck from '@/components/icons/IconCheck.vue';
import WModal from '@/components/Modal.vue'
import { useLotteryStore } from '@/stores';

export default {
    name: 'modal-lottery-numbers',
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
        numbers() {
            const sizeSelected = this.lotteryStore.loteryNumbersSelected;
            return this.lotteryStore.options.sizes.map((size) => ({
                ...size,
                label: size.qtdNumeros,
                value: size.qtdNumeros,
                selected: sizeSelected == size.qtdNumeros
            }))
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(item) {
            if(this.isDisabled(item.value)) return
            this.$refs['wmodal'].handleClose();
            this.$emit('click', item);
        },
        isDisabled(number) {
            const tensSelected = this.lotteryStore.tensSelected.length;
            return Number(number) <= Number(tensSelected);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-lottery-numbers {
    &__title {
        color: #FFFFFF80;
        color: var(--foreground-inputs-odds);
        font-size: 16px;
        font-weight: 500;
        min-height: 26px;
    }

    &__items {
        padding: 0 0 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: calc(80vh - 56px);
        overflow-y: auto;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 30px;

        color: #ffffff;
        color: var(--foreground-inputs-odds);
        font-size: 16px;
        font-weight: 400;
        text-align: left;

        margin-top: 10px;
        margin-bottom: 10px;

        &--disabled {
            opacity: 0.5;
        }
    }

    &__icon {
        margin-bottom: 10px;
        margin-left: 10px;
    }
}
</style>