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
              <span class="gain__value">{{ formatCurrencyMoney(bet.possibilidade_ganho) }}</span>
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
                {{ truncateText(betItem.time_a_nome + " x " + betItem.time_b_nome) }}
              </span>
              <template v-if="showFinished">
                <p :class="{ 'bet__status--success': betItem.resultado === 'ganhou', 'bet__status--danger': betItem.resultado === 'perdeu' }">{{ capitalizeFirstLetter(betItem.resultado) }}</p>
              </template>
            </div>
            <div class="bet__info">
              <span class="bet__date">{{ formateDateTime(betItem.jogo_horario) }}</span>
            </div>
            <div class="bet__text">
              <span class="bet__select">
                {{ betItem.encerrado ? 'Resultado Final' : 'Para ganhar' }} : {{ betItem.odd_nome }}
              </span>
              <span class="bet__odd">{{ betItem.cotacao }}</span>
            </div>
          </div>
          <div class="bet__message" v-if="showClickFinalized">
            <p>
              <strong>Atenção:</strong> Confira como ficarão os novos valores. 
              Ao confirmar essa operação, não poderá ser desfeita.
            </p>
          </div>
        </div>
        <div class="buttons">
          <template v-if="showClickFinalized">
            <w-button
              text="Cancelar"
              color="secondary-light"
              @click="cancelAction"
            />
            <w-button
              text="Confirmar"
              @click="confirmAction"
            />
          </template>
          <template v-if="showFinished">
            <w-button
              text="Compartilhar"
              color="secondary-light"
            >
              <template #icon-left>
                <IconShare :size="20"/>
              </template>
            </w-button>
            <w-button
              text="Imprimir"
              class="button__confirm"
            >
              <template #icon-left>
                <IconPrinter :size="20"/>
              </template>
            </w-button>
          </template>
        </div>
        <div class="finish" v-if="showCloseBet">
          <w-button
            id="btn-entrar"
            text="Encerrar Aposta"
            value="entrar"
            name="btn-entrar"
            @click="closeBet"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import 'moment/locale/pt-br';
import Header from '@/components/layouts/Header.vue';
import IconBall from '@/components/icons/IconBall.vue';
import IconLive from '@/components/icons/IconLive.vue';
import IconGame from '@/components/icons/IconGame.vue';
import IconVolleyball from '@/components/icons/IconVolleyball.vue';
import IconFootball from '@/components/icons/IconFootball.vue';
import IconShare from '@/components/icons/IconShare.vue';
import IconPrinter from '@/components/icons/IconPrinter.vue';
import WButton from '@/components/Button.vue';   
import { checkLive, closeBet, getById, tokenLiveClosing } from '@/services'
import { formatCurrency } from '@/utilities'

const MODALITY_SPORT_FUTEBOL = 1;
const MODALITY_SPORT_VOLEI = 91;
const MODALITY_SPORT_E_SPORTS = 151;

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
    IconPrinter
  },
  props: {
    id: {
        type: Number | String,
        required: true
    },
  },
  data() {
    return {  
      title: 'Bilhete',
      bet: null,
      showClickFinalized: false,
      showCloseBet: false,
      showFinished: false,
    };
  },
  mounted() {
    this.fetchBetDetails();
    
  },
  methods: {
    formatDate(date) {
      return moment(date).locale('pt-br').format('DD/MM/YYYY');
    },
    async closeBet() {
      // TODO: IMPLEMENTADO O SERVICE DE IMPLEMENTAR A APOSTA MAS FALTA TESTAR 
      // simulateBetClosure(this.bet.id)
      // then(resp => {
      //   console.log(resp);
      // })
      // .catch(error => {
      //   console.error(error);
      // })
      console.log('SIMULAR FECAR A APOSTA!');
      this.showCloseBet = false;
      this.showClickFinalized = true;
  
    },
    cancelAction() {
      this.showCloseBet = true;
      this.showClickFinalized = false;
    },
    async confirmAction() {
      // TODO: API APRESENTANDO PROBLEMA NO PHP
      // this.showFinish = false;
      // this.showClickFinalized = false;
      // this.showFinished = true;
      // this.title = 'Aposta';   
      if(this.bet) {
        
        const live = await this.haveLive(this.bet);
        let payload = { apostaId: this.bet.id, version: this.bet.version };

        if(live) {
          const token = await tokenLiveClosing(this.bet.id);
          const token_aovivo = token ?? null;
          payload.token = token_aovivo;
        }
        
        closeBet(payload)
        .then(resp => {
          console.log('Aposta encerrada com sucesso');
          console.log(resp);
        })
        .catch(error => {
          console.log(error);
        })
        
      }

    },
    async fetchBetDetails() {
      getById(this.id)
      .then(resp => {
        
        this.bet = resp.results;

        if(resp.results.pago == false && resp.results.resultado == null){
          this.showCloseBet = true;
          this.showFinished = false;
          this.showClickFinalized = false;
        }

        if (resp.results.pago == true && (resp.results.resultado === 'ganhou' || resp.results.resultado == 'perdeu' )) {
          this.showFinish = false;
          this.showFinished = true;
          this.showClickFinalized = false;
        } 
        
      })
      .catch(error => {
          console.log(error);
      })
    },
    formatCurrencyMoney(value) {
        return formatCurrency(value);
    },
    formateDateTime(datetime) {
        return moment(datetime).format("DD/MM/YYYY HH:mm");
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
      if(found) {
          return true;
      }

      const itensID = bet.itens.map((item) => {
          return item.jogo_api_id;
      })

      const retorno = await checkLive(itensID);

      if(retorno) {
          result = true;
      }

      return result;
    }
  },
  computed: {
    MODALITY_SPORT_FUTEBOL() {
      return MODALITY_SPORT_FUTEBOL;
    },
    MODALITY_SPORT_VOLEI() {
      return MODALITY_SPORT_VOLEI;
    },
    MODALITY_SPORT_E_SPORTS() {
      return MODALITY_SPORT_E_SPORTS;
    },
  }
}
</script>
<style lang="scss" scoped>
.close-bet {

  padding-bottom: 10px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0 10px;
    min-height: 100%;
    padding-top: 15px;
  }
  &__ticket {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 19px 15px;
    width: 100%;
    background: var(--color-background-input);
    border-radius: 2px;
  }
}

.code {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &__text {
        font-size: 14px;
        color: var(--color-text);
    }
    &__date {
        color: var(--color-text-input)
    }
}

.info {
    display: flex;
    flex-direction: column;
    gap: 4px;
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
    gap: 4px;
    margin-bottom: 10px;

    &__item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: var(--color-text);
    }

}

.bet {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: var(--color-background);
    border-radius: 4px;
    margin-bottom: -9px;
    
    &__header, &__info, &__text, &__result {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    &__team {
        font-size: 14px;
        color: var(--color-text);
        display: flex;          
        align-items: center;   
        font-size: 14px;
        color: var(--color-text);
        gap: 4px;  
    }

    &__date, &__text, &__result {
        font-size: 14px;
        color: #bbbbbb;
        justify-content: space-between;
    }

    &__odd {
        font-size: 14px;
        color: var(--color-text);
    }

    &__select {
        color: var(--color-text);
        font-size: 14px;
    }
    
    &__message {
        color: var(--color-danger);
        text-align: center;
        font-size: 14px;
        padding: 10px;
        padding-top: 10px;
    }

    &__status--success {
      color: var(--color-success);
    }
    &__status--danger {
      color: var(--color-danger);
    }
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding-top: 25px;
}

.finish {
    padding: 8px;
    padding-top: 25px;
    
    &__button{
        width: 100%;
    }
}
</style>

