<template>
    <div class="password">
      <Header title="Alterar senha" :showBackButton="true" />
        <div class="password__container">
          <div class="password_inputs">
            <w-input
              ref="currentPasswordInput"
              class="login__input"
              label="Senha atual"
              name="current_password"
              placeholder="Digite sua senha atual"
              type="password"
              v-model="currentPassword"
            >
            </w-input>
            
            <w-input
              ref="newPasswordInput"
              class="login__input"
              label="Nova Senha"
              name="new_password"
              placeholder="Digite sua nova senha"
              type="password"
              v-model="newPassword"
            >
            </w-input>

            <w-input
              ref="confirmPasswordInput"
              class="login__input"
              label="Confirmar Senha"
              name="confirm_password"
              placeholder="Confirme a nova senha"
              type="password"
              v-model="confirmPassword"
            >
            </w-input>
          </div>

          <div class="password__button">
            <w-button
              id="btn-salvar"
              text="Salvar Alterações"
              value="salvar"
              name="btn-salvar"
              @click="handleClickSave"
            />
          </div>
        </div>
    </div>
</template>

<script>

import Header from '@/components/layouts/Header.vue'
import WButton from '@/components/Button.vue'
import IconPassword from '@/components/icons/IconPassword.vue'
import WInput from '@/components/Input.vue'
import { changePassword } from '@/services'
import { useToastStore } from '@/stores'
import { ToastType } from '@/enums'

export default {
  name: 'change-password',
  components: { 
    Header,
    WInput,
    IconPassword,
    WButton
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      tostStore: useToastStore()
    }
  },
  methods: {
    async handleClickSave() {
      this.tostStore.setToastConfig({ message: '' })
      changePassword(this.currentPassword,this.newPassword, this.confirmPassword)
      .then(resp => {
        let typeToast = ToastType.ALERT;
        if(resp.success) {
          typeToast = ToastType.SUCCESS;
          this.clearInputs();
        }

        this.tostStore.setToastConfig({
          message: resp.results.message,
          type: typeToast,
          duration: 5000
        })
      })
      .catch(({ errors }) => {
        this.tostStore.setToastConfig({
          message: errors.message,
          type: ToastType.WARNING,
          duration: 5000
        })
      })
    },
    clearInputs() {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      
      this.$nextTick(() => {
        this.$refs.currentPasswordInput.reset();
        this.$refs.newPasswordInput.reset();
        this.$refs.confirmPasswordInput.reset();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.password {
  display: flex;
  flex-direction: column;
  height: 100vh;
    
  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 30px 0px 30px;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
  }

  &__button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>