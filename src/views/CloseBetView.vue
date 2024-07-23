<template>
  <div class="close-bet">
    <Header :title="title" :showBackButton="true" />
    <div class="close-bet__container">
      <div class="close-bet__ticket">
        <div class="code">
          <span class="code__text">Código da aposta: {{ bet.codeBet }}</span>
          <span class="code__date">Horário: {{ bet.hourDate }}</span>
        </div>
        <div class="info">
          <span class="info__text">Cambista: {{ bet.scalperName }}</span>
          <span class="info__text">Apostador: {{ bet.punter }}</span>
          <span class="info__text">Status: {{ bet.status }}</span>
        </div>
        <div class="gain">
          <div class="gain__item">
            <span>Quantidade de Jogos:</span>
            <span class="gain__value">{{ bet.qtGames }}</span>
          </div>
          <div class="gain__item">
            <span>Cotação:</span>
            <span class="gain__value">{{ bet.odd }}</span>
          </div>
          <div class="gain__item">
            <span>Valor Apostado:</span>
            <span class="gain__value">R${{ bet.valueBet }}</span>
          </div>
          <div class="gain__item">
            <span>Possível Retorno:</span>
            <span class="gain__value">R${{ bet.returnEarnings }}</span>
          </div>
          <div class="gain__item">
            <span>Resultados:</span>
            <span class="gain__value">{{ bet.statusResult }}</span>
          </div>
          <div class="gain__item">
            <span>Prêmio:</span>
            <span class="gain__value">R${{ bet.award }}</span>
          </div>
        </div>
        <div 
          class="bet" 
          v-for="(betItem, betIndex) in bet.items" 
          :key="betIndex"
        >
          <div class="bet__header">
            <span class="bet__team">
              <template v-if="betItem.isLive">
                <IconLive :size="16"/>
              </template>
              <template v-if="betItem.modality === 'football'">
                <IconFootball :size="16"/>
              </template>
              <template v-else-if="betItem.modality === 'volleyball'">
                <IconVolleyball :size="16"/>
              </template>
              <template v-else-if="betItem.modality === 'e-sport'">
                <IconGame :size="16"/>
              </template>
              {{ betItem.title }}
            </span>
          </div>
          <div class="bet__info">
            <span class="bet__date">{{ formatDate(betItem.date) }} {{ betItem.hour }}</span>
          </div>
          <div class="bet__text">
            <span class="bet__select">
              {{ betItem.isLive ? 'Resultado Final' : 'Para ganhar' }} : {{ betItem.select }}
            </span>
            <span class="bet__odd">{{ betItem.odd }}</span>
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
  data() {
    return {  
      title: 'Bilhete',
      bet: {
        codeBet: "AEC0-1AB4", 
        hourDate: "2024-06-02 18:00",
        scalperName: "Demo", 
        punter: '118.525.478-83', 
        status: "Ativo", 
        qtGames: 3,   
        odd: 29, 
        valueBet: 10, 
        returnEarnings: 290, 
        statusResult: "Pendente", 
        award: 0.00,
        items: [
          {
            title: 'Argentino JRS X Rosario Central',
            isLive: true,
            date: '2024-03-19', 
            hour: '21:15', 
            select: 'Empate',
            odd: 3.30,
            modality: 'football', 
          },
          {
            title: 'França X Italia',
            isLive: false,
            date: '2024-03-19', 
            hour: '20:15', 
            select: 'França',
            odd: 1.30,
            modality: 'e-sport', 
          },
          {
            title: 'Real Madrid X Sporting',
            isLive: false,
            date: '2024-03-19', 
            hour: '20:15', 
            select: 'Sporting',
            odd: 4.30,
            modality: 'volleyball', 
          },
        ]
      },
      showClickFinalized: false,
      showCloseBet: true,
      showFinished: false,
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).locale('pt-br').format('DD/MM/YYYY');
    },
    closeBet() {
      this.showCloseBet = false;
      this.showClickFinalized = true;
    },
    cancelAction() {
      this.showCloseBet = true;
      this.showClickFinalized = false;
    },
    confirmAction() {
      console.log('Encerrada');
      this.showFinish = false;
      this.showClickFinalized = false;
      this.showFinished = true;
      this.title = 'Aposta';
    }
  }
}
</script>
<style lang="scss" scoped>
.close-bet {
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

