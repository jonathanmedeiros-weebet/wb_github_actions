<template>
  <div class="login">
    <div class="login__container">
      <img class="login__image" src="@/assets/images/weebet_logo_verde.png" alt="">
      <div class="login__header">
        <h1 class="login__title">Bem-vindo <img class="login__emogi" src="@/assets/images/hand.png" alt=""></h1>
        <p class="login__description">Insira seus dados para acessar o aplicativo </p>
      </div>
      <w-input
        class="login__input"
        label="Usuário"
        name="user_name"
        placeholder="Digite seu usuário"
      >
        <template #icon>
          <img src="@/assets/images/user-line-white.png" alt="login_user_icon">
        </template>
      </w-input> 
      <w-input
        class="login__input"
        label="Senha"
        name="user_password"
        placeholder="Digite sua senha"
        type="password"
      >
        <template #icon>
            <img src="@/assets/images/password.png" alt="login_user_password">
        </template>
      </w-input>
      <w-button
        id="btn-entrar"
        text="Entrar"
        value="entrar"
        name="btn-entrar"
      />
    </div>
    <div class="login__footer">
        <a class="login__privacity" href="#">Política de privacidade</a>
        <p class="login_copyright">&copyCopyright2024</p>
      </div>
  </div>
   
</template>

<script>
import WInput from '@/components/Input.vue'
import WButton from '@/components/Button.vue'
export default {
  name: 'login',
  components: {
    WInput,
    WButton 
  },
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
    min-height: 100vh;
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

    &--primary {
      color: green;
    }

    &--secondary {
      color: black;
    }
  }

  &__description {
    color: #FFFFFF99;
    font-size: 16px;
    font-weight: 400;
    line-height: 18.75px;
    text-align: left;
  }

  &__header {
    margin-bottom: 16px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    
  }

  &__privacity {
    text-decoration: none;    
    color: var(--color-text);
  }

  &__copyright {
    margin: 0px;
  }
} 
</style>