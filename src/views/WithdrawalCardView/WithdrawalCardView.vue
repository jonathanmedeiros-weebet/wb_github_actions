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
import { convertInMomentInstance, formatCurrency, now } from '@/utilities'
import { useConfigClient, useToastStore } from '@/stores'
import Toast from '@/components/Toast.vue'
import { requestWithdrawal } from '@/services'
import { ToastType } from '@/enums';
import scrollMixin from '@/mixins/scroll.mixin'
import ModalFilterStatus from './parts/ModalFilterStatus.vue'

export default {
  name: 'bets',
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
    Toast
  },
  data() {
    return {
        showResults: false,
        showModalCalendar: false,
        dateFilter: now().startOf('week').add(1, 'days'),
        finalDateFilter: now(),
        info: [],
        params: {
            initialDate: '',
            endDate: '',
            status: '1',
        },
        toastStore: useToastStore(),
        configClientStore: useConfigClient(),
    }
  },
  mounted() {
    // this.options = this.configClientStore.options;
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
        this.params.endDate = this.finalDateFilter ? convertInMomentInstance(this.finalDateFilter).format("YYYY-MM-DD") : this.parametros.dataInicial;
        this.params.status = this.params.status;
        this.getWithdrawals();
    },
    async getWithdrawals() {
      this.info = [];
      this.showResults = false;

      const params = { ...this.params };
      requestWithdrawal(params)
      .then(async (resp) => {
        this.info = resp;
          this.showResults = true;
          console.log(info);
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
}

</style>