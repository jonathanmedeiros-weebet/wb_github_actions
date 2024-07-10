<template>
  <div class="movements">
    <Header :title="modality" :showCalendarButton="true" :showBackButton="true" />
    <div class="movements__container">
      <span class="date">
        {{ startDate }} - {{endDate}}
        <IconClose class="date__close" />
      </span>
      <div v-for="(movement, movementIndex) in dates" :key="movementIndex" class="information">
        <div class="information__text">
          <span class="information__date">{{ movement.infoDate }}</span>
        </div>
        <div v-for="(i, index) in movement.movements" :key="index" class="information__item">
          <MovementsItem  
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
import SelectFake from '../views/HomeView/parts/SelectFake.vue';
import MovementsItem from '../views/MovementView/parts/MovementsItem.vue';
import Header from '@/components/layouts/Header.vue';
import { modalityList } from '../constants/modalities.constant';
import IconClose from '@/components/icons/IconClose.vue';
import IconAttachMoney from '@/components/icons/IconAttachMoney.vue';

export default {
  name: 'movements',
  components: { 
    Header, 
    SelectFake, 
    IconClose, 
    IconAttachMoney, 
    MovementsItem 
  },
  data() {
    return {  
      startDate: '04/06/2024',
      endDate: '06/06/2024',
      modality: 'Movimentações',
      modalityList: modalityList,
      dates: [
          {
            infoDate: 'Seg 04 de Jun de 2024',
            movements: [
              {value: '30,00', type: 'Crédito', date: '04/06/2024',},
              {value: '50,00', type: 'Crédito'},
              {value: '10,00', type: 'Débito'},
              {value: '11,00', type: 'Crédito'}
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
            date: '06/06/2024', 
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
  created() {
    console.log(this.modalityList);
  },
  methods: {
    handleSelectModalClick() {
      alert('Modal select');
    },
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
