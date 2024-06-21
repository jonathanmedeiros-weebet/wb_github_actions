<template>
  <div class="home">
    <Header :showCalendarButton="true" :showSearchButton="true">
      <SelectFake @click="handleSpotsModal"> {{ modality }} </SelectFake>
    </Header>
    <section class="home__body">
      <SelectFake
        class="home__league-select"
        titleSize="medium"
        @click="handleLeaguesModal"
      >
        <img v-if="league.image" :src="league.image">
        <span>{{ league.title }}</span>
      </SelectFake>

      <Collapse
        class="home__collapse"
        :initCollapsed="true"
        v-for="({title, image}, index) in championshipList"
        :key="index"
      >
        <template #title>
          <img :src="image" />
          {{ title }}
        </template>

        <div class="game-list"> 
          <div class="game-list__item-empty">
            <div class="game-list__columns">
              <span class="game-list__column">1</span>
              <span class="game-list__column">x</span>
              <span class="game-list__column">2</span>
            </div>
          </div>
          <GameItem
            v-for="(game, index) in gameList"
            :key="index"
            :game="game"
          />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import SelectFake from './parts/SelectFake.vue'
import { modalityList, championshipList, leagueList, gameList } from '@/constants'
import Collapse from '@/components/Collapse.vue'
import GameItem from './parts/GameItem.vue'

export default {
  name: 'home',
  components: {
    Header,
    SelectFake,
    Collapse,
    GameItem
  },
  data() {
    return {
      modality: 'Futebol',
      league: leagueList[0],
      modalityList,
      championshipList,
      leagueList,
      gameList
    }
  },
  methods: {
    handleSpotsModal() {
      alert('Modal handleSpotsModal')
    },
    handleLeaguesModal() {
      alert('Modal handleLeaguesModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &__body {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__league-select {
    padding: 8px 16px;
  }

  &__collapse img,
  &__league-select img {
    width: 16px;
    height: 16px;
  }
}

.game-list {
  margin-top: 1px;
  display: flex;
  flex-direction: column;
  gap: 1px;

  &__item-empty {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 16px;
  }

  &__columns {
    width: 190px;
    display: flex;
    gap: 8px;
  }

  &__column {
    width: 58px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF80;
;
  }

}
</style>