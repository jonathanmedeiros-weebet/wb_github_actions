<template>
  <div class="login">
    <div class="login__container">
      <img class="login__image" src="@/assets/images/weebet_logo_verde.png">
      <div class="login__header">
        <h1 class="login__title">Bem-vindo <img class="login__emogi" src="@/assets/images/hand.png"></h1>
        <p class="login__description">Insira seus dados para acessar o aplicativo </p>
      </div>
      <w-input
        class="login__input"
        label="Usuário"
        name="user_name"
        placeholder="Digite seu usuário"
        type="email"
        v-model="username"
      >
        <template #icon>
          <icon-user-line/>
        </template>
      </w-input> 
      <w-input
        class="login__input"
        label="Senha"
        name="user_password"
        placeholder="Digite sua senha"
        type="password"
        v-model="password" 
      >
        <template #icon>
            <icon-password/>
        </template>

      </w-input>
      <w-button
        id="btn-entrar"
        text="Entrar"
        value="entrar"
        name="btn-entrar"
        @click="handleClick"
        class="login__button"
      />
    </div>
  </div>
</template>

<script>
import WInput from '@/components/Input.vue'
import WButton from '@/components/Button.vue'
import IconUserLine from '@/components/icons/IconUserLine.vue'
import IconPassword from '@/components/icons/IconPassword.vue'
import { authUser } from '@/services'
import { useToastStore } from '@/stores'
import { ToastType } from '@/enums'

export default {
  name: 'login',
  components: {
    WInput,
    WButton,
    IconUserLine,
    IconPassword,
  },
  data() {
    return {
      username: '',
      password: '',
      toastStore: useToastStore()
    }
  },
  methods: {    
    async handleClick() {
      try {
        this.toastStore.setToastConfig({ message: '' })
        const resp = await authUser(this.username, this.password);
        if(resp) {
          this.toastStore.setToastConfig({
            message: 'Login realizado com sucesso!',
            type: ToastType.SUCCESS,
            duration: 2000
          })
          this.$router.replace('/home');
        }else{
          this.toastStore.setToastConfig({
            message: 'Usuário ou senha inválida',
            type: ToastType.DANGER,
            duration: 3000
          })
        }
      } catch ({ errors }) {
        this.toastStore.setToastConfig({
          message: errors?.message ?? 'Usuário ou Senha inválido',
          type: ToastType.DANGER,
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  justify-content: space-between;
  padding: 0px 30px;
  
  &__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 90px;
  }

  &__image {
    width: 101.67px;
    height: 21.17px;
    margin-bottom: 32px;
  }

  &__title {
    font-size: 24px;
    font-weight: 500;
    line-height: 28.13px;
    text-align: left;
    margin-bottom: 4px;
    margin-top: 10px;
  }

  &__description {
    color: #ffffff80;
    color: var(--color-text-input);
    font-size: 16px;
    font-weight: 400;
    line-height: 18.75px;
    text-align: left;
  }

  &__header {
    margin-bottom: 16px;
  }

  &__input {
    margin-top: 10px 
  }
  &__button {
    margin-top: 10px
  }

} 
</style>