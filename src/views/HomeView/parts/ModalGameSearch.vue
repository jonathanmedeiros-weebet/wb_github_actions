<template>
    <div class="modal-game-search">
      <div class="modal-game-search__header">
        <SelectFake titleSize="large" @click="handleOpenModalitiesModal">
          <IconFootball />
        </SelectFake>
        <InputSearch @input="handleSearch"/>
        <button class="modal-game-search__close" @click="handleClose">
          <IconClose color="var(--color-text)"/>
        </button>
      </div>
      <div class="modal-game-search__body">
        <GameList :data="championshipList" @click="handleClick"/>
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
import IconClose from '@/components/icons/IconClose.vue'
import SelectFake from './SelectFake.vue'
import IconFootball from '@/components/icons/IconFootball.vue'
import InputSearch from '@/components/InputSearch.vue'
import GameList from './GameList.vue'
import { championshipList, modalityList } from '@/constants'
import ModalModalities from './ModalModalities.vue'

export default {
  components: {
    IconClose,
    SelectFake,
    IconFootball,
    InputSearch,
    GameList,
    ModalModalities
  },
  name: 'modal-game-search',
  data() {
    return {
      championshipList,
      modalityList,
      modality: modalityList[0],
      showModalModalities: false,
    }
  },
  methods: {
    handleClick(game) {
      this.$emit('click', game)
    },
    handleClose() {
      this.$emit('closeModal')
    },
    handleSearch(value) {
      console.log(value)
    },

    handleOpenModalitiesModal() {
      this.showModalModalities = true;
    },
    handleCloseModalitiesModal() {
      this.showModalModalities = false;
    },
    handleModality(modalityId) {
      this.modality = this.modalityList.find(modality => modality.id === modalityId)
      this.handleCloseModalitiesModal()
    },
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