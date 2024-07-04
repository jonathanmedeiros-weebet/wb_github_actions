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

        <div class="collapse" @click="toggleCollapse('entradas', $event)">
          <div class="collapse__item">
            <component :is="iconArrowDinamicEntradas" />
            <span class="collapse__title">Entradas</span>
            <div class="collapse__value">
              <IconAdd class="collapse__icon" />
              <span class="collapse__balance">R$ 2,00</span>
            </div>
          </div>

          <div v-if="collapsedEntradas" class="collapse__content">
            <div class="collapse__section">
              <div class="collapse" @click="toggleCollapse('apostado', $event)">
                <div class="collapse__item">
                  <component :is="iconArrowDinamicApostado" />
                  <span class="collapse__title">Total Apostado:</span>
                  <div class="collapse__icon-wrapper">
                    <IconAdd class="collapse__icon-add" />
                    <span>R$ {{ totalApostado }}</span>
                  </div>
                </div>
                <div v-if="collapsedApostado" class="collapse__section-result">
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

        <div class="collapse" @click="toggleCollapse('saidas')">
          <div class="collapse__item">
            <component :is="iconArrowDinamicSaidas" />
            <span class="collapse__title">Saídas</span>
            <div class="collapse__value">
              <IconRemove class="collapse__icon-remove" />
              <span class="collapse__balance">R$ 2,00</span>
            </div>
          </div>

          <div v-if="collapsedSaidas" class="collapse__content">
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
            <span class="debit__value">R$0,00</span>
          </div>
        </div>
        <div class="collapse__line"></div>
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
      totalApostado: '2,00',
      recargasCartao: '0,00',
      comissao: '2,10',
      premio: '13,10',
      Saque: '55,10',
      modalityList: modalityList,
      collapsedEntradas: this.initCollapsed,
      collapsedApostado: this.initCollapsed,
      collapsedSaidas: this.initCollapsed
    }
  },

  computed: {
    iconArrowDinamicEntradas() {
      return this.collapsedEntradas ? IconArrowUp : IconArrowDown;
    },
    iconArrowDinamicApostado() {
      return this.collapsedApostado ? IconArrowUp : IconArrowDown;
    },
    iconArrowDinamicSaidas() {
      return this.collapsedSaidas ? IconArrowUp : IconArrowDown;
    }
  },

  methods: {
    handleSelectModalClick() {
      alert('Modal select')
    },
    toggleCollapse(section, event) {
      console.log(section);
      if (section === 'entradas') {
        this.collapsedEntradas = !this.collapsedEntradas;
      } else if (section === 'saidas') {
        this.collapsedSaidas = !this.collapsedSaidas;
      } else if (section === 'apostado') {
        event.stopPropagation();
        this.collapsedApostado = !this.collapsedApostado;
      }
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
