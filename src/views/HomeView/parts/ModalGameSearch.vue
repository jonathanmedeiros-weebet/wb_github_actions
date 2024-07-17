<template>
    <div class="modal-game-search">
      <div class="modal-game-search__header">
        <InputSearch @input="handleSearch" @clear="handleSearch"/>
        <button class="modal-game-search__close" @click="handleClose">
          <IconClose color="var(--color-text)"/>
        </button>
      </div>
      <div class="modal-game-search__body">
        <GameListSkeleton v-if="loading" :showFirstCollapse="false"/>
        <GameList
          v-else
          @click="handleClick"
        />
      </div>
    </div>
</template>

<script>
import IconClose from '@/components/icons/IconClose.vue'
import InputSearch from '@/components/InputSearch.vue'
import GameList from './GameList.vue'
import { modalityList } from '@/constants'
import ModalModalities from './ModalModalities.vue'
import GameListSkeleton from './GameListSkeleton.vue'
import { useHomeStore } from '@/stores'
import _ from 'lodash'

export default {
  components: {
    IconClose,
    InputSearch,
    GameList,
    ModalModalities,
    GameListSkeleton
  },
  name: 'modal-game-search',
  data() {
    return {
      championshipList: [],
      modalityList: modalityList(),
      modality: null,
      showModalModalities: false,
      loading: true,
      homeStore: useHomeStore()
    }
  },
  created() {
    this.modality = this.modalityList[0];
  },
  mounted() {
    this.championshipList = this.homeStore.championshipList;
    setTimeout(() => this.loading = false, 1000);
  },
  methods: {
    handleClick(game) {
      this.homeStore.setChampionshipList(this.championshipList);
      this.$emit('click', game)
    },
    handleClose() {
      this.homeStore.setChampionshipList(this.championshipList);
      this.$emit('closeModal')
    },
    handleSearch: _.debounce(function (term){
      term = term.toUpperCase();
      let championships = this.championshipList;

      if(Boolean(term)) {
        championships = this.championshipList.filter(championship => {
          const hasGames = championship.jogos.some(
            game => (game.nome ?? '').toUpperCase().includes(term)
          );
          
          return hasGames;
        })

        if(Boolean(championships.length)) {
          championships = championships.map(championship => {
            championship.jogos = championship.jogos.filter(
              game => (game.nome ?? '').toUpperCase().includes(term)
            );
            return championship;
          })
        }
      }

      this.homeStore.setChampionshipList(championships);
    }, 700),
  }
}
</script>

<style lang="scss" scoped>
.modal-game-search {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  transition: transform 0.5s ease-out;

  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;

  color: var(--color-text);
  background: var(--color-background);

  &__header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  &__body {
    padding: 16px 0;
    overflow-y: auto;
    max-height: calc(100% - 40px);
    height: 100%;
  }

  &__close,
  &__close:hover {
    background: transparent;
    border: 0;

    display: flex;
    align-items: center;

    margin: 0;
    padding: 0;
  }
}
</style>