<template>
    <div class="lottery" ref="lotteryScroll">
        <LotterySkeleton v-if="loading"/>
        <template v-if="!loading">
            <div class="lottery__header">
                <SelectFake
                    @click="handleOpenLotteryType"
                >
                    <span>{{ typeSelected }}</span>
                </SelectFake>

                <SelectFake
                    @click="handleOpenLotteryNumbers"
                >
                    <span>{{ `${sizeSelected} números` }}</span>
                </SelectFake>
            </div>
            
            <div class="lottery__body">
                <span class="lottery__message">Escolha suas dezenas </span>

                <div
                    class="lottery__items"
                    :class="{
                        'lottery__items--android6': isAndroid6Version,
                        'lottery__items--grid': !isAndroid6Version,
                    }"
                >
                    <button
                        v-for="item of items"
                        :key="item"
                        class="lottery__item"
                        :class="{
                            'lottery__item--android6': isAndroid6Version,
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
                        id="lottery-copy"
                        text="Copiar aspota"
                        class="lottery__copy"
                        name="lottery-copy"
                        color="secondary"
                        @click="handleOpenModalCopyLottery"
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
        </template>

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
            :lotteryList="lotteryOptions"
            :lotterySelected="lotteryOptionSelected"
            @click="handleLotteryOptions"
            @closeModal="handleCloseLotteryOptions"
        />

        <ModalSearchLotteryBet
            v-if="showModalCopyLottery" 
            @close="handleCloseModalCopyLottery" 
            @consult="handleCopyLottery"
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
import { getLotteryBetsByType, getLotteryDraw } from '@/services/lottery.service';
import { isAndroid6 } from '@/utilities';
import ModalSearchLotteryBet from './parts/ModalSearchLotteryBet.vue';
import { getBetByCode } from '@/services';

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
        WButton,
        ModalSearchLotteryBet
    },
    data() {
        return {
            lotteryStore: useLotteryStore(),
            ticketStore: useTicketStore(),
            toastStore: useToastStore(),
            showModalLotteryNumbers: false,
            showModalLotteryTypes: false,
            showModalLotteryOptions: false,
            showModalCopyLottery: false,
            showSurpriseButton: true,
            loading: false
        }
    },
    activated() {
        this.loadPage(false);
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
        isAndroid6Version() {
            return isAndroid6();
        },
        tensInfo() {
            return `${this.lotteryStore.tensSelected.length}/${this.sizeSelected} Dezenas selecionadas`;
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
            const numbers = Boolean(this.lotteryStore.loteryNumbersSelected.qtdNumeros) ? 
                this.lotteryStore.loteryNumbersSelected.qtdNumeros
                : defaultNumbers;
            return numbers;
        },
        items() {
            return this.lotteryStore.lotteryTypeSelected == LotteryTypes.QUININHA ? 80 : 60;
        },
        reachedTotalTens() {
            return this.lotteryStore.tensSelected.length >= this.sizeSelected;
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
                || !Boolean(this.sizeSelected)
                || !Boolean(this.lotteryStore.lotteryTypeSelected)
            )
        },
        lotteryOptions() {
            return this.lotteryStore.options.lotteries;
        },
        lotteryOptionSelected() {
            return this.lotteryStore.loteryOptionsSelected;
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
        async loadPage(loading = true) {
            this.loading = loading;
            await this.getLotteryOptions();
            await this.getLotteryNumbers();
            this.loading = false;
        },
        async getLotteryOptions() {
            this.lotteryStore.setLotteryOptions([]);
            this.lotteryStore.setLotteryOptionsSelected(null);

            const params = {
                type: this.lotteryStore.lotteryTypeSelected,
            };

            try {
                const response = await getLotteryDraw(params);
                this.lotteryStore.setLotteryOptions(response);
            } catch (error) {
                console.error(error);
                this.lotteryStore.setLotteryOptions([]);
            }
        },
        async getLotteryNumbers() {
            this.lotteryStore.setLotterySizes([]);

            const params = {
                type: this.lotteryStore.lotteryTypeSelected,
                sort: 'data'
            };

            try {
                const response = await getLotteryBetsByType(params);
                this.lotteryStore.setLotterySizes(response);
                this.lotteryStore.setLotteryNumbersSelected(response.length ? res[0] : null);
            } catch (error) {
                console.error(error);
                this.lotteryStore.setLotterySizes([]);
            }

            getLotteryBetsByType(params)
                .then((res) => {
                    this.lotteryStore.setLotterySizes(res);
                    this.lotteryStore.setLotteryNumbersSelected(res.length ? res[0] : null);
                })
                .catch((err) => {
                    console.error(err);
                    this.lotteryStore.setLotterySizes([]);
                });
        },
        handleSurprise() {
            const max = this.lotteryStore.lotteryTypeSelected == LotteryTypes.QUININHA ? 70 : 50;
            const endIndex = this.sizeSelected;
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
            this.ticketStore.clear();

           this.loadPage();
        },

        handleOpenLotteryNumbers() {
            this.showModalLotteryNumbers = true;
        },
        handleCloseLotteryNumbers() {
            this.showModalLotteryNumbers = false;
        },
        handleLotteryNumbers(number) {
            this.lotteryStore.setLotteryNumbersSelected(number);
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

        handleOpenModalCopyLottery() {
            this.showModalCopyLottery = true;
        },
        handleCloseModalCopyLottery() {
            this.showModalCopyLottery = false;
        },
        async handleCopyLottery(ticketCode) {
            getBetByCode(ticketCode)
                .then((resp) => {
                    console.log(resp.results.id)
                    this.$router.push({ 
                        name: 'replicate-lottery-bet',
                        params: { betId: resp.results.id }
                    });
                })
                .catch((error) => {
                    this.handleCloseModalCopyLottery();
                    this.toastStore.setToastConfig({
                        message: error.errors.message,
                        type: ToastType.DANGER,
                        duration: 5000
                    });
                })
        },

        handleLotteryValueClick(valueAditional) {
            const lotteryValue = parseFloat(Boolean(this.lotteryValue) ? this.lotteryValue : 0) + Number(valueAditional);
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
    background: var(--header);
    padding-bottom: 200px;

    &__header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 18px 16px;
        background: var(--background);
    }

    &__body {
        overflow-y: none;
        width: 100%;
        padding: 16px;
    }

    &__footer {
        overflow-y: none;
        width: 100%;
        padding: 16px;
    }

    &__items {
        margin-top: 16px;
        margin-bottom: 16px;
        
        &--grid {
            display: grid;
            grid-template-columns: repeat(5, auto);
            gap: 24px;
        }

        &--android6 {
            margin-left: 16px;
            display: flex;
            flex-wrap: wrap;
        }
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

        &--android6 {
            margin: 0;
            margin-left: 20px;
            margin-top: 24px;
        }

        &--selected {
            background: var(--highlight);
            color: var(--foreground-highlight);
        }

        &--disabled {
            opacity: 0.5;
        }
    }

    &__item--android6:nth-child(1),
    &__item--android6:nth-child(6),
    &__item--android6:nth-child(11),
    &__item--android6:nth-child(16),
    &__item--android6:nth-child(21),
    &__item--android6:nth-child(26),
    &__item--android6:nth-child(31),
    &__item--android6:nth-child(36),
    &__item--android6:nth-child(41),
    &__item--android6:nth-child(46),
    &__item--android6:nth-child(51),
    &__item--android6:nth-child(56),
    &__item--android6:nth-child(61),
    &__item--android6:nth-child(66),
    &__item--android6:nth-child(71),
    &__item--android6:nth-child(76),
    &__item--android6:nth-child(81),
    &__item--android6:nth-child(86),
    &__item--android6:nth-child(91),
    &__item--android6:nth-child(96),
    &__item--android6:nth-child(101),
    &__item--android6:nth-child(106),
    &__item--android6:nth-child(111),
    &__item--android6:nth-child(116),
    &__item--android6:nth-child(121),
    &__item--android6:nth-child(126),
    &__item--android6:nth-child(131),
    &__item--android6:nth-child(136),
    &__item--android6:nth-child(141),
    &__item--android6:nth-child(146),
    &__item--android6:nth-child(151)
    {
        margin-left: 0;
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

    &__submit,
    &__copy {
        width: 34%;
    }

    &__clear {
        width: 28%;
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
    bottom: 100px;
}

::v-deep .select-fake__title {
    font-size: 14px;
}
</style>
