<template>
  <div class="results">
    <Header title="Resultados" :showBackButton="true" />
    <div class="results__dates">
      <div class="results__dates-buttos" v-for="day in dateRange"  :key="day">
        <button-date 
          v-if="day == today"
          :value="day"
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
      <select-fake-result @click="handleOpenModalitiesModal">{{ modality.name }}</select-fake-result>
    </div>
    
    <p class="results__count-modalities">{{ modalityList.length }} Resultados encontrados</p>
    
    <collapse :leftIcon="true" :initCollapsed="false" v-for="({title,image,games}, championshipListIndex) in championshipList" :key="championshipListIndex">
      <template #title>
        <img :src="image" />
        {{ title }}
      </template>
      <div class="games">
        <div class="games__items" v-for="(game, i) in games" :key="i">
          <p class="games__datetime">{{ game.dateTime }}</p>
          
          <div class="games__team">
            
            <div class="games__team-left">
              <span class="games__team-name-left"> {{ game.teams[0].name }}</span>
              <img class="games__team-image-left"  height="26px" width="26px" :src="game.teams[0].image">
            </div>

            <div class="games__scores">
              <div v-for="(result, resultsIndex) in game.results" :key="resultsIndex">
                <span v-if="resultsIndex==0">
                  {{ result.team0 }} x {{ result.team1 }}
                </span>
                
                <span 
                v-else
                class="games__scores games__scores--secondary"
                >
                  ({{ result.team0 }} x {{ result.team1 }})
                </span>
              </div>
            </div>
            
            <div class="games__team-right">
              <img class="games__team-image-right"  height="26px" width="26px" :src="game.teams[1].image">
              <span class="games__team-name-right"> {{ game.teams[1].name }}</span>
            </div>
           
          </div>
         
        </div>
      </div>
        
    </collapse>
    <ModalModalities
      v-if="showModalModalities"
      :modalityId="modality.id"
      @closeModal="handleCloseModalitiesModal"
      @click="handleModality"
    />  
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import ButtonDate from './parts/ButtonDate.vue'
import SelectFakeResult from './parts/SelectFakeResult.vue';
import moment from 'moment';
import ModalModalities from '@/views/HomeView/parts/ModalModalities.vue';
import Collapse from '@/components/Collapse.vue';
import { modalityList, championshipList, leagueList } from '@/constants'
import GameItemResult from './parts/GameItemResult.vue';
import IconCheck from '@/components/icons/IconCheck.vue';

export default {
  name: 'results-view',
  components: {
    Header,
    ButtonDate,
    SelectFakeResult,
    ModalModalities,
    Collapse,
    GameItemResult,
    IconCheck
  },
  created() {
    this.generateDaysOfMonth();
  },
  data() {
    return {
      today: moment().format('DD/MM'),
      modality: modalityList[0],
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
    handleOpenModalitiesModal() {
      this.showModalModalities = !this.showModalModalities;
    },
    handleCloseModalitiesModal() {
      this.showModalModalities = false;
    },
    handleModality(modalityId) {
      this.modality = this.modalityList.find(modality => modality.id === modalityId)
      this.handleCloseModalitiesModal()
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

  &__modalities-modal {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 32px;
    font-size: 16px;
  }
}

.games {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  background: var(--color-background-input);
  
  
  &__items {
  
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.10);
     
  }

  &__datetime {
    padding: 15px 8px;
    align-items: center;
    text-align: center;
    color: var(--color-text-input);
    
  }

  &__team {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    
  }

  &__team-left,
  &__team-right {
    font-size: 14px;
    flex: 1;
  }

  &__team-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 37%;
    text-align: left;
    
  }

  &__scores {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 20px;
    padding: 5px;
    flex: 0 0 30%; /* Ocupa 30% da largura total */

    &--secondary {
      font-size: 12px;
      color: var(--color-text-input);
      padding-top: 0;
    }

  }

  &__team-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 37%;
        margin-left: 5px;

  }

  &__team-image-left {
    margin-left: 10px
  }

  &__team-image-right {
    margin-right: 10px
  }
}
</style>