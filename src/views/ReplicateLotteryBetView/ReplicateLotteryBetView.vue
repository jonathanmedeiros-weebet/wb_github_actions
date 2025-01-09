<template>
    <div class="replicate-lottery-bet">
        <Header :title="title" :showBackButton="true" />
        <div class="replicate-lottery-bet__container">

            <div class="replicate-lottery-bet__results">
                <template v-if="bet">
                    <div class="bet" v-for="(betItem, betIndex) in betItems" :key="betIndex">
                        <div class="bet__header">
                            <span></span>
                            <IconClose class="bet__icon-close" @click="removeItem(betItem.id)"/>
                        </div>
                        <div class="bet__options">
                            <div class="bet__option">
                                <span class="bet__option-label"> Sorteio </span>
                                <SelectFake
                                    class="bet__option-select"
                                    title-size="medium"
                                    @click="handleOpenLotteryOptions(betItem.sorteio_id, betIndex)"
                                >
                                    <span>{{ betItem.sorteio_nome }}</span>
                                </SelectFake>
                            </div>

                            <div class="bet__option">
                                <span class="bet__option-label"> Valor </span>
                                <w-input
                                    class="bet__option-input"
                                    name="bet-value"
                                    type="number"

                                    v-model="betItem.valor"
                                    :value="betItem.valor"
                                    @focus="handleInitializeBetValue(betItem.valor, betIndex)"
                                >
                                    <template #icon>
                                        <span style="color: var(--foreground-inputs-odds);">R$</span>
                                    </template>
                                </w-input>
                            </div>
                        </div>

                        <div class="bet__text">
                            <div class="bet__odd-text">Valor do palpite: R${{ formatCurrencyMoney(betItem.valor) }}</div>
                            <div class="bet__odd-text" v-if="betItem.cotacao6 > 0">
                                <div>Retorno 6: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao6)) }}</div>
                                <div v-if="!bet.is_cliente && bet.passador?.percentualPremio > 0">
                                    Retorno líquido 6: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor, betItem.cotacao6, bet.passador?.percentualPremio)) }}
                                </div>
                            </div>
                            <div class="bet__odd-text" v-if="betItem.cotacao5 > 0">
                                Retorno 5: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao5)) }}
                                <div v-if="!bet.is_cliente && bet.passador?.percentualPremio > 0">
                                    Retorno líquido 5: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor,betItem.cotacao5, bet.passador.percentualPremio)) }}
                                </div>
                            </div>
                            <div class="bet__odd-text" v-if="betItem.cotacao4 > 0">
                                Retorno 4: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao4)) }}
                                <div v-if="!bet.is_cliente && bet.passador?.percentualPremio > 0">
                                    Retorno líquido 4: R${{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor,betItem.cotacao4, bet.passador?.percentualPremio)) }}
                                </div>
                            </div>
                            <div class="bet__odd-text" v-if="betItem.cotacao3 > 0">
                                Retorno 3: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao3)) }}
                                <div v-if="!bet.is_cliente && bet.passador?.percentualPremio > 0">
                                    Retorno líquido 3: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor,betItem.cotacao3, bet.passador?.percentualPremio)) }}
                                </div>
                            </div>
                        </div>

                        <div class="value">
                            <span class="value__text">Dezenas:</span>
                            <div class="value__result">
                                <span 
                                    class="value__result__circle" 
                                    v-for="number in betItem.numeros" 
                                    :key="number"
                                >
                                    {{ number }}
                                </span>
                            </div>
                        </div>

                        <div class="bet__line"></div>
                    </div>
                </template>
            </div>

            <div class="replicate-lottery-bet__actions">
                <w-input
                    label="Apostador"
                    class="replicate-lottery-bet__input"
                    name="bettor_name"
                    placeholder="Informe o nome do apostador"
                    type="text"
                    v-model="bettorName"
                />
                <div class="replicate-lottery-bet__total">
                    <span>Valor da aposta: {{ formatCurrencyMoney(totalBetValue) }}</span>
                </div>
                <w-button
                    id="btn-entrar"
                    :text="textButtonFinalizeBet"
                    value="entrar"
                    class="replicate-lottery-bet__button"
                    name="btn-entrar"
                    :disabled="buttonDisabled || formInvalid"
                    @click="submit"
                />
            </div>
        </div>

        <ModalLotteryOptions
            v-if="showModalLotteryOptions"
            :lotteryList="lotteryOptions"
            :lotterySelected="lotteryOptionSelected"
            @click="handleLotteryOptions"
            @closeModal="handleCloseLotteryOptions"
        />

    </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import { useToastStore } from '@/stores';
import { formatDateTimeBR, formatCurrency, calculateLotteryWinnings, calculateNetLotteryWinnings, calculateTotalValueLottery } from '@/utilities';
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';
import IconWarning from '@/components/icons/IconWarning.vue';
import IconClose from '@/components/icons/IconClose.vue';
import { createLotteryBet, getLotteryDraw } from '@/services/lottery.service';
import { getBetById } from '@/services';
import ModalLotteryOptions from '../HomeView/LotteryModality/parts/ModalLotteryOptions.vue';
import SelectFake from '../HomeView/parts/SelectFake.vue';

export default {
    name: 'replicate-lottery-bet',
    components: {
        Header,
        WInput,
        WButton,
        IconWarning,
        Toast,
        IconClose,
        ModalLotteryOptions,
        SelectFake
    },
    data() {
        return {
            title: 'Replicar aposta',
            bet: null,
            betItems: [],
            buttonDisabled: false,
            bettorName: '',
            toastStore: useToastStore(),
            textButtonFinalizeBet: "Finalizar aposta",
            showModalLotteryOptions: false,
            lotteryOptions: [],
            lotteryOptionSelected: '',
            lotteryOptionIndex: null,
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        formatDateTimeBR,
        async fetchData() {
            const betId = String(this.$route.params.betId);

            getBetById(betId)
                .then(resp => {
                    this.bet = resp.results;
                    this.valueBet = this.bet.valor;
                    this.bettorName = this.bet.apostador;
                    this.betItems = this.bet.itens.map(item => ({
                        ...item,
                        sorteio_nome: '',
                        sorteio_id: null,
                        valor: 0
                    }));

                    getLotteryDraw({ type: this.bet.modalidade })
                        .then((response) => this.lotteryOptions = response)
                        .catch(() => this.lotteryOptions = [])

                }).catch(error => {
                    this.toastStore.useToastStore({
                        message: error.errors?.message ?? 'Erro inesperado',
                        type: ToastType.DANGER,
                        duration: 5000
                    });
                });
        },

        formatCurrencyMoney(value) {
            return formatCurrency(value);
        },
        formateDateTime(datetime) {
            return formatDateTimeBR(datetime);
        },
        removeItem(id) {
            this.betItems = this.betItems.filter(item => item.id !== id);
            this.bet.itens = [...this.betItems];

            let disabled = false;

            this.bet.cotacao = this.betItems
                .map(item => {
                    if (item.mensagem) {
                        disabled = true;
                    }
                    return item.cotacao_atual;
                })
                .reduce((acumulador, valorAtual) => acumulador * valorAtual, 1); 

            this.buttonDisabled = disabled;
        },

        async submit() {
            this.buttonDisabled = true;
            this.textButtonFinalizeBet = "Processando...";
            
            const itens = this.betItems.map(betItem => {  
                return {
                    sorteio_id: betItem.sorteio_id,
                    cotacao3: Number(betItem.cotacao3),
                    cotacao4: Number(betItem.cotacao4),
                    cotacao5: Number(betItem.cotacao5),
                    cotacao6: Number(betItem.cotacao6),
                    numeros: betItem.numeros,
                    valor: betItem.valor,
                }
            });

            const payload = {
                versao_app: '2.0',
                apostador: this.bettorName,
                itens
            };

            createLotteryBet(payload)
                .then(response => {
                    this.toastStore.setToastConfig({
                        message: response.message ?? 'Validado com sucesso!',
                        type: ToastType.SUCCESS,
                        duration: 5000
                    })
                    this.$router.push({ 
                        name: 'close-bet',
                        params: {
                            id: response.id,
                            action: 'view'
                        }
                    });
                })
                .catch(error => {
                    this.toastStore.setToastConfig({
                        message: error.errors?.message ?? 'Erro inesperado',
                        type: ToastType.DANGER,
                        duration: 5000
                    });
                })
                .finally(() => {
                    this.buttonDisabled = false;
                    this.textButtonFinalizeBet = "Finalizar aposta";
                })
        },

        calculateLotteryWinnings(value, odd) {
            return calculateLotteryWinnings(value, odd);
        },
        calculateNetLotteryWinnings(value, odd, percentageReward) {
            return calculateNetLotteryWinnings(value, odd, percentageReward);
        },
        calculateTotalValueLottery(bet) {
            return calculateTotalValueLottery(bet);
        },

        handleOpenLotteryOptions(lotteryId, betIndex) {
            this.lotteryOptionIndex = betIndex;
            this.lotteryOptionSelected = lotteryId;
            this.showModalLotteryOptions = true;
        },
        handleCloseLotteryOptions() {
            this.showModalLotteryOptions = false;
        },
        handleLotteryOptions(lotteryId) {
            const lotteryOption = this.lotteryOptions.find(({id}) => id == lotteryId);
            this.betItems[this.lotteryOptionIndex].sorteio_id = lotteryOption.id;
            this.betItems[this.lotteryOptionIndex].sorteio_nome = lotteryOption.nome;

            this.lotteryOptionIndex = null;
            this.lotteryOptionSelected = '';
        },

        handleInitializeBetValue(betValue, betIndex) {
            this.betItems[betIndex].valor = Boolean(betValue) ? betValue : '';
        },
    },
    computed: {
        totalBetValue() {
            return this.betItems.reduce((total, item) => Number(total) + Number(item.valor ?? 0), 0);
        },
        formInvalid() {
            return (
                this.betItems.some((item) => !Boolean(item.sorteio_id) || !Boolean(item.valor))
                || !Boolean(this.bettorName)
            );
        }
    }

}
</script>

<style lang="scss" scoped>
.replicate-lottery-bet {
    background: var(--header);

    &__container {
        display: flex;
        flex-direction: column;
        padding: 0 20px;
        padding-top: 12px;
        padding-bottom: 100px;
    }

    &__results {
        flex: 1; 
        padding-bottom: 10px; 
    }

    &__actions {
        display: flex;
        flex-direction: column;
        gap: 10px; 
        padding: 10px 0; 
    }

    &__button {
        width: 100%; 
    }
}

.bet {
    margin-bottom: 5px;
    padding-top: 1rem;
    
    &:nth-child(1) {
        padding-top: 0;
    }
    
    &__header {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
    }

    &__odd-text {
        opacity: 0.8;
    }

    &__line {
        width: 100%;
        height: 1px;
        background: #ffffff;
        background: var(--foreground-league);
        opacity: 0.1;
        position: absolute;
        left: 0;
    }

    &__options {
        display: flex;
        flex-direction: column;
        margin-top: 8px;
    }

    &__option {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
    }

    &__option-label {
        color: var(--foreground-inputs-odds);
    }

    &__option-select {
        height: 56px;
        padding: 10px 20px;
        border-radius: 5px;
        border: 2px solid #181818;
        border: 0.5px solid var(--foreground-inputs-odds);
        background: var(--inputs-odds);
    }

    &__option-input {
        width: 50%;
    }
}

.value {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    margin-bottom: 8px;

    &__text {
        white-space: nowrap; 
        margin-top: 5px;
        opacity: 0.8;
    }

    &__result {
        display: flex;
        flex-wrap: wrap;
        gap: 5px; 

        &__circle {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 25px;
            width: 25px;
            font-size: 11px;
            background-color: var(--sub-nav);
            color: var(--foreground-header); 
            clip-path: circle(50%);
            text-align: center;
        }
    }
}
</style>