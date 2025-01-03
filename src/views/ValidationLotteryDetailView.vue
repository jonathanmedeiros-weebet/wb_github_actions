<template>
    <div class="validation-lottery-detail">
        <Header :title="title" :showBackButton="true" />
        <div class="validation-lottery-detail__container">

            <div class="validation-lottery-detail__results">
                <template v-if="bet !== null">
                    <div class="bet" v-for="(betItem, betIndex) in bet.itens" :key="betIndex">
                            <div class="bet__header">
                                Sorteio: {{ formateDateTime(betItem.horario) }}
                                <IconClose class="bet__icon-close" @click="removeItem(betItem.id)"/>
                            </div>
                        <div v-if="bet.tipo === 'loteria'">
                            <div class="bet__text">
                                <div class="bet__odd-text">Valor do palpite: R${{ formatCurrencyMoney(betItem.valor) }}</div>
                                <div class="bet__odd-text" v-if="betItem.cotacao6 > 0">
                                    <div>Retorno 6: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao6)) }}</div>
                                    <div v-if="!bet.is_cliente && bet.passador?.percentualPremio > 0">
                                        Retorno líquido 6: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor, betItem.cotacao6, bet.passador?.percentualPremio)) }}
                                    </div>
                                </div>
                                <div class="bet__odd-text">
                                Retorno 5: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao5)) }}
                                <div v-if="!bet.is_cliente && bet.passador?.percentualPremio > 0">
                                    Retorno líquido 5: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor,betItem.cotacao5, bet.passador.percentualPremio)) }}
                                </div>
                                </div>
                                <div class="bet__odd-text">
                                    Retorno 4: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao4)) }}
                                    <div v-if="!bet.is_cliente && bet.passador?.percentualPremio > 0">
                                        Retorno líquido 4: R${{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor,betItem.cotacao4, bet.passador?.percentualPremio)) }}
                                    </div>
                                </div>
                                <div class="bet__odd-text">
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
                        </div>
                        <div class="bet__line"></div>
                    </div>
                </template>
            </div>

            <div class="validation-lottery-detail__actions">
                <w-input
                    label="Apostador"
                    class="validation-lottery-detail__input"
                    name="bettor_name"
                    placeholder="Informe o nome do apostador"
                    type="text"
                    v-if="showBettorName"
                    v-model="bettorName"
                />
                <div class="validation-lottery-detail__total">
                    <span>Valor da aposta: {{ formatCurrencyMoney(totalBetValue) }}</span>
                </div>
                <w-button
                    id="btn-entrar"
                    :text="textButtonFinalizeBet"
                    value="entrar"
                    class="validation-lottery-detail__button"
                    name="btn-entrar"
                    :disabled="buttonDisabled"
                    @click="submit"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import { getPreBetByCode } from '@/services/preBet.service';
import { useConfigClient, useToastStore } from '@/stores';
import { formatDateTimeBR, formatCurrency, calculateLotteryWinnings, calculateNetLotteryWinnings, calculateTotalValueLottery } from '@/utilities';
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';
import IconWarning from '@/components/icons/IconWarning.vue';
import IconClose from '@/components/icons/IconClose.vue';
import { createLotteryBet } from '@/services/lottery.service';

export default {
    name: 'validation-lottery-detail',
    components: {
        Header,
        WInput,
        WButton,
        IconWarning,
        Toast,
        IconClose
    },
    props: {
        id: {
            type: Number | String,
            required: true
        }
    },
    data() {
        return {
            title: 'Validar loteria',
            bet: null,
            betItems: null,
            gainEstime: 0,
            buttonDisabled: false,
            bettorName: '',
            bettorDocumentNumber: '',
            toastStore: useToastStore(),
            configClientStore: useConfigClient(),
            textButtonFinalizeBet: "Finalizar aposta"
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        formatDateTimeBR,
        getNameTypeBet() {
            return this.betOptions[key] ? this.betOptions[key].nome : '';
        },
        async fetchData() {
            getPreBetByCode(this.id)
                .then(resp => {
                    this.bet = resp.results;

                    this.valueBet = this.bet.valor;
                    this.betItems = this.bet.itens;
                    this.bettorName = this.bet.apostador;

                }).catch(error => {
                    this.toastStore.useToastStore({
                        message: error.errors?.message ?? 'Erro inesperado',
                        type: ToastType.DANGER,
                        duration: 5000
                    });
                });
        },
        addValue(value) {
            this.valueBet += value
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

            this.calculateEstimatedWinnings();
        },
        async submit() {
            this.buttonDisabled = true;
            this.textButtonFinalizeBet = "Processando...";
            
            const values = {};
            values.preaposta_codigo = this.bet.codigo;
            values.apostador = this.bettorName;
            values.valor = parseFloat(this.valueBet);
            values.versao_app = 'app cambista';

            values.itens = this.betItems.map(betItem => {  
                return {
                    aposta_id: betItem.aposta_id,
                    sorteio_id: betItem.sorteio_id,
                    cotacao3: betItem.cotacao3,
                    cotacao4: betItem.cotacao4,
                    cotacao5: betItem.cotacao5,
                    cotacao6: betItem.cotacao6,
                    numeros: betItem.numeros,
                    horario: betItem.horario,
                    valor: betItem.valor,
                    versao_app: betItem.versao_app
                }
            });

            if (values.itens.length) {
                createLotteryBet(values)
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
                
            } else {
                this.buttonDisabled = false;
                this.textButtonFinalizeBet = "Finalizar aposta";
                this.toastStore.setToastConfig({
                    message: 'Nenhum jogo na aposta!',
                    type: ToastType.WARNING,
                    duration: 5000
                });
            }
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
    },
    computed: {
        showBettorName() {
            return !this.configClientStore.bettorDocumentNumberEnabled;
        },
        showBettorDocumentNumber() {
            return this.configClientStore.bettorDocumentNumberEnabled;
        },
        totalBetValue() {
            return this.bet.itens.reduce((total, item) => total + item.valor, 0);
        }
    }

}
</script>

<style lang="scss" scoped>
.validation-lottery-detail {
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
        padding: 10px; 
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