<template>
  <div class="home">
    <Header :showCalendarButton="true" :showSearchButton="true">
      <SelectFake :text="modality" @click="handleSelectModalClick"/>
    </Header>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import SelectFake from './parts/SelectFake.vue'
import { modalityList } from '@/constants'
export default {
  name: 'home',
  components: { Header, SelectFake },
  data() {
    return {
      modality: 'Futebol',
      modalityList: modalityList,
    }
  },

  created() {
    console.log(this.modalityList)
  },
  methods: {
    handleSelectModalClick() {
      alert('Modal select')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>