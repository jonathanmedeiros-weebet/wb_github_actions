<template>
  <div class="tickets">
    <Header title="Bilhete" :showBackButton="true" />
    <div class="tickets__container">
      <span class="tickets__message" v-if="!hasItems">Não há apostas selecionadas.</span>
      <template v-else>
        <div class="game">
          <span class="game__select">Jogos selecionados</span>
          <div class="game__delete" @click="handleAllRemove">
            <IconDelete color="var(--foreground)" class="game__icon" />
            <span class="game__text">Excluir todos</span>
          </div>
        </div>

        <div
          class="bet"
          v-for="(item, index) in items"
          :key="index"
        >
          <template v-if="!isModalityLottery">
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
            <div class="bet__result" :class="{ 'bet__result--border': item.hasChanges }">
              <span>{{ item.quoteName }}</span>
              <span>
                {{ item.finalQuoteValue }}
                <span v-if="item.previousQuoteValue" class="bet__previous-quote">({{ item.previousQuoteValue }})</span>
              </span>
            </div>
          </template>

          <template v-if="isModalityLottery">
            <div class="lottery__header">
              <span class="lottery__title">{{ item.lotteryTitle }}</span>
              <IconClose class="lottery__info" @click.native="handleItemRemove(item.id)"/>
            </div>
            <span class="lottery__info">
              Valor do palpite: R$ {{ formatCurrency(item.value) }}
            </span>

            <span class="lottery__info" v-if="Boolean(item.award06)">
              Retorno 6: R$ {{ formatCurrency(item.award06) }}
            </span>
            <span class="lottery__info" v-if="Boolean(item.award05)">
              Retorno 5: R$ {{ formatCurrency(item.award05) }}
            </span>
            <span class="lottery__info" v-if="Boolean(item.award04)">
              Retorno 4: R$ {{ formatCurrency(item.award04) }}
            </span>
            <span class="lottery__info" v-if="Boolean(item.award03)">
              Retorno 3: R$ {{ formatCurrency(item.award03) }}
            </span>

            <span class="lottery__tens">
              <span class="lottery__info">Dezenas:</span> 
              <div
                class="lottery__group-tens"
                :class="{
                  'lottery__group-tens--grid': !isAndroid6Version,
                  'lottery__group-tens--android6': isAndroid6Version
                }"
              >
                <span
                  class="lottery__ten"
                  :class="{'lottery__ten--android6': isAndroid6Version}"
                  v-for="(ten, index) of item.tens"
                  :key="index"
                >
                  {{ ten }}
                </span>
              </div>
            </span>
          </template>
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
            v-if="showBettorName"
            v-model="bettorName"
          />

          <w-input
            label="CPF"
            class="finish__input"
            name="bettor_name"
            placeholder="Informe o cpf do apostador"
            type="tel"
            @keypress.native="handleNotAllowLyrics"
            mask="XXX.XXX.XXX-XX"
            v-if="showBettorDocumentNumber"
            v-model="bettorDocumentNumber"
          />
        </div>
      </div>
      <div class="value">
        <template v-if="!isModalityLottery">
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
                <span style="color: var(--input-foreground);">R$</span>
              </template>
            </w-input>
          </div>
        </template>

        <template v-if="isModalityLottery">
          <div class="lottery__values">
            <span class="lottery__value-descriptiom">Valor da aposta:</span>
            <span class="lottery__value">R$ {{ formatCurrency(betValue) }}</span>
          </div>
        </template>
      </div>
      <div class="cotacao">
        <template v-if="!isModalityLottery">
          <div class="cotacao__value">
            <span>Cotação:</span>
            <span>{{ quoteValue.toFixed(2) }}</span>
          </div>
          <div class="cotacao__ganhos">
            <span>Possíveis ganhos:</span>
            <span>R$ {{ possibilityAward }}</span>
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
        </template>
        <div class="cotacao__finalizar" v-if="!hasChanges">
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
        <div class="cotacao__aceitar-alteracoes" v-if="hasChanges">
          <p>Algumas cotações mudaram, verifique com atenção antes de confirmar a aposta </p>
          <w-button
            id="btn-aceitar-alteracoes"
            text="Aceitar alterações"
            value="aceitar"
            class="cotacao__finalizar-button"
            name="btn-aceitar"
            :disabled="buttonDisable"
            @click="handleAcceptChanges"
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
import { delay, formatCurrency, formatDateTimeBR, generateLotteryKey, isAndroid6 } from '@/utilities';
import { calculateQuota, createLiveToken, createBetSport } from '@/services';
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
import { getModalitiesEnum } from '@/constants';
import { createLotteryBet } from '@/services/lottery.service';

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
      configClientStore: useConfigClient(),
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
      },
      hasChanges: false
    };
  },
  computed: {
    isAndroid6Version() {
      return isAndroid6();
    },
    quoteValue() {
      if(!Boolean(this.items.length)) return 0;

      let quote = this.items.reduce((total, item) => {
        const finalValue = Number(item.finalQuoteValue); 
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
      if(!this.isModalityLottery) {
        return Object.values(this.ticketStore.items)
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(item => ({
            ...item,
            icon: this.icons[item.modalityId],
            quoteValue: item.quoteValue.toFixed(2),
            previousQuoteValue: Boolean(item.previousQuoteValue) ? item.previousQuoteValue.toFixed(2) : null,
            finalQuoteValue: Boolean(item.finalQuoteValue) ? item.finalQuoteValue.toFixed(2) : null,
            hasChanges: Boolean(item.quoteValue) && Boolean(item.previousQuoteValue)
          }));
      } else {
        return Object.values(this.ticketStore.items);
      }
    },
    hasLiveBet() {
      return this.items.some(item => item.live);
    },
    hasItems() {
      return Boolean(this.items.length)
    },
    isModalityLottery() {
      const Modalities = getModalitiesEnum();
      return this.ticketStore.modalityId == Modalities.LOTTERY
    },

    bettorName: {
      get() {
        return this.ticketStore.bettor;
      },
      set(value) {
        this.ticketStore.setBettor(value);
      }
    },
    bettorDocumentNumber: {
      get() {
        return this.ticketStore.bettorDocumentNumber;
      },
      set(value) {
        this.ticketStore.setBettorDocumentNumber(value);
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
    betAward() {
      return this.ticketStore.award;
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
      const bettorField = this.showBettorName
        ? this.bettorName
        : this.bettorDocumentNumber;

      return (
        !Boolean(bettorField)
        || !Boolean(this.betValue)
        || !Boolean(this.items.length)
        || this.submitting
      )
    },
    buttonText() {
      return this.submitting ? 'Processando...' : 'Finalizar Aposta'
    },
    showBettorDocumentNumber() {
      return this.configClientStore.bettorDocumentNumberEnabled;
    },
    showBettorName() {
      return !this.configClientStore.bettorDocumentNumberEnabled;
    },
  },
  methods: {
    handleNotAllowLyrics(event) {
      const char = String.fromCharCode(event.charCode);
      if (!/\d/.test(char)) {
        event.preventDefault();
      }
    },
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
    handleItemRemove(itemId) {
      if(!this.isModalityLottery) {
        this.ticketStore.removeQuote(itemId);
      } else {
        this.ticketStore.removeTen(itemId);
      }
    },
    async handleFinalizeBet() {
      this.submitting = true;
      if (!this.isModalityLottery) {
        this.finalizeSportBet();
      } else {
        this.finalizeLotteryBet();
      }
    },
    async finalizeSportBet() {
      const { options, delayLiveBet } = useConfigClient();

      if (this.items.length < options.quantidade_min_jogos_bilhete) {
        this.toastStore.setToastConfig({
          message: `Por favor, inclua no MÍNIMO ${options.quantidade_min_jogos_bilhete} evento(s).`,
          type: ToastType.WARNING,
          duration: 5000
        })
        this.submitting = false;
      }

      if (this.items.length > options.quantidade_max_jogos_bilhete) {
        this.toastStore.setToastConfig({
          message: `Por favor, inclua no MÁXIMO ${options.quantidade_max_jogos_bilhete} evento(s).`,
          type: ToastType.WARNING,
          duration: 5000
        })
        this.submitting = false;
      }

      const {items, bettor, bettorDocumentNumber, value, accepted} = this.ticketStore;

      const data = {
        apostador: bettor,
        bettorDocumentNumber,
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
              valor: Number(item.quoteValue),
              nome: isQuotePlayer ? item.quoteName : null
            },
            cotacao_antiga_valor: null,
          }
        })
      }

      if(this.hasLiveBet) {
        try {
          const liveToken = await createLiveToken(data);
          data.token_aovivo = liveToken;

          const timeDelay = delayLiveBet;
          await delay(timeDelay * 1000);
        } catch ({errors}) {
          this.toastStore.setToastConfig({
            message: errors.message,
            type: ToastType.WARNING,
            duration: 5000
          })
          return;
        }
      }

      createBetSport(data)
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
          if(errors.code == 17) { // Código de cotação alterada.
            errors.data.forEach(({jogo_event_id, valor}) => {
              const items = { ...this.ticketStore.items};
              const ticketItem = Object.values(items).find(({eventId}) => eventId == jogo_event_id);
              if(ticketItem) {
                this.ticketStore.addQuote({
                  ...ticketItem,
                  previousQuoteValue: ticketItem.finalValue,
                  quoteValue: valor,
                  finalValue: valor,
                });

                this.hasChanges = true;
              }
            });
          }

          this.toastStore.setToastConfig({
            message: errors.message,
            type: ToastType.WARNING,
            duration: 5000
          })
        })
        .finally(() => this.submitting = false)
    },
    async finalizeLotteryBet() {
      const itens = this.items.map(item => ({
        numeros: item.tens,
        premio3: item.award03,
        premio4: item.award04,
        premio5: item.award05,
        sorteio_id: item.lotteryId,
        valor: item.value
      }))

      const payload = {
        apostador: this.bettorName,
        valor: this.betValue,
        versao_app: '2.0',
        telefone: '',
        chave: generateLotteryKey(),
        premio: this.betAward,
        itens
      }

      createLotteryBet(payload)
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
        .catch(({errors}) => {
          console.error({errors})
          this.toastStore.setToastConfig({
            message: errors.message,
            type: ToastType.WARNING,
            duration: 5000
          })
        })
        .finally(() => this.submitting = false)

    },  
    formatCurrency(value) {
      return formatCurrency(value);
    },
    handleAcceptChanges() {
      this.hasChanges = false;
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
    margin-top: 20px;
    margin-bottom: 30px;
    font-size: 12px;
    color: rgba(255, 255, 255, .5);
    color: rgba(var(--foreground-rgb), .5);
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
    color: #ffffff;
    color: var(--foreground);
  }

  &__text {
    color: #ffffff;
    color: var(--foreground);
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
  color: #ffffff;
  color: var(--foreground);

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
    fill: #ffffff;
    fill: var(--foreground);
  }

  &__icon-ball {
    min-width: 14px;
    height: 14px;
    margin-right: 4px;
    fill: #ffffff;
    fill: var(--foreground);
  }

  &__icon-close {
    opacity: 0.5;
    fill: #ffffff;
    fill: var(--foreground);
  }

  &__date {
    opacity: 0.5;
    color: var(--foreground);
    color: #ffffff;
  }

  &__result {
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;

    &--border {
      border: 1px solid var(--highlight);
      padding: 5px;
    }
  }

  &__previous-quote {
    text-decoration: line-through;
    padding-left: 5px;
  }
}

.finish {
  margin-bottom: -20px;
}

.value {
  margin-top: 8px;

  &__balance-text {
    font-size: 14px;
    color:#ffffff;
    color: var(--foreground);
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
    border: 0;
    border-radius: 8px;
    background: #181818;
    background: var(--input);
    color: rgba(255, 255, 255, 0.50);
    color: rgba(var(--input-foreground-rgb), 0.5);
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
    color:#ffffff;
    color: var(--foreground);
  }

  &__ganhos {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color:#ffffff;
    color: var(--foreground);
  }

  &__checkbox {
    appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid rgba(255, 255, 255, .5);
    border: 1px solid rgba(var(--foreground-rgb), 0.5);
    cursor: pointer;
    border-radius: 3px;
    position: relative;
    margin-right: 4px;
  }

  &__checkbox:checked {
    background-color: #35cd96;
    background-color: var(--highlight);
  }

  &__checkbox::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 4px;
    width: 5px;
    height: 9px;
    color:#ffffff;
    color: var(--foreground);
  }

  &__alteracao {
    display: flex;
    align-items: center;
    color:#ffffff;
    color: var(--foreground);
  }

  &__finalizar {
    padding: 8px 0;
  }

  &__finalizar-button {
    width: 100%;
  }

  &__aceitar-alteracoes {
   display: flex;
   flex-direction: column;
  }

  &__aceitar-alteracoes p{
    box-sizing: border-box;
    border-radius: .25rem;
    margin-bottom: 15px;
    margin-top: 15px;
    padding: 15px;
    color:#ffff;
    color: var(--foreground);
  }
}

.lottery {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  &__info {
    opacity: 0.8;
    color: #ffffff;
    color: var(--foreground);
  }

  &__tens {
    display: flex;
    align-items: center;
    opacity: 0.8;
  }

  &__group-tens {
    &--grid {
      display: grid;
      grid-template-columns: repeat(7, auto);
      gap: 8px;
    }

    &--android6 {
      display: flex;
      flex-wrap: wrap;
    }
  }

  &__ten {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #181818;
    background-color: var(--input);
    color: #ffffff;
    color: var(--input-foreground);
    border-radius: 120px;

    &--android6 {
      margin-left: 8px;
      margin-top: 8px;
    }
  }

  &__values {
    margin-top: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }

  &__value {
    color: #ffffff;
    color: var(--foreground);
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  &__value-description {
    color: #ffffff;
    color: var(--foreground);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}
</style>
