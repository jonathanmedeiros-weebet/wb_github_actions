<template>
  <div class="movements">
    <Header :title="modality" :showCalendarButton="true" :showBackButton="true" />
    <div class="movements__container">
      <span class="date">
        {{ date }}
        <IconClose class="date__close" />
      </span>
      <div v-for="(movement, index) in movements" :key="index">
        <div v-if="index % 4 === 0" class="information">
          <span class="information__date">{{movement.info}}</span>
        </div>
        <MovementsItem   
          :value="movement.value"
          :debit="movement.debit"
          :date="movement.date"
        />
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
      date: "01/06/2024 - 06/06/2024",
      modality: 'Movimentações',
      dateComission: '03/06/2024',
      info_date: 'Seg, 04 Junho 2024',
      modalityList: modalityList,
      // movements: [
      //   {value: '350,00', type: 'Crédito', date: '03/06/2024', info: 'Seg, 03 Junho 2024'},
      //   {value: '80,00', type: 'Débito', date: '03/06/2024', info: 'Seg, 03 Junho 2024'},
      //   {value: '25,00', type: 'Débito', date: '03/06/2024', info: 'Seg, 03 Junho 2024'},
      //   {value: '1,00', type: 'Débito', date: '03/06/2024', info: 'Seg, 03 Junho 2024'},
      //   {value: '52,00', type: 'Crédito', date: '04/06/2024', info: 'Seg, 04 Junho 2024'},
      //   {value: '14,33', type: 'Débito', date: '04/06/2024', info: 'Seg, 04 Junho 2024'},
      //   {value: '6,00', type: 'Débito', date: '04/06/2024',  info: 'Seg, 04 Junho 2024'},
      //   {value: '42,22', type: 'Débito', date: '04/06/2024', info: 'Seg, 04 Junho 2024'},
      //   {value: '12,22', type: 'Crédito', date: '05/06/2024', info: 'Seg, 05 Junho 2024'},
      //   {value: '702,22', type: 'Débito', date: '05/06/2024', info: 'Seg, 05 Junho 2024'},
      //   {value: '120,22', type: 'Crédito', date: '05/06/2024', info: 'Seg, 05 Junho 2024'},
      //   {value: '72,22', type: 'Débito', date: '05/06/2024', info: 'Seg, 05 Junho 2024'},
      // ]
      dates: [
          {
            date: '04/06/2024' 
            movements: []
          },
          {
            date: '04/06/2024' 
            movements: []
          },

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
    gap: 4px;
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
  
  padding-bottom: 15px;
  padding-top: 10px;

  &__date {
    
    color: var(--color-text);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
}
</style>
