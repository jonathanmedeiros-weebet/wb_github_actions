<template>
    <div class="recharge-card">
        <Header title="Recargas de cartão" :showBackButton="true" />
        <div class="recharge-card__container">
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
                label="Chave do cartão"
                placeholder="Informe a chave do cartão"
                type="text"
                name="carkey"
                v-model="cardKey"
            >
            </w-input>
            <div class="buttons">
                <w-button
                    text="Recarregar"
                    :disabled="!formValid"
                    @click="handleRecharge"
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
import { recharge } from '@/services';
import { ToastType } from '@/enums';
import { useToastStore } from '@/stores';

export default {
    name: 'recharge-card-view',
    components: { 
        WInput,
        Header, 
        WButton 
    },
    data() {
        return {
            cardValue: '',
            cardKey: '',
            toastStore: useToastStore()
        };
    },
    computed: {
        formValid() {
            return Boolean(this.cardValue) && Boolean(this.cardKey);
        }
    },
    methods: {
        async handleRecharge() {
            if (!this.formValid) {
                this.toastStore.setToastConfig({
                    message: 'Por favor, preencha todos os campos.',
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

            recharge(this.cardKey, cardValueNumber)
                .then((cardBet) => {
                    this.toastStore.setToastConfig({
                        message: 'Recarga realizada com sucesso!',
                        type: ToastType.SUCCESS,
                        duration: 5000
                    });

                    this.$router.push({
                        name: 'recharge-receipt',
                        params: {
                            cardBet
                        }
                    });
                })
                .catch(({ errors }) => {
                    this.toastStore.setToastConfig({
                        message: errors.message,
                        type: ToastType.DANGER,
                        duration: 5000
                    })
                })
        },
    },
};
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
