<template>
  <div class="commission">
    <div class="comission__card">
      <IconAttachMoney class="comission__icon" />
      <div class="comission__info">
        <div class="comission__header">
          <span class="comission__text">Comissão</span>
          <span :class="valueClass" :style="{ color: computedValueColor }">R$ {{ value }}</span>
        </div>
        <span :class="debitClass">{{ debit }}</span>
        <span :class="dateClass">{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import IconAttachMoney from '@/components/icons/IconAttachMoney.vue'; 

export default {
  name: 'MovementsItem',
  components: {
    IconAttachMoney  
  },
  props: {
    value: {
      type: String,
      required: true
    },
    valueClass: {
      type: String,
      default: 'comission__value'
    },
    debit: {
      type: String,
      required: true
    },
    debitClass: {
      type: String,
      default: 'comission__debit'
    },
    date: {
      type: String,
      required: true
    },
    dateClass: {
      type: String,
      default: 'comission__date'
    }
  },
  computed: {
    computedValueColor() {
      return this.debit.toLowerCase() === 'débito' ? '#F61A1A' : (this.debit.toLowerCase() === 'crédito' ? '#00FF00' : this.valueColor);
    }
  }
}
</script>

<style lang="scss" scoped>
.comission {
  &__card {
    display: flex;
    padding: 18px 15px;
    gap: 10px;
    align-self: stretch;
    align-items: flex-start;
    border-radius: 8px;
    background: #181818;   
    padding-bottom: 14px;
  }
  
  &__info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    width: 100%;
  }

  &__balance {
    display: flex;
    flex-direction: column;
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
  }

  &__date { 
    color: rgba(255, 255, 255, 0.50);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }

  &__value {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}
</style>
