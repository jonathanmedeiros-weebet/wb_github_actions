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
        placeholder="Ex.: EA5D-DG41"
        type="text"
        v-model="code"
      />
      <WButton
        id="btn-salvar"
        text="Consultar"
        value="salvar"
        name="btn-salvar"
        @click="handleSearch"
        :disabled="buttonDisable"
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
      submitting: false
    }
  },
  methods: {
    async handleSearch() {
      this.submitting = true;
      getPreBetByCode(this.code)
      .then(resp => {
        console.log(resp);
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
      .finally(() => this.submitting = false)
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
    gap: 10px;
  }

  &__text {
    color: var(--color-text-input);
    font-size: 14px;
    text-align: center;
  }
}

::v-deep .input__group,
::v-deep .input__field {
  background-color: var(--color-background);
}
</style>
