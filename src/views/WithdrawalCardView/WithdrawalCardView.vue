<template>
  <div class="withdrawal-card">
    <Header title="Saques" :showBackButton="true" />
    <div class="withdrawal-card__container">
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
      <w-select
        label="Status"
        name="status"
        v-model="selectedOption"
        isSelect
        :options="[{ value: '1', text: 'Aprovado' }, { value: '1', text: 'Não Aprovado' }]"
      >
      </w-select>
      <w-button
        id="btn-filter"
        text="Filtrar"
        value="filter"
        name="btn-filter"
        class="button--primary"
        @click="getResults"
      />
      <ModalCalendar
        v-if="showModalCalendar"
        :initialDate="dateFilter"
        :finalDate="finalDateFilter"
        :isMultiDate="true"
        @closeModal="handleCloseCalendarModal"
        @change="handleCalendar"
      />
      
      <div class="withdrawal-card___content-filters" v-for="(item, index) in info" :key="index">
        <div v-if="item.cartao_aposta">
          <card-bets>
            <template #body>
              <table class="table">
                
                  <tbody>
                    <tr>
                      <td class="table__line--left">Apostador: {{ item.cartao_aposta.apostador }}</td>
                    </tr>
                    <tr>
                      <td class="table__line--left">Chave: {{ item.cartao_aposta.chave }}</td>
                    </tr>
                    <tr>
                      <td class="table__line--left">Saldo Atual: R${{ formatCurrencyMoney(item.cartao_aposta.saldo)}}</td>
                    </tr>
                    <tr>
                      <td class="table__line--left">Data Solicitação: {{ formatDateBr(item.data) }}</td>
                    </tr>
                    <tr>
                      <td class="table__line--left">Valor: R${{ formatCurrencyMoney(item.valor) }}</td>
                    </tr>
                    <div class="table__line--payament" v-if="(!item.pago)">
                      <w-button
                        id="btn-filter"
                        text="Confirmar Pagamento"
                        value="filter"
                        name="btn-filter"
                        class="button--primary"
                        @click="handleOpenModalConfirmPayment(item.id, item.version)"
                      />
                    </div>
                  </tbody>
              </table>
            </template>
          </card-bets>
        </div>
      </div>

      <ModalConfirmPayment
        ref="modalConfirmPayment"
        v-if="isModalConfirmPaymentVisible"
        :id="modalItemId" 
        :version="modalItemVersion"
        @close="handleCloseModalConfirmPayment"
        @consult="handleConfirmPayment" 
      />
    </div>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import WInput from '@/components/Input.vue'
import WSelect from '@/components/Select.vue'
import WButton from '@/components/Button.vue'
import WModal from '@/components/Modal.vue'
import CardBets from '@/views/BetsView/parts/CardBet.vue'
import TagButton from '@/components/TagButton.vue'
import ModalCalendar from '@/views/HomeView/parts/ModalCalendar.vue'
import { convertInMomentInstance, formatCurrency, now, formatDateTimeBR } from '@/utilities'
import { useConfigClient, useToastStore } from '@/stores'
import Toast from '@/components/Toast.vue'
import { requestWithdrawal, withdrawalPayment } from '@/services'
import { ToastType } from '@/enums';
import scrollMixin from '@/mixins/scroll.mixin'
import ModalFilterStatus from './parts/ModalFilterStatus.vue'
import ModalConfirmPayment from './parts/ModalConfirmPayment.vue' 

export default {
  name: 'withdrawal-card',
  mixins: [scrollMixin],
  components: { 
    Header,
    WInput,
    WButton,
    WModal,
    CardBets,
    TagButton,
    ModalCalendar,
    ModalFilterStatus,
    Toast,
    ModalConfirmPayment,
    WSelect
  },
  data() {
    return {
      showResults: false,
      showModalCalendar: false,
      dateFilter: now().startOf('week').add(1, 'days'),
      finalDateFilter: now(),
      isModalConfirmPaymentVisible: false, 
      modalItemId: '', 
      modalItemVersion: '', 
      selectedOption: '',
      info: {
        cartao_aposta: [], 
      },        
      params: {
        initialDate: '',
        endDate: '',
        status: '',
      },
      toastStore: useToastStore(),
      configClientStore: useConfigClient(),
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
    handleOpenWithdrawalCardModal() {
      this.isWithdrawalModalVisible = true;
    },
    handleCloseWithdrawalCardModal() {
      this.isWithdrawalModalVisible = false;
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
    formatDateBr(data){
      return formatDateTimeBR(data);
    },
    getResults() {
      this.params.status = this.selectedOption;
      this.params.initialDate = this.dateFilter ? convertInMomentInstance(this.dateFilter).format("YYYY-MM-DD") : now().format("YYYY-MM-DD");
      this.params.endDate = this.finalDateFilter ? convertInMomentInstance(this.finalDateFilter).format("YYYY-MM-DD") : this.parametros.dataInicial;
      this.getWithdrawals();
    },
    async getWithdrawals() {
      this.showResults = false;
      const params = { ...this.params };
      try {
        const response = await requestWithdrawal(params);
        this.info = response || []; 
        this.showResults = true;
      } catch (error) {
        this.toastStore.setToastConfig({
          message: error.message,
          type: ToastType.DANGER,
          duration: 5000,
        });
      }
    },
    async handleConfirmPayment(id,version) {
      try {
        const response = await withdrawalPayment(id,version);
        this.toastStore.setToastConfig({
          message: 'Pagamento confirmado!',
          type: ToastType.SUCCESS,
          duration: 5000,
        });
        this.handleCloseModalConfirmPayment();
        this.getWithdrawals();
      } catch (error) {
        const errorMessage = error.errors.debug; 
        this.toastStore.setToastConfig({
          message: errorMessage,
          type: ToastType.DANGER,
          duration: 5000,
        });
      }
    },
    handleOpenModalConfirmPayment(id,version) {
      this.modalItemId = id; 
      this.modalItemVersion = version;
      this.isModalConfirmPaymentVisible = true;  
    },
    handleCloseModalConfirmPayment() {
      this.isModalConfirmPaymentVisible = false; 
    },
    formateDateTime(datetime) {
      return formatDateTimeBR(datetime);
    }
  }
}
</script>

<style lang="scss" scoped>
.withdrawal-card {  
  height: 100;
  padding-bottom: 100px;
  overflow-y: auto;

  &__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px;
  }
  &___content-filters { 
    margin-top: 15px;
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
    &--payament  {
      margin-top: 20px;
    }
  }
}
</style>
