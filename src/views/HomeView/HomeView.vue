<template>
  <div class="home">
    <Header
      :showCalendarButton="showCalendarButton"
      :showSearchButton="showSearchButton"
      @calendarClick="handleOpenCalendarModal"
      @searchClick="handleOpenSearchModal"
    >
      <SelectFake :iconColor="'var(--foreground)'" @click="handleOpenModalitiesModal"> {{ modality?.name }} </SelectFake>

      <template #actions> 
        <LiveButton
          v-if="hasLive"
          :actived="liveActived"
          @click.native="handleLive"
        />
      </template>
    </Header>

    <SportModality ref="sport-modality" v-if="isSportModality"/>
    <PopularLotteryModality ref="popular-lottery-modality" v-if="isPopularLotteryModality"/>
    <LotteryModality ref="lottery-modality" v-if="isLotteryModality"/>

    <ModalModalities
      v-if="showModalModalities"
      :modalityId="modality?.id"
      :isLive="liveActived"
      @closeModal="handleCloseModalitiesModal"
      @click="handleModality"
    />

    <ModalCalendar
      v-if="showModalCalendar"
      :initialDate="dateSelected"
      :maxDate="tablelimiteDate"
      @closeModal="handleCloseCalendarModal"
      @change="handleCalendar"
    />

    <ModalSearch
      v-if="showModalSearch"
      @closeModal="handleCloseSearchModal"
      @click="handleSearchModal"
    />
  </div>
</template>

<script>
import { modalityList, getModalitiesEnum } from '@/constants'
import { useConfigClient, useHomeStore, useToastStore, useTicketStore } from '@/stores'

import Header from '@/components/layouts/Header.vue'
import SelectFake from './parts/SelectFake.vue'
import ModalModalities from './parts/ModalModalities.vue'
import ModalCalendar from './parts/ModalCalendar.vue'
import ModalSearch from './parts/ModalGameSearch.vue'

import LiveButton from './parts/LiveButton.vue'
import Toast from '@/components/Toast.vue'
import scrollMixin from '@/mixins/scroll.mixin'
import SportModality from './SportModality/SportModality.vue'
import PopularLotteryModality from './PopularLotteryModality/PopularLotteryModality.vue'
import LotteryModality from './LotteryModality/LotteryModality.vue'
import { now } from '@/utilities'

export default {
  name: 'home',
  mixins: [scrollMixin],
  components: {
    Header,
    SelectFake,
    ModalModalities,
    ModalCalendar,
    ModalSearch,
    LiveButton,
    Toast,
    SportModality,
    PopularLotteryModality,
    LotteryModality
  },
  data() {
    return {
      showModalSearch: false,
      showModalCalendar: false,
      showModalModalities: false,
      modalityList: modalityList(),
      homeStore: useHomeStore(),
      toastStore: useToastStore(),
      ticketStore: useTicketStore()
    }
  },
  activated() {
    this.onInit(false);
  },
  computed: {
    showCalendarButton() {
      return this.isSportModality && !this.liveActived;
    },
    showSearchButton() {
      return this.isSportModality;
    },
    hasLive() {
      const { options } = useConfigClient();
      if(!options.aovivo) return false;

      if(this.modality?.id == this.Modalities.FOOTBALL && options.futebol_aovivo) return true;
      if(this.modality?.id == this.Modalities.BASKETBALL && options.basquete_aovivo) return true;
      
      return false;
    },
    liveActived() {
      return this.homeStore.isLive;
    },
    modality() {
      return this.homeStore.modality;
    },
    isLotteryModality() {
      return this.Modalities.LOTTERY == this.modality?.id;
    },
    isSportModality() {
      return [
        this.Modalities.AMERICAN_FOOTBALL,
        this.Modalities.BASKETBALL,
        this.Modalities.COMBAT,
        this.Modalities.E_SPORTS,
        this.Modalities.FOOTBALL,
        this.Modalities.FUTSAL,
        this.Modalities.ICE_HOCKEY,
        this.Modalities.TABLE_TENNIS,
        this.Modalities.TENNIS,
        this.Modalities.VOLLEYBALL
      ].includes(this.modality?.id);
    },
    isPopularLotteryModality() {
      return this.Modalities.POPULAR_LOTTERY == this.modality?.id;
    },
    dateSelected() {
      return this.homeStore.date;
    },
    Modalities() {
      return getModalitiesEnum();
    },
    tablelimiteDate () {
      const { options } = useConfigClient();
      return options?.data_limite_tabela ?? 1
    }
  },
  methods: {
    onInit() {
      if(!Boolean(this.modality)) {
        const hasTicketModalityId = Boolean(this.ticketStore.modalityId);
        const modalityId = hasTicketModalityId ? this.ticketStore.modalityId : this.Modalities.FOOTBALL;
        const modality = this.modalityList.find(modality => modality.id === modalityId);
        this.homeStore.setModality(modality);

        if(!hasTicketModalityId) {
          this.ticketStore.setModalityId(modalityId);
        }
      }
      const { homePage } = useConfigClient();

      switch (homePage) {
        case 'sport':
          this.setSportModality(false);
          break;
        case 'lottery':
          this.setLotteryModality();
          break;
        case 'popular-lottery':
          this.setPopularLotteryModality();
          break;
        default:
          this.setSportModality(false);
          break;
      }
    },

    setSportModality(forceLoading = true) {
      document.getElementById('app').style.overlay = "scroll";
      const modality = this.modalityList.find(modality => modality.id === this.Modalities.FOOTBALL);
      this.homeStore.setModality(modality);
      this.ticketStore.setModalityId(modality.id);
      this.$refs['sport-modality']?.onInit(forceLoading);
    },

    setLotteryModality() {
      document.getElementById('app').style.overlay = "hiden";
      const modality = this.modalityList.find(modality => modality.id === this.Modalities.LOTTERY);
      this.homeStore.setModality(modality);
      this.ticketStore.setModalityId(modality.id);
      this.$refs['lottery-modality'].loadPage();
    },

    setPopularLotteryModality() {
      document.getElementById('app').style.overlay = "hiden";
      const modality = this.modalityList.find(modality => modality.id === this.Modalities.POPULAR_LOTTERY);
      this.homeStore.setModality(modality);
      this.ticketStore.setModalityId(modality.id);
      setTimeout(() => this.$refs['popular-lottery-modality'].loadPage(), 500);
    },

    handleOpenModalitiesModal() {
      this.showModalModalities = true;
    },
    handleCloseModalitiesModal() {
      this.showModalModalities = false;
    },
    async handleModality(modalityId) {
      const modality = this.modalityList.find(modality => modality.id === modalityId);
      const previousModality = this.homeStore.modality;
      this.homeStore.setModality(modality);
      this.ticketStore.setModalityId(modality.id);

      const previousModalitySelectedIsNotSport = [
        this.Modalities.LOTTERY,
        this.Modalities.POPULAR_LOTTERY,
        this.Modalities.ACCUMULATION,
        this.Modalities.CHALLENGE
      ].includes(modalityId);

      const newModalitySelectedIsNotSport = [
        this.Modalities.LOTTERY,
        this.Modalities.POPULAR_LOTTERY,
        this.Modalities.ACCUMULATION,
        this.Modalities.CHALLENGE
      ].includes(previousModality.id);

      const clearTicket = newModalitySelectedIsNotSport && !previousModalitySelectedIsNotSport || !newModalitySelectedIsNotSport && previousModalitySelectedIsNotSport;

      this.ticketStore.setModalityId(modality.id, clearTicket);

      this.homeStore.setDate(now());
      this.homeStore.setPaginate(10);

      if(this.isPopularLotteryModality){
        setTimeout(() => this.$refs['popular-lottery-modality'].loadPage(), 500);
      }

      if(modalityId === this.Modalities.LOTTERY){
        return; 
      }

      if(this.isSportModality) {
        this.homeStore.setLeague(null);
        setTimeout(() => this.$refs['sport-modality'].onInit(true), 500);
      }

      this.handleCloseModalitiesModal();
    },

    handleOpenCalendarModal() {
      this.showModalCalendar = true;
    },
    handleCloseCalendarModal() {
      this.showModalCalendar = false;
    },
    async handleCalendar(dateTime) {
      this.loading = true;
      this.homeStore.setDate(dateTime);
      this.homeStore.setPaginate(10);
      this.handleCloseCalendarModal();
      
      if(this.isSportModality) {
        this.$refs['sport-modality'].onInit(true);
      }
    },

    handleOpenSearchModal() {
      this.showModalSearch = true,
      this.homeStore.setSelectedSearch(true);
      this.homeStore.setInSearch(true);
    },
    handleCloseSearchModal() {
      this.showModalSearch = false
      this.homeStore.selectedSearch = false;
      this.$refs['sport-modality'].pageLoad();
    },
    handleSearchModal(gameId) {
      this.$refs['sport-modality'].handleGameDetailClick(gameId);
    },
    handleLive() {
      this.homeStore.setIsLive(!this.liveActived);
      this.homeStore.setInSearch(!this.homeStore.inSearch);
      this.homeStore.setLeague(null);
      this.homeStore.setPaginate(10);
      this.$refs['sport-modality'].prepareSocket();
      this.$refs['sport-modality'].pageLoad();
    },

    handleCloseToast() {
      this.toastStore.setToastConfig({ message: '' });
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  overflow: hidden;
  &__body {
    display: flex;
    flex-direction: column;
  }

  &__league-select {
    padding: 8px 16px;
  }

  &__league-select img {
    width: 16px;
    height: 16px;
    border-radius: 50px;
    margin-right: 8px;
  }

  &__league-select svg {
    width: 18px;
    height: 18px;
    border-radius: 50px;
    margin-right: 8px;
    margin-left: -1px;
  }
}

::v-deep .select-fake {
  background: #0a0a0a;
  background: var(--background);
}

::v-deep .select-fake__title {
  color: #ffffff;
  color: var(--foreground);
}

::v-deep .select-fake svg {
  fill: #ffffff;
  fill: var(--foreground);
}
</style>
