<template>
  <div class="bets">
    <toast 
      v-if="showToast" 
      type="danger" 
      @close="showToast = false"
    >
      {{ toastText }}
    </toast>
    <Header title="Apostas" :showBackButton="true" />
    <div class="bets__container">
      
      <div class="bets__contente">
        <w-input
          id="inputApostador"
          label="Apostador"
          name="apostador"
          placeholder="Apostador"
          type="email"
          v-model="apostador"
        />
        <w-input
          id="inputCode"
          label="Código"
          name="code"
          placeholder="XXXX-XXXX"
          type="text"
          mask="XXXX-XXXX"
          autocomple="off"
          v-model="code"
        />
        <w-input
          id="inputDate"
          name="inputDate"
          label="email"
          type="email"
          placeholder="dd/mm/aaaa"
          @click="handleOpenCalendarModal"
          v-model="dateFilter"
          
        />
        <w-button
          id="btn-filter"
          text="Filtrar"
          value="filter"
          name="btn-filter"
          class="button--primary"
          @click="getResults"
        />
      </div>
      
      <div class="bets__results" v-if="showResults">
        <p class="bets__count-results">{{ bets.length }} apostas encontradas</p>
  
        <div class="bets__buttons-filters">
          <tag-button
            id="btn-all"
            text="Todas"
            value="todos"
            name="btn-all"
            :class="{ 'button--primary': activeButton === 'todos', 'button--secondary': activeButton !== 'todos'}"
            @click="setActive('todos')"
          />
          <tag-button
            id="btn-pendent"
            text="Pendente"
            value="pendente"
            name="btn-pendent"
            :class="{ 'button--primary': activeButton === 'pendente', 'button--secondary': activeButton !== 'pendente'}"
            @click="setActive('pendente')"
          />
          <tag-button
            id="btn-win"
            text="Ganhou"
            value="ganhou"
            name="btn-win"
            :class="{ 'button--primary': activeButton === 'ganhou', 'button--secondary': activeButton !== 'ganhou'}"
            @click="setActive('ganhou')"
          />
          <tag-button
            id="btn-lose"
            text="Perdeu"
            value="perdeu"
            name="btn-lose"
            :class="{ 'button--primary': activeButton === 'perdeu', 'button--secondary': activeButton !== 'perdeu'}"
            @click="setActive('perdeu')"
          />
        </div>
  
        <div class="bets__content-filters" v-for="(bet, index) in bets" :key="index">
          <card-bets>
            <template #title>
              <p>Código da Aposta: {{ bet.codigo }}</p>
            </template>
            <template #subtitle>
              <p>HORÁRIO: {{ formateDateTime(bet.horario) }}</p>
            </template>
            <template #body>
              <p>Apostador: {{ bet.apostador }}</p>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="table__line--left">Valor apostado:</td>
                    <td class="table__line--right">{{ formatCurrencyMoney(bet.valor) }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Comissão:</td>
                    <td class="table__line--right">{{ formatCurrencyMoney(bet.comissao) }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Prêmio:</td>
                    <td class="table__line--right">{{ formatCurrencyMoney(bet.premio) }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Status:</td>
                    <td 
                      class="table__line--right"
                      :class="{ 'table__status--success': bet.resultado === 'ganhou', 'table__status--danger': bet.resultado === 'perdeu' }"
                    >{{ capitalizeFirstLetter(bet.resultado) }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Pagamento:</td>
                    <td class="table__line--right">{{ bet.status_pagamento ?? '-' }}</td>
                  </tr>
                </tbody>  
              </table>
            </template>
  
            <template #footer >
              <div class="bets__card-footer--inline">
                <w-button
                  id="btn-view"
                  text="Visuaizar"
                  value="view"
                  name="btn-view"
                  class="button--secondary"
                  @click="goToTickets(bet)"
                />
                <w-button
                  id="btn-payer"
                  text="Pagar"
                  value="payer"
                  name="btn-payer"
                  class="button--secondary"
                  @click="handleOpenPayModal(bet)"
                  v-if="bet.pago === false && bet.resultado === 'ganhou'"
                />
                <w-button
                  id="btn-finish"
                  text="Encerrar aposta"
                  value="finish"
                  name="finish"
                  class="button--secondary"
                  v-if="bet.pago === false && habilitar_cancelar_aposta == true"
                  @click="goToTickets(bet)"
                />
              </div>
            </template>
          </card-bets>
        </div>
      </div>

      <WModal ref="modalPay" v-if="showModalPay" @close="handleClosePayModal">
        
        <template #title>
          <p>Pagar aposta</p>
          <p class="bets__text-light">Tem certeza que deseja pagar a aposta?</p>
        </template>

        <template #body>             
          <w-button
            id="btn-yes"
            text="Sim"
            value="yes"
            name="btn-yes"
            class="button--primary"
            @click="pay()"
          />
          
          <w-button
            id="btn-no"
            text="Não"
            value="no"
            name="btn-no"
            class="button--secondary"
            @click="handleClosePayModal"
          />
          
        </template>
      </WModal>

      <ModalCalendar
        v-if="showModalCalendar"
        @closeModal="handleCloseCalendarModal"
        @change="handleCalendar"
      />

    </div>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import WInput from '@/components/Input.vue'
import WButton from '@/components/Button.vue'
import WModal from '@/components/Modal.vue'
import CardBets from '@/views/BetsView/parts/CardBet.vue'
import TagButton from '@/components/TagButton.vue'
import ModalCalendar from '@/views/HomeView/parts/ModalCalendar.vue'
import { find, payBet } from '@/services'
import moment from 'moment'
import { formatCurrency } from '@/utilities'
import { useConfigClient } from '@/stores'
import Toast from '@/components/Toast.vue'

export default {
  name: 'bets',
  components: { 
    Header,
    WInput,
    WButton,
    WModal,
    CardBets,
    TagButton,
    ModalCalendar,
    Toast
  },
  mounted() {
    const { options } = useConfigClient();
    this.habilitar_cancelar_aposta = options.habilitar_cancelar_aposta;
  },
  data() {
    return {
      code: '',
      showModalPay: false,
      showResults: false,
      showModalCalendar: false,
      dateFilter: '',
      activeButton: 'todos',
      apostador: '',
      bets: [],
      betSelected: null,
      parametros: {
        codigo: '',
        dataInicial: '',
        dataFinal: '',
        status: '',
        apostador: '',
        sort: '',
        otimizado: true,
      },
      showToast: false,
      toastText: '',
      habilitar_cancelar_aposta: true
    }
  },
  methods: {
    handleOpenPayModal(bet){
      this.betSelected = bet;
      this.showModalPay = true;
    },
    handleClosePayModal() {
      this.betSelected = null;
      this.showModalPay = false;
      this.$refs.modalPay.handleClose();
    },
    handleOpenCalendarModal() {      
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    handleCalendar(dateTime) {
      this.dateFilter = dateTime.format("DD/MM/YYYY");
      this.handleCloseCalendarModal();
    },
    setActive(button) {
      this.activeButton = button;
    },
    formatCurrencyMoney(value) {
      return formatCurrency(value);
    },  
    getResults() {
    
      this.parametros.codigo = this.code.replace(/-/g, '');
      this.parametros.dataInicial = '';
      this.parametros.dataFinal = '';
      this.parametros.status = this.activeButton == 'todos' ? '' : this.activeButton;
      this.parametros.apostador = this.apostador;
      this.parametros.sort = '-horario';
      this.parametros.otimizado = true;
      
      this.getApiBets();
      
    },
    async getApiBets() {
      this.bets = [];
      this.showResults = false;
      find(this.parametros)
      .then(resp => {
        this.bets = resp.results;
        this.showResults = true;
      })
      .catch(error => {
        console.error(error);
      })
    },
    goToTickets(bet) {
      this.$router.push({ 
        name: 'close-bet',
        params: {
          id: bet.id
        }
      });
    },
    async pay() {
      payBet(this.betSelected.id)
      .then(resp => {
        this.getResults();
      })
      .catch(error => {
        console.error(error);
        //TODO: AJUSTAR O RETORNO COM O NOVO AJUSTE NO INTERCEPTOR DO AXIOS
        this.toastText = error.response?.data?.errors?.message ?? 'Usuário ou Senha inválido';
        this.showToast = true;
        
      })
      this.$refs.modalPay.handleClose();
      this.showModalPay = false;
      this.$refs['wmodal'].handleClose();
    },
    formateDateTime(datetime) {
      return moment(datetime).format("DD/MM/YYYY HH:mm");
    },
    capitalizeFirstLetter(str) {
      if(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
      }else{
        return str;
      }
    }
  },
  watch: {
    activeButton(newValue, oldValue){
      this.parametros.status = newValue == 'todos' ? '' : newValue; 
      this.getApiBets();

    },
    dateFilter(newValue) {
      this.dateFilter = newValue;   
    }
  }
}
</script>

<style lang="scss" scoped>
.bets {  

  height: 100%;
  justify-content: space-between;

  &__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
  }

  &__contente {
    display: flex;
    flex-direction: column;
  }

  &__results {
    padding-bottom: 80px;
  }

  &__count-results {
    padding-top: 30px;
    color: var(--color-text-input);
  }

  &__buttons-filters {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    overflow-x: auto;
    white-space: nowrap;
    gap: 8px;
  }

  &__buttons-filters::-webkit-scrollbar {
    display: none;  /* WebKit-based browsers */
  }

  &__content-filters {
    margin-top: 24px;
  }

  &__card-footer {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &--inline {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 8px;
    }
    
  }

  &__text-light {
    color: var(--color-text-input);
  }
  
}

.table {

  width: 100%;

  &__line {   
    
    &--left {
      text-align: left;
    }

    &--right {
      text-align: right;
    }
  }

  &__status {
    &--success {
      color: var(--color-success);
    }
    &--danger {
      color: var(--color-danger);
    }
  }
}
</style>