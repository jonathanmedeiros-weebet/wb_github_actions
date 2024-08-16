<template>
  <div class="validation-detail">
    <Header :title="title" :showBackButton="true" />
    <div class="validation-detail__container">
      <template v-if="bet !== null">
        <div class="code">
          <span class="code__bet">Código pré-aposta:</span>
          <span class="code__number">{{bet.id}}</span>
        </div>
        <div 
          class="bet"
          v-for="item in betItems" 
          :key="item.id" 
        >
          <div class="bet__header">
            <span class="bet__team">
              <IconLive v-if="item.ao_vivo" class="bet__icon-live"/>
              <IconBall class="bet__icon-ball"/>
              {{ item.jogo_nome }}
            </span>
            <IconClose class="bet__icon-close" @click="removeItem(item.id)"/>
          </div>
          <div class="bet__info">
            <span class="bet__date">{{ item.jogo_horario }}</span>
          </div>
          <div class="bet__text">
            <span>{{ item.ao_vivo ? 'Resultado Final' : 'Para ganhar' }}</span>
          </div>
          <div class="bet__result">
            <span>{{ item.categoria_nome }} : {{ getNameTypeBet(item.aposta_tipo.chave) }}</span>
            <template v-if="!item.mensagem">
              <span v-if="item.cotacao_antiga == item.cotacao_atual">{{ item.cotacao_antiga }}</span>
              <template v-else>
                <span>{{ item.cotacao_atual }}<span class="bet__text--danger"> {{ item.cotacao_antiga }}</span> </span>
              </template>
            </template>
          </div>
          <div class="bet__text--danger" v-if="item.mensagem">
            <span>{{ item.mensagem }}</span>
          </div>
        </div>
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
            <button class="value__add" @click="addValue(10)">+10</button>
            <button class="value__add" @click="addValue(20)">+20</button>
            <button class="value__add" @click="addValue(50)">+50</button>
            <w-input
              class="value__balance-input"
              name="value_bet"
              type="number"
              v-model="valueBet" 
            >
              <template #icon>
                <span style="color: #ffffff80;">R$</span>
              </template>
            </w-input>
          </div>
        </div>
        <div class="cotacao">
          <div class="cotacao__ganhos">
            <span>Possíveis Ganhos:</span>
            <span>{{ formatCurrencyMoney(gainEstimate) }}</span>
          </div>
          <div class="cotacao__alteracao">
            <input class="cotacao__checkbox" type="checkbox" v-model="acceptChangesOdds" id="accept-changes" />
            <label for="accept-changes">Aceitar Alterações de odds</label>
          </div>
          <div class="cotacao__alerta" v-if="hasDifferentOdds">
            <span class="bet__team">
              <icon-warning fill="#664d03" :size="14"/>Atenção
            </span>
            <p>Algumas cotações mudaram desde que foi criada a pré-aposta, verifique com atenção antes realizar a validação.</p>
          </div>
          <div class="cotacao__finalizar">
            <w-button
              id="btn-entrar"
              :text="textButtonFinalizeBet"
              value="entrar"
              class="cotacao__finalizar-button"
              name="btn-entrar"
              :disabled="buttonDisabled"
              @click="submit"
            />
          </div>
        </div>
      </template>
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
import IconUserLine from '@/components/icons/IconUserLine.vue'
import { getPreBetByCode } from '@/services/preBet.service';
import { useConfigClient, useToastStore } from '@/stores';
import { formatCurrency } from '@/utilities';
import IconWarning from '@/components/icons/IconWarning.vue';
import { createBetSport, tokenLiveSport } from '@/services/sport.service';
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';


export default {
  name: 'validation-detail',
  components: { 
    Header, 
    IconDelete,
    IconLive,
    IconBall,
    IconClose,
    IconUserLine,
    WInput,
    WButton,
    IconWarning,
    Toast
  },
  props: {
    id: {
      type: Number | String,
      required: true
    }
  },
  data() {
    return {  
      title: 'Validar Aposta',
      code_aposta: 231,
      valueBet: 0,
      bet: null,
      betLive: false,
      betItems: null,
      betOptions: useConfigClient().betOptions,
      options: useConfigClient().options,
      gainEstimate: 0,
      buttonDisabled: false,
      hasDifferentOdds: false,
      bettorName: '',
      acceptChangesOdds: false,
      toastStore: useToastStore(),
      textButtonFinalizeBet: "Finalizar aposta"
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getNameTypeBet(key){
      return this.betOptions[key] ? this.betOptions[key].nome : '';
    },
    async fetchData() {
      getPreBetByCode(this.id)
        .then(resp => {
          this.bet = resp.results;
          this.valueBet = this.bet.valor;
          this.betItems = this.bet.itens;
          this.bettorName = this.bet.apostador;

          let live = false;

          this.betItems.forEach(item => {
              if (item.ao_vivo) live = true;

              if (item.mensagem) this.buttonDisabled = true;

              if (item.cotacao_antiga != item.cotacao_atual) {
                this.hasDifferentOdds = true;
              }
          });

          this.betLive = live;
        })
        .catch(error => {
          this.toastStore.setToastConfig({
            message: error.errors?.message ?? 'Erro inesperado',
            type: ToastType.DANGER,
            duration: 5000
          })
        })
    },
    calculateEstimatedWinnings(value = undefined) {
      if (value === undefined) {
        value = this.valueBet;
      }

      let odds = this.bet.cotacao > this.options.fator_max ? this.options.fator_max : this.bet.cotacao;
      
      const gainEstimate = value * odds;

      if (gainEstimate < this.options.valor_max_premio) {
        this.gainEstimate = gainEstimate;
      } else {
        this.gainEstimate = this.options.valor_max_premio;
      }
    },
    addValue(value){
      this.valueBet += value;
    },
    formatCurrencyMoney(value) {
      return formatCurrency(value);
    },
    removeItem(id){
      this.betItems = this.betItems.filter(item => item.id !== id);
      
      let disabled = false;
      let aovivo = false;

      this.bet.cotacao = this.betItems
        .map(item => {
            if (item.mensagem) {
                disabled = true;
            }

            if (item.ao_vivo) {
                aovivo = true;
            }

            return item.cotacao_atual;
        })
        .reduce((acumulador, valorAtual) => acumulador * valorAtual);

      this.buttonDisabled = disabled;
      this.betLive = aovivo;

      this.calculateEstimatedWinnings();
    },
    async submit() {
      this.buttonDisabled = true;
      this.textButtonFinalizeBet = "Processando...";
      const values = {};
      values.preaposta_codigo = this.bet.codigo;
      values.apostador = this.bettorName;
      values.valor = parseFloat(this.valueBet);
      values.aceitar_alteracoes_odds = this.acceptChangesOdds;

      values.itens = this.betItems.map(item => {
          return {
              jogo_event_id: item.jogo_api_id,
              jogo_id: item.jogo_fi,
              jogo_nome: item.jogo_nome,
              ao_vivo: item.ao_vivo,
              cotacao: {
                  chave: item.aposta_tipo.chave,
                  nome: item.odd_nome,
                  valor: item.cotacao_base
              }
          };
      });

      if (values.itens.length) {
        if (this.betLive) {
          values.token_aovivo = await tokenLiveSport(values);
          const { option } = useConfigClient();
          const timeDelay = option.delay_aposta_aovivo ? option.delay_aposta_aovivo : 10;
          await delay((timeDelay * 1000));
        }

        createBetSport(values)
          .then(resp => {
            this.toastStore.setToastConfig({
              message: resp.results.message ?? 'Validado com sucesso!',
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
            this.buttonDisabled = false;
            this.textButtonFinalizeBet = "Finalizar aposta";
            this.toastStore.setToastConfig({
              message: error.errors?.message ?? 'Erro inesperado',
              type: ToastType.DANGER,
              duration: 5000
            })
        })
        
      } else {
        this.buttonDisabled = false;
        this.textButtonFinalizeBet = "Finalizar aposta";
        this.toastStore.setToastConfig({
          message: 'Nenhum jogo na aposta!',
          type: ToastType.WARNING,
          duration: 5000
        })
      }
    }
  },
  computed: {
    sumOdds() {
      return this.teams.reduce((total, team) => total + team.odd, 0).toFixed(2);
    },
    
  },
  watch: {
    valueBet(newValue, oldValue){
      const value = parseFloat(newValue);
      if(value <= 0 || this.valueBet <= 0) {
        this.buttonDisabled = true;
        this.gainEstimate = 0;
      }else{
        this.calculateEstimatedWinnings(newValue);
        this.buttonDisabled = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.validation-detail {
  &__container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0 20px;
    min-height: 100%;
    padding-top: 12px;
    padding-bottom: 100px;
  }
  
}
.code {
  border-radius: 4px;
  background: #181818;
  display: flex;
  width: 100%;
  padding: 13px;
  align-items: center;
  margin-bottom: 6px;

  &__bet {
    font-size: 16px;
    margin-right: 10px;
  }

  &__number {
    font-size: 20px;
  }
  
}


.bet {
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative; 
  
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
    width: 14px;
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

  &__text {
    &--danger {
      color: #ff0000;
      color: var(--color-danger);
    }
  }
}

.finish {
  margin-bottom: -20px;
}

.value {
  margin-top: 8px;

  &__balance-text {
    font-size: 14px;
  }

  &__balance {
    display: flex;
    align-items: center;
  }

  &__add {
    display: flex;
    width: 46px;
    padding: 18px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: var(--color-background-input);
    background: #181818;
    color: var(--color-text-input);
    color: #ffffff80;
    font-size: 14px;
    border: none; 
    margin-right: 8px;
  }

  &__balance-input{
    width: 100%;
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
  padding: 8px;

  &__value {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  &__ganhos {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  &__alteracao {
    padding-top: 5px;
    display: flex;
    align-items: center;
  }

  &__checkbox {
    margin-right: 5px;
    appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid #ffffff80;
    border: 1px solid var(--color-text-input);
    background-color: transparent;
    cursor: pointer;
    border-radius: 3px;
    position: relative;
  }
  
  &__checkbox:checked {
    background-color: #0be58e;
    background-color: var(--color-primary);
  }
  &__checkbox::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 4px;
    width: 5px;
    height: 9px;
  }

  &__finalizar {
    padding-top: 16px;
  }

  &__finalizar-button {
    width: 100%;
  }

  &__alerta {
    margin-top: 8px;
    background-color: #fff3cd;
    border-radius: 6px;
    color: #664d03;
    padding: 12px;
    font-size: 12px;

    p {
      margin-top: 6px;
    }
  }

  &__alerta-tile {
    display: flex;
    padding-bottom: 10px;
  }

  
}
</style>
