<template>
  <div class="results">
    <div class="results__header">
      <Header title="Resultados" :showBackButton="true" />
      <div class="results__dates">
        <div 
          class="results__dates-buttons" 
          v-for="(day, dateRangeIndex) in dateRange"  
          :key="dateRangeIndex"
        >
          <ButtonDate 
            :value="day.format('YYYY-MM-DD')"
            :text="getTextButton(day)"
            :actived="isCurrentDay(day)"
            @click="setActiveDay(day)"
            :ref="getRef(day)"
          />
        </div>
      </div>
    </div>

    <div class="results__body">
      <div class="results__modalities">
        <label class="results__modalities-label">Modalidade</label>
        <SelectFake
          :iconColor="'var(--input-foreground)'"
          class="results__selectfake"
          titleSize="medium"
          @click="handleOpenModalitiesModal"
        >
          {{ modality.name }}
        </SelectFake>
      </div>

      <template v-if="loading">
        <SquareSkeleton
          class="results__total_results-skeleton"
          :height="14"
          :width="120"
        />
        <GameItemResultSkeleton />
      </template>

      <template v-else>
        <p class="results__count-modalities">
          {{ championshipList.length }} Resultados encontrados
        </p>

        <Collapse 
          :iconColor="'var(--league-foreground)'"
          :leftIcon="true" 
          :initCollapsed="true" 
          v-for="(championship, championshipListIndex) in championshipList" 
          :key="championshipListIndex"
        >
          <template #title>
            {{ championship.nome }}
          </template>

          <GameItemResult :games="championship.jogos"/>
        </Collapse>
      </template>
    </div>

    <ModalModalities
      v-if="showModalModalities"
      :modalityId="modality.id"
      @closeModal="handleCloseModalitiesModal"
      @click="handleModality"
    />  
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';
import ButtonDate from './parts/ButtonDate.vue';
import SelectFake from '@/views/ResultsView/parts/SelectFake.vue';
import moment from 'moment';
import ModalModalities from '@/views/HomeView/parts/ModalModalities.vue';
import Collapse from '@/components/Collapse.vue';
import { modalityList } from '@/constants';
import GameItemResult from './parts/GameItemResult.vue';
import { getResults } from '@/services';
import { formatDateTimeBR, now  } from '@/utilities';
import GameItemResultSkeleton from './parts/GameItemResultSkeleton.vue';
import SquareSkeleton from '@/components/skeletons/SquareSkeleton.vue';

export default {
  name: 'results-view',
  components: {
    Header,
    ButtonDate,
    SelectFake,
    ModalModalities,
    Collapse,
    GameItemResult,
    GameItemResultSkeleton,
    SquareSkeleton,
  },
  data() {
    return {
      activeDay: now().format('YYYY-MM-DD'),
      today: now().format('YYYY-MM-DD'),
      modality: null,
      showModalModalities: false,
      modalityList: modalityList(),
      championshipList: [],
      dateRange: [],
      loading: true
    };
  },
  created() {
    this.generateDaysOfMonth();
    this.modality = this.modalityList[0];
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
      this.modality = this.modalityList.find(modality => modality.id === modalityId);
      this.handleCloseModalitiesModal();
      this.getSports(); 
    },
    setActiveDay(day) {
      this.activeDay = day.format('YYYY-MM-DD');
      this.getSports(); 
    },
    getRef(day) {
      return day.format('YYYY-MM-DD') === this.today ? 'todayButton' : '';
    },
    getTextButton(day) {
      return day.format('YYYY-MM-DD') === this.today ? 'Hoje' : day.format('DD/MM');
    },
    isCurrentDay(day) {
      return day.format('YYYY-MM-DD') === this.activeDay;
    },
    changeSrcWhenImageError(event) {
      event.target.src = 'https://wb-assets.com/img/times/m/default.png';
    },
    async getSports() {
      try {
        this.loading = true;
        const res = await getResults(this.activeDay, this.modality.id);
        this.championshipList = res.map(championship => {
          return {
            ...championship,
            jogos: championship.jogos.map(game => {
              const resultado = game.resultado;
              return {
                dateTime: formatDateTimeBR(game.horario),
                teams: [
                  { name: game.time_a_nome },
                  { name: game.time_b_nome }
                ],
                results: [
                  {
                    team0: (resultado.casa === 0 || resultado.casa) ? resultado.casa : '-',
                    team1: (resultado.fora === 0 || resultado.fora) ? resultado.fora : '-'
                  }
                ],
                halfTime: {
                  team0: (resultado.casa_1t === 0 || resultado.casa_1t) ? resultado.casa_1t : '-',
                  team1: (resultado.fora_1t === 0 || resultado.fora_1t) ? resultado.fora_1t : '-'
                }
              };
            })
          };
        });
        this.loading = false;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  },
  activated() {
    this.getSports();
    this.$nextTick(() => {
      if (this.$refs.todayButton && this.$refs.todayButton[0]) {
        const todayButtonEl = this.$refs.todayButton[0].$el || this.$refs.todayButton[0];
        if (todayButtonEl.scrollIntoView) {
          todayButtonEl.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
          });
        }
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.results {
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  padding-bottom: 100px;

  &__header {
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100%;
  }

  &__body {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }

  &__dates {
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    padding: 16px 10px;
  }

  &__dates::-webkit-scrollbar {
    display: none;  
  }

  &__dates-buttons {
    color: rgba(255, 255, 255, .5);
    color: rgba(var(--foreground-rgb), .5);

    border-bottom: 1px solid rgba(255, 255, 255, .1);
    border-bottom: 1px solid rgba(var(--foreground-rgb), .1);

    border-top: 1px solid rgba(255, 255, 255, .1);
    border-top: 1px solid rgba(var(--foreground-rgb), .1);

    display: inline-block;
  }

  &__modalities {
    display:  flex;
    flex-direction: column;
    padding: 10px 20px;
    
    
  }

  &__modalities-label {
    color: #ffffff;
    color: var(--foreground);
  }

  &__count-modalities {
    margin: 5px 20px;
    color: rgba(255, 255, 255, .5);
    color: rgba(var(--foreground-rgb), .5);
  }

  &__modalities-modal {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 32px;
    font-size: 16px;
  }

  &__total_results-skeleton {
    margin-bottom: 10px;
  }

  &__selectfake ::v-deep .select-fake__title {
    color: #ffffff;
    color: var(--input-foreground);
  }
}

::v-deep .collapse__item {
  background: #0a0a0a;
  background: var(--league);
  color: #ffffff;
  color: var(--league-foreground);
  border-bottom: 1px solid rgba(var(--league-foreground-rgb), 0.1);
}

</style>