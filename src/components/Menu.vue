<template>
  <div class="menu">
    <section class="menu__container">
      <div class="user-info">
        <img class="user-info__icon" src="../assets/user-line.png" alt="User Icon">
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
            <i class="fas fa-eye wallet__icon" @click="toggleCreditoVisibility"></i>
          </span>
        </div>

        <div class="wallet__item">
          <p class="wallet__label">Saldo</p>
          <span class="wallet__value">
            R$ {{ isSaldoVisible ? saldo : '*******' }}
            <i class="fas fa-eye wallet__icon" @click="toggleSaldoVisibility"></i>
          </span>
        </div>

        <div class="wallet__shortcuts">
          <button class="wallet__button wallet__button--dash">
            <img src="../assets/dashboard.png" alt="Dashboard Icon">Dashboard
          </button>
          <button class="wallet__button wallet__button--consulta">
            <img src="../assets/consultar.png" alt="Consultar Bilhete Icon">Consultar Bilhete
          </button>
          <button class="wallet__button">
            <img src="../assets/consultar.png" alt="Apuração Icon">Apuração
          </button>
        </div>
      </div>

      <div class="more-options">
        <span class="more-options__text">Mais opções</span>
        <div class="card">
          <button class="more-options__item">
            <img src="../assets/movimentacoes.png" alt="Movimentações Icon"> Movimentações
          </button>
          <button class="more-options__item">
            <img src="../assets/alterar.png" alt="Alterar senha Icon"> Alterar senha
          </button>
          <button class="more-options__item">
            <img src="../assets/configuracoes.png" alt="Configurações Icon"> Configurações
          </button>
          <button class="more-options__item">
            <img src="../assets/resultados.png" alt="Resultados Icon"> Resultados
          </button>
          <button class="more-options__item">
            <img src="../assets/sair.png" alt="Sair Icon"> Sair
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MenuComponent',
  data() {
    return {
      name: "Marcos Felipe",
      credito: "850,00",
      saldo: "17,58",
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

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
  background-color: #000000;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  position: relative;
}

.menu__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5px;
  margin-top: 32px;
}

.menu {
  color: #ffffff;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info__icon {
  position: relative;
  padding: 10px;
  width: 40px;
  height: 40px;
}

.user-info__welcome {
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
}

.user-info__greeting {
  opacity: 0.7;
}

.user-info__name {
  font-size: 20px;
}

.wallet {
  position: fixed;
  font-family: 'Poppins', sans-serif;
  width: 350px; 
  height: 200px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #181818;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  z-index: 1000;
}

.wallet__item {
  margin-bottom: 30px;
}

.wallet__label {
  margin-top: 2px;
  font-family: 'Poppins', sans-serif;
  color: #ffffff;
  opacity: 0.5;
  margin-bottom: 11px;
}

.wallet__value {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 18px; 
}

.wallet__icon {
  margin-left: 10px;
  cursor: pointer;
  color: gray;
  opacity: 0.6;
}

.wallet__shortcuts {
  display: flex;
  justify-content: space-between;
  
}

.wallet__button {
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  padding: 13px 7px;
  gap: 3px;
  background-color: #ffffff;
  border: none;
  border-radius: 18px;
  color: rgb(0, 0, 0); 
}

.more-options {
  margin-top: 250px;
  padding: 20px;
}

.more-options__text {
  color: #ffffff;
  font-size: 24px; 
  font-family: 'Roboto', sans-serif;
}


.card {
  margin-top: 30px;
  position: fixed;
  font-family: 'Poppins', sans-serif;
  width: 346px; 
  height: 226px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #181818;
  padding: 20px;
  border-radius: 10px;
}


.more-options__item {
  display: flex;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  margin-top: -8px; 
  font-family: 'Roboto', sans-serif;
  text-align: left;
  padding-left: 0; 
  padding-top: 12px;
  height: 56px;
}

.more-options__item img {
  margin-right: 18px;
  width: 14px;
  height: 18px;
}

</style>
