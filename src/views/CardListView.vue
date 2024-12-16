<template>
  <div class="bets-cards">
    <Header title="Cartões de aposta" :showBackButton="true" />
    <div class="bets-cards__container">
      
      <div class="bets-cards__content">
        <w-input
          id="inputApostador"
          label="Apostador"
          name="apostador"
          placeholder="Apostador"
          type="text"
          v-model="gambler"
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
      
      <div class="bets-cards__results" v-if="showResults">
        <p class="bets-cards__count-results">Quantidade de cartões: {{ cards.length }}</p>
  
        <div class="bets-cards__content-filters" v-for="(card, index) in cards" :key="index">
          <card-bets>
            <template #title>
              <p>Código do cartão de aposta: {{ card.chave }}</p>
            </template>
            <template #subtitle>
              <p>HORÁRIO: {{ formateDateTime(card.data_registro) }}</p>
            </template>
            <template #body>
              <p v-if="card.apostador">Apostador: {{ card.apostador }}</p>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="table__line--left">Crédito:</td>
                    <td class="table__line--right">R$ {{ formatCurrencyMoney(card.total_creditos) }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Prêmio:</td>
                    <td class="table__line--right">R$ {{ formatCurrencyMoney(card.premios) }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Saques:</td>
                    <td class="table__line--right">R$ {{ formatCurrencyMoney(card.total_saques) }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Saldo:</td>
                    <td class="table__line--right">R$ {{ formatCurrencyMoney(card.saldo) }}</td>
                  </tr>
                </tbody>  
              </table>
            </template>
          </card-bets>
        </div>
      </div>

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
import { formatDateTimeBR, convertInMomentInstance, formatCurrency, now } from '@/utilities'
import { findCardBet } from '@/services'
import { useToastStore } from '@/stores'
import Toast from '@/components/Toast.vue'
import { ToastType } from '@/enums';

export default {
  name: 'bets-cards',
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
  data() {
    return {
      showResults: false,
      showModalCalendar: false,
      dateFilter: now(),
      finalDateFilter: now(),
      gambler: '',
      cards: [],
      params: {
        initialDate: '',
        finalDate: '',
        gambler: '',
        sort: ''
      },
      toastStore: useToastStore(),
    }
  },
  computed: {
    dateFilterView() {
      const initialDate = convertInMomentInstance(this.dateFilter).format("DD/MM/YYYY");
      const finalDate = convertInMomentInstance(this.finalDateFilter).format("DD/MM/YYYY");
      return `${initialDate} - ${finalDate}`;
    }
  },
  methods: {
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
    formatCurrencyMoney(value) {
      return formatCurrency(value);
    },  
    getResults() {
      this.params.initialDate = this.dateFilter ? convertInMomentInstance(this.dateFilter).format("YYYY-MM-DD") : now().format("YYYY-MM-DD");
      this.params.finalDate = this.finalDateFilter ? convertInMomentInstance(this.finalDateFilter).format("YYYY-MM-DD") : this.params.initialDate;
      this.params.gambler = this.gambler;
      this.params.sort = '-dataRegistro'

      this.getCardBets();
    },
    async getCardBets() {
      this.cards = [];
      this.showResults = false;
      
      const params = { ...this.params };
      findCardBet(params)
        .then(async (resp) => {
          this.cards = resp;
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
    formateDateTime(datetime) {
      return formatDateTimeBR(datetime);
    }
  }
}
</script>

<style lang="scss" scoped>
.bets-cards {  
  height: 100;
  padding-bottom: 100px;
  overflow-y: auto;

  &__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
  }

  &__content {
    min-height: 290px;
    display: flex;
    flex-direction: column;
  }

  &__results {
    padding-bottom: 80px;
  }

  &__count-results {
    color: #ffffff80;
    color: var(--foreground-header);
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
    color: var(--foreground-league-input);
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
}

</style>