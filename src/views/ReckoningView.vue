<template>
  <div class="reckoning">
    <Header 
      title="Apuração" 
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
    <div class="reckoning__container">
      <span class="date">
        {{ dateFormatedWithYear}}
        <IconClose class="date__close" @click.native="resetDateToCurrent" />
      </span>
      <div class="collapse" @click="toggleCollapse('input', $event)">
        <div class="collapse__item">
          <component :is="iconArrowDinamicInputs" />
          <span class="collapse__title">Entradas</span>
          <div class="collapse__value">
            <IconAdd class="collapse__icon" />
            R$   {{ entry }}
          </div>
        </div>
        <div v-if="collapsedInputs" class="collapse__content">
          <div class="collapse__section">
            <div class="collapse" @click="toggleCollapse('bet', $event)">
              <div class="collapse__item">
                <component class="collapse__icon-arrow" :is="iconArrowDinamicBet" />
                <span class="collapse__title">Total apostado:</span>
                <div class="collapse__icon-wrapper">
                  <IconAdd class="collapse__icon-add" />
                  <span>R$ {{ totalBet }}</span>
                </div>
              </div>
              <div v-if="collapsedBet" class="collapse__section-result">
                <div class="collapse__section-item">
                  <span class="collapse__section-sports">Esportivas</span>
                  <span class="collapse__value-right">R$ {{sports}}</span>
                </div>
              </div>
            </div>
            <div class="collapse__section-item">
              <span class="collapse__section-text">Recargas de cartão:</span>
              <span class="collapse__value-right">R$ {{ rechargeCard }}</span>
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
            <span class="collapse__balance">R$ {{ totalExits }}</span>
          </div>
        </div>
        <div v-if="collapsedExits" class="collapse__content">
          <div class="collapse__section">
            <div class="collapse__section-item">
              <span>Comissões</span>
              <span class="collapse__value-right">R$ {{ commission }}</span>
            </div>
            <div class="collapse__section-item">
              <span>Prêmio</span>
              <span class="collapse__value-right">R$ {{ award }}</span>
            </div>
            <div class="collapse__section-item">
              <span>Saque</span>
              <span class="collapse__value-right">R$ {{ withdraw }}</span>
            </div>
            <div class="collapse__line"></div>
          </div>
        </div>
      </div>
      <div class="result">
        <span>Resultado {{dateFormated}}</span>
        <div class="result__date">
          <span class="result__value">R$ {{resultDate}}</span>
        </div>
      </div>
      <div class="collapse__line"></div>
      <div class="credit">
        <span>Créditos</span>
        <div class="credit__date">
          <IconAdd class="credit__icon" />
          <span class="credit__value">R$ {{ credit }}</span>
        </div>
      </div>
      <div class="collapse__line"></div>
      <div class="debit">
        <span>Débitos</span>
        <div class="debit__date">
          <IconRemove class="debit__icon" />
          <span class="debit__value">R$ {{ debit }}</span>
        </div>
      </div>
      <div class="collapse__line"></div>
      <div class="balance">
        <span>Saldo</span>
        <div class="balance__date">
          <span class="balance__value">R$ {{ balance }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectFake from './HomeView/parts/SelectFake.vue'
import Header from '@/components/layouts/Header.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import IconRemove from '@/components/icons/IconRemove.vue'
import { getCalculationValue } from '@/services'
import { formatCurrency, now , dateFormatInDayAndMonth,formatDateBR } from '@/utilities'
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
  data() {
    return {
      showModalCalendar: false,
      balanceCalculation: null,
      startDate: now().format('YYYY-MM-DD'),
      endDate: now().format('YYYY-MM-DD'),
      totalBet: 0,
      resultDate: 0,
      rechargeCard: 0,
      entry: 0,
      comissao: 0,
      totalExits: 0,
      award: 0,
      withdraw: 0,
      credit: 0,
      debit: 0,
      balance: 0,
      sports: 0,
      collapsedInputs: this.initCollapsed,
      collapsedBet: this.initCollapsed,
      collapsedExits: this.initCollapsed,
      dateSelected: now().format('YYYY-MM-DD')
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
    },
    dateFormated() {
      return `${dateFormatInDayAndMonth(this.startDate)} à ${dateFormatInDayAndMonth(this.endDate)}`;
    },
    dateFormatedWithYear() {
      const startDateFormatted = formatDateBR(this.startDate);
      const endDateFormatted = formatDateBR(this.endDate);
      return `${startDateFormatted} - ${endDateFormatted}`;
    }
  },
  mounted() {
    this.getValue()
  },
  methods: {
    formatDateWithYear(date) {
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
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
      this.getValue();
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
    },
    async getValue() {
      try {
        const res = await getCalculationValue(this.startDate, this.endDate);
        this.sports = formatCurrency(Number(res.esporte.apostado ?? 0));
        this.withdraw = formatCurrency(Number(res.saque ?? 0));
        this.commission = formatCurrency(Number(res.total_comissao ?? 0));
        this.award = formatCurrency(Number(res.total_premios ?? 0));
        this.totalBet = formatCurrency(Number(res.total_apostado ?? 0));
        this.entry = formatCurrency(Number(res.total_entradas ?? 0));
        this.rechargeCard = formatCurrency(Number(res.cartao ?? 0));
        this.totalExits = formatCurrency(Number(res.total_saidas ?? 0));
        this.credit = formatCurrency(Number(res.creditos ?? 0));
        this.debit = formatCurrency(Number(res.debitos ?? 0));
        this.balance = formatCurrency(Number(res.saldo ?? 0));
        this.resultDate = formatCurrency(
          Number(res.total_apostado + res.cartao - res.saque - res.total_comissao - res.total_premios)
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    resetDateToCurrent() {
      const currentDate = now().format('YYYY-MM-DD');
      this.startDate = currentDate;
      this.endDate = currentDate;
      this.dateSelected = currentDate; 
      this.getValue();
    }
  }
}
</script>

<style lang="scss" scoped>

.reckoning {
  color: #ffffff;
  color: var(--color-text);
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
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
  color: #ffffff;
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
    color: #ffffff;
    color: var(--color-text);
    font-size: 14px;
    font-style: normal;
    display: flex;
    flex: 1;
    padding: 5px 1px;
    margin-left: 5px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    width: 100%;
  }

  &__value {
    display: flex;
    align-items: center; 
    justify-content: flex-end; 
    width: 100%; 
  }

  &__section-sports {
    margin-left: 25px;
  }

  &__section-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__icon-add {
    padding: 1px;
    fill: #0be58e;;
    fill: var(--highlight);
  }

  &__value-right {
    display: flex;
    justify-content: flex-end;
    width: 100px; 
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__icon-wrapper {
    display: flex;
    align-items: center;
  }

  &__icon-arrow {
    padding: 1.5px;
  }

  &__section {
    display: flex;
    flex-direction: column;
  }

  &__icon {
    fill: #0be58e;
    fill: var(--highlight);
    margin-right: 5px;
  }

  &__icon-remove {
    fill: #f61a1a;
    fill: var(--color-danger);
    margin-right: 5px;
  }

  &__line {
    width: 100%;
    height: 1px;
    background: #ffffff;
    background: var(--color-text);
    opacity: 0.1;
    margin-top: 5px;
  }
}

.result {
  display: flex;
  justify-content: space-between;

  &__date {
    display: flex;
  }

  &__value {
    display: flex;
    align-items: center;
    color: #6da544;
    color: var(--color-success);
  }

}

.credit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;

  &__date {
    display: flex;
  }

  &__value {
    display: flex;
    align-items: center;
  }

  &__icon {
    fill: #0be58e;
    fill: var(--highlight);
    margin-right: 5px;
  }
}

.debit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;

  &__date {
    display: flex;
  }

  &__value {
    display: flex;
    align-items: center;
  }

  &__icon {
    fill: #f61a1a;
    fill: var(--color-danger);
    margin-right: 5px;
  }
}
.balance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  
  &__date {
    display: flex;
  }
  
  &__value {
    color: #6da544;
    color: var(--color-success);
  }
}
</style>
