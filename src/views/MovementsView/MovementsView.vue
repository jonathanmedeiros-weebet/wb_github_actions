<template>
  <div class="movements">
    <Header 
      :title="title" 
      :showCalendarButton="true" 
      :showBackButton="true" 
    />
    <div class="movements__container">
      <span class="date">
        {{ startDate }} - {{endDate}}
        <IconClose class="date__close" />
      </span>
      <div 
        class="information"
        v-for="(movement, movementIndex) in dates" 
        :key="movementIndex" 
      >
        <div class="information__text">
          <span class="information__date">{{ movement.infoDate }}</span>
        </div>
        <div 
          class="information__item"
          v-for="(i, index) in movement.movements" 
          :key="index" 
        >
          <MovementItem  
            :value="i.value"
            :debit="i.type"
            :date="i.date"
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
      startDate: '2024-07-29',
      endDate: '2024-08-04',
      title: 'Movimentações',
      balanceData: null,
      dates: [
          {
            infoDate: 'Seg 04 de Jun de 2024',
            movements: [
              {value: '30,00', type: 'Crédito', date: '04/06/2024'},
              {value: '50,00', type: 'Crédito', date: '04/06/2024'},
              {value: '10,00', type: 'Débito', date: '04/06/2024'},
              {value: '11,00', type: 'Crédito', date: '04/06/2024'}
            ]
          },
          {
            infoDate: 'Ter 05 de Jun de 2024 ',
            movements: [
              {value: '25,00', type: 'Débito', date: '05/06/2024', },
              {value: '15,00', type: 'Crédito', date: '05/06/2024', },
              {value: '8,00', type: 'Débito', date: '05/06/2024', },
              {value: '2,00', type: 'Crédito', date: '05/06/2024', },
              {value: '750,00', type: 'Crédito', date: '05/06/2024', }
            ]
          },
          {
            infoDate: 'Qua 06 de Jun de 2024 ',
            movements: [
              {value: '41,00', type: 'Débito', date: '06/06/2024', },
              {value: '13,00', type: 'Crédito', date: '06/06/2024', },
              {value: '100,00', type: 'Débito', date: '06/06/2024', },
              {value: '10,00', type: 'Crédito', date: '06/06/2024', }
            ]
          }

      ]
    };
  },
  mounted(){
    this.getBalance();
  },
  methods: {
    handleSelectModalClick() {
      alert('Modal select');
    },
    async getBalance() {
      try {
        const res = await getMovements(this.startDate, this.endDate);
        this.balanceData = res;
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
