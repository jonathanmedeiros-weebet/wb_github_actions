<template>
    <div class="recharge-card">
    <Header title="Comprovante" :showBackButton="true" />
        <div class="recharge-card__container">
            <div class="recharge-card__info">
                <div class="code">
                    <img class="logo__image" :src="imageClient">
                </div>
                <div class="code__text">
                    <span>Comprovante de recarga</span>
                </div>
                <div class="code">
                    <span>Cartão: 62A-789-410</span>
                    <span>Cambista: Marcos</span>
                    <span>Valor: R$20,00</span>
                    <span>Data/Hora: 10/12/2024 11:51</span>
                    <span>72525ds5fd5sf5ds5f5ds5fd5sf5ds86</span>
                </div>
            </div>
            <div class="buttons">
                <w-button
                    text="Fechar"
                    color="secondary-light"
                >
                </w-button>

                <div class="button-spacer"></div>

                <w-button
                    text="Imprimir"
                    class="button__confirm"
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

export default {
    name: 'recharge-card',
    components: { WInput,
        Header, WButton
    },
    data() {
        return {
            configClient: useConfigClient()
        }
    },
    computed: {
        imageClient(){
            return this.configClient.logo;
        }
    },
    methods: {
       
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
</style>