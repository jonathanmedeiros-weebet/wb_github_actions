<template>
  <div class="movements">
    <Header 
      :title="title" 
      :showCalendarButton="true" 
      :showBackButton="true" 
      @calendarClick="handleOpenCalendarModal"
    />
    <ModalCalendar
      v-if="showModalCalendar"
      :initialDate="startDate"
      :finalDate="endDate"
      :isMultiDate="true"
      @closeModal="handleCloseCalendarModal"
      @change="handleCalendar"
    />
    <div class="movements__container">
      <span class="date">
        {{ dateFormatedWithYear }}
        <IconClose class="date__close" :color="useHexColors" @click.native="resetDateToCurrent"/>
      </span>
      <div v-if="isBalanceDataEmpty" class="no-data">
        Nenhuma informação nesse período
      </div>
      <div v-else>
        <div 
          class="information"
          v-for="(movements, date) in balanceData" 
          :key="date"
        >
          <div class="information__text">
            <span class="information__date">{{date}}</span>
          </div>
          <div class="information__item" v-for="(movement, index) in movements" :key="index">
            <MovementItem  
              :value="formatCurrency(movement.valor)"
              :debit="movement.descricao"
              :date="movement.data"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectFake from '../HomeView/parts/SelectFake.vue';
import MovementItem from './parts/MovementItem.vue';
import Header from '@/components/layouts/Header.vue';
import IconClose from '@/components/icons/IconClose.vue';
import IconAttachMoney from '@/components/icons/IconAttachMoney.vue';
import { listMovements } from '@/services';
import { formatCurrency, now, formatDateBR, isAndroid5 } from '@/utilities';
import ModalCalendar from './../HomeView/parts/ModalCalendar.vue';
import { useConfigClient, useToastStore } from '@/stores';
import { ToastType } from '@/enums';

export default {
  name: 'movements',
  components: { 
    Header, 
    SelectFake, 
    IconClose, 
    IconAttachMoney, 
    MovementItem,
    ModalCalendar 
  },
  props: {
    dateIni: {
      type: String,
      default: null
    },
    dateEnd: {
      type: String,
      default: null
    }
  },
  data() {
    return {  
      showModalCalendar: false,
      startDate: this.dateIni ?? now().startOf('week').add(1, 'days').format('YYYY-MM-DD'),
      endDate: this.dateEnd ?? now().format('YYYY-MM-DD'),
      title: 'Movimentações',
      balanceData: {},
      tostStore: useToastStore()
    };
  },
  computed: {
    dateFormatedWithYear() {
      const startDateFormatted = formatDateBR(this.startDate);
      const endDateFormatted = formatDateBR(this.endDate);
      return `${startDateFormatted} - ${endDateFormatted}`;
    },
    isBalanceDataEmpty() {
      return Object.keys(this.balanceData).length === 0;
    },
    useHexColors() {
      return isAndroid5() ? 'rgba(255, 255, 255, .5)' : 'rgba(var(--input-foreground-rgb), .5)';
    }
  },
  created() {
    const { firstDayOfTheWeek } = useConfigClient();
    this.startDate = this.dateIni ?? firstDayOfTheWeek.format('YYYY-MM-DD');
  },
  activated(){
    this.getBalance();
  },
  methods: {
    handleOpenCalendarModal() {
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    async handleCalendar({initialDate, finalDate}) {
      this.startDate = initialDate.format('YYYY-MM-DD');
      this.endDate = finalDate.format('YYYY-MM-DD');
      this.handleCloseCalendarModal();
      this.getBalance();
    },
    async getBalance() {
      const queryParams = {
        'periodoDe': this.startDate,
        'periodoAte': this.endDate
      }
      listMovements(queryParams)
        .then(({ movimentacoes }) => {
          this.balanceData = this.groupMovementsByDate(movimentacoes);
        })
        .catch(({ errors }) => {
          this.tostStore.setToastConfig({
            message: errors?.message,
            type: ToastType.DANGER,
            duration: 5000
          })

          this.resetDateToCurrent();
        })
    },
    resetDateToCurrent() {
      this.startDate = this.dateIni ?? now().format('YYYY-MM-DD');
      this.endDate = this.dateEnd ?? now().format('YYYY-MM-DD');
      this.getBalance();
    },
    formatCurrency(value) {
      return formatCurrency(value);
    },
    groupMovementsByDate(movements) {
      return movements.reduce((groups, movement) => {
        const date = movement.data;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(movement);
        return groups;
      }, {});
    }
  }
}
</script>

<style lang="scss" scoped>

.movements {
  height: auto;
  width: 100%;
  padding-bottom: 100px;
  
  &__container {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0 25px;
    padding-top: 15px;
    min-height: 100%;
  }
}

.no-data {
  margin-top: 8px;
  color: rgba(255, 255, 255, .5);
  color: rgba(var(--foreground-rgb), .5);
}

.date {
  border-radius: 50px;
  width: 185px;
  margin-top: 5px;
  height: 30px;
  padding: 0px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: rgba(255, 255, 255, .5);
  color: rgba(var(--input-foreground-rgb), .5);
  background: #181818;
  background: var(--input);

  &__close {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: rgba(255, 255, 255, .5);
    color: rgba(var(--input-foreground-rgb), .5);
  }
}

.information {
  margin-bottom: -10px;
  margin-top: 10px;

  &__text {
    padding-bottom: 15px;
    padding-top: 10px;
  }

  &__date {
    color: #ffffff;
    color: var(--foreground);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  &__item {
    margin-bottom: 4px; 
  }
}

</style>
