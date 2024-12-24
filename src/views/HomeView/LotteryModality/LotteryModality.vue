<template>
    <div class="lottery">
      <!-- <LotterySkeleton /> -->
       
        <div class="lottery__header">
            <SelectFake
                @click="handleOpenLotteryType"
            >
                <span>{{ typeSelected }}</span>
            </SelectFake>

            <SelectFake
                @click="handleOpenLotteryNumbers"
            >
                <span>{{ sizeSelected }}</span>
            </SelectFake>
        </div>
          
        <div class="lottery__body">
            <span class="lottery__message">Escolha suas dezenas </span>

            <div class="lottery__options">
                <button
                    class="lottery__option"
                    :class="{
                        'lottery__option--selected': isSelected(option),
                        'lottery__option--disabled': isDisabled(option),
                    }"
                    v-for="option of options"
                    :key="option"
                    @click="handleSelected(option)"
                    :disabled="isDisabled(option)"
                >
                    {{ option }}
                </button>
            </div>

            <span class="lottery__info"> {{ tensInfo }} </span>

        </div>

        <div class="lottery__footer">

        </div>

        <SurpriseButton
            class="surprise-button"
            @click="handleSurprise"
        />

        <ModalLotteryNumbers
            v-if="showModalLotteryNumbers"
            @click="handleLotteryNumbers"
            @closeModal="handleCloseLotteryNumbers"
        />

        <ModalLotteryTypes
            v-if="showModalLotteryTypes"
            @click="handleLotteryType"
            @closeModal="handleCloseLotteryType"
        />
    </div>
</template>

<script>
import SelectFake from '../parts/SelectFake.vue';
import LotterySkeleton from './parts/LotterySkeleton.vue';
import SurpriseButton from './parts/SurpriseButton.vue';
import { LotteryTypes } from '@/enums';
import { useLotteryStore } from '@/stores';
import ModalLotteryNumbers from './parts/ModalLotteryNumbers.vue';
import ModalLotteryTypes from './parts/ModalLotteryTypes.vue';
import { random } from 'lodash';

export default {
    name: 'lottery-modality',
    components: {
        LotterySkeleton,
        SurpriseButton,
        SelectFake,
        ModalLotteryNumbers,
        ModalLotteryTypes
    },
    data() {
        return {
            title: 'Loteria Popular',
            loteryType: LotteryTypes.QUININHA,
            lotteryStore: useLotteryStore(),
            showModalLotteryNumbers: false,
            showModalLotteryTypes: false
        }
    },
    activated() {
        this.loadPage();
    },
    computed: {
        tensInfo() {
            return `${this.lotteryStore.tensSelected.length}/${this.lotteryStore.loteryNumbersSelected} Dezenas selecionadas`;
        },
        typeSelected() {
            const type = (this.lotteryStore.options.types ?? []).find(
                type => type.id == this.lotteryStore.lotteryTypeSelected
            );
            return type?.name ?? '';
        },
        sizeSelected() {
            const defaultNumbers = this.lotteryStore.lotteryTypeSelected == LotteryTypes.QUININHA ? 5 : 6;
            const numbers = this.lotteryStore.loteryNumbersSelected ?? defaultNumbers;
            return `${numbers} números`;
        },
        options() {
            return this.lotteryStore.lotteryTypeSelected == LotteryTypes.QUININHA ? 80 : 60;
        },
        reachedTotalTens() {
            return this.lotteryStore.tensSelected.length >= this.lotteryStore.loteryNumbersSelected;
        }
    },
    methods: {
        isSelected(number) {
            return this.lotteryStore.tensSelected.includes(number);
        },
        isDisabled(number) {
            return !this.isSelected(number) && this.reachedTotalTens;
        },
        loadPage() {
        },
        handleSurprise() {
            const max = this.lotteryStore.sizes;
            const endIndex = this.lotteryStore.loteryNumbersSelected;
            this.lotteryStore.removeAlltens();

            for (let index = 0; index < endIndex; index++) {
                let number = 0;

                do {
                    number = random(1, max);
                } while (number == 0 || this.isSelected(number))
                
                this.lotteryStore.addTens(number);
            }
        },

        handleSelected(number) {
            if(!this.isSelected(number)) {
                this.lotteryStore.addTens(number);
            } else {
                this.lotteryStore.removeTens(number);
            }
        },

        handleOpenLotteryType() {
            this.showModalLotteryTypes = true;
        },
        handleCloseLotteryType() {
            this.showModalLotteryTypes = false;
        },
        handleLotteryType(type) {
            if(this.lotteryStore.lotteryTypeSelected == type) return
            this.lotteryStore.setLotteryNumbersSelected(null);
            this.lotteryStore.setLotteryTypeSelected(type);
            this.lotteryStore.removeAlltens();
        },

        handleOpenLotteryNumbers() {
            this.showModalLotteryNumbers = true;
        },
        handleCloseLotteryNumbers() {
            this.showModalLotteryNumbers = false;
        },
        handleLotteryNumbers(numbers) {
            this.lotteryStore.setLotteryNumbersSelected(numbers);
        },
    }
}
</script>

<style lang="scss" scoped>
.lottery {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90vh;
    width: 100vw;
    overflow-y: auto;

    &__header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 18px 16px;
    }

    &__body {
        overflow-y: none;
        width: 100%;
        padding: 16px;
        padding-bottom: 150px;
        background: var(--header);
    }

    &__options {
        margin-top: 16px;
        margin-bottom: 16px;
        display: grid;
        grid-template-columns: repeat(5, auto);
        gap: 24px;
    }

    &__option {
        margin: auto;
        height: 46px;
        width: 46px;

        border: 0;
        border-radius: 50px;
        color: var(--foreground-inputs-odds);
        background: var(--inputs-odds);
    }

    &__option--selected {
        background: var(--highlight);
        color: var(--foreground-highlight);
    }

    &__option--disabled {
        opacity: 0.5;
    }
}

.surprise-button {
    position: absolute;
    right: 17px;
    top: 536px;
}

::v-deep .select-fake__title {
    font-size: 14px;
}
</style>
