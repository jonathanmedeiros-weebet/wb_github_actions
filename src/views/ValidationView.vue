<template>
  <div class="validation">
    <Header :title="title" :showBackButton="true" />
    <div class="validation__items">
      <span class="validation__text">
        Digite o código de aposta para realizar a validação
      </span>
      <WInput
        class="validation__input"
        name="consult_ticket"
        placeholder="Ex.: 0000"
        type="number"
        mask="#########"
        autocomple="off"
        v-model="code"
      />
      <WButton
        id="btn-salvar"
        :text="textButtonConfirm"
        value="salvar"
        name="btn-salvar"
        @click="handleSearch"
        :disabled="buttonDisable"
        class="validation__button"
      />
    </div>
  </div>
</template>

<script>
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import Header from '@/components/layouts/Header.vue';
import { getPreBetByCode } from '@/services/preBet.service';
import { useToastStore } from '@/stores';
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';

export default {
  name: 'validation',
  components: { Header,
    WInput,
    WButton,
    Toast 
  },
  data(){
    return {
      title: 'Validar Aposta',
      code: '',
      toastStore: useToastStore(),
      submitting: false,
      textButtonConfirm: 'Consultar'
    }
  },
  methods: {
    async handleSearch() {
      this.submitting = true;
      this.textButtonConfirm = 'Processando...';
      getPreBetByCode(this.code)
      .then(resp => {
        this.$router.push({ 
          name: 'validation-detail',
          params: {
            id: resp.results.id
          }
        });
      })
      .catch(error => {
        this.toastStore.setToastConfig({
          message: error.errors.message,
          type: ToastType.DANGER,
          duration: 5000
        })
      })
      .finally(() => {
        this.submitting = false,
        this.textButtonConfirm = 'Consultar';
      })
    }
  },
  computed: {
    buttonDisable() {
      return this.submitting == true;
    }
  }
}
</script>

<style lang="scss" scoped>
.validation {
  &__items {
    padding: 17.35px;
    display: flex;
    flex-direction: column;
  }

  &__text {
    color: #ffffff80;
    color: rgb(var(--foreground-header-rgb), 0.5); 
    font-size: 14px;
    text-align: center;
  }

  &__input {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}

</style>
