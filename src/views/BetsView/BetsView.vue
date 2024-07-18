<template>
  <div class="bets">
    <Header title="Apostas" :showBackButton="true" />
    <div class="bets__container">
      
      <div class="bets__contente">
        <w-input
          id="inputApostador"
          label="Apostador"
          name="apostador"
          placeholder=""
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
          label="Data"
          placeholder="dd/mm/aaaa"
          type="date"
          @click="handleOpenCalendarModal"
          v-model="dateFilter"
          
        />
        <w-button
          id="btn-filter"
          text="Filtar"
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
              <div :class="{
                'bets__card-footer--inline': bet.status === 'Pendente',
                'bets__card-footer':  bet.status !== 'Pendente'
              }">
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
                  @click="handleOpenPayModal"
                  v-if="bet.status === 'Pendente'"
                />
                <w-button
                  id="btn-finish"
                  text="Encerrar aposta"
                  value="finish"
                  name="finish"
                  class="button--secondary"
                  v-if="bet.status === 'Pendente'"
                />
              </div>
            </template>
          </card-bets>
        </div>
      </div>

      <WModal v-if="showModalPay" @close="handleClosePayModal">
        
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
import { find, getById } from '@/services'
import moment from 'moment'
import { formatCurrency } from '@/utilities'

export default {
  name: 'bets',
  components: { 
    Header,
    WInput,
    WButton,
    WModal,
    CardBets,
    TagButton,
    ModalCalendar
  },
  data() {
    return {
      code: '',
      showModalPay: false,
      showResults: false,
      showModalCalendar: false,
      dateFilter: null,
      activeButton: 'todos',
      apostador: '',
      bets: [],
      parametros: {
        codigo: '',
        dataInicial: '',
        dataFinal: '',
        status: '',
        apostador: '',
        sort: '',
        otimizado: true,
      },
    }
  },
  methods: {
    handleOpenPayModal(){
      this.showModalPay = true;
    },
    handleClosePayModal() {
      this.showModalPay = false;
    },
    handleOpenCalendarModal() {      
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    handleCalendar(dateTime) {
      this.dateFilter = dateTime.format('YYYY-MM-DD');
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
        console.log(resp);
        this.bets = resp.results;
        this.showResults = true;
        
      })
      .catch(error => {
        console.error(error);
      })
    },
    goToTickets() {
      this.$router.push( { name: 'tickets' } );
    },
    async viewTicket(bet) {
      getById(bet.id)
      .then(resp => {
        console.log(resp);
      })
      .catch(error => {
        console.log(error);
      })
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