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

      <div class="balance">
        <div class="balance__date">
          <span class="balance__relatory">Saldo em {{ relatory }}</span>
          <span class="balance__value">
            <IconAdd class="balance__add" />
            R$ {{ value }}
          </span>
        </div>
      </div>

      <div class="money">
        <div class="money__relatory">
          <span class="money__entry">
          <IconTop class="money__top" />
            Entradas
          </span>
          <span class="money__value">R$ {{money_value}}</span>
        </div>
        <div class="money__bet">
          <span class="money__total">
          <IconArrowDown class="money__arrow" />
            Total apostado
          </span>
          <span class="money__value">R$ {{money_value}}</span>
          <div class="money__recharge">
          <span>Recargas cartão</span>
          <span>R$0,00</span>
          </div>
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
import IconAdd from '@/components/icons/IconAdd.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconTop from '@/components/icons/IconTop.vue'

export default {
  name: 'Verification',
  components: { Header, SelectFake, 
  IconClose,IconAdd,
  IconArrowDown,IconTop },
  data() {
    return {
      date: "01/06/2024 - 06/06/2024",
      modality: 'Apuração',
      relatory: '31/05',
      value: '0,00',
      money_value: '2,00',
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

.balance {

  &__date {
    display: flex;
    gap: 25px;
  }


  &__value {
    display: flex;
    align-items: center;
    
  }
  &__add {
    fill: var(--color-primary);
    padding: 3px;
  }
  
}
</style>
