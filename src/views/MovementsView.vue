<template>
  <div class="header">
    <Header :showCalendarButton="true" :showSearchButton="true">
      <SelectFake :text="modality" @click="handleSelectModalClick"/>
    </Header>
    <section class="verification__container">
      <span class="date">
        {{ date }}
        <IconClose class="date__close" />
      </span>
      <div class="information">
        <span class="information__date">{{info_date}}</span>
      </div>
      <div class="commission">
        <div class="comission__card">
            <IconAttachMoney class="comission__icon" />
            <span class="comission__text">Comissão</span>
            <div class="comission__balance">
                <span class="comission__debit">Débito</span>    
                <span class="comission__date">{{date_comission}}</span>
            </div>
            <span class="comission__value">R$ {{comission}}</span>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import SelectFake from '../views/HomeView/parts/SelectFake.vue'
import Header from '@/components/layouts/Header.vue'
import { modalityList } from '../constants/modalities.constant'
import IconClose from '@/components/icons/IconClose.vue'
import IconAttachMoney from '@/components/icons/IconAttachMoney.vue'


export default {
  name: 'movements',
  components: { Header, SelectFake, 
                IconClose, IconAttachMoney},
  data() {
    return {  
      date: "01/06/2024 - 06/06/2024",
      modality: 'Movimentações',
      date_comission: '03/06/2024',
      info_date: 'Seg, 04 Junho 2024',
      comission: '200,00',
      modalityList: modalityList,
    }
  },
  created() {
    console.log(this.modalityList)
  },
  methods: {
    handleSelectModalClick() {
      alert('Modal select')
    }
  }
}
</script>
<style lang="scss" scoped>
.verification {
  color: #000000;
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin: 0;
    padding: 0 20px;
    padding-top: 20px;
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

    &__date {
        color: #FFF;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
}


.comission {
    &__card {
        display: flex;
        padding: 18px 15px;
        gap: 12px;
        align-items: flex-start;
        align-self: stretch;
        border-radius: 8px;
        background: #181818;
        
    }
    &__balance {

    }
    &__text {
        color: #FFF;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        display: flex;

    }
    &__debit {

        color: rgba(255, 255, 255, 0.50);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;

    }
    &__date {
        
        color: rgba(255, 255, 255, 0.50);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    &__value {
        color: #F61A1A;
        text-align: right;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
}

</style>
