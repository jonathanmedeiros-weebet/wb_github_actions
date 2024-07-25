<template>
  <div class="reckoning">
    <Header 
      :title="title" 
      :showCalendarButton="true" 
      :showBackButton="true"
      @calendarClick="handleOpenCalendarModal"
    />
    <ModalCalendar
      v-if="showModalCalendar"
      @closeModal="handleCloseCalendarModal"
      @change="handleCalendar"
    />
    <div class="reckoning__container">
      <span class="date">
        {{ startDate }} - {{ endDate }}
        <IconClose class="date__close" />
      </span>
      <div class="collapse" @click="toggleCollapse('input', $event)">
        <div class="collapse__item">
          <component :is="iconArrowDinamicInputs" />
          <span class="collapse__title">Entradas</span>
          <div class="collapse__value">
            <IconAdd class="collapse__icon" />
            {{ entry }}
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
                  <span>{{ totalBet }}</span>
                </div>
              </div>
              <div v-if="collapsedBet" class="collapse__section-result">
                <span></span>
              </div>
            </div>
            <div class="collapse__section-item">
              <span class="collapse__section-text">Recargas de Cartão:</span>
              <span class="collapse__value-right">{{ rechargesCartao }}</span>
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
            <span class="collapse__balance">{{ totalExits }}</span>
          </div>
        </div>
        <div v-if="collapsedExits" class="collapse__content">
          <div class="collapse__section">
            <div class="collapse__section-item">
              <span>Comissões</span>
              <span class="collapse__value-right">{{ commission }}</span>
            </div>
            <div class="collapse__section-item">
              <span>Prêmio</span>
              <span class="collapse__value-right">{{ award }}</span>
            </div>
            <div class="collapse__section-item">
              <span>Saque</span>
              <span class="collapse__value-right">{{ withdraw }}</span>
            </div>
            <div class="collapse__line"></div>
          </div>
        </div>
      </div>
      <div class="result">
        <span>Resultado {{startDate}} à {{endDate}}</span>
        <div class="result__date">
          <span class="result__value">{{resultDate}}</span>
        </div>
      </div>
      <div class="collapse__line"></div>
      <div class="credit">
        <span>Créditos</span>
        <div class="credit__date">
          <IconAdd class="credit__icon" />
          <span class="credit__value">{{ credit }}</span>
        </div>
      </div>
      <div class="collapse__line"></div>
      <div class="debit">
        <span>Débitos</span>
        <div class="debit__date">
          <IconRemove class="debit__icon" />
          <span class="debit__value">{{ debit }}</span>
        </div>
      </div>
      <div class="collapse__line"></div>
      <div class="balance">
        <span>Saldo</span>
        <div class="balance__date">
          <span class="balance__value">{{ balance }}</span>
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
import { getCalculationValue } from '@/services/reckoning.service'
import moment from 'moment';
import { formatCurrency } from '@/utilities'
import ModalCalendar from './HomeView/parts/ModalCalendar.vue'

export default {
  name: 'reckoning',
  components: {
    Header,
    SelectFake,
    IconClose,
    IconAdd,
    IconArrowDown,
    IconArrowUp,
    IconRemove,
    ModalCalendar
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
      showModalCalendar: false,
      balanceCalculation: null,
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      totalBet: null,
      resultDate: 0,
      rechargesCartao: null,
      entry: null,
      comissao: null,
      totalExits: null,
      award: null,
      withdraw: null,
      credit: null,
      debit: null,
      balance: null,
      modalityList: modalityList,
      collapsedInputs: this.initCollapsed,
      collapsedBet: this.initCollapsed,
      collapsedExits: this.initCollapsed
    }
  },
  computed: {
    iconArrowDinamicInputs() {
      return this.collapsedInputs ? IconArrowUp : IconArrowDown
    },
    iconArrowDinamicBet() {
      return this.collapsedBet ? IconArrowUp : IconArrowDown
    },
    iconArrowDinamicExits() {
      return this.collapsedExits ? IconArrowUp : IconArrowDown
    }
  },
  mounted() {
    this.getValue()
  },
  methods: {
    handleSelectModalClick() {
      alert('Modal select')
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
      this.handleCloseCalendarModal();
      await this.getValue();
    },
    toggleCollapse(section, event) {
      if (section === 'input') {
        this.collapsedInputs = !this.collapsedInputs
      } else if (section === 'exit') {
        this.collapsedExits = !this.collapsedExits
      } else if (section === 'bet') {
        event.stopPropagation()
        this.collapsedBet = !this.collapsedBet
      }
    },
    async getValue() {
      try {
        const res = await getCalculationValue(this.startDate, this.endDate)
        console.log(res);
        this.withdraw = formatCurrency(Number(res.saque ?? 0))
        this.commission = formatCurrency(Number(res.total_comissao ?? 0))
        this.award = formatCurrency(Number(res.total_premios ?? 0))
        this.totalBet = formatCurrency(Number(res.total_apostado ?? 0))
        this.entry = formatCurrency(Number(res.total_entradas ?? 0))
        this.rechargesCartao = formatCurrency(Number(res.cartao ?? 0))
        this.totalExits = formatCurrency(Number(res.total_saidas ?? 0))
        this.credit = formatCurrency(Number(res.creditos ?? 0))
        this.debit = formatCurrency(Number(res.debitos ?? 0))
        this.balance = formatCurrency(Number(res.saldo ?? 0))
        this.resultDate = formatCurrency(Number(res.total_apostado + res.cartao - res.saque -
                          res.total_comissao - res.total_premios));
        console.log(resultDate)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.reckoning {
  color: var(--color-text);
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

.collapse {
  cursor: pointer;

  &__title {
    color: var(--color-text);
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
    background: var(--color-text);
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
