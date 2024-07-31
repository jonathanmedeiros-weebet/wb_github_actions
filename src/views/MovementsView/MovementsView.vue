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
        {{ startDate }} - {{endDate}}
        <IconClose class="date__close" />
      </span>
      <div 
        class="information"
        v-for="(movement, movementIndex) in balanceData" 
        :key="movementIndex" 
      >
        <div class="information__text">
          <span class="information__date">{{movement.data}}</span>
        </div>
        <div class="information__item">
          <MovementItem  
            :value="movement.valor"
            :debit="movement.descricao"
            :date="movement.data"
          />
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

export default {
  name: 'movements',
  components: { 
    Header, 
    SelectFake, 
    IconClose, 
    IconAttachMoney, 
    MovementItem 
  },
  data() {
    return {  
      showModalCalendar: false,
      startDate: now().format('YYYY-MM-DD'),
      endDate: now().format('YYYY-MM-DD'),
      title: 'Movimentações',
      balanceData: null,
      dateSelected: now().format('YYYY-MM-DD')
    };
  },
  mounted(){
    this.getBalance();
  },
  methods: {
    handleSelectModalClick() {
      alert('Modal select');
    },
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
        this.balanceData = res.movimentacoes;
        console.log(this.balanceData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.movements {
  color: var(--color-background);
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 0;
    padding: 0 20px;
    padding-top: 15px;
    min-height: 100%;
  }
}

.date {
  border-radius: 50px;
  width: 185px;
  height: 30px;
  opacity: 0.5;
  color: var(--color-text);
  background-color: #FFFFFF0D;
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

  &__text {
    padding-bottom: 15px;
    padding-top: 10px;
  }

  &__date {
    color: var(--color-text);
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
