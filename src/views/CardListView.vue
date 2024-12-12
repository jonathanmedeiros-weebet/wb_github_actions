<template>
  <div class="bets-cards">
    <Header title="Cartões de Aposta" :showBackButton="true" />
    <div class="bets-cards__container">
      
      <div class="bets-cards__content">
        <w-input
          id="inputApostador"
          label="Apostador"
          name="apostador"
          placeholder="Apostador"
          type="text"
          v-model="apostador"
          v-if="showBettorName"
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
      
      <div class="bets-cards__results" v-if="bets.length > 0">
        <p class="bets-cards__count-results">Quantidade de cartões: {{ bets.length }}</p>
  
        <div class="bets-cards__content-filters" v-for="bet in bets" :key="bets.id">
          <card-bets>
            <template #title>
              <p>Código da Aposta: {{ bet.chave }}</p>
            </template>
            <template #subtitle>
              <p>HORÁRIO: {{ formateDateTime(bet.data_registro) }}</p>
            </template>
            <template #body>
              <p v-if="bet.apostador">Apostador: {{ bet.apostador }}</p>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="table__line--left">Crédito:</td>
                    <td class="table__line--right">R$ {{ bet.total_creditos }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Prêmio:</td>
                    <td class="table__line--right">R$ {{ bet.premio }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Saques:</td>
                    <td class="table__line--right">R$ {{ bet.total_saques }}</td>
                  </tr>
                  <tr>
                    <td class="table__line--left">Saldo:</td>
                    <td class="table__line--right">R$ {{ bet.saldo }}</td>
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
import { formatDateTimeBR, convertInMomentInstance, formatCurrency, now, capitalizeFirstLetter } from '@/utilities'
import { FindCardBet } from '@/services'
import { useConfigClient, useToastStore } from '@/stores'
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
      showModalCancel: false,
      showModalPay: false,
      showResults: false,
      showModalCalendar: false,
      dateFilter: now(),
      finalDateFilter: now(),
      apostador: '',
      bets: {},
      betSelected: null,
      parametros: {
        dataInicial: '',
        dataFinal: '',
        apostador: '',
        sort: ''
      },
      showToast: false,
      toastText: '',
      options: null,
      toastStore: useToastStore(),
      configClientStore: useConfigClient(),
    }
  },
  mounted() {
    this.options = this.configClientStore.options;
  },
  computed: {
    dateFilterView() {
      const initialDate = convertInMomentInstance(this.dateFilter).format("DD/MM/YYYY");
      const finalDate = convertInMomentInstance(this.finalDateFilter).format("DD/MM/YYYY");
      return `${initialDate} - ${finalDate}`;
    },
    showBettorName() {
      return !this.configClientStore.bettorDocumentNumberEnabled;
    },
  },
  methods: {
    capitalizeFirstLetter,
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
    formatCurrencyMoney(value) {
      return formatCurrency(value);
    },  
    getResults() {
      this.parametros.dataInicial = this.dateFilter ? convertInMomentInstance(this.dateFilter).format("YYYY-MM-DD") : now().format("YYYY-MM-DD");
      this.parametros.dataFinal = this.finalDateFilter ? convertInMomentInstance(this.finalDateFilter).format("YYYY-MM-DD") : this.parametros.dataInicial;
      this.parametros.apostador = this.apostador;
      this.parametros.sort = '-horario'

      this.getCardBets();
    },
    async getCardBets() {
      this.bets = [];
      this.showResults = false;
      
      const params = { ...this.parametros };
      FindCardBet(params)
      .then(async (resp) => {
        console.log('Resposta da API:', resp);
        this.bets = resp.results;
        console.log('ARRAY',this.bets);
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
    min-height: 390px;
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
.button-spacer {
  width: 10px; 
}
#btn-view,
#btn-cancel {
  color: var(--foreground-header);
}

</style>