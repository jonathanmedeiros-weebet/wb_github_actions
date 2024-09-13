<template>
  <div class="bets">
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
          label="Data"
          type="text"
          placeholder="dd/mm/aaaa"
          @click="handleOpenCalendarModal"
          v-model="dateFilterView"
          :readonly="true"
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
                  @click="goToTickets(bet, 'view')"
                />
                <div class="button-spacer"></div>
                <w-button
                  id="btn-cancel"
                  text="Cancelar"
                  value="cancel"
                  name="btn-cancel"
                  class="button--secondary"
                  @click="handleOpenCancelModal(bet)"
                />

                <w-button
                  id="btn-payer"
                  text="Pagar"
                  value="payer"
                  name="btn-payer"
                  class="button--secondary"
                  @click="handleOpenPayModal(bet)"
                  v-if="bet.pago === false && bet.resultado === 'ganhou' && !bet.cartao_aposta"
                />
                <w-button
                  id="btn-finish"
                  text="Encerrar aposta"
                  value="finish"
                  name="finish"
                  class="button--secondary"
                  v-if="bet.pago === false && ['cambista', 'todos'].includes(options.permitir_encerrar_aposta) && canClose(bet)"
                  @click="goToTickets(bet, 'close')"
                />
              </div>
            </template>
          </card-bets>
        </div>
      </div>

      <WModal 
        ref="modalPay" 
        v-if="showModalPay" 
        @close="handleClosePayModal"
      >
        
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
            @click="handleButtonNoPayBet"
          />
          
        </template>
      </WModal>

      <WModal 
        ref="modalCancel"
        v-if="showModalCancel" 
        @close="handleCloseCancelModal"
      >
        
        <template #title>
          <p>Cancelar aposta</p>
          <p class="bets__text-light">Tem certeza que deseja cancelar a aposta?</p>
        </template>

        <template #body>             
          <w-button
            id="btn-cancel-yes"
            text="Sim"
            value="yes"
            name="btn-yes"
            class="button--primary"
            @click="confirmCancelBet"
          />
          <div class="button-space"></div>
          <w-button
            id="btn-no"
            text="Não"
            value="no"
            name="btn-no"
            class="button--secondary"
            @click="handleButtonNoCancelBet"
          />
          
        </template>
      </WModal>

      <ModalCalendar
        v-if="showModalCalendar"
        :initialDate="dateFilter"
        :finalDate="finalDateFilter"
        :isMultiDate="true"
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
import { cancelBet, findBet, getBetById, payBet } from '@/services'
import { formatDateTimeBR, convertInMomentInstance, formatCurrency, now } from '@/utilities'
import { useConfigClient, useToastStore } from '@/stores'
import Toast from '@/components/Toast.vue'
import { ToastType } from '@/enums';

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
    this.options = options;
  },
  data() {
    return {
      code: '',
      showModalCancel: false,
      showModalPay: false,
      showResults: false,
      showModalCalendar: false,
      dateFilter: now(),
      finalDateFilter: now(),
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
        sort: ''
      },
      showToast: false,
      toastText: '',
      permitir_encerrar_aposta: false,
      options: null,
      toastStore: useToastStore(),
      isLastBet: false,
    }
  },
  watch: {
    activeButton(newValue, oldValue){
      this.parametros.status = newValue == 'todos' ? '' : newValue; 
      this.getApiBets();
    },
  },
  computed: {
    dateFilterView() {
      const initialDate = convertInMomentInstance(this.dateFilter).format("DD/MM/YYYY");
      const finalDate = convertInMomentInstance(this.finalDateFilter).format("DD/MM/YYYY");
      return `${initialDate} - ${finalDate}`;
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
    },
    handleButtonNoPayBet() {
      this.$refs.modalPay.handleClose();
      this.handleClosePayModal();
    },
    handleOpenCancelModal(bet){
      if(this.canCancel(bet)){
        this.betSelected = bet;
        this.showModalCancel = true;
      }else{
        this.toastStore.setToastConfig({
          message: 'Sem permissão para cancelar a aposta',
          type: ToastType.WARNING,
          duration: 5000
        })
      }
    },
    handleCloseCancelModal() {
      this.betSelected = null;
      this.showModalCancel = false;
    },
    handleButtonNoCancelBet() {
      this.$refs.modalCancel.handleClose();
      this.handleCloseCancelModal();
    },
    handleOpenCalendarModal() {    
      event.stopPropagation();
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    handleCalendar({initialDate, finalDate}) {
      this.dateFilter = initialDate;
      this.finalDateFilter = finalDate;
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
      this.parametros.dataInicial = this.dateFilter ? convertInMomentInstance(this.dateFilter).format("YYYY-MM-DD") : now().format("YYYY-MM-DD");
      this.parametros.dataFinal = this.finalDateFilter ? convertInMomentInstance(this.finalDateFilter).format("YYYY-MM-DD") : this.parametros.dataInicial;
      this.parametros.status = this.activeButton == 'todos' ? '' : this.activeButton;
      this.parametros.apostador = this.apostador;
      this.parametros.sort = '-horario'
      
      this.getApiBets();
    },
    async getApiBets() {
      this.bets = [];
      this.showResults = false;
      findBet(this.parametros)
      .then(resp => {
        this.bets = resp.results;
        this.showResults = true;
      })
      .catch(error => {
        this.toastStore.setToastConfig({
          message: error.errors.message,
          type: ToastType.DANGER,
          duration: 5000
        })
      })
    },
    goToTickets(bet, action) {
      this.$router.push({ 
        name: 'close-bet',
        params: {
          id: bet.id,
          action: action
        }
      });
    },
    async pay() {
      payBet(this.betSelected.id)
      .then(resp => {
        if(resp.results.pago){
          this.toastStore.setToastConfig({
            message: 'Pagamento realizado com sucesso!',
            type: ToastType.SUCCESS,
            duration: 5000
          })
        }else{
          this.toastStore.setToastConfig({
            message: 'Não foi possível realizar o pagamento. Se o erro persistir, entre em contato com o suporte',
            type: ToastType.DANGER,
            duration: 5000
          })
        }
        this.getResults();
      })
      .catch(error => {
        this.toastStore.setToastConfig({
          message: error.errors.message,
          type: ToastType.DANGER,
          duration: 5000
        })
      })
      .finally(() => {
        this.$refs.modalPay.handleClose();
        this.handleClosePayModal();
      })
    },
    formateDateTime(datetime) {
      return formatDateTimeBR(datetime);
    },
    capitalizeFirstLetter(str) {
      if(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
      }else{
        return str;
      }
    },
    canClose(bet) {
      const strategy = this.options.closure_strategy;     

      if (strategy === 'probability') {
          const itemSemProbabilidade = bet.itens.find((item) => item.probabilidade == null);
  
          if (itemSemProbabilidade || (new Date(bet.horario) < new Date('2024-05-08 13:00:00'))) {
              return false;
          }
      }

      const found = bet.itens.find((item) => !item.encerrado && !item.resultado && !item.cancelado);
      if(!found) {
          return false;
      }

      if(bet.resultado) {
          return false;
      }

      return true;
    },
    canCancel(bet) {
      let result = false;
      this.isLastBet = false;

      getBetById(bet.id, { 'verificar-ultima-aposta': 'true' })
      .then(resp => {
        this.isLastBet = resp.results.is_ultima_aposta ?? false;
      })
      .catch(error => {
        this.toastStore.setToastConfig({
          message: error.errors.message,
          type: ToastType.DANGER,
          duration: 5000
        })
      })

      if (this.options.habilitar_cancelar_aposta) {
        result = true;
      } 
      else if (this.options.habilitar_cancelar_ultima_aposta && this.isLastBet) {
          result = true;
      }
      return result;
    },
    async confirmCancelBet() {
      cancelBet(this.betSelected)
      .then(resp => {
        this.toastStore.setToastConfig({
          message: resp.results?.message ?? 'Aposta cancelada com sucesso!',
          type: ToastType.SUCCESS,
          duration: 5000
        })
        this.getResults();
      })
      .catch(error => {
        this.toastStore.setToastConfig({
          message: error.errors?.message,
          type: ToastType.DANGER,
          duration: 5000
        })
      })
      
      this.$refs.modalCancel.handleClose();
      this.handleCloseCancelModal();
      
    }
  }
}
</script>

<style lang="scss" scoped>
.bets {  
  height: 100;
  padding-bottom: 100px;
  overflow-y: auto;

  &__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
  }

  &__contente {
    min-height: 390px;
    display: flex;
    flex-direction: column;
  }

  &__results {
    padding-bottom: 80px;
  }

  &__count-results {
    padding-top: 30px;
    color: #ffffff80;
    color: var(--color-text-input);
  }

  &__buttons-filters {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    overflow-x: auto;
    white-space: nowrap;
    
  }

  &__buttons-filters::-webkit-scrollbar {
    display: none;  
  }

  &__content-filters {
    margin-top: 24px;
  }

  &__card-footer {
    display: flex;
    flex-direction: column;
   

    &--inline {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    
  }

  &__text-light {
    color: #ffffff80;
    color: var(--color-text-input);
  }
  
}

.button-space {
  margin-top: 5px;
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
      color: #6da544;
      color: var(--color-success);
    }
    &--danger {
      color: #f61a1a;
      color: var(--color-danger);
    }
  }
}
.button-spacer {
  width: 10px; 
}
</style>