<template>
  <div class="close-bet">
    <Header :title="title" :showBackButton="true" />
    <div class="close-bet__container">
      <div 
        class="ticket" 
        v-for="(ticketItem, ticketIndex) in ticket" 
        :key="ticketIndex"
       >
        <div class="code">
          <span class="code__text">Código da aposta: {{ ticketItem.infoBet[0].codeBet }}</span>
          <span class="code__date">Horário: {{ ticketItem.infoBet[0].hourDate }}</span>
        </div>
        <div class="info">
          <span class="info__text">Cambista: {{ ticketItem.infoBet[0].scalperName }}</span>
          <span class="info__text">Apostador: {{ ticketItem.infoBet[0].punter }}</span>
          <span class="info__text">Status: {{ ticketItem.infoBet[0].status }}</span>
        </div>
        <div class="gain">
          <div class="gain__item">
            <span>Quantidade de Jogos:</span>
            <span class="info__value">{{ ticketItem.infoBet[0].qtGames }}</span>
          </div>
          <div class="gain__item">
            <span>Cotação:</span>
            <span class="info__value">{{ ticketItem.infoBet[0].odd }}</span>
          </div>
          <div class="gain__item">
            <span>Valor Apostado:</span>
            <span class="info__value">R${{ ticketItem.infoBet[0].valueBet }}</span>
          </div>
          <div class="gain__item">
            <span>Possível Retorno:</span>
            <span class="info__value">R${{ ticketItem.infoBet[0].returnEarnings }}</span>
          </div>
          <div class="gain__item">
            <span>Resultados:</span>
            <span class="info__value">{{ ticketItem.infoBet[0].statusResult }}</span>
          </div>
          <div class="gain__item">
            <span>Prêmio:</span>
            <span class="info__value">R${{ ticketItem.infoBet[0].award }}</span>
          </div>
        </div>
        <div 
            class="bet" 
            v-for="(bet, betIndex) in Object.values(ticketItem.team_bet)" 
            :key="betIndex"
        >
          <div class="bet__header">
            <span class="bet__team">
              <template v-if="bet[0].live">
                <IconLive class="bet__icon-live"/>
              </template>
              <template v-if="bet[0].modality === 'football'">
                <IconFootball class="bet__icon-modality"/>
              </template>
              <template v-else-if="bet[0].modality === 'volleyball'">
                <IconVolleyball class="bet__icon-modality"/>
              </template>
              <template v-else-if="bet[0].modality === 'e-sport'">
                <IconGame class="bet__icon-modality"/>
              </template>
              {{ bet[0].team_house }} X {{ bet[0].team_outside }}
            </span>
          </div>
          <div class="bet__info">
            <span class="bet__date">{{ bet[0].date }} {{ bet[0].hour }}</span>
          </div>
          <div class="bet__text">
            <span class="bet__select">
                {{ bet[0].live ? 'Resultado Final' : 'Para ganhar' }} : {{bet[0].select}}
            </span>
            <span class="bet__odd">{{ bet[0].odd }}</span>
          </div>
        </div>
        <div class="bet__message" v-if="showClickFinalized">
          <p>
            <strong>Atenção:</strong> Confira como ficarão os novos valores. 
            Ao confirmar essa operação, não poderá ser desfeita.
          </p>
        </div>
      </div>  
    <div class="buttons" v-if="showClickFinalized">
        <w-button
        text="Cancelar"
        class="button__cancel"
        @click="cancelAction"
        />
        <w-button
        text="Confirmar"
        class="button__confirm"
        @click="confirmAction"
        />
    </div>
        <div class="buttons" v-if="showFinished">
        <w-button
        text="Compartilhar"
        class="button__cancel"
        @click="cancelAction"
        />
        <w-button
        text="Imprimir"
        class="button__confirm"
        @click="confirmAction"
        />
    </div>
      <div class="finish" v-if="showCloseBet">
        <w-button
          id="btn-entrar"
          text="Encerrar Aposta"
          value="entrar"
          class="finish__button"
          name="btn-entrar"
          @click="closeBet"
        />
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
import WButton from '@/components/Button.vue';   

export default {
  name: 'Ticket',
  components: { 
    Header, 
    IconBall,
    IconLive,
    WButton,
    IconGame,
    IconVolleyball,
    IconFootball
  },
  data() {
    return {  
      title: 'Bilhete',
      ticket: [
        {
          infoBet: [
            {   
              codeBet: "AEC0-1AB4", 
              hourDate: "02/06/2024 18:00",
              scalperName: "Demo", 
              punter: '118.525.478-83', 
              status: "Ativo", 
              qtGames: 3,   
              odd: 29, 
              valueBet: 10, 
              returnEarnings: 290, 
              statusResult: "Pendente", 
              award: 0.00 
            }
          ],
          team_bet: {
            bet_one: [
              {
                team_house: 'Argentino JRS', 
                team_outside: 'Rosario Central',
                modality: 'football',  
                odd: 3.30, 
                date: '19/03/2024', 
                hour: '21:15', 
                live: true, 
                select: 'Empate'
              }
            ],
            bet_two: [
              {
                team_house: 'França', 
                team_outside: 'Itália',
                modality: 'e-sport', 
                odd: 3.10, 
                date: '19/03/2024', 
                hour: '21:15', 
                live: false, 
                select: 'França'
              }
            ],
            bet_three: [
              {
                team_house: 'Real Madrid', 
                team_outside: 'Barcelona',
                modality: 'volleyball', 
                odd: 3.30, 
                date: '19/03/2024', 
                hour: '21:15', 
                live: false, 
                select: 'Real Madrid'
              }
            ],
          }
        }
      ],
      showClickFinalized: false,
      showCloseBet: true,
      showFinished: false,
    };
  },
  methods: {
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
      this.showFinished = true
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
}

.ticket {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 19px 15px;
  width: 100%;
  background: #181818;
  border-radius: 2px;
  

}

.code {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &__text {
        font-size: 14px;
        color: #fff;
    }
    &__date {
        color: #ffffff80
    }
}


.info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: -10px;
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
        color: #fff;
    }
    &__value {
        margin-left: auto;
    }

}

.bet {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #0A0A0A;
    border-radius: 4px;
    margin-bottom: -9px;
    &__header, &__info, &__text, &__result {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    &__team {
        font-size: 14px;
        color: #fff;
        display: flex;          
        align-items: center;   
        font-size: 14px;
        color: #fff;
        gap: 4px;  
    }

    &__date, &__text, &__result {
        font-size: 14px;
        color: #bbb;
        justify-content: space-between;
    }

    &__odd {
        font-size: 14px;
        color: #FFF;
    }

    &__select {
        color: #FFF;
        font-size: 14px;
    }

    &__icon-ball, &__icon-modality, &__icon-live {
        width: 16px;
        height: 16px;
    }
    &__message {
        color: #F61A1A;
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
  

  &__cancel {
    font-size: 16px;
    background: #181818;
  }

  &__confirm {
    font-size: 16px;
  }

}

.finish {
    padding: 8px;
    padding-top: 25px;
    
    &__button{
        width: 100%;
    }
}
</style>

