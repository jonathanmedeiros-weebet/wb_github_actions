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
          <button class="wallet__button">
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
import IconEye from '@/components/icons/IconEye.vue';
import IconEyeClose from '@/components/icons/IconEyeClose.vue';
import IconMoney from '@/components/icons/IconMoney.vue';
import IconSettings from '@/components/icons/IconSettings.vue';
import IconLogout from '@/components/icons/IconLogout.vue';
import IconPassKey from '@/components/icons/IconPassKey.vue';
import IconFactCheck from '@/components/icons/IconFactCheck.vue';
import IconManageSearch from '@/components/icons/IconManageSearch.vue';
import IconInsertChart from '@/components/icons/IconInsertChart.vue';

export default {
  components: {
    IconEye, IconEyeClose, IconMoney, IconSettings, IconLogout, 
    IconPassKey, IconFactCheck, IconManageSearch, IconInsertChart
  },
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
    }
  }
}
</script>


<style lang="scss" scoped>
.menu {
  color: #ffffff;
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 25px;

    margin: 0;
    padding: 0 20px;
    padding-top: 70px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  &__welcome {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    font-size: 24px;
    font-weight: 500;
    line-height: 24px;
  }

  &__greeting {
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
    color: #FFFFFF80;
  }
}

.wallet {
  
  width: 100%;
  height: auto;
  background-color: #181818;
  border-radius: 10px;
  padding: 22px 18px;
  gap: 29px;
  padding-top: 16px;

  &__item {
    margin-bottom: 15px;
  }

  &__label {
    display: flex;
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
    opacity: 0.5;
    margin-bottom: 8px;
    font-size: 13px; 
  }

  &__value {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 20px; 
  }

  &__eye {
    margin-left: 15px;
    cursor: pointer;
    color: #ffffff80;
    opacity: 0.5;
  }

  &__shortcuts {
    display: flex;
    justify-content: space-between;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    background-color: #ffffff;
    border: none;
    border-radius: 18px;
    color: rgb(0, 0, 0); 
    padding: 10px 10px;
    gap: 1px;
    opacity: 0px;
    white-space: nowrap;
    font-size: 10px;
  }

  &__icon {
    fill: #181818;
    align-items: center;
  }
}

.more-options {
  display: flex;
  flex-direction: column;

  &__text {
    color: #ffffff;
    font-size: 16px;
    padding-bottom: 10px;
  }

  &__card {
    width: 100%;
    background-color: #181818;
    padding: 18px;
    padding-top: 8px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: inherit;
    padding-top: 10px;
    font-size: 14px;
  }

  &__icon {
    margin-left: -10px;
    margin-right: 10px;
  }
}
</style>
