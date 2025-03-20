<template>
  <div class="sport-modality-view">
    <section class="sport-modality-view__body">
      <GameListSkeleton v-if="loading"/>

      <template v-else>
        <SelectFake
          class="sport-modality-view__league-select"
          titleSize="medium"
          v-if="!liveActived"
          @click="handleOpenLeaguesModal"
        >
          <img v-if="league.image" :src="league.image"  @error="changeSrcWhenImageError">
          <component v-if="league.icon" :is="league.icon" color="var(--highlight)" />

          <span>{{ league.label }}</span>
        </SelectFake>

        <GameList :infiniteScroll="true" @gameClick="handleGameDetailClick" />
      </template>
    </section>

    <ModalLeagues
      v-if="showModalLeagues"
      @closeModal="handleCloseLeaguesModal"
      @click="handleLeague"
    />
  </div>
</template>
  
<script>
  import { modalityList, countriesWithFemaleNames, getModalitiesEnum } from '@/constants'
  import { getChampionship, getChampionshipBySportId, getChampionshipRegionBySportId, getLiveChampionship, prepareLiveQuote, SocketService } from '@/services'
  import { useConfigClient, useHomeStore, useToastStore } from '@/stores'
  
  import ModalLeagues from './parts/ModalLeagues.vue'
  import ModalSearch from '../parts/ModalGameSearch.vue'
  import GameList from './parts/GameList.vue'
  import IconTrophy from '@/components/icons/IconTrophy.vue'
  import IconGlobal from '@/components/icons/IconGlobal.vue'
  import GameListSkeleton from '@/views/HomeView/SportModality/parts/GameListSkeleton.vue'
  import IconFootball from '@/components/icons/IconFootball.vue'
  import IconCombat from '@/components/icons/IconCombat.vue'
  import IconAmericanFootball from '@/components/icons/IconAmericanFootball.vue'
  import IconTennis from '@/components/icons/IconTennis.vue'
  import IconHockey from '@/components/icons/IconHockey.vue'
  import IconBasketball from '@/components/icons/IconBasketball.vue'
  import IconFutsal from '@/components/icons/IconFutsal.vue'
  import IconVoleiball from '@/components/icons/IconVoleiball.vue'
  import IconESport from '@/components/icons/IconESport.vue'
  import LiveButton from '../parts/LiveButton.vue'
  import Toast from '@/components/Toast.vue'
  import scrollMixin from '@/mixins/scroll.mixin'
  import SelectFake from '../parts/SelectFake.vue'
  import { convertInMomentInstance } from '@/utilities'
  
  export default {
    name: 'sport-modality-view',
    mixins: [scrollMixin],
    components: {
      ModalLeagues,
      ModalSearch,
      GameList,
      IconTrophy,
      IconGlobal,
      GameListSkeleton,
      IconFootball,
      IconCombat,
      IconAmericanFootball,
      IconTennis,
      IconHockey,
      IconBasketball,
      IconFutsal,
      IconVoleiball,
      IconESport,
      LiveButton,
      Toast,
      SelectFake
    },
    data() {
      return {
        showModalLeagues: false,
        loading: false,
        modalityList: modalityList(),
        regionSelected: '',
        homeStore: useHomeStore(),
        toastStore: useToastStore(),
        socket: new SocketService(),
        pauseActivatedHook: false
      }
    },
    created() {
      this.pauseActivatedHook = true;
      this.onInit(true);
    },
    mounted() {
      setTimeout(() => {
        this.pauseActivatedHook = false;
      }, 5000);
    },
    activated() {
      if(this.pauseActivatedHook) return
      this.onInit(false);
    },
    computed: {
      championshipPerRegionList() {
        return this.homeStore.championshipPerRegionList;
      },
      hasLive() {
        const { options } = useConfigClient();
        if(!options.aovivo) return false;
  
        if(this.modality.id == this.Modalities.FOOTBALL && options.futebol_aovivo) return true;
        if(this.modality.id == this.Modalities.BASKETBALL && options.basquete_aovivo) return true;
        
        return false;
      },
      liveActived() {
        return this.homeStore.isLive;
      },
      modality() {
        return this.homeStore.modality;
      },
      league() {
        return this.homeStore.league;
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
      onInit(forceLoading = true) {
        if(this.liveActived) {
          this.prepareSocket();
        }
  
        this.pageLoad(forceLoading);
      },
      async pageLoad(forceLoading = true) {
        this.loading = forceLoading;
  
        if(Boolean(this.league)) {
          await this.handleLeague(this.league, forceLoading)
        } else {
          await this.prepareChampionshipList(this.modality.id, null, this.dateSelected.format('YYYY-MM-DD'))
        }
         
        await this.prepareChampionshipPerRegionList(this.modality.id)
  
        if(this.liveActived && this.socket.connected()){
          this.behaviorLiveEvents();
        }
  
        this.loading = false;
      },
  
      async prepareChampionshipPerRegionList(modalityId) {
        if(this.liveActived) return [];
  
        const championshipPerRegion = await getChampionshipRegionBySportId(modalityId, this.dateSelected);
        const championshipPerRegionList = championshipPerRegion.result.map((region) => {
          const isIcon = ['ww', 'all'].includes(region.sigla);
          const iconComponent = region.sigla === 'ww' ? IconGlobal : IconTrophy;
  
          const championships = region.campeonatos.map(({_id, nome}) => ({
            id: _id,
            name: nome.replace(`${region._id}: `, '').toUpperCase(),
            label: nome.toUpperCase(),
            image: !isIcon ? `https://wb-assets.com/flags/1x1/${region.sigla}.svg` : null,
            icon: isIcon ? iconComponent : null
          }));
  
          return {
            id: `region_${region._id}`,
            name: region._id.toUpperCase(),
            label: region._id.toUpperCase(),
            slug: region.sigla,
            image: !isIcon ? `https://wb-assets.com/flags/1x1/${region.sigla}.svg` : null,
            icon: isIcon ? iconComponent : null,
            championships
          };
        });
  
        championshipPerRegionList.unshift({
          id: "region_ALL",
          name: "TODOS OS CAMPEONATOS".toUpperCase(),
          label: "TODOS OS CAMPEONATOS".toUpperCase(),
          slug: "all",
          image: null,
          icon: IconGlobal,
          championships: []
        });
  
        this.homeStore.setChampionshipPerRegionList(championshipPerRegionList);
  
        if(!Boolean(this.league)) {
          const league = { ...championshipPerRegionList[0] };
          delete league?.championships;
          this.homeStore.setLeague(league);
        }
  
        if(this.modality.id !== this.Modalities.FOOTBALL) {
          this.prepareChampionshipPerRegionListForModalityOtherThanFootball();
        }
      },
      prepareChampionshipPerRegionListForModalityOtherThanFootball() {
        const icons = {
          1: IconFootball,
          9: IconCombat,
          12: IconAmericanFootball,
          13: IconTennis,
          17: IconHockey,
          48242: IconBasketball,
          83: IconFutsal,
          91: IconVoleiball,
          92: IconTennis,
          151: IconESport
        }
  
        const icon = icons[this.modality.id] ?? null;
      
        const championships = this.homeStore.championshipList.map((championship) => {
          return {
            id: championship._id,
            name: championship.nome.toUpperCase(),
            label: championship.nome.toUpperCase(),
            image: null,
            icon
          }
        })
  
        const championshipPerRegionList = this.homeStore.championshipPerRegionList;
        championshipPerRegionList[0].championships = championships;
        this.homeStore.setChampionshipPerRegionList(championshipPerRegionList)
      },
      async prepareChampionshipList(
        modalityId,
        regionName = null,
        dateSelected= null
      ) {
        const { options } = useConfigClient();
        const isPopularLeague = options?.ordem_exibicao_campeonatos == 'populares';
        const championships = this.liveActived
          ? await getLiveChampionship(modalityId)
          : await getChampionshipBySportId(
            modalityId,
            regionName,
            dateSelected,
            isPopularLeague
          );

          if (!championships || championships.length === 0 && !this.liveActived) {
            const nextDateEvents = this.dateSelected.add(1, 'day');
            this.homeStore.setDate(nextDateEvents);

            if (nextDateEvents <= convertInMomentInstance(this.tablelimiteDate)) {
              await this.prepareChampionshipList(modalityId, regionName, nextDateEvents.format('YYYY-MM-DD'))
              return  
            }
          }
  
        this.homeStore.setChampionshipList(championships);
      },
      async prepareChampionship(championshipId, date = '') {
        const championship = await getChampionship(championshipId, date);
        this.homeStore.setChampionshipList([championship.result])
      },
      prepareCountryName(countryName) {
        return countriesWithFemaleNames.includes(countryName.toUpperCase()) ? `da ${countryName}` : `do ${countryName}`;
      },
  
      behaviorLiveEvents() {
        this.socket.getEvents().subscribe((event) => {
          let hasChange = false;
          const {
            _id: id,
            info: newInfo,
            cotacoes: newQuotes,
            campeonato,
            finalizado: finished
          } = event;
  
          const championshipList = [ ...this.homeStore.championshipList ];
          let championshipIndex = championshipList.findIndex((championship) => championship._id == campeonato._id);
          const hasChampionship = championshipIndex =! -1;
  
          if(hasChampionship) {
            const gameIndex = championshipList[championshipIndex].jogos.findIndex(game => game._id == id);
            const hasGame = gameIndex != -1;
            if(hasGame) {
              if(finished) {
                championshipList[championshipIndex].jogos.splice(gameIndex);
                hasChange = true;
              } else {
                hasChange = true;
                const game = championshipList[championshipIndex].jogos[gameIndex];
                const quotes = prepareLiveQuote(game.cotacoes ?? [], newQuotes);
                championshipList[championshipIndex].jogos[gameIndex] = {
                  ...game,
                  cotacoes: quotes,
                  info: newInfo,
                }
              }
            }
          }
  
          if(hasChange) {
            this.homeStore.setChampionshipList(championshipList)
          }
        })
      },
  
      async handleModality(modalityId) {
        this.loading = true;
        if(modalityId === this.Modalities.POPULAR_LOTTERY){
          this.$router.push({ name: 'popular-lottery' });
          return; 
        }
        const modality = this.modalityList.find(modality => modality.id === modalityId);
        this.homeStore.setModality(modality);
        this.homeStore.setLeague(null);
  
        this.handleCloseModalitiesModal();
  
        await this.prepareChampionshipList(modalityId, null, this.dateSelected.format('YYYY-MM-DD'));
        await this.prepareChampionshipPerRegionList(modalityId);
        this.loading = false;
      },
  
      handleOpenLeaguesModal() {
        this.showModalLeagues = true;
      },
      handleCloseLeaguesModal() {
        this.showModalLeagues = false;
      },
      async handleLeague(regionOrChampionship, forceLoading) {
        this.loading = forceLoading;
        this.regionSelected = '';
        this.handleCloseLeaguesModal();
  
        delete regionOrChampionship?.championships;
        this.homeStore.setLeague(regionOrChampionship);
  
        await this.prepareChampionshipListByLeague();
  
        this.loading = false;
      },
  
      async prepareChampionshipListByLeague() {
        const searchTypeIsRegion = this.league.id.includes('region');
        if(searchTypeIsRegion) {
          let regionName = this.league.id;
          regionName = regionName.split('region_').pop();
          regionName = regionName != 'ALL' ? regionName : null;
  
          this.regionSelected = regionName;
          await this.prepareChampionshipList(this.modality.id, regionName, this.dateSelected.format('YYYY-MM-DD'));
        } else {
          await this.prepareChampionship(this.league.id, this.dateSelected.format('YYYY-MM-DD'));
        }
      },
  
      changeSrcWhenImageError (event) {
        event.target.src = 'https://wb-assets.com/img/times/m/default.png';
      },
  
      handleLive() {
        this.homeStore.setIsLive(!this.liveActived);
        this.homeStore.inSearch = !this.homeStore.inSearch;
        this.homeStore.setLeague(null);
        this.prepareSocket();
        this.pageLoad();
      },
      async prepareSocket() {
        if(this.liveActived) {
          await this.socket.connect();
          this.socket.enterEventsRoom();
        } else {
          this.eventSocketDisconnect();
        }
      },
      handleGameDetailClick(gameId) {
        this.eventSocketDisconnect();
  
        this.$router.push({
          name: 'game-detail',
          params: {
            id: gameId
          }
        });
  
        event.stopPropagation();
      },
      eventSocketDisconnect() {
        this.socket.exitEventsRoom();
        this.socket.disconnect();
      },
  
      handleCloseToast() {
        this.toastStore.setToastConfig({ message: '' });
      }
    },
    beforeDestroy() {
      this.eventSocketDisconnect();
    }
  }
</script>
  
<style lang="scss" scoped>
  .sport-modality-view {
    overflow: hidden;
    &__body {
      display: flex;
      flex-direction: column;
    }
  
    &__league-select {
      padding: 8px 16px;
      border-bottom: 1px solid rgba(var(--league-foreground-rgb), 0.1)
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
</style>