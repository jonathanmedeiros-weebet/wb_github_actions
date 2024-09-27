<template>
  <div class="tickets">
    <Header title="Bilhete" :showBackButton="true" />
    <div class="tickets__container">
      <span class="tickets__message" v-if="!hasItems">Não há apostas selecionadas.</span>
      <template v-else>
        <div class="game">
          <span class="game__select">Jogos selecionados</span>
          <div class="game__delete" @click="handleAllRemove">
            <IconDelete class="game__icon" />
            <span class="game__text">Excluir todos</span>
          </div>
        </div>

        <div
          class="bet"
          v-for="(item, index) in items" 
          :key="index" 
        >
          <div class="bet__header">
            <span class="bet__team">
              <IconLive v-if="item.live" class="bet__icon-live"/>
              <component :is="item.icon" :size="14" class="bet__icon-ball"/>
              {{ item.gameName }}
            </span>
            <IconClose class="bet__icon-close" @click.native="handleItemRemove(item.gameId)"/>
          </div>
          <div class="bet__info">
            <span class="bet__date">{{ formatDateTimeBR(item.gameDate) }}</span>
          </div>
          <div class="bet__text">
            <span>{{ item.quoteGroupName }}</span>
          </div>
          <div class="bet__result">
            <span>{{ item.quoteName }}</span>
            <span>{{ item.quoteValue }}</span>
          </div>
        </div>
      </template>
      <div class="finish">
        <div class="finish__cpf">
          <w-input
            label="Apostador"
            class="finish__input"
            name="bettor_name"
            placeholder="Informe o nome do apostador"
            type="text"
            v-model="bettorName"
          />
        </div>
      </div>
      <div class="value">
        <div class="value__label">
          <span class="value__balance-text">Valor</span>
        </div>
        <div class="value__balance">
          <button class="value__add" @click="handleBetValueClick(10)">+10</button>
          <button class="value__add" @click="handleBetValueClick(20)">+20</button>
          <button class="value__add" @click="handleBetValueClick(50)">+50</button>
          <w-input
            class="value__balance-input"
            name="bet-value"
            type="number"
            v-model="betValue"
            :value="betValue"
            @focus="handleInitializeBetValue"
          >
            <template #icon>
              <span style="color: var(--foreground-inputs-odds);">R$</span>
            </template>
          </w-input>
        </div>
      </div>
      <div class="cotacao">
        <div class="cotacao__value">
          <span>Cotação:</span>
          <span>{{ quoteValue.toFixed(2) }}</span>
        </div>
        <div class="cotacao__ganhos">
          <span>Possíveis ganhos:</span>
          <span>{{ possibilityAward }}</span>
        </div>
        <div class="cotacao__alteracao">
          <input
            class="cotacao__checkbox"
            type="checkbox"
            id="accept-changes"
            v-model="acceptChanges"
          />
          <label for="accept-changes">Aceitar alterações de odds</label>
        </div>
        <div class="cotacao__finalizar">
          <w-button
            id="btn-entrar"
            :text="buttonText"
            value="entrar"
            class="cotacao__finalizar-button"
            name="btn-entrar"
            :disabled="buttonDisable"
            @click="handleFinalizeBet"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconLive from '@/components/icons/IconLive.vue';
import IconBall from '@/components/icons/IconBall.vue';
import IconClose from '@/components/icons/IconClose.vue';
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import { useConfigClient, useTicketStore, useToastStore } from '@/stores';
import { delay, formatCurrency, formatDateTimeBR } from '@/utilities';
import { calculateQuota, createLiveToken, createPrebet } from '@/services';
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';
import IconFootball from '@/components/icons/IconFootball.vue';
import IconCombat from '@/components/icons/IconCombat.vue';
import IconAmericanFootball from '@/components/icons/IconAmericanFootball.vue';
import IconTennis from '@/components/icons/IconTennis.vue';
import IconHockey from '@/components/icons/IconHockey.vue';
import IconBasketball from '@/components/icons/IconBasketball.vue';
import IconFutsal from '@/components/icons/IconFutsal.vue';
import IconVoleiball from '@/components/icons/IconVoleiball.vue';
import IconESport from '@/components/icons/IconESport.vue';

export default {
  name: 'tickets',
  components: { 
    Header, 
    IconDelete,
    IconLive,
    IconBall,
    IconClose,
    WInput,
    WButton,
    Toast,
    IconFootball,
    IconCombat,
    IconTennis,
    IconHockey,
    IconBasketball,
    IconFutsal,
    IconVoleiball,
    IconTennis,
    IconESport
  },
  data() {
    return {  
      ticketStore: useTicketStore(),
      toastStore: useToastStore(),
      submitting: false,
      icons: {
        1: IconFootball,
        9: IconCombat,
        12: IconAmericanFootball,
        13: IconTennis,
        17: IconHockey,
        48242: IconBasketball,
        83: IconFutsal,
        91: IconVoleiball,
        92: IconTennis,
        151: IconESport
      }
    };
  },
  computed: {
    quoteValue() {
      if(!Boolean(this.items.length)) return 0;

      let quote = this.items.reduce((total, item) => {
        const finalValue = calculateQuota({
          value: Number(item.quoteValue),
          key: item.quoteKey,
          gameEventId: item.eventId,
          favorite: item.favorite,
          isLive: item.live
        });
        return Number(total) * Number(finalValue)
      }, 1)

      const { options } = useConfigClient();
      if (quote > options.fator_max) {
          quote = options.fator_max;
      }

      return quote;
    },
    possibilityAward() {
      const { options } = useConfigClient();
      const award = Number(this.betValue) * Number(this.quoteValue);
      const possibilityAward = (award < options.valor_max_premio)
        ? award
        : options.valor_max_premio;

      return formatCurrency(possibilityAward);
    },
    items() {
      return Object.values(this.ticketStore.items).map(item => ({
        ...item,
        icon: this.icons[item.modalityId],
        quoteValue: item.quoteValue.toFixed(2)
      }));
    },
    hasLiveBet() {
      return this.items.some(item => item.live);
    },
    hasItems() {
      return Boolean(this.items.length)
    },

    bettorName: {
      get() {
        return this.ticketStore.bettor;
      },
      set(value) {
        this.ticketStore.setBettor(value);
      }
    },
    betValue: {
      get() {
        return this.ticketStore.value;
      },
      set(value) {
        this.ticketStore.setValue(value);
      }
    },
    acceptChanges: {
      get() {
        return this.ticketStore.accepted;
      },
      set(value) {
        this.ticketStore.setAccepted(value);
      }
    },
    buttonDisable() {
      return (
        !Boolean(this.bettorName)
        || !Boolean(this.betValue)
        || !Boolean(this.items.length)
        || this.submitting
      )
    },
    buttonText() {
      return this.submitting ? 'Processando...' : 'Finalizar Aposta'
    }
  },
  methods: {
    formatDateTimeBR,
    handleBetValueClick(valueAditional) {
      this.betValue = parseFloat(this.betValue || 0) + Number(valueAditional);
    },
    handleInitializeBetValue() {
      this.betValue = Boolean(this.betValue) ? this.betValue : '';
    },
    handleAllRemove() {
      this.ticketStore.clear();
    },
    handleItemRemove(gameId) {
      this.ticketStore.removeQuote(gameId)
    },
    async handleFinalizeBet() {
      this.submitting = true;

      const { options } = useConfigClient();

      if (this.items.length < options.quantidade_min_jogos_bilhete) {
        this.toastStore.setToastConfig({
          message: `Por favor, inclua no MÍNIMO ${options.quantidade_min_jogos_bilhete} evento(s).`,
          type: ToastType.DANGER,
          duration: 5000
        })
        this.submitting = false;
      }

      if (this.items.length > options.quantidade_max_jogos_bilhete) {
        this.toastStore.setToastConfig({
          message: `Por favor, inclua no MÁXIMO ${options.quantidade_max_jogos_bilhete} evento(s).`,
          type: ToastType.DANGER,
          duration: 5000
        })
        this.submitting = false;
      }

      const {items, bettor, value, accepted} = this.ticketStore;
      const data = {
        apostador: bettor,
        valor: value,
        utilizar_bonus: false,
        aceitar_alteracoes_odds: accepted,
        itens: Object.values(items).map(item => {
          const isQuotePlayer = item.quoteKey.includes('player');
          const quoteKey = isQuotePlayer ? item.quoteKey.split('___')[2] : item.quoteKey;
          return {
            ao_vivo: item.live,
            jogo_id: item.gameId,
            jogo_nome: item.gameName,
            jogo_event_id: item.eventId,
            cotacao: {
              chave: quoteKey,
              valor: item.quoteValue,
              nome: isQuotePlayer ? item.quoteName : null
            },
            cotacao_antiga_valor: null,
          }
        })
      }

      if(this.hasLiveBet) {
        const liveToken = await createLiveToken(data);
        data.token_aovivo = liveToken;
        await delay(10000);
      }

      createPrebet(data)
        .then(({id}) => {
          this.toastStore.setToastConfig({
            message: 'Aposta realizada com sucesso!',
            type: ToastType.SUCCESS,
            duration: 5000
          })
          this.handleAllRemove();

          this.$router.push({
            name: 'close-bet',
            params: {
              id,
              action: 'view'
            }
          });
        })
        .catch(({ errors }) => {
          this.toastStore.setToastConfig({
            message: errors.message,
            type: ToastType.DANGER,
            duration: 5000
          })
        })
        .finally(() => this.submitting = false)
    },
    formatCurrency(value) {
      return formatCurrency(value);
    }
  }
}
</script>

<style lang="scss" scoped>
.tickets {
  &__container {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0 20px;
    min-height: 100%;
    padding-bottom: 100px;

  }

  &__message {
    margin-top: 10px;
    font-size: 12px;
    color:#ffff;
    color: var(--foreground-header);
  }
}

.game {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  &__select {
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    color: #ffff;
    color: var(--foreground-header);
  }

  &__text {
    color: #ffff;
    color: var(--foreground-header);
  }

  &__delete {
    display: flex; 
    align-items: center; 
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}

.bet {
  padding: 8px;  
  display: flex;
  flex-direction: column;
  position: relative; 
  color: #ffff;
  color: var(--foreground-header);

  &::after { 
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw; 
    height: 1px;
    background-color: #7e7b7b1a;
    transform: translateX(-20px); 
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2.5px;
  }

  &__team {
    align-items: center;
    display: flex;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  &__icon-live {
    width: 18px;
    height: 18px;
  }

  &__icon-ball {
    min-width: 14px;
    height: 14px;
    margin-right: 4px;
  }

  &__icon-close {
    opacity: 0.5;
  }

  &__date {
    opacity: 0.5;
  }

  &__result {
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
}

.finish {
  margin-bottom: -20px;
}

.value {
  margin-top: 8px;

  &__balance-text {
    font-size: 14px;
    color:#ffff;
    color: var(--foreground-header);
  }

  &__balance {
    display: flex;
    align-items: center;
  }

  &__add {
    display: flex;
    width: calc(50%/3 - 8px);
    padding: 18px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: var(--inputs-odds);
    color: #ffffff80;
    color: var(--foreground-inputs-odds);
    font-size: 14px;
    margin-right: 8px;
  }

  &__balance-input{
    width: 50%;
    margin-top: 10px;
  }
  
  &__balance-input ::v-deep .input__field {
    height: 50px;
  }

  &__label {
    margin-top: 10px;
  }
}

.cotacao {
  &__value {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color:#ffff;
    color: var(--foreground-header);
  }

  &__ganhos {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color:#ffff;
    color: var(--foreground-header);
  }

  &__checkbox {
    appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid #ffffff80;
    background-color: transparent;
    cursor: pointer;
    border-radius: 3px;
    position: relative;
    margin-right: 4px;
  }

  &__checkbox:checked {
    background-color: #0be58e;
    background-color: var(--highlight);
  }

  &__checkbox::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 4px;
    width: 5px;
    height: 9px;
    color:#ffff;
    color: var(--foreground-header);
  }

  &__alteracao {
    display: flex;
    align-items: center;
    color:#ffff;
    color: var(--foreground-header);
  }

  &__finalizar {
    padding: 8px 0;
  }

  &__finalizar-button {
    width: 100%;
  }
}
</style>
