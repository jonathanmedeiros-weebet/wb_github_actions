<template>
    <div class="recharge-card">
        <Header title="Recargas de cartão" :showBackButton="true" />
        <div class="recharge-card__container">
            <w-input
                label="Valor do cartão"
                class="recharge-card__balance-input"
                name=""
                type="number"
                v-model="cardValue"
            >
                <template #icon>
                    <span style="color: var(--foreground-inputs-odds);">R$</span>
                </template>
            </w-input>
            
            <w-input
                label="Chave do cartão"
                placeholder="Informe a chave do cartão"
                class="recharge-card__balance-input"
                name=""
                type="text"
                v-model="cardKey"
            >
            </w-input>
            <div class="buttons">
                <w-button
                    text="Cancelar"
                    color="secondary-light"
                >
                </w-button>

                <div class="button-spacer"></div>

                <w-button
                    text="Recarregar"
                    class="button__confirm"
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
import { reloading } from '@/services';

export default {
    name: 'recharge-card',
    components: { 
        WInput,
        Header, 
        WButton 
    },
    data() {
        return {
            cardValue: '',
            cardKey: '',  
        };
    },
    methods: {
        async handleRecharge() {
            try {
                if (!this.cardValue || !this.cardKey) {
                    alert('Por favor, preencha todos os campos.');
                    return;
                }
                const cardValueNumber = Number(this.cardValue);
                if (isNaN(cardValueNumber) || cardValueNumber <= 0) {
                    alert('Por favor, insira um valor válido.');
                    return;
                }
                const result = await reloading(this.cardKey, cardValueNumber);
                alert('Recarga realizada com sucesso!');
                console.log(result);
            } catch (error) {
                console.error('Erro ao recarregar o cartão:', error);
                alert('Houve um erro ao realizar a recarga.');
            }
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
