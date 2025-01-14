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
      :initialDate="startDate"
      :finalDate="endDate"
      :isMultiDate="true"
      @closeModal="handleCloseCalendarModal"
      @change="handleCalendar"
    />
    <div class="reckoning__container">
      <span class="date">
        {{ dateFormatedWithYear}}
        <IconClose class="date__close" color="var(--foreground)" @click.native="resetDateToCurrent" />
      </span>

      <div class="previous-balance" v-if="currentAccountModeIsEnabled">
          <span class="previous-balance__title">
            Saldo em {{ previousBalanceDate }}
            
            <span class="previous-balance__value">
              <IconAdd class="previous-balance__icon" />
              R$ {{ previousBalance }}
            </span>
          </span>
      </div>

      <div class="collapse" @click="toggleCollapse('input', $event)">
        <div class="collapse__item">
          <component :is="iconArrowDinamicInputs" color="var(--foreground)" />
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
                <div class="collapse__section-item">
                  <span class="collapse__section-sports">Loterias</span>
                  <span class="collapse__value-right">R$ {{lotteries}}</span>
                </div>
                <div class="collapse__section-item">
                  <span class="collapse__section-sports">Acumuladão</span>
                  <span class="collapse__value-right">R$ {{accumulation}}</span>
                </div>
                <div class="collapse__section-item">
                  <span class="collapse__section-sports">Desafio</span>
                  <span class="collapse__value-right">R$ {{challenge}}</span>
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
          <component :is="iconArrowDinamicExits" color="var(--foreground)" />
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
          <span :class="`result__value--${resultDateStatus}`">R$ {{resultDate}}</span>
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
          <span :class="`balance__value--${balanceStatus}`">R$ {{ balance }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import IconClose from '@/components/icons/IconClose.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
import IconRemove from '@/components/icons/IconRemove.vue'
import { getCalculationValue } from '@/services'
import { formatCurrency, now , dateFormatInDayAndMonth,formatDateBR, convertInMomentInstance, isAndroid5 } from '@/utilities'
import ModalCalendar from './HomeView/parts/ModalCalendar.vue'
import { useConfigClient, useToastStore } from '@/stores'
import SelectFake from './HomeView/parts/SelectFake.vue'

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
      startDate: null,
      endDate: now().format('YYYY-MM-DD'),
      totalBet: 0,
      resultDate: 0,
      resultDateStatus: 'positive',
      rechargeCard: 0,
      entry: 0,
      comissao: 0,
      totalExits: 0,
      award: 0,
      commission: 0,
      withdraw: 0,
      credit: 0,
      debit: 0,
      balance: 0,
      previousBalance: 0,
      balanceStatus: 'positive',
      sports: 0,
      lotteries: 0,
      challenge: 0,
      accumulation: 0,
      collapsedInputs: true,
      collapsedBet: false,
      collapsedExits: true,
      tostStore: useToastStore()
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
    },
    currentAccountModeIsEnabled() {
      const { options } = useConfigClient();
      return options?.modo_conta_corrente ?? false;
    },
    previousBalanceDate() {
      return convertInMomentInstance(this.startDate).subtract(1, 'days').format('DD/MM');
    },
    closeButtonColor() {
      return isAndroid5() ? '#ffffff80' : 'rgba(var(--foreground-rgb), 0.5)';
    }
  },
  created() {
    const { firstDayOfTheWeek } = useConfigClient();
    this.startDate = this.dateIni ?? firstDayOfTheWeek.format('YYYY-MM-DD');
  },
  activated() {
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
    async handleCalendar({initialDate, finalDate}) {
      this.startDate = initialDate.format('YYYY-MM-DD');
      this.endDate = finalDate.format('YYYY-MM-DD');
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
        this.accumulation = formatCurrency(Number(res.acumuladao.apostado ?? 0));
        this.challenge = formatCurrency(Number(res.desafio.apostado ?? 0));
        this.lotteries = formatCurrency(Number(res.loteria.apostado ?? 0));
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
        this.previousBalance = formatCurrency(Number(res.saldo_anterior ?? 0));
        this.balanceStatus = Number(res.saldo ?? 0) >= 0 ? 'positive' : 'negative';
        const resultDate = (Number(res.total_apostado ?? 0) + Number(res.cartao ?? 0)) - Number(res.saque ?? 0) - Number(res.total_comissao ?? 0) - Number(res.total_premios ?? 0);
        this.resultDate = formatCurrency(resultDate);
        this.resultDateStatus = resultDate >= 0 ? 'positive' : 'negative';
      } catch ({ errors }) {
        this.tostStore.setToastConfig({
          message: errors?.message,
          type: ToastType.WARNING,
          duration: 5000
        })
        this.resetDateToCurrent();
      }
    },
    resetDateToCurrent() {
      const currentDate = now().format('YYYY-MM-DD');
      this.startDate = currentDate;
      this.endDate = currentDate;
      this.getValue();
    }
  }
}
</script>

<style lang="scss" scoped>

.reckoning {
  color: #ffffff;
  color: var(--foreground);
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
  opacity: 0.6;
  color: rgba(255, 255, 255, .5);
  color: rgba(var(--input-foreground-rgb), .5);
  background-color: #181818;
  background-color: var(--input);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &__close {
    cursor: pointer;
  }
}

.previous-balance {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  margin-top: 25px;

  &__title {
    width: 100%;
    color: #ffffff;
    color: var(--foreground);
    font-size: 14px;
    font-style: normal;
    display: flex;
    padding: 5px 1px;
    margin-left: 5px;
  }

  &__value {
    display: flex;
    align-items: center; 
    margin-left: 25px;
    color: #ffffff;
    color: var(--foreground);
  }

  &__icon {
    fill: #0be58e;
    fill: var(--highlight);
    margin-right: 5px;
  }
}

.collapse {
  cursor: pointer;

  &__title {
    color: #ffffff;
    color: var(--foreground);
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
    color: #ffffff;
    color: var(--foreground); 
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
    fill: #35cd96;
    fill: var(--highlight);
  }

  &__value-right {
    display: flex;
    justify-content: flex-end;
    width: 100px;
    color: #ffffff;
    color: var(--foreground);
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
    padding-left: 25px;
  }

  &__icon {
    fill: #35cd96;
    fill: var(--highlight);
    margin-right: 5px;
  }

  &__icon-remove {
    fill: #f61a1a;
    fill: var(--warning);
    margin-right: 5px;
  }

  &__line {
    width: 100%;
    height: 1px;
    background: #ffffff;
    background: var(--foreground);
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
    &--positive {
      color: #6da544;
      color: var(--success);
    }

    &--negative {
      color: #f61a1a;
      color: var(--warning);
    }
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
    fill: #35cd96;
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
    fill: var(--warning);
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
    &--positive {
      color: #6da544;
      color: var(--success);
    }

    &--negative {
      color: #f61a1a;
      color: var(--warning);
    }
  }
}
</style>
