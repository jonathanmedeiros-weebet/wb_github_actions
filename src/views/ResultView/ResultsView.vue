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
    
    <collapse 
      :leftIcon="true" 
      :initCollapsed="false" 
      v-for="({title,image,games}, championshipListIndex) in championshipList" 
      :key="championshipListIndex"
    >
      <template #title>
        <img :src="image" />
        {{ title }}
      </template>

      <game-item-result :games="games"/>
    
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
import { modalityList, championshipList } from '@/constants'
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
  },
  data() {
    return {
      today: moment().format('DD/MM'),
      modality: modalityList[0],
      showModalModalities: false,
      modalityList,
      championshipList,
  ,
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

</style>