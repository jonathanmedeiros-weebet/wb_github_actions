<template>
  <div class="header">
    <Header>
      <SelectFake :text="modality" @click="handleSelectModalClick"/>
    </Header>


    <div class="ticket__container">
      <div class="game">
        <span class="game__select">Jogos selecionados</span>
        <div class="game__delete">
          <IconDelete class="game__icon" />
          <span>Excluir todos</span>
        </div>
      </div>


      <div v-for="(team, index) in teams" :key="index" class="bet">
        <div class="bet__header">
          <span class="bet__team">
            <IconLive v-if="team.live" class="bet__icon-live"/>   
            <IconBall class="bet__icon-ball"/>   
            {{ team.team_house }} X {{ team.team_outside }}
          </span>
          <IconClose class="bet__icon-close" />
        </div>
        <div class="bet__info">
          <span class="bet__date">{{ team.date }} {{ team.hour }}</span>
        </div>
        <div class="bet__text">
          <span>{{ team.live ? 'Resultado Final' : 'Para ganhar' }}</span>
        </div>
        <div class="bet__result">
          <span>{{ team.select }}</span>
          <span>{{ team.odd }}</span>
        </div>
      </div>


      <div class="finish">
        <div class="finish__cpf">
          <w-input
            label="Apostador"
            class="finish__input"
            name="ticket_cpf"
            placeholder="Informe o cpf do apostador"
            type="text"
          />
        </div> 
      </div>
      

      <div class="value">
        <div class="value__label">
          <span class="value__balance-text">Valor</span>
        </div>
        <div class="value__balance">
          <button class="value__add">+10</button>
          <button class="value__add">+20</button>
          <button class="value__add">+50</button>
          <w-input
            class="value__balance-input"
            name="ticket_value"
            placeholder="R$"
            type="text"/>
        </div>
      </div>

      
      <div class="cotacao">
        <div class="cotacao__value">
          <span>Cotação:</span>
          <span>{{sumOdds}}</span>
        </div>
        <div class="cotacao__ganhos">
          <span>Possiveis Ganhos:</span>
          <span>R$ 90,00</span>
        </div>
        <div class="cotacao__alteracao">
          
          <label for="accept-changes">Aceitar Alterações de odds</label>
        </div>
        <div class="cotacao__finalizar">
          <w-button
            id="btn-entrar"
            text="Finalizar Aposta"
            value="entrar"
            name="btn-entrar"
            @click="handleClick"
          />
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import SelectFake from '../views/HomeView/parts/SelectFake.vue';
import Header from '@/components/layouts/Header.vue';
import { modalityList } from '../constants/modalities.constant';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconLive from '@/components/icons/IconLive.vue';
import IconBall from '@/components/icons/IconBall.vue';
import IconClose from '@/components/icons/IconClose.vue';
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';

export default {
  name: 'ticket',
  components: { 
    Header, 
    SelectFake, 
    IconDelete,
    IconLive,
    IconBall,
    IconClose,
    WInput,
    WButton
  },
  data() {
    return {  
      modality: 'Bilhetes',
      modalityList: modalityList,
      teams: [
        { team_house: 'Argentino JRS', team_outside: 'Rosario Central', odd: 3.30, date: '19/03/2024', hour: '21:15', live: true, select: 'Empate' },
        { team_house: 'França', team_outside: 'Itália', odd: 3.30, date: '19/03/2024', hour: '21:15', live: false, select: 'França' },
        { team_house: 'Infinity', team_outside: 'Qhai', odd: 2.90, date: '19/03/2024', hour: '21:15', live: false, select: 'Qhali' },
      ]
    };
  },
  computed: {
    sumOdds() {
      return this.teams.reduce((total, team) => total + team.odd, 0).toFixed(2);
    }
  },
  methods: {
    handleSelectModalClick() {
      alert('Modal select');
    },
    handleClick() {
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket {
  color: var(--color-background);
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0 20px;
    min-height: 100%;
  }
}

.game {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  
  &__select {
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
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
  gap: 2.5px;
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
    background-color: rgba(126, 123, 123, 0.1);
    transform: translateX(-20px); 
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__team {
    align-items: center;
    display: flex;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    gap: 4px;
  }

  &__icon-live {
    width: 18px;
    height: 18px;
  }

  &__icon-ball {
    width: 14px;
    height: 14px;
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
  }
}

.value {
  

  &__balance-text {
    font-size: 14px;
  }

  &__balance {
    gap: 8px;
    display: flex;
    align-items: center;
  }

  &__add {
    display: flex;
    width: 46px;
    padding: 18px;
    justify-content: center;
    border-radius: 8px;
    background: var(--color-background-input);
    color: var(--color-text-input);
    font-size: 14px;
    border: none; 
  }

  &__balance-input{
    padding-top: 20px;
    width: 100%;
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
    gap: 8px;
  }

  &__finalizar {
    padding-top: 16px;
  }
  


}

</style>
