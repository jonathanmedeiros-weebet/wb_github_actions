<template>
    <div class="detailed-card">
        <Header title="Detalhes do cartão" :showBackButton="true"/>
        <div class="detailed-card__container">
            <div class="detailed-card__key">
                <h4>Chave cartão</h4>
                <span>{{ cardKey }}</span>
            </div>
            <div class="detailed-card__infos">
                <div>
                    <span><b> Apostador: </b> {{ bettorName }}</span>
                    <span><b> Recargas: </b> R$ {{ formatCurrencyMoney(recharges) }}</span>
                    <span><b> Prêmios: </b> R$ {{ formatCurrencyMoney(prizes) }} </span>
                    <span><b> Criação: </b>{{ formatDate(creationDate) }}</span>
                </div>
                <div>
                    <span><b> Cambista: </b>{{ moneyChangerName }}</span>
                    <span><b> Saques: </b> R$ {{ formatCurrencyMoney(withdraws) }}</span>
                    <span><b> Saldo atual: </b> R$ {{ formatCurrencyMoney(balance) }}</span>
                </div>
            </div>
            <div class="buttons">
                <w-button
                    text="Compartilhar"
                    color="secondary-light"
                    @click="handleShared"
                    >
                    <template #icon-left>
                        <IconShare :size="20" color="var(--foreground-league)"/>
                    </template>
                </w-button>
                    <div class="button-spacer"></div>
                <w-button
                    text="Imprimir"
                    class="button__confirm"
                    @click="handlePrint"
                    >
                    <template #icon-left>
                        <IconPrinter :size="20" color="var(--foreground-highlight)"/>
                    </template>
                </w-button>
            </div>
        </div>
    </div>
</template>

<script>
import WInput from '@/components/Input.vue';
import Header from '@/components/layouts/Header.vue';
import WButton from '@/components/Button.vue';  
import { ToastType } from '@/enums';
import { useToastStore } from '@/stores';
import { formatCurrency, formatDateTimeBR } from '@/utilities';
import { consultCard, printDetailedCard, sharedCard } from '@/services';
import IconShare from '@/components/icons/IconShare.vue';
import IconPrinter from '@/components/icons/IconPrinter.vue';

export default {
    name: 'detailed-card-view',
    components: { 
        WInput,
        Header,
        WButton,
        IconPrinter,
        IconShare
    },
    props: {
        code: {
            type: Number | String,
            required: true
        },
        pin: {
            type: Number | String,
            required: true
        }
    },
    data() {
        return {
            toastStore: useToastStore(),
            cardBet: {}
        }
    },
    mounted() {
        this.fetchCard();
    },
    methods: {
        async fetchCard() {
            const isValidPin = this.pin && this.pin.length >= 3;
            if (!isValidPin) {
                this.toastStore.setToastConfig({
                    message: 'PIN inválido.',
                    type: ToastType.DANGER,
                    duration: 5000
                });
                return;
            }

            const isValidCode = this.code;
            if (!isValidCode) {
                this.toastStore.setToastConfig({
                    message: 'Chave inválida.',
                    type: ToastType.DANGER,
                    duration: 5000
                });
                return;
            }

            consultCard(this.code, this.pin)
            .then(response => {
                this.cardBet = response;
            })
            .catch((errors) => {
                this.toastStore.setToastConfig({
                    message: errors?.message ?? 'Ocorreu algum erro inesperado.',
                    type: ToastType.DANGER,
                    duration: 5000
                })
            })
        },
        formatCurrencyMoney(value) {
            return formatCurrency(value);
        },
        formatDate(date) {
            return formatDateTimeBR(date);
        },
        handlePrint() {
            printDetailedCard(this.cardBet);
        },
        handleShared() {
            sharedCard(this.code, this.pin);
        }
    },
    computed: {
        cardKey() {
            return this.cardBet?.chave ?? '';
        },
        bettorName() {
            return this.cardBet?.apostador ?? '';
        },
        recharges() {
            return this.cardBet?.total_creditos ?? '';
        },
        prizes() {
            return this.cardBet?.premios ?? '';
        },
        creationDate() {
            return this.cardBet?.data_registro ?? '';
        },
        moneyChangerName() {
            return this.cardBet?.passador?.nome ?? '';
        },
        withdraws() {
            return this.cardBet?.total_saques ?? '';
        },
        balance() {
            return this.cardBet?.saldo ?? '';
        }
    },
}
</script>

<style lang="scss" scoped>
.detailed-card {
    color: #ffffff;
    color: var(--foreground-game);
    height: auto;
    width: 100%;
    padding-bottom: 100px;

    &__container {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0 20px;
        padding-top: 20px;
    }

    &__text {
        color: #ffffff80;
        color: var(--foreground-header); 
        font-size: 14px;
    }

    &__key {
        margin-bottom: 20px;
        background: var(--game);
        padding: 16px;
        border-radius: 8px;

        h4 {
            font-weight: bold;
        }

        span {
            font-size: 16px;
        }
    }

    &__infos {
        display: flex;
        justify-content: space-between;

        div {
            display: flex;
            flex-direction: column;
            
            span {
                margin-bottom: 18px;

                b {
                    font-weight: bold;
                }
            }
        }
    }
}

.buttons {
  display: flex;
  align-items: center;
  padding-top: 25px;
}

.button-spacer {
  width: 20px; 
}
</style>