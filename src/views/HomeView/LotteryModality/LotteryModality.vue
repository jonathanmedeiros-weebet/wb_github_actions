<template>
    <div class="lottery" ref="lotteryScroll">
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

            <div class="lottery__items">
                <button
                    v-for="item of items"
                    :key="item"
                    class="lottery__item"
                    :class="{
                        'lottery__item--selected': isSelected(item),
                        'lottery__item--disabled': isDisabled(item),
                    }"
                    @click="handleSelected(item)"
                    :disabled="isDisabled(item)"
                >
                    {{ item }}
                </button>
            </div>
            <span class="lottery__info"> {{ tensInfo }} </span>
        </div>

        <div class="lottery__footer" ref="footer">
            <div class="lottery__options">
                <span class="lottery__options-label"> Sorteio </span>
                <SelectFake
                    class="lottery__options-select"
                    @click="handleOpenLotteryOptions"
                >
                    <span>{{ optionSelected }}</span>
                </SelectFake>
            </div>

            <div class="lottery__values value">
                <span class="value__balance-text">Valor do palpite</span>
                <div class="value__balance">
                    <button class="value__add" @click="handleLotteryValueClick(10)">+10</button>
                    <button class="value__add" @click="handleLotteryValueClick(20)">+20</button>
                    <button class="value__add" @click="handleLotteryValueClick(50)">+50</button>
                    <WInput
                        class="value__balance-input"
                        name="lottery-value"
                        type="number"
                        v-model="lotteryValue"
                        :value="lotteryValue"
                        @focus="handleInitializeLotteryValue"
                    >
                        <template #icon>
                            <span style="color: var(--foreground-inputs-odds);">R$</span>
                        </template>
                    </WInput>
                </div>
            </div>
            <div class="lottery__actions">
                <WButton
                    id="lottery-clear"
                    text="Limpar"
                    class="lottery__clear"
                    name="lottery-clear"
                    color="secondary"
                    @click="handleClearLottery"
                />
                <WButton
                    id="lottery-submit"
                    text="Incluir palpite"
                    class="lottery__submit"
                    name="lottery-submit"
                    :disabled="submitButtonDisable"
                    @click="handleSubmitLottery"
                />
            </div>
        </div>

        <SurpriseButton
            class="surprise-button"
            v-if="showSurpriseButton"
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

        <ModalLotteryOptions
            v-if="showModalLotteryOptions"
            @click="handleLotteryOptions"
            @closeModal="handleCloseLotteryOptions"
        />
    </div>
</template>

<script>
import SelectFake from '../parts/SelectFake.vue';
import LotterySkeleton from './parts/LotterySkeleton.vue';
import SurpriseButton from './parts/SurpriseButton.vue';
import { LotteryTypes, ToastType } from '@/enums';
import { useLotteryStore, useTicketStore, useToastStore } from '@/stores';
import ModalLotteryNumbers from './parts/ModalLotteryNumbers.vue';
import ModalLotteryTypes from './parts/ModalLotteryTypes.vue';
import { random } from 'lodash';
import ModalLotteryOptions from './parts/ModalLotteryOptions.vue';
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import { getLotteryDraw } from '@/services/lottery.service';

export default {
    name: 'lottery-modality',
    components: {
        LotterySkeleton,
        SurpriseButton,
        SelectFake,
        ModalLotteryNumbers,
        ModalLotteryTypes,
        ModalLotteryOptions,
        WInput,
        WButton
    },
    data() {
        return {
            lotteryStore: useLotteryStore(),
            ticketStore: useTicketStore(),
            toastStore: useToastStore(),
            showModalLotteryNumbers: false,
            showModalLotteryTypes: false,
            showModalLotteryOptions: false,
            showSurpriseButton: true
        }
    },
    activated() {
        this.getLotteryOptions();
    },
    mounted() {
        this.loadPage();
        const scrollDiv = this.$refs.lotteryScroll;
        if (scrollDiv) {
            scrollDiv.addEventListener('scroll', this.handleScroll);
        }
    },
    beforeUnmount() {
        const scrollDiv = this.$refs.lotteryScroll;
        if (scrollDiv) {
            scrollDiv.removeEventListener('scroll', this.handleScroll);
        }
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
        optionSelected() {
            const option = (this.lotteryStore.options.lotteries ?? []).find(
                option => option.id == this.lotteryStore.loteryOptionsSelected
            );
            return option?.nome ?? 'Selecione o sorteio';
        },
        sizeSelected() {
            const defaultNumbers = this.lotteryStore.lotteryTypeSelected == LotteryTypes.QUININHA ? 5 : 6;
            const numbers = this.lotteryStore.loteryNumbersSelected ?? defaultNumbers;
            return `${numbers} números`;
        },
        items() {
            return this.lotteryStore.lotteryTypeSelected == LotteryTypes.QUININHA ? 80 : 60;
        },
        reachedTotalTens() {
            return this.lotteryStore.tensSelected.length >= this.lotteryStore.loteryNumbersSelected;
        },
        lotteryValue: {
            get() {
                return this.lotteryStore.lotteryValue;
            },
            set(value) {
                this.lotteryStore.setLotteryValue(value);
            }
        },
        submitButtonDisable() {
            return (
                !Boolean(this.lotteryStore.lotteryValue)
                || !this.reachedTotalTens
                || !Boolean(this.lotteryStore.loteryOptionsSelected)
                || !Boolean(this.lotteryStore.loteryNumbersSelected)
                || !Boolean(this.lotteryStore.lotteryTypeSelected)
            )
        }
    },
    methods: {
        handleScroll() {
            const targetDiv = this.$refs.footer;
            const rect = targetDiv.getBoundingClientRect();
            this.showSurpriseButton = !(rect.top < window.innerHeight && rect.bottom > 0);
        },
        isSelected(number) {
            return this.lotteryStore.tensSelected.includes(number);
        },
        isDisabled(number) {
            return !this.isSelected(number) && this.reachedTotalTens;
        },
        loadPage() {
           this.getLotteryOptions();
        },
        getLotteryOptions() {
            this.lotteryStore.setLotteryOptions([]);
            this.lotteryStore.setLotteryOptionsSelected(null);

            const params = {
                type: this.lotteryStore.lotteryTypeSelected,
            };

            getLotteryDraw(params)
                .then((res) => this.lotteryStore.setLotteryOptions(res))
                .catch((err) => {
                    console.error(err);
                    this.lotteryStore.setLotteryOptions([]);
                });
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

           this.getLotteryOptions();
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

        handleOpenLotteryOptions() {
            this.showModalLotteryOptions = true;
        },
        handleCloseLotteryOptions() {
            this.showModalLotteryOptions = false;
        },
        handleLotteryOptions(option) {
            this.lotteryStore.setLotteryOptionsSelected(option);
        },

        handleLotteryValueClick(valueAditional) {
            const lotteryValue = parseFloat(this.lotteryValue ?? 0) + Number(valueAditional);
            this.lotteryValue = lotteryValue;
        },
        handleInitializeLotteryValue() {
            this.lotteryValue = Boolean(this.lotteryValue) ? this.lotteryValue : '';
        },

        handleSubmitLottery() {
            this.ticketStore.addTen({
                value: this.lotteryValue,
                ten: this.lotteryStore.tensSelected,
                type: this.lotteryStore.lotteryTypeSelected,
                lotteryId: this.lotteryStore.loteryOptionsSelected,
                lotteryTitle: this.optionSelected
            });

            this.toastStore.setToastConfig({
                message: 'Palpite adicionado no seu bilhete.',
                type: ToastType.SUCCESS,
                duration: 3000
            })

            this.handleClearLottery();
        },
        handleClearLottery() {
            this.lotteryStore.removeAlltens();
            this.lotteryStore.setLotteryValue(0);
        }
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
        background: var(--header);
    }

    &__footer {
        overflow-y: none;
        width: 100%;
        padding: 16px;
        padding-bottom: 150px;
        background: var(--header);
    }

    &__items {
        margin-top: 16px;
        margin-bottom: 16px;
        display: grid;
        grid-template-columns: repeat(5, auto);
        gap: 24px;
    }

    &__item {
        margin: auto;
        height: 46px;
        width: 46px;

        border: 0;
        border-radius: 50px;
        color:#ffffff;
        color: var(--foreground-inputs-odds);
        background: var(--inputs-odds);
    }

    &__item--selected {
        background: var(--highlight);
        color: var(--foreground-highlight);
    }

    &__item--disabled {
        opacity: 0.5;
    }

    &__options {
        display: flex;
        flex-direction: column;
    }

    &__options-label {
        color:#ffffff;
        color: var(--foreground-inputs-odds);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-bottom: 8px;
    }

    &__options-select {
        padding: 18px 16px;
        border-radius: 8px;
        background: #181818;
    }

    &__actions {
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
    }

    &__submit {
        width: 64%;
    }

    &__clear {
        width: 32%;
    }
}

.value {
  margin-top: 8px;

  &__balance-text {
    font-size: 14px;
    color:#ffff;
    color: var(--foreground-inputs-odds);
  }

  &__balance {
    display: flex;
    align-items: center;
  }

  &__add {
    border: 0;
    display: flex;
    width: calc(50%/3 - 8px);
    padding: 18px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: var(--inputs-odds);
    color: #ffffff80;
    color: var(--foreground-inputs-odds);
    font-size: 14px;
    margin-right: 8px;
  }

  &__balance-input{
    width: 50%;
    margin-top: 10px;
  }
  
  &__balance-input ::v-deep .input__field {
    height: 50px;
  }

  &__balance-input ::v-deep .input__group {
    border: 0;
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
