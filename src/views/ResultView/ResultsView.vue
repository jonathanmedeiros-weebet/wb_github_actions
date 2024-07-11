<template>
  <div class="results">
    <Header title="Resultados" :showBackButton="true" />
    <div class="results__dates" >

      <div 
        class="results__dates-buttons" 
        v-for="(day, dateRangeIndex) in dateRange"  
        :key="dateRangeIndex"
      >
        <button-date 
          :value="day.format('YYYY-MM-DD')"
          :text="getTextButton(day)"
          :actived="isCurrentDay(day)"
          @click="setActiveDay(day)"
          :ref="getRef(day)"
        />
      </div>

    </div>
    <div class="results__modalities">
      <label class="results__modalities-label">Modalidade</label>
      <select-fake titleSize="medium" @click="handleOpenModalitiesModal">{{ modality.name }}</select-fake>
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
import SelectFake from '@/views/HomeView/parts/SelectFake.vue';
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
    SelectFake,
    ModalModalities,
    Collapse,
    GameItemResult
  },
  created() {
    this.generateDaysOfMonth();
  },
  data() {
    return {
      activeDay: moment().format('YYYY-MM-DD'),
      today: moment().format('YYYY-MM-DD'),
      modality: modalityList[0],
      showModalModalities: false,
      modalityList,
      championshipList,
      dateRange: []
    }
  },
  methods: {
    generateDaysOfMonth() {
      const startDate = moment().subtract(15, 'days');
      const endDate = moment().add(15, 'days');
      let currentDate = startDate.clone();

      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
        this.dateRange.push(currentDate.clone());
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
    },
    setActiveDay(day) {
      this.activeDay = day.format('YYYY-MM-DD');
    },
    getRef(day){
      return day.format('YYYY-MM-DD') === this.today ? 'todayButton' : '';
    },
    getTextButton(day) {
      return day.format('YYYY-MM-DD') === this.today ? 'Hoje' : day.format('DD/MM');
    },
    isCurrentDay(day) {
        return day.format('YYYY-MM-DD') === this.activeDay;
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.todayButton && this.$refs.todayButton[0]) {
        const todayButtonEl = this.$refs.todayButton[0].$el || this.$refs.todayButton[0];
        if (todayButtonEl.scrollIntoView) {
          todayButtonEl.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
          });
        }
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.results {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__dates {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    
  }

  &__dates::-webkit-scrollbar {
    display: none;  /* WebKit-based browsers */
  }

  &__dates-buttons {
    display: inline-block;
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


::v-deep .select-fake {
  background-color: var(--color-background-input);
  padding: 18px 16px;
  
  &__title {
    color: var(--color-text-input);

    &--medium { 
      font-size: 14px;
    }
  }
}

</style>