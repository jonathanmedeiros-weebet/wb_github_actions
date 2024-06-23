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
        type="email"
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
        @click="openModal"
      />
    </div>

    <WModal v-if="isModalVisible" @close="closeModal" title="Example Modal">
      
      <template #title>
        <p>Title</p>
      </template>

      <template #body>
        <p>Item in content body</p>
        <p>Item in content body</p>
        <p>Item in content body</p>
        <p>Item in content body</p>
        <p>Item in content body</p>
        <p>Item in content body</p>
        <p>Item in content body</p>
        <p>Item in content body</p>
        
      </template>
      
      <template #footer>
        <p>Footer</p>
      </template>
      
    </WModal>
  </div>
   
</template>

<script>
import WInput from '@/components/Input.vue'
import WButton from '@/components/Button.vue'
import WModal from '@/components/Modal.vue'
export default {
  name: 'login',
  components: {
    WInput,
    WButton,
    WModal
  },
  data() {
    return {
      isModalVisible: false
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
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

} 
</style>