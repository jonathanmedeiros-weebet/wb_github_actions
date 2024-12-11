<template>
    <div class="recharge-card">
        <Header title="Comprovante" :showBackButton="true" />
        <div class="recharge-card__container">
            <div class="recharge-card__info">
                <div class="code">
                    <img class="logo__image" :src="imageClient" @error="changeSrcWhenImageError">
                </div>
                <div class="code__text">
                    <span>Comprovante de recarga</span>
                </div>
                <div class="code">
                    <span>Cartão: {{ rechargeCode }}</span>
                    <span>Cambista: {{ rechargeBettor }}</span>
                    <span>Valor: {{ rechargeValue }}</span>
                    <span>Data/Hora: {{ rechargeDate }}</span>
                    <span>{{ rechargeAuthentication }}</span>
                </div>
            </div>
            <div class="buttons">
                <w-button
                    text="Fechar"
                    color="secondary-light"
                    @click="handleClose"
                >
                </w-button>

                <div class="button-spacer"></div>

                <w-button
                    text="Imprimir"
                    class="button__confirm"
                    @click="handlePrint"
                >
                </w-button>
            </div>
        </div>
    </div>
</template>

<script>
import WInput from '@/components/Input.vue';
import Header from '@/components/layouts/Header.vue';
import WButton from '@/components/Button.vue';   
import { useConfigClient } from '@/stores'
import { formatCurrency, formatDateTimeBR } from '@/utilities';
import { printRechargeReceipt } from '@/services';

export default {
    name: 'recharge-receipt-view',
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
    data() {
        return {
            configClient: useConfigClient()
        }
    },
    computed: {
        rechargeCode() {
            return this.cardBet?.cartao_aposta ?? ''
        },
        rechargeAuthentication() {
            return this.cardBet?.autenticacao ?? ''
        },
        rechargeDate() {
            return this.cardBet?.data ? formatDateTimeBR(this.cardBet?.data) : ''
        },
        rechargeBettor() {
            return this.cardBet?.passador ?? ''
        },
        rechargeValue() {
            return `R$ ${this.cardBet?.valor ? formatCurrency(this.cardBet?.valor) : ''}`;
        },
        imageClient(){
            const configClient = useConfigClient();
            return configClient.logo;
        }
    },
    methods: {
        changeSrcWhenImageError (event) {
            event.target.src = 'https://weebet.s3.amazonaws.com/demo.wee.bet/logos/logo_banca.png';
        },
        handleClose() {
            this.$router.back();
        },
        handlePrint() {
            printRechargeReceipt(this.cardBet);
        }
    }
}

</script>


<style lang="scss" scoped>
.recharge-card {
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

  &__info {
    display: flex;
    flex-direction: column;
    padding: 19px 35px;
    width: 100%;
    background: #181818;
    background: var(--game);

    border-radius: 2px;
  }
}

.code {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px; 
    font-size: 14px; 
    color: #ffffff;

    &__text {
        display: flex;
        justify-content: center;
        font-size: 14px
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

.logo__image {
    margin: auto;
    width: 80%;
    height: auto;
}
</style>