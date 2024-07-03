<template>
  <div class="header">
    <Header :showCalendarButton="true" :showSearchButton="true">
      <SelectFake :text="modality" @click="handleSelectModalClick" />
    </Header>
    <div class="verification">
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
        <div class="collapse" @click="handleClick">
          <div class="collapse__item">
            <component :is="iconArrowDinamic" />
            <span class="collapse__title">Entradas</span>
            <div class="collapse__value">
              <IconAdd class="collapse__icon" />
              <span class="collapse__balance">R$ 2,00</span>
            </div>
          </div>
          <div v-if="collapsed" class="collapse__content">
            <div class="collapse__section">
              <div class="collapse__section-item">
                <span>Total Apostado:</span>
                <span>R$ {{ totalApostado }}</span>
              </div>
              <div class="collapse__section-item">
                <span>Recargas de Cartão:</span>
                <span>R$ {{ recargasCartao }}</span>
              </div>
            </div>
        <hr>
          </div>
        </div>
        <div class="collapse" @click="handleClick">
          <div class="collapse__item">
            <component :is="iconArrowDinamic" />
            <span class="collapse__title">Saídas</span>
            <div class="collapse__value">
              <IconRemove class="collapse__icon-remove" />
              <span class="collapse__balance">R$ 2,00</span>
            </div>
          </div>
          <div v-if="collapsed" class="collapse__content">
            <div class="collapse__section">
              <div class="collapse__section-item">
                <span>Comissões</span>
                <span>R$ {{ totalApostado }}</span>
              </div>
              <div class="collapse__section-item">
                <span>Prêmio</span>
                <span>R$ {{ recargasCartao }}</span>
              </div>
              <div class="collapse__section-item">
                <span>Saque</span>
                <span>R$ {{ recargasCartao }}</span>
              </div>
            </div>
          <hr>
          </div>
        </div>
        <div class="result">
          <span>Resultado 01/06 à 06/06</span>
          <div class="result__date">
            <span class="result__value">R$1,90</span>
          </div>
        </div>
        <div class="credit">
          <span>Créditos</span>
          <div class="credit__date">
            <IconAdd class="credit__icon" />
            <span class="credit__value">R$0,00</span>
          </div>
        </div>
        <div class="debit">
          <span>Débitos</span>
          <div class="debit__date">
            <IconRemove class="debit__icon" />
            <span class="debit__value">R$0,00</span>
          </div>
        </div>
        <div class="balance">
          <span>Saldo</span>
          <div class="balance__date">
            <span class="balance__value">R$0,00</span>
          </div>
        </div>

      </section>
    </div>
  </div>
</template>

<script>
import SelectFake from '../views/HomeView/parts/SelectFake.vue'
import Header from '@/components/layouts/Header.vue'
import { modalityList } from '../constants/modalities.constant'
import IconClose from '@/components/icons/IconClose.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import IconRemove from '@/components/icons/IconRemove.vue'

export default {
  name: 'Verification',
  components: {
    Header,
    SelectFake,
    IconClose,
    IconAdd,
    IconArrowDown,
    IconArrowUp,
    IconRemove
  },

  props: {
    initCollapsed: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      date: "01/06/2024 - 06/06/2024",
      modality: 'Apuração',
      relatory: '31/05',
      value: '0,00',
      totalApostado: '150,00',
      recargasCartao: '50,00',
      comissao: '2,10',
      premio: '13,10',
      Saque: '55,10',
      modalityList: modalityList,
      collapsed: this.initCollapsed
    }
  },

  computed: {
    iconArrowDinamic() {
      return this.collapsed ? IconArrowUp : IconArrowDown;
    }
  },

  methods: {
    handleSelectModalClick() {
      alert('Modal select')
    },
    handleClick() {
      this.collapsed = !this.collapsed;
    }
  }
}
</script>

<style lang="scss" scoped>
.verification {
  color: #ffffff;
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 22px;
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

.collapse {
  cursor: pointer;

  &__title {
    color: #FFF;
    font-size: 14px;
    font-style: normal;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    gap: 10px;
    width: 100%;
  }

  &__value {
    display: flex;
    align-items: center; 
    justify-content: flex-end; 
    gap: 5px; 
    width: 100%; 
  }

  &__balance {
    color: #FFF; 
  }

  &__icon {
    fill: var(--color-primary);
    padding: 3px;
  }
  &__icon-remove {
    fill: var(--color-danger);
  }

  &__content {
    padding: 10px 0;
  }

  &__section {
    padding-top: 10px;
  }

  &__section-item {
    display: flex;
    justify-content: space-between;
  }
}
.result {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__value {
    color: green;
  } 
}

.credit {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__date {
      display: flex;
      gap: 5px; 
  }
  &__icon {
    fill: var(--color-primary);
    padding: 3px;
  }
}

.debit {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__date {
    display: flex;
    gap: 5px; 
  }
  &__icon {
    fill: var(--color-danger);
    padding: 3px;
  }
}

.balance {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__date {
    display: flex;
    gap: 5px; 
  }
}



</style>
