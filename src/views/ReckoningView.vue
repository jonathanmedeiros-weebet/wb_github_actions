<template>
  <div class="reckoning">
    <Header 
      :title="title" 
      :showCalendarButton="true" 
      :showBackButton="true" 
    />
    <div class="reckoning__container">
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
      <div class="collapse" @click="toggleCollapse('input', $event)">
        <div class="collapse__item">
          <component :is="iconArrowDinamicInputs" />
          <span class="collapse__title">Entradas</span>
          <div class="collapse__value">
            <IconAdd class="collapse__icon" />
            R$ 2,00
          </div>
        </div>
        <div v-if="collapsedInputs" class="collapse__content">
          <div class="collapse__section">
            <div class="collapse" @click="toggleCollapse('bet', $event)">
              <div class="collapse__item">
                <component class="collapse__icon-arrow" :is="iconArrowDinamicBet" />
                <span class="collapse__title">Total Apostado:</span>
                <div class="collapse__icon-wrapper">
                  <IconAdd class="collapse__icon-add" />
                  <span>R$ {{ totalApostado }}</span>
                </div>
              </div>
              <div v-if="collapsedBet" class="collapse__section-result">
                <span>Futebol</span>
              </div>
            </div>
            <div class="collapse__section-item">
              <span class="collapse__section-text">Recargas de Cartão:</span>
              <span class="collapse__value-right">R$ {{ recargasCartao }}</span>
            </div>
            <div class="collapse__line"></div>
          </div>
        </div>
      </div>
      <div class="collapse" @click="toggleCollapse('exit')">
        <div class="collapse__item">
          <component :is="iconArrowDinamicExits" />
          <span class="collapse__title">Saídas</span>
          <div class="collapse__value">
            <IconRemove class="collapse__icon-remove" />
            <span class="collapse__balance">R$ 2,00</span>
          </div>
        </div>
        <div v-if="collapsedExits" class="collapse__content">
          <div class="collapse__section">
            <div class="collapse__section-item">
              <span>Comissões</span>
              <span class="collapse__value-right">R$ {{ comissao }}</span>
            </div>
            <div class="collapse__section-item">
              <span>Prêmio</span>
              <span class="collapse__value-right">R$ {{ premio }}</span>
            </div>
            <div class="collapse__section-item">
              <span>Saque</span>
              <span class="collapse__value-right">R$ {{ Saque }}</span>
            </div>
            <div class="collapse__line"></div>
          </div>
        </div>
      </div>
      <div class="result">
        <span>Resultado 01/06 à 06/06</span>
        <div class="result__date">
          <span class="result__value">R$1,90</span>
        </div>
      </div>
      <div class="collapse__line"></div>
        <div class="credit">
          <span>Créditos</span>
          <div class="credit__date">
            <IconAdd class="credit__icon" />
            <span class="credit__value">R$0,00</span>
          </div>
        </div>
        <div class="collapse__line"></div>
        <div class="debit">
          <span>Débitos</span>
          <div class="debit__date">
            <IconRemove class="debit__icon" />
            <span class="debit__value">R$ 5,00</span>
          </div>
        </div>
        <div class="collapse__line"></div>
        <div class="balance">
          <span>Saldo</span>
          <div class="balance__date">
            <span class="balance__value">R$ 2,00</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import SelectFake from './HomeView/parts/SelectFake.vue'
import Header from '@/components/layouts/Header.vue'
import { modalityList } from '../constants/modalities.constant'
import IconClose from '@/components/icons/IconClose.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import IconRemove from '@/components/icons/IconRemove.vue'

export default {
  name: 'reckoning',
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
      title: 'Apuração',
      date: "01/06/2024 - 06/06/2024",
      relatory: '31/05',
      value: '0,00',
      totalApostado: '2,00',
      recargasCartao: '0,00',
      comissao: '2,10',
      premio: '13,10',
      Saque: '55,10',
      modalityList: modalityList(),
      collapsedInputs: this.initCollapsed,
      collapsedBet: this.initCollapsed,
      collapsedExits: this.initCollapsed,
    }
  },

  computed: {
    iconArrowDinamicInputs() {
      return this.collapsedInputs ? IconArrowUp : IconArrowDown;
    },
    iconArrowDinamicBet() {
      return this.collapsedBet ? IconArrowUp : IconArrowDown;
    },
    iconArrowDinamicExits() {
      return this.collapsedExits ? IconArrowUp : IconArrowDown;
    }
  },

  methods: {
    handleSelectModalClick() {
      alert('Modal select')
    },
    toggleCollapse(section, event) {
      if (section === 'input') {
        this.collapsedInputs = !this.collapsedInputs;
      } else if (section === 'exit') {
        this.collapsedExits = !this.collapsedExits;
      } else if (section === 'bet') {
        event.stopPropagation();
        this.collapsedBet = !this.collapsedBet;
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.reckoning {
  color: #ffffff;
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 5px;
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
  padding-top: 8px;
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
    padding: 1px;
  }
}

.collapse {
  cursor: pointer;

  &__title {
    color: #FFF;
    font-size: 14px;
    font-style: normal;
    display: flex;
    flex: 1;
    padding: 5px 1px;
    
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    gap: 5px;
    width: 100%;
  }

  &__value {
    display: flex;
    align-items: center; 
    justify-content: flex-end; 
    gap: 5px; 
    width: 100%; 
  }

  &__section-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__icon-add {
    padding: 1px;
    fill: var(--color-primary);
  }

  &__value-right {
    display: flex;
    justify-content: flex-end;
    width: 100px; 
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }


  &__icon-wrapper {
    display: flex;
    align-items: center;
    gap: 7px; 
  }
  &__icon-arrow {
    padding: 1.5px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__icon {
    fill: var(--color-primary);
  }

  &__icon-remove {
    fill: var(--color-danger);
  }

  &__line {
    width: 100%;
    height: 1px;
    background: #FFFFFF;
    opacity: 0.1;
  }
}

.result {
  display: flex;
  justify-content: space-between;

  &__date {
    display: flex;
    gap: 20px;
  }

  &__value {
    display: flex;
    align-items: center;
  }
}

.credit {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__date {
    display: flex;
    gap: 10px;
  }

  &__value {
    display: flex;
    align-items: center;
  }

  &__icon {
    fill: var(--color-primary);
  }
}

.debit {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__date {
    display: flex;
    gap: 10px;
  }

  &__value {
    display: flex;
    align-items: center;
  }

  &__icon {
    fill: var(--color-danger);
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
