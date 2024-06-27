<template>
  <div class="menu">
    <section class="menu__container">
      <div class="user-info">
        <img class="user-info__icon" src="../assets/images/user-line.png" alt="User Icon">
        <div class="user-info__welcome">
          <span class="user-info__greeting">Olá,</span>
          <span class="user-info__name">{{ name }}</span>
        </div>
      </div>

      <div class="wallet">
        <div class="wallet__item">
          <p class="wallet__label">Crédito</p>
          <span class="wallet__value">
            R$ {{ isCreditoVisible ? credito : '*******' }}
            <IconEyeClose v-if="isCreditoVisible" class="wallet__eye" @click="toggleCreditoVisibility" />
            <IconEye v-else class="wallet__eye" @click="toggleCreditoVisibility" />
          </span>
        </div>

        <div class="wallet__item">
          <p class="wallet__label">Saldo</p>
          <span class="wallet__value">
            R$ {{ isSaldoVisible ? saldo : '*******' }}
            <IconEyeClose v-if="isSaldoVisible" class="wallet__eye" @click="toggleSaldoVisibility" />
            <IconEye v-else class="wallet__eye" @click="toggleSaldoVisibility" />
          </span>
        </div>

        <div class="wallet__shortcuts">
          <button class="wallet__button">
            <IconInsertChart class="wallet__icon"/>
            Dashboard
          </button>
          <button class="wallet__button">
            <IconManageSearch class="wallet__icon" />
            Consultar Bilhete
          </button>
          <button class="wallet__button" @click="navigateTo('/verification')">
            <IconFactCheck class="wallet__icon" />
            Apuração
          </button>
        </div>
      </div>

      <div class="more-options">
        <span class="more-options__text">Mais opções</span>
        <div class="more-options__card">
          <button class="more-options__item">
            <IconMoney class="more-options__icon" />
            Movimentações
          </button>
          <button class="more-options__item">
            <IconPassKey class="more-options__icon" />
            Alterar senha
          </button>
          <button class="more-options__item">
            <IconSettings class="more-options__icon" />
            Configurações
          </button>
          <button class="more-options__item">
            <IconFactCheck class="more-options__icon" />
            Resultados
          </button>
          <button class="more-options__item">
            <IconLogout class="more-options__icon" />
            Sair
          </button>
        </div>
      </div> 
    </section>
  </div>
</template>


<script>
import Header from '@/components/layouts/Header.vue'

export default {
  name: 'menu',
  data() {
    return {
      name: "Marcos Felipe",
      credito: "850,00",
      saldo: "18.258,00",
      isCreditoVisible: false,
      isSaldoVisible: false
    };
  },
  methods: {
    toggleCreditoVisibility() {
      console.log('Toggling Credito Visibility');
      this.isCreditoVisible = !this.isCreditoVisible;
    },
    toggleSaldoVisibility() {
      console.log('Toggling Saldo Visibility');
      this.isSaldoVisible = !this.isSaldoVisible;
    },
    navigateTo(route) {
      this.$router.push(route);
    }
  }
}
</script>

<style lang="scss" scoped>
</style>