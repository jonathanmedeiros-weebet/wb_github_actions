<template>
  <div class="results">
    <Header title="Resultados" :showBackButton="true" />
    <div class="results__dates">
      <div class="results__dates-buttos" v-for="day in dateRange"  :key="day">
        <button-date 
          v-if="day == currentDate1"
          value="Hoje"
          text="Hoje"
          customClass="button button__item--active"
          ref="todayButton"
        />  
        <button-date 
          v-else
          :value="day"
          :text="day"
        />  
      </div>
    </div>
    <div class="results__modalities">
      <label for="" class="results__modalities-label">Modalidade</label>
      <select-fake-result @click="OpenModalModalities">  
        {{ valueFilter }}
      </select-fake-result>
    </div>
    
    <p class="results__count-modalities">{{ modalityList.length }} Resultados encontrados</p>
    
    <collapse :initCollapsed="false" v-for="({title, image, games}, index) in championshipList" :key="index">
      <template #title>
        <img :src="image" />
        {{ title }}
      </template>
      <div class="games">
        <div class="games__items" v-for="(game, index) in games" :key="index">
          <p class="games__datetime" >{{ game.dateTime }}</p>
          
          
          <div class="games__team">
            <div class="games_team-left">
              <span class="games__team-name-left"> {{ game.teams[0].name }}</span>
              <img class="games__team-image" :src="game.teams[0].image">
            </div>
            x
            <div class="games__team-right">
              <img class="games__team-image" :src="game.teams[1].image">
              <span class="games__team-name-right"> {{ game.teams[1].name }}</span>
            </div>
           
          </div>
         
        </div>
      </div>
        
    </collapse>
    <modal-modalities v-if="showModalModalities" @closeModal="handleCloseModalModalities">
      <template #title>
        <p>Selecione</p>
      </template>
      <template #body>
        <p
          v-for="modality in modalityList" 
          :key="modality"
          @click="handleModalities(modality.name)"
        >
          {{ modality.name }}
        </p>
      </template>
    </modal-modalities>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import ButtonDate from './parts/ButtonDate.vue'
import SelectFakeResult from './parts/SelectFakeResult.vue';
import moment from 'moment';
import ModalModalities from '@/components/Modal.vue';
import Collapse from '@/components/Collapse.vue';
import { modalityList, championshipList, leagueList } from '@/constants'
import GameItemResult from './parts/GameItemResult.vue';

export default {
  name: 'results-view',
  components: {
    Header,
    ButtonDate,
    SelectFakeResult,
    ModalModalities,
    Collapse,
    GameItemResult
  },
  created() {
    this.generateDaysOfMonth();
    console.log(championshipList);
  },
  data() {
    return {
      currentDate1: moment().format('DD/MM'),
      valueFilter: 'Futebol',
      modalities: ['Futebol', 'Volêi', 'Basquete', 'Boxe'],
      showModalModalities: false,
      modalityList,
      championshipList,
      leagueList,
      dateRange: []
    }
  },
  methods: {
    generateDaysOfMonth() {
      const startDate = moment().subtract(15, 'days');
      const endDate = moment().add(15, 'days');
      let currentDate = startDate.clone();

      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        this.dateRange.push(currentDate.format('DD/MM'));
        currentDate.add(1, 'day');
      }
    },
    OpenModalModalities() {
      this.showModalModalities = !this.showModalModalities;
    },
    handleCloseModalModalities() {
      this.showModalModalities = false;
    },
    handleModalities(value) {
      this.valueFilter = value;
      this.showModalModalities = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.results {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__dates {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    
    &-buttons {
      display: inline-block;
    }
  }

  &__modalities {
    display:  flex;
    flex-direction: column;
    padding: 20px;
  }

  &__count-modalities {
    padding: 5px 20px;
    color: var(--color-text-input);
  }
}

.games {
  display: flex;
  flex-direction: column;
  padding: 13px 16px;
  background: var(--color-background-input);
  
  
  &__items {
  
    align-items: center;
    background-color: red;
    padding: 10px;    
  }

  &__datetime {
    align-items: center;
    background-color: blue;
    
  }

  &__team {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-bottom: 3px solid blue;
  }

  &__team-left {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }
  &__team-right {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
  }



  &__team-image {
    height: 50px;
    width: 50px;
  }
}
</style>