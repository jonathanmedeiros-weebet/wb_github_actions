<template>
  <div class="ticket">
    <Header :title="modality" :showBackButton="true" />
    <div class="ticket__container">
      <div class="game">
        <span class="game__select">Jogos selecionados</span>
        <div class="game__delete">
          <IconDelete class="game__icon" />
          <span class="game__text" >Excluir todos</span>
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
      <div class="line"></div>
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
            name="user_name"
            type="email"
          >
            <template #icon>
              <span style="color: #ffffff80;">R$</span>
            </template>
          </w-input>
        </div>
      </div>
      <div class="cotacao">
        <div class="cotacao__value">
          <span>Cotação:</span>
          <span>{{sumOdds}}</span>
        </div>
        <div class="cotacao__ganhos">
          <span>Possíveis Ganhos:</span>
          <span>R$ 90,00</span>
        </div>
        <div class="cotacao__alteracao">
          <input class="cotacao__checkbox" type="checkbox" id="accept-changes" />
          <label for="accept-changes">Aceitar Alterações de odds</label>
        </div>
        <div class="cotacao__finalizar">
          <w-button
            id="btn-entrar"
            text="Finalizar Aposta"
            value="entrar"
            class="cotacao__finalizar-button"
            name="btn-entrar"
            @click="handleClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';
import { modalityList } from '../constants/modalities.constant';
import IconDelete from '@/components/icons/IconDelete.vue';
import IconLive from '@/components/icons/IconLive.vue';
import IconBall from '@/components/icons/IconBall.vue';
import IconClose from '@/components/icons/IconClose.vue';
import WInput from '@/components/Input.vue';
import WButton from '@/components/Button.vue';
import IconUserLine from '@/components/icons/IconUserLine.vue'

export default {
  name: 'ticket',
  components: { 
    Header, 
    IconDelete,
    IconLive,
    IconBall,
    IconClose,
    IconUserLine,
    WInput,
    WButton
  },
  data() {
    return {  
      modality: 'Bilhete',
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
  }
}
</script>

<style lang="scss" scoped>
.ticket {

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
  
  &__text {
    gap: 10px;
  }

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
    background-color: var(--color-line);
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

.line {

  &::after { 
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100vw; 
    height: 1px;
    background-color: var(--color-line);
    transform: translateX(-20px); 
  }

}

.finish {
  margin-bottom: -20px;
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
    align-items: center;
    border-radius: 8px;
    background: var(--color-background-input);
    color: var(--color-text-input);
    font-size: 14px;
    border: none; 
    
  }

  &__balance-input{
    width: 100%;
    margin-bottom: -10px;
  }
  
  &__balance-input ::v-deep .input__field {
    height: 50px;
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

    & input[type="checkbox"] {
      appearance: none;
      width: 15px;
      height: 15px;
      border: 1px solid var(--color-text-input);
      background-color: transparent;
      cursor: pointer;
      border-radius: 3px;
      position: relative;
    }

    & input[type="checkbox"]::after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      position: absolute;
      top: 2px;
      left: 2px;
      background-color: var(--color-primary);
      opacity: 0;
      border-radius: 2px;
    }

    & input[type="checkbox"]:checked::after {
      opacity: 1;
    }

  }

  &__finalizar {
    padding-top: 16px;
  }

  &__finalizar-button {
    width: 100%;
  }
}

</style>
