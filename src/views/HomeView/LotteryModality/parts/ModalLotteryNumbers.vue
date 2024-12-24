<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-lottery-numbers__title">Selecione a quantidade</span>
      </template>

      <template #body>
        <div class="modal-lottery-numbers__items">
            <a
                v-for="({label, value, selected}) of numbers"
                type="button"
                class="modal-lottery-numbers__item"
                :class="{'modal-lottery-numbers__item--disabled': isDisabled(value)}"
                :key="value"
                @click="handleSelect(value)"
            >
                {{ label }}
                <IconCheck v-if="selected" class="modal-lottery-numbers__icon"/>
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
            const min = this.lotteryStore.minSize;
            const max = (this.lotteryStore.sizes - min) + 1;
            const sizeSelected = this.lotteryStore.loteryNumbersSelected;
            return Array.from({ length: max }, (_, i) => ({
                label: `${min + i}`,
                value: min + i,
                selected: sizeSelected == (min + i),
            }));
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(number) {
            if(this.isDisabled(number)) return
            this.$refs['wmodal'].handleClose();
            this.$emit('click', number);
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