<template>
    <div class="consult-card">
        <Header title="Consultar cartão" :showBackButton="true" />
        <div class="consult-card__container">
            <w-input
                label="Chave do cartão"
                placeholder="Informe a chave do cartão"
                type="text"
                name="code"
                mask="XXX-XXX-XXX"
                v-model="code"
            >
            </w-input>
            
            <w-input
                label="PIN"
                placeholder="Informe o pin do cartão"
                type="password"
                name="pin"
                v-model="pin"
            >
            </w-input>
            <div class="buttons">
                <w-button
                    text="Consultar"
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
import { consultCard } from '@/services';
import { ToastType } from '@/enums';
import { useToastStore } from '@/stores';

export default {
    name: 'consult-card',
    components: { 
        WInput,
        Header, 
        WButton 
    },
    data() {
        return {
            code: '',
            pin: '',
            card: [],
            toastStore: useToastStore()
        };
    },
    computed: {
        formValid() {
            return Boolean(this.code) && Boolean(this.pin);
        },
    },
    methods: {
        async handleRecharge() {
            if (!this.formValid) {
                this.toastStore.setToastConfig({
                    message: 'Por favor, preencha todos os campos.',
                    type: ToastType.DANGER,
                    duration: 5000,
                });
                return;
            }

            try {
                const response = await consultCard(this.code, this.pin);
                this.card = response; 
            } catch ({errors}) {
                const errorMessage = errors.message || 'Erro inesperado';
                console.log(errors);
                this.toastStore.setToastConfig({
                    message: errorMessage,
                    type: ToastType.DANGER,
                    duration: 5000,
                });
            }
        },
    },
};
</script>


<style lang="scss" scoped>
.consult-card {
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
