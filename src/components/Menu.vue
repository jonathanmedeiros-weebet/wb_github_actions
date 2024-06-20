<template>
  <div class="menu container">
    <div class="menu__user-icon">
      <img src="../assets/user-line.png" alt="User Icon">
    </div>
    <div class="menu__user-info">
      <h5 class="menu__user-info__greeting">Olá,</h5>
      <h2 class="menu__user-info__name">{{ name }}</h2>
    </div>
    <div class="card card--first">
      <div class="card__close-icon" @click="toggleModal">&times;</div>
      <div class="card__content">
        <p class="card__label">Crédito</p>
        <div class="card__balance">
          <h2 class="card__balance__value">R$ {{ showCredito ? credito : '********' }}</h2>
          <span class="card__eye-icon" @click="toggleCreditoVisibility">
            <i class="far" :class="showCredito ? 'fa-eye' : 'fa-eye-slash'" style="color: rgba(255, 255, 255, 0.5);"></i>
          </span>
        </div>
        <p class="card__label">Saldo</p>
        <div class="card__balance">
          <h2 class="card__balance__value">R$ {{ showSaldo ? saldo : '********' }}</h2>
          <span class="card__eye-icon" @click="toggleSaldoVisibility">
            <i class="far" :class="showSaldo ? 'fa-eye' : 'fa-eye-slash'" style="color: rgba(255, 255, 255, 0.5);"></i>
          </span>
        </div>
        <div class="card__button-group">
          <button class='card__button card__button--dash'><img src="../assets/dashboard.png" alt="">Dashboard</button>
          <button class='card__button card__button--consulta'><img src="../assets/consultar.png" alt="">Consultar Bilhete</button>
          <button class='card__button'>Apuração</button>
        </div>
      </div>
    </div>
    <div class="menu__options-container">
      <h4 class="menu__option-text">Mais opções</h4>
    </div>
    <div class="card card--second">
      <button class="card__second__button"><img src="../assets/movimentacoes.png" alt="">Movimentações</button>
      <button class="card__second__button"><img src="../assets/alterar.png" alt="">Alterar senha</button>
      <button class="card__second__button"><img src="../assets/configuracoes.png" alt="">Configurações</button>
      <button class="card__second__button"><img src="../assets/resultados.png" alt="">Resultados</button>
      <button class="card__second__button"><img src="../assets/sair.png" alt="">Sair</button>
    </div>
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
      showCredito: false,
      showSaldo: false
    };
  },
  methods: {
    toggleCreditoVisibility() {
      this.showCredito = !this.showCredito;
      if (this.showCredito) {
        this.credito = "850,00";
      } else {
        this.credito = "********";
      }
    },
    toggleSaldoVisibility() {
      this.showSaldo = !this.showSaldo;
      if (this.showSaldo) {
        this.saldo = "17,58";
      } else {
        this.saldo = "********";
      }
    },
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.menu {
  color: #ffffff;
}

.menu__user-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px;
  width: 16px;
  height: 25px;
  gap: 0px;
  opacity: 0px;
  margin-top: 20px;
  font-size: 24px;
  border-radius: 50%;
}

.menu__user-info {
  position: absolute;
  top: 10px;
  left: 68px;
  font-family: 'Roboto', sans-serif;
}

.menu__user-info__greeting {
  margin-bottom: -18px;
  opacity: 0.5;
}

.card {
  position: fixed;
  font-family: 'Poppins', sans-serif;
  width: 350px;
  height: 227px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #181818;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  z-index: 1000;
}

.card--first {
  top: 120px; 
}

.card__close-icon {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  opacity: 0;
}

.card__close-icon:hover {
  opacity: 1;
}

.card__content h2 {
  color: #ffffff;
  margin-top: -5px;
}

.card__content p {
  color: #ffffff;
  margin-top: 2px;
  opacity: 0.5;
}

.card__button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.card__button {
  display: flex;
  align-items: center;
  font-family: 'Roboto', sans-serif;
  padding: 10px 20px;
  background-color: #ffffff;
  border: none;
  border-radius: 25px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  margin-right: 10px;
}

.card__button:last-child {
  margin-right: 0;
}

.card__eye-icon {
  cursor: pointer;
  margin-top: -30px;
}

.card__button--dash {
  display: flex;
  align-items: center;
  padding: 13px 7px;
  gap: 2px;
  opacity: 1;
}

.card__button--consulta {
  display: flex;
  align-items: center;
  padding: 13px 7px;
  gap: 2px;
  opacity: 1;
}

.card__button--dash img {
  width: 12.5px;
  height: 12.5px;
  margin-right: 5px;
}

.card__balance {
  display: flex;
  align-items: center;
}

.card__balance__value {
  margin-right: 10px;
}

.menu__options-container {
  position: fixed;
  top: 390px;
  left: 18%;
  transform: translateX(-50%);
  z-index: 1001; 
  text-align: center;
}

.menu__option-text {
  color: #ffffff;
  font-size: 18px; 
  font-family: 'Roboto', sans-serif;
}

.card--second {
  position: fixed;
  top: 450px; 
  left: 50%;
  transform: translateX(-50%);
  width: 350px;
  background-color: #181818;
  padding: 20px; 
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  height: 174px;
  z-index: 1000;
}

.card__second__button {
  display: flex;
  align-items: center; 
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  margin-top: -15px; 
  font-family: 'Roboto', sans-serif;
  text-align: left;
  padding-left: 0; 
  padding-top: 23px; 
}

.card__second__button img {
  margin-right: 18px;
  width: 14px;
  height: 18px;
}

.card__second__button:hover {
  text-decoration: underline;
}
</style>
