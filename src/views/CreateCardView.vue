<template>
    <div class="create-card">
        <Header title="Criação de cartão" :showBackButton="true" />
        <div class="create-card__container">
            <w-input
                label="Apostador"
                placeholder="Informe o nome do apostador"
                type="text"
                name="cardbettorname"
                v-model="cardBettorName"
            />
            <w-input
                label="Valor do cartão"
                type="number"
                name="cardvalue"
                inputmode="numeric"
                v-model="cardValue"
            >
                <template #icon>
                    <span style="color: var(--foreground-inputs-odds);">R$</span>
                </template>
            </w-input>
            <w-input
                label="PIN"
                name="cardpin"
                placeholder="Digite um PIN"
                type="password"
                v-model="cardPin"
            >
            </w-input>
            <w-input
                label="Confirmar PIN"
                name="confirmcardpin"
                placeholder="Confirmar o PIN"
                type="password"
                v-model="confirmCardPin"
            >
            </w-input>
            <div class="buttons">
                <w-button
                    text="Confirmar"
                    :disabled="!formValid"
                    @click="handleCreateCard"
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
import { ToastType } from '@/enums';
import { useToastStore } from '@/stores';
import { create } from '@/services/cardBet.service';

export default {
    name: 'create-card-receipt',
    components: { 
        WInput,
        Header,
        WButton
    },
    data() {
        return {
            cardBettorName: '',
            cardValue: '',
            cardPin: '',
            confirmCardPin: '',
            toastStore: useToastStore()
        }
    },
    computed: {
        formValid() {
            return this.cardBettorName && this.cardValue && this.cardPin && this.cardPin && this.confirmCardPin;
        }
    },
    methods: {
        async handleCreateCard() {
            if (!this.formValid) {
                this.toastStore.setToastConfig({
                    message: 'Por favor, preencha todos os campos corretamente.',
                    type: ToastType.DANGER,
                    duration: 5000
                })
                return;
            }

            const cardValueNumber = Number(this.cardValue);
            if (isNaN(cardValueNumber) || cardValueNumber <= 0) {
                this.toastStore.setToastConfig({
                    message: 'Por favor, insira um valor válido.',
                    type: ToastType.DANGER,
                    duration: 5000
                });
                return;
            }

            const isValidPins = this.cardPin.length >= 3 && this.confirmCardPin >= 3;
            if (!isValidPins) {
                this.toastStore.setToastConfig({
                    message: 'Os PINs devem ter no mínimo 3 caracteres.',
                    type: ToastType.DANGER,
                    duration: 5000
                });
                return;
            }

            const isEqualPins = this.cardPin === this.confirmCardPin;
            if (!isEqualPins) {
                this.toastStore.setToastConfig({
                    message: 'Os PINs informados devem ser iguais.',
                    type: ToastType.DANGER,
                    duration: 5000
                });
                return;
            }

            create(this.cardBettorName, cardValueNumber, this.cardPin, this.confirmCardPin)
            .then(cardBet => {
                this.toastStore.setToastConfig({
                    message: 'Cartão criado com sucesso!',
                    type: ToastType.SUCCESS,
                    duration: 5000
                });

                this.$router.push({
                    name: 'create-receipt',
                    params: {
                        cardBet
                    }
                });
            })
            .catch(({ errors }) => {
                this.toastStore.setToastConfig({
                    message: errors.message || 'Ocorreu algum erro inesperado.',
                    type: ToastType.DANGER,
                    duration: 5000
                })
            })
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

    .buttons {
        display: flex;
        align-items: center;
        padding-top: 25px;
    }

    .button-spacer {
        width: 20px; 
    }
</style>