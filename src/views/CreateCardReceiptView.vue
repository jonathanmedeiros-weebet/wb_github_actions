<template>
    <div class="create-card">
        <Header title="Detalhes do cartão" :showBackButton="true"/>
        <div class="create-card__key">
            <h4>Chave Cartão</h4>
            <span>Cartão {{ cardKey }}</span>
        </div>
        <div class="create-card__details">
            <div>
                <span>Apostador: {{ bettorName }}</span>
                <span>Recargas: {{ recharges }}</span>
                <span>Prêmios: {{ prizes }} </span>
                <span>Criação: {{ creationDate }}</span>
            </div>
            <div>
                <span>Cambista: {{ moneyChangerName }}</span>
                <span>Saques: {{ withdraws }}</span>
                <span>Saldo atual: {{ balance }}</span>
            </div>
        </div>
        <div class="buttons">
                
        </div>
    </div>
</template>

<script>
import WInput from '@/components/Input.vue';
import Header from '@/components/layouts/Header.vue';
import WButton from '@/components/Button.vue';

export default {
    name: 'create-card-view',
    components: { 
        WInput,
        Header,
        WButton
    },
    props: {
        cardBet: {
            type: Object,
            required: true
        }
    },
    computed: {
        cardKey() {
            return this.cardBet?.chave ?? ''
        },
        bettorName() {
            return this.cardBet?.apostador ?? ''
        },
        recharges() {
            return this.cardBet?.total_creditos ?? ''
        },
        prizes() {
            return this.cardBet?.premios ?? ''
        },
        creationDate() {
            return this.cardBet?.data_registro ?? ''
        },
        moneyChangerName() {
            return this.cardBet?.passador?.nome ?? ''
        },
        withdraws() {
            return this.cardBet?.total_saques ?? ''
        },
        balance() {
            return this.cardBet?.saldo ?? ''
        }
    }

};
</script>

<style lang="scss" scoped>
    .create-card {
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
    }
</style>