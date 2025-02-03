<template>
  <div class="close-bet">
    <Header :title="title" :showBackButton="true" />
    <div class="close-bet__container">
      <template v-if="bet">
        <div class="close-bet__ticket">
          <div class="code">
            <span class="code__text">Código da aposta: {{ bet.codigo }}</span>
            <span class="code__date">Horário: {{ formateDateTime(bet.horario) }}</span>
          </div>
          <div class="info">
            <span class="info__text">Cambista: {{ bet.passador.nome }}</span>
            <span class="info__text" v-if="bet.apostador">Apostador: {{ bet.apostador }}</span>
            <span class="info__text" v-if="bet.bettor_document_number">CPF do apostador: {{ bet.bettor_document_number }}</span>
            <span class="info__text">Status: {{ bet.ativo === true ? 'Ativo' : 'Inativo' }}</span>
            <span v-if="bet.tipo === 'loteria'" class="info__text">Valor total: R$ {{ formatCurrencyMoney(calculateTotalValueLottery(bet)) }}</span>
            <span v-if="bet.tipo === 'loteria'" class="info__text lottery">Modalidade: {{ bet.modalidade }}</span>
          </div>
          <div v-if="bet.tipo !== 'loteria'" class="gain">
            <div class="gain__item">
              <span>Quantidade de Jogos:</span>
              <span class="gain__value">{{ bet.itens_ativos }}</span>
            </div>
            <div class="gain__item">
              <span>Cotação:</span>
              <span class="gain__value">{{ formatNumber((bet.possibilidade_ganho / bet.valor), 1, 2) }}</span>
            </div>
            <div class="gain__item">
              <span>Valor Apostado:</span>
              <span class="gain__value">R$ {{ formatCurrencyMoney(bet.valor) }}</span>
            </div>
            <div class="gain__item">
              <span>Possível Retorno:</span>
              <span v-if="newEarningPossibility == null" class="gain__value">R$ {{ formatCurrencyMoney(bet.possibilidade_ganho) }}</span>
              <span v-else class="gain__value">
                <span class="gain__strikethrough" v-if="bet.possibilidade_ganho">R$ {{ formatCurrencyMoney(bet.possibilidade_ganho) }}</span> 
                <span class="gain--warning" v-if="newEarningPossibility">R$ {{ formatCurrencyMoney(newEarningPossibility) }}</span>
              </span>
            </div>
            <div class="gain__item">
              <span>Resultados:</span>
              <span class="gain__value">{{ capitalizeFirstLetter(bet.resultado) }}</span>
            </div>
            <div class="gain__item">
              <span>Prêmio:</span>
              <span class="gain__value">R$ {{ formatCurrencyMoney(bet.premio) }}</span>
            </div>
          </div>
          <div 
            class="bet" 
            v-for="(betItem, betIndex) in bet.itens" 
            :key="betIndex"
          >
            <div class="bet__header">
              <span class="bet__team">
                <template v-if="betItem.ao_vivo">
                  <IconLive :size="16" class="bet__icon"/>
                </template>
                <template v-if="betItem.sport === MODALITY_SPORT_FUTEBOL">
                  <IconFootball :size="16" class="bet__icon"/>
                </template>
                <template v-else-if="betItem.sport === MODALITY_SPORT_VOLEI">
                  <IconVolleyball :size="16" class="bet__icon"/>
                </template>
                <template v-else-if="betItem.sport === MODALITY_SPORT_E_SPORTS">
                  <IconGame :size="16" class="bet__icon"/>
                </template>
                <div v-if="bet.tipo !== 'loteria'" class="bet__team-name">
                  <span :class="{'gain__strikethrough': newEarningPossibility !== null}">{{ truncateText(betItem.time_a_nome + " x " + betItem.time_b_nome) }}</span>
                </div>
                <div class="bet-lottery" v-if="bet.tipo === 'loteria'">
                  <span>Valor: R${{ formatCurrencyMoney(betItem.valor) }}</span>
                  <span v-if="betItem.tipo == 'seninha'">
                    <span>Retorno 6: R${{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao6)) }}</span>
                    <span v-if="!bet.is_cliente && bet.passador.percentualPremio > 0">
                      <br>
                      Retorno líquido 6: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor, betItem.cotacao6, bet.passador.percentualPremio)) }}
                    </span>
                  </span>
                  <span v-if="betItem.cotacao5 > 0">
                    Retorno 5: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao5)) }}
                    <span v-if="!bet.is_cliente && bet.passador.percentualPremio > 0">
                      <br>
                      Retorno líquido 5: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor, betItem.cotacao5, bet.passador.percentualPremio)) }}
                    </span>
                  </span>
                  <span class="informacoes-item" v-if="betItem.cotacao4 > 0">
                    Retorno 4: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao4)) }}
                    <span v-if="!bet.is_cliente && bet.passador.percentualPremio > 0">
                      <br>
                      Retorno líquido 4: R${{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor, betItem.cotacao4, bet.passador.percentualPremio)) }}
                    </span>
                  </span>
                  <span class="informacoes-item" v-if="betItem.cotacao3 > 0">
                    Retorno 3: R$ {{ formatCurrencyMoney(calculateLotteryWinnings(betItem.valor, betItem.cotacao3))}}
                    <span v-if="!bet.is_cliente && bet.passador.percentualPremio > 0">
                      <br>
                      Retorno líquido 3: R$ {{ formatCurrencyMoney(calculateNetLotteryWinnings(betItem.valor, betItem.cotacao3, bet.passador.percentualPremio)) }}
                    </span>
                  </span>
                  <span>Dezenas: {{ betItem.numeros.join(', ') }}</span>
                  <span>
                    <strong v-if="betItem.status !== 'ganhou'">Resultado: {{ betItem.status }}</strong>
                    <template v-else>
                      <strong>Resultado: {{ betItem.status }} {{ betItem.tipo_premio }}</strong>
                    </template>
                  </span>
                </div>
              </span>
              <template>
                <p :class="{ 
                  'bet__status--success': betItem.resultado === 'ganhou', 
                  'bet__status--warning': betItem.resultado === 'perdeu',
                  'gain__strikethrough': newEarningPossibility !== null
                }"
                >{{ capitalizeFirstLetter(betItem.resultado) }}</p>
              </template>
            </div>
            <div v-if="bet.tipo !== 'loteria'" class="bet__info">
              <span class="bet__date" :class="{'gain__strikethrough': newEarningPossibility !== null}">{{ formateDateTime(betItem.jogo_horario) }}</span>
            </div>
            <div class="bet__text" v-if="bet.tipo !== 'loteria'">
              <span class="bet__select" :class="{'gain__strikethrough': newEarningPossibility !== null}">
                {{ betItem.categoria_nome }} : {{ betItem.aposta_tipo.nome }}
              </span>
              <span class="bet__odd" :class="{'gain__strikethrough': newEarningPossibility !== null}">{{ betItem.cotacao }}</span>
            </div>
          </div>
          <div class="bet__message" v-if="showConfirmCancelButtons">
            <p>
              <strong>Atenção:</strong> Confira como ficarão os novos valores. 
              Ao confirmar essa operação, não poderá ser desfeita.
            </p>
          </div>
        </div>
        <div class="buttons">
          <template v-if="showConfirmCancelButtons">
            <w-button
              text="Cancelar"
              color="secondary-light"
              @click="cancelAction"
              :disabled="buttonDisable"
            />
            <w-button
              :text="textButtonConfirm"
              @click="confirmAction"
              :disabled="buttonDisable"
            />
          </template>
          <template v-if="showDefaultButtons">
            <w-button
              text="Compartilhar"
              color="secondary-light"
              @click="handleOpenModalSharedBet"
              :disabled="buttonDisable"
              class="button-share"
            >
              <template #icon-left>
                <IconShare :size="20" color="var(--foreground)"/>
              </template>
            </w-button>
            <div class="button-spacer"></div>
            <w-button
              text="Imprimir"
              class="button__confirm"
              @click="handlePrint"
              :disabled="buttonDisable"
            >
              <template #icon-left>
                <IconPrinter :size="20" color="var(--highlight-foreground)"/>
              </template>
            </w-button>
          </template>
        </div>
        <div class="finish" v-if="showCancelButtons">
          <w-button
            id="btn-entrar"
            :text="textButtonCloseBet"
            value="entrar"
            name="btn-entrar"
            @click="closeBet"
            :disabled="buttonDisable"
          />
        </div>
      </template>
    </div>

    <ModalSharedOptions
      v-if="showModalShared"
      @close="handleCloseModalSharedBet"
      @click="handleShared"
    />
    
    <div style="position: absolute; top: -9999px; left: -9999px;">
      <div v-if="bet" ref="bet-shared" >
        <BetSharedPreview v-if="bet?.tipo !== 'loteria'" :bet="bet" />
        <BetSharedLotteryPreview v-else :bet="bet" />
      </div>
    </div>

  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';
import IconBall from '@/components/icons/IconBall.vue';
import IconLive from '@/components/icons/IconLive.vue';
import IconGame from '@/components/icons/IconGame.vue';
import IconVolleyball from '@/components/icons/IconVolleyball.vue';
import IconFootball from '@/components/icons/IconFootball.vue';
import IconShare from '@/components/icons/IconShare.vue';
import IconPrinter from '@/components/icons/IconPrinter.vue';
import WButton from '@/components/Button.vue';   
import { checkLive, closeBet, getBetById, printLottery, printTicket, sharedTicket, simulateBetClosure, tokenLiveClosing } from '@/services'
import { formatDateTimeBR, formatDateBR, formatCurrency, delay, capitalizeFirstLetter, calculateLotteryWinnings, calculateNetLotteryWinnings, calculateTotalValueLottery } from '@/utilities'
import { useConfigClient, useToastStore } from '@/stores';
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';
import { getModalitiesEnum } from '@/constants';
import ModalSharedOptions from './parts/ModalSharedOptions.vue';
import { toPng } from 'html-to-image';
import BetSharedPreview from './parts/BetSharedPreview.vue';
import BetSharedLotteryPreview from "@/views/CloseBetView/parts/BetSharedLotteryPreview.vue";


export default {
  name: 'close-bet',
  components: { 
    Header, 
    IconBall,
    IconLive,
    WButton,
    IconGame,
    IconVolleyball,
    IconFootball,
    IconShare,
    IconPrinter,
    Toast,
    ModalSharedOptions,
    BetSharedPreview,
    BetSharedLotteryPreview
  },
  props: {
    id: {
      type: Number | String,
      required: true
    },
    action: {
      type: String,
      default: 'view'
    },
  },
  data() {
    return {  
      title: 'Bilhete',
      bet: null,
      submitting: false,
      showCloseBet: false,
      showFinished: false,
      newQuotation: null,
      newEarningPossibility: null,
      closeRequesterd: false,
      toastStore: useToastStore(),
      configClientStore: useConfigClient(),
      textButtonConfirm: 'Confirmar',
      textButtonCloseBet: 'Encerrar Aposta',
      showModalShared: false
    };
  },
  activated() {

    this.fetchBetDetails();
  },
  computed: {
    showDefaultButtons() {
      return this.action === 'view'
    },
    showCancelButtons() {
      return this.action !== 'view' && !this.closeRequesterd
    },
    showConfirmCancelButtons() {
      return this.action !== 'view' && this.closeRequesterd
    },
    // TODO: Rever essa logica. Pois precisa cobrir todos.
    MODALITY_SPORT_FUTEBOL() {
      return this.Modalities.FOOTBALL;
    },
    MODALITY_SPORT_VOLEI() {
      return this.Modalities.VOLLEYBALL;
    },
    MODALITY_SPORT_E_SPORTS() {
      return this.Modalities.E_SPORTS;
    },
    Modalities() {
      return getModalitiesEnum();
    },
    buttonDisable() {
      return this.submitting == true;
    }
  },
  methods: {
    capitalizeFirstLetter,
    formatDate(date) {
      return formatDateBR(date);
    },
    calculateLotteryWinnings(value, odd) {
      return calculateLotteryWinnings(value, odd);
    },
    calculateNetLotteryWinnings(value, odd, percentageReward) {
      return calculateNetLotteryWinnings(value, odd, percentageReward);
    },
    calculateTotalValueLottery(bet) {
      return calculateTotalValueLottery(bet);
    },
    async closeBet() {
      this.submitting = true;
      this.textButtonCloseBet = 'Processando...';
      simulateBetClosure(this.bet.id)
        .then(resp => {
          this.closeRequesterd = true;
          this.newQuotation = resp.results.nova_cotacao;
          this.newEarningPossibility = resp.results.nova_possibilidade_ganho;
        })
        .catch(error => {
          this.newQuotation = null;
          this.newEarningPossibility = null;
        })
        .finally(() => {
          this.submitting = false;
          this.textButtonCloseBet = 'Encerrar Aposta';
        })
    },
    cancelAction() {
      this.newQuotation = null;
      this.newEarningPossibility = null;
      this.closeRequesterd = false;
      this.submitting = false;
    },
    async confirmAction() { 
      if(this.bet) {
        this.submitting = true;
        this.textButtonConfirm = "Processando...";
        const live = await this.haveLive(this.bet);
        let payload = { apostaId: this.bet.id, version: this.bet.version };

        if(live) {
          tokenLiveClosing(this.bet.id)
            .then(resp => {
              payload.token = resp.results ?? null;
            })
            .catch(error => {
              this.toastStore.setToastConfig({
                message: error.errors?.message,
                type: ToastType.WARNING,
                duration: 5000
              })
            });
          const timeDelay = this.configClientStore.delayLiveBet;
          await delay((timeDelay * 1000));
        }

        closeBet(payload)
          .then(resp => { 
            this.toastStore.setToastConfig({
              message: 'Encerrado com sucesso!',
              type: ToastType.SUCCESS,
              duration: 5000
            })
            this.$router.push({ 
              name: 'close-bet',
              params: {
                id: resp.results.id,
                action: 'view'
              }
            });
          })
          .catch(error => {
            this.toastStore.setToastConfig({
              message: error.errors?.message,
              type: ToastType.WARNING,
              duration: 5000
            })
          })
          .finally(() => {
            this.submitting = false;
            this.textButtonConfirm = "Confirmar";
          })
      }
    },
    async fetchBetDetails() {
      getBetById(this.id)
      .then(resp => {
        this.bet = resp.results;
      })
      .catch(({errors}) => {
        this.toastStore.setToastConfig({
          message: errors.message,
          type: ToastType.WARNING,
          duration: 5000
        })
      })
    },
    formatCurrencyMoney(value) {
        return formatCurrency(value);
    },
    formateDateTime(datetime) {
        return formatDateTimeBR(datetime);
    },
    formatNumber(value, minFractionDigits, maxFractionDigits) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: minFractionDigits,
            maximumFractionDigits: maxFractionDigits
        }).format(value);
    },
    truncateText(text, maxLength = 27) {
      if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
      }
      return text;
    },
    async haveLive(bet) {
      let result = false;

      const found = bet.itens.find((item) => item.ao_vivo);
      if(found) return true;

      const itensID = bet.itens.map((item) => item.jogo_api_id)
      const retorno = await checkLive(itensID);

      if(retorno.result) {
        result = true;
      }

      return result;
    },
    async handleShared(type) {
      if(type == 'link') {
        sharedTicket(this.bet);
      } else {
        const file = await this.generateBetImage();
        sharedTicket(this.bet, file);
      }
    },
    handlePrint() {
      if (this.bet.tipo !== 'loteria') {
        printTicket(this.bet);
        return;
      }

      printLottery(this.bet)
    },
    handleOpenModalSharedBet() {
      this.showModalShared = true;
    },
    handleCloseModalSharedBet() {
      this.showModalShared = false;
    },
    async generateBetImage() {
      try {
        await this.$nextTick();
        const element = this.$refs['bet-shared'];
        return await toPng(element);
      } catch (error) {
        console.error('Erro ao gerar a imagem:', error);
        return '';
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.close-bet {
  padding-bottom: 10px;

  &__container {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0 10px;
    min-height: calc(100vh - 80px);
    padding-top: 15px;
  }

  &__ticket {
    display: flex;
    flex-direction: column;
    padding: 19px 15px;
    width: 100%;
    background: #181818;
    background: var(--game);
    color: #ffffff;
    color: var(--game-foreground);
    border-radius: 2px;
  }
}

.code {
  display: flex;
  flex-direction: column;
  
  &__text {
    font-size: 14px;
    color: #ffffff;
    color: var(--game-foreground);
  }
  &__date {
    color: rgba(255, 255, 255, .5);
    color: rgba(var(--game-foreground-rgb), .5);
  }
}

.info {
  display: flex;
  flex-direction: column;
  margin-bottom: -10px;

  &__item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  &__text {
    font-size: 14px;
    color: #ffffff;
    color: var(--game-foreground);

    &.lottery {
      margin-bottom: 1.6rem;
    }
  }
}

.gain {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-top: 8px;
  
  &__item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #ffffff;
    color: var(--game-foreground);
  }

  &__strikethrough {
    text-decoration: line-through;
  }

  &--warning {
    color: #f61a1a;
    color: var(--warning);
  }

}

.bet {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #0a0a0a;
  background: var(--background);
  border-radius: 4px;
  margin-bottom: 5px;

  &__header, &__info, &__text, &__result {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__team {
    font-size: 14px;
    color: #ffffff;
    color: var(--foreground);
    display: flex;          
    align-items: center;   
  }

  &__team-name {
    margin-left: 4px;
  }

  &__date, &__text, &__result {
    font-size: 14px;
    color: #ffffff;
    color: var(--foreground);
    justify-content: space-between;
    font-weight: 500;
  }

  &__date {
    color: rgba(255, 255, 255, .5);
    color: rgba(var(--foreground-rgb), .5);
  }

  &__select {
    font-size: 14px;
    color: #ffffff;
    color: var(--foreground);
    font-weight: 500;
  }

  &__odd {
    font-size: 14px;
    color: #ffffff;
    color: var(--foreground);
    font-weight: 500;
  }

  &__status--success {
    color: #4CAF50;
    color: var(--success);
  }

  &__status--warning {
    color: #f61a1a;
    color: var(--warning);
  }

  &__message {
    margin-top: 20px;
  }

  &__icon {
    fill: #ffffff;
    fill: var(--foreground);
  }
}

.buttons {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.button-spacer {
  width: 20px; 
}

.finish {
  margin-top: 20px;
}

strong {
  font-weight: bold;
}

.bet-lottery {
  display: flex;
  flex-direction: column;
  color: #ffffff;
  color: var(--foreground);
}
</style>


