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
      :initialDate="dateSelected"
      @closeModal="handleCloseCalendarModal"
      @change="handleCalendar"
    />
    <div class="movements__container">
      <span class="date">
        {{ dateFormatedWithYear }}
        <IconClose class="date__close" @click.native="resetDateToCurrent" />
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
import { getMovements } from '@/services';
import { formatCurrency, now, formatDateBR } from '@/utilities';
import ModalCalendar from './../HomeView/parts/ModalCalendar.vue';

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
  data() {
    return {  
      showModalCalendar: false,
      startDate: now().format('YYYY-MM-DD'),
      endDate: now().format('YYYY-MM-DD'),
      title: 'Movimentações',
      balanceData: {},
      dateSelected: now().format('YYYY-MM-DD')
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
    }
  },
  mounted(){
    this.getBalance();
  },
  methods: {
    handleOpenCalendarModal() {
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    async handleCalendar(dateTime) {
      this.startDate = dateTime.format('YYYY-MM-DD');
      this.endDate = dateTime.format('YYYY-MM-DD');
      this.dateSelected = dateTime.format('YYYY-MM-DD'); 
      this.handleCloseCalendarModal();
      this.getBalance();
    },
    async getBalance() {
      try {
        const res = await getMovements(this.startDate, this.endDate);
        this.balanceData = this.groupMovementsByDate(res.movimentacoes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    resetDateToCurrent() {
      const currentDate = now().format('YYYY-MM-DD');
      this.startDate = currentDate;
      this.endDate = currentDate;
      this.dateSelected = currentDate; 
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
  color: var(--color-text-input);
}

.date {
  border-radius: 50px;
  width: 185px;
  margin-top: 5px;
  height: 30px;
  opacity: 0.5;
  color: var(--color-text);
  background-color: #cf53530d;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__close {
    cursor: pointer;
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
    color: var(--color-text);
    color: #ffffff;
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
