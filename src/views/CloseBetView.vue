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
            <span class="info__text">Apostador: {{ bet.apostador }}</span>
            <span class="info__text">Status: {{ bet.ativo === true ? 'Ativo' : 'Inativo' }}</span>
          </div>
          <div class="gain">
            <div class="gain__item">
              <span>Quantidade de Jogos:</span>
              <span class="gain__value">{{ bet.itens_ativos }}</span>
            </div>
            <div class="gain__item">
              <span>Cotação:</span>
              <span class="gain__value">{{ formatNumber((bet.possibilidade_ganho / bet.valor), 1, 3) }}</span>
            </div>
            <div class="gain__item">
              <span>Valor Apostado:</span>
              <span class="gain__value">{{ formatCurrencyMoney(bet.valor) }}</span>
            </div>
            <div class="gain__item">
              <span>Possível Retorno:</span>
              <span v-if="newEarningPossibility == null" class="gain__value">{{ formatCurrencyMoney(bet.possibilidade_ganho) }}</span>
              <span v-else class="gain__value">
                <span class="gain__strikethrough">{{ formatCurrencyMoney(bet.possibilidade_ganho) }}</span> 
                <span class="gain--danger"> {{ formatCurrencyMoney(newEarningPossibility) }}</span>
              </span>
            </div>
            <div class="gain__item">
              <span>Resultados:</span>
              <span class="gain__value">{{ capitalizeFirstLetter(bet.resultado) }}</span>
            </div>
            <div class="gain__item">
              <span>Prêmio:</span>
              <span class="gain__value">{{ formatCurrencyMoney(bet.premio) }}</span>
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
                  <IconLive :size="16"/>
                </template>
                <template v-if="betItem.sport === MODALITY_SPORT_FUTEBOL">
                  <IconFootball :size="16"/>
                </template>
                <template v-else-if="betItem.sport === MODALITY_SPORT_VOLEI">
                  <IconVolleyball :size="16"/>
                </template>
                <template v-else-if="betItem.sport === MODALITY_SPORT_E_SPORTS">
                  <IconGame :size="16"/>
                </template>
                <div class="bet__team-name">
                  <span :class="{'gain__strikethrough': newEarningPossibility !== null}">{{ truncateText(betItem.time_a_nome + " x " + betItem.time_b_nome) }}</span>
                </div>
              </span>
              <template v-if="showFinished">
                <p :class="{ 
                  'bet__status--success': betItem.resultado === 'ganhou', 
                  'bet__status--danger': betItem.resultado === 'perdeu',
                  'gain__strikethrough': newEarningPossibility !== null
                }"
                >{{ capitalizeFirstLetter(betItem.resultado) }}</p>
              </template>
            </div>
            <div class="bet__info">
              <span class="bet__date" :class="{'gain__strikethrough': newEarningPossibility !== null}">{{ formateDateTime(betItem.jogo_horario) }}</span>
            </div>
            <div class="bet__text">
              <span class="bet__select" :class="{'gain__strikethrough': newEarningPossibility !== null}">
                {{ betItem.encerrado ? 'Resultado Final' : 'Para ganhar' }} : {{ betItem.odd_nome }}
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
              @click="handleShared"
              :disabled="buttonDisable"
            >
              <template #icon-left>
                <IconShare :size="20" color="var(--foreground-league)"/>
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
                <IconPrinter :size="20" color="var(--foreground-highlight)"/>
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
import { checkLive, closeBet, getBetById, printTicket, sharedTicket, simulateBetClosure, tokenLiveClosing } from '@/services'
import { formatDateTimeBR, formatDateBR, formatCurrency, delay } from '@/utilities'
import { Modalities } from '@/enums';
import { useConfigClient, useToastStore } from '@/stores';
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';

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
    Toast
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
      option: useConfigClient().options,
      textButtonConfirm: 'Confirmar',
      textButtonCloseBet: 'Encerrar Aposta'
    };
  },
  mounted() {
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
      return Modalities.SOCCER;
    },
    MODALITY_SPORT_VOLEI() {
      return Modalities.VOLEIBALL;
    },
    MODALITY_SPORT_E_SPORTS() {
      return Modalities.E_SPORT;
    },
    buttonDisable() {
      return this.submitting == true;
    }
  },
  methods: {
    formatDate(date) {
      return formatDateBR(date);
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
                type: ToastType.DANGER,
                duration: 5000
              })
            });
          const timeDelay = this.option.delay_aposta_aovivo ?? 10;
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
              type: ToastType.DANGER,
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
      .catch(error => {
        this.toastStore.setToastConfig({
          message: error.errors.message,
          type: ToastType.DANGER,
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
    capitalizeFirstLetter(str) {
        if(str){
            return str.charAt(0).toUpperCase() + str.slice(1);
        }else{
            return str;
        }
    },
    formatNumber(value, minFractionDigits, maxFractionDigits) {
        return 'R$ ' + new Intl.NumberFormat('pt-BR', {
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
    handleShared() {
      sharedTicket(this.bet);
    },
    handlePrint() {
      printTicket(this.bet)
    }
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
    min-height: 100%;
    padding-top: 15px;
  }

  &__ticket {
    display: flex;
    flex-direction: column;
    padding: 19px 15px;
    width: 100%;
    background: #181818;
    background: var(--game);
    border-radius: 2px;
  }
}

.code {
  display: flex;
  flex-direction: column;
  
  &__text {
    font-size: 14px;
    color: #ffffff;
    color: var(--foreground-league);
  }
  &__date {
    color: #ffffff80;
    color: var(--foreground-league-input)
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
    color: var(--foreground-league);
  }

  &__strikethrough {
    text-decoration: line-through;
  }

  &--danger {
    color: #f61a1a;
    color: var(--color-danger);
  }

}

.bet {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #0a0a0a;
  background: var(--background);
  border-radius: 4px;
  margin-bottom: -9px;

  &__header, &__info, &__text, &__result {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__team {
    font-size: 14px;
    color: #ffffff;
    color: var(--foreground-header);
    display: flex;          
    align-items: center;   
  }

  &__team-name {
    margin-left: 4px;
  }

  &__date, &__text, &__result {
    font-size: 14px;
    color: #bbbbbb;
    justify-content: space-between;
    color: var(--foreground-header);
    font-weight: 500;
  }

  &__select {
    font-size: 14px;
    color: #bbbbbb;
    color: var(--foreground-header);
    font-weight: 500;
  }

  &__odd {
    font-size: 14px;
    color: #cccccc;
    color: var(--foreground-header);
    font-weight: 500;
  }

  &__status--success {
    color: #4CAF50;
    color: var(--color-success);
  }

  &__status--danger {
    color: #f61a1a;
    color: var(--color-danger);
  }
}

.buttons {
  display: flex;
  align-items: center;
  padding-top: 25px;
}

.button-spacer {
  width: 20px; 
}

.finish {
  margin-top: 20px;
}
</style>


