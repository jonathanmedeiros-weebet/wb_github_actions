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
          <DynamicScroller
            :items="campeonatos"
            :prerender="10"
            :min-item-size="150"
            class="scroller game-list"
            ref="scroller"
          >
            <template v-slot="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :data-index="index"
                :size-dependencies="[isCollapsed[index]]"
                :size="getItemSize(index)"
                :emitResize="true"
                :ref="`scrollerItem-${index}`"
              >
                <div class="collapse game-list__collapse">
                  <div class="collapse__item" @click="toggleCollapse(index)">
                      <span class="collapse__title">{{ item.title }} ({{ isCollapsed[index] ? "Fechado" : "Aberto" }})</span>
                      <component :is="iconArrowDinamic(index)" color="var(--league-foreground)"/>
                  </div>
                    <div v-if="!isCollapsed[index]" class="game-list__items">
                      <div class="game-list__item-empty">
                          <div class="game-list__columns">
                              <span class="game-list__column">1</span>
                              <span class="game-list__column game-list__column--second">x</span>
                              <span class="game-list__column">2</span>
                          </div>
                      </div>
  
                      <div class="game" v-for="(game, gameIndex) in item.games" :key="gameIndex">
                        <div class="game__teams">
                          <span
                              class="game__team"
                              :class="{'game__team--first': true}"
                          >
                              <img v-lazy="''" @error="changeSrcWhenImageError" />
                              {{ game.team1 }}
                          </span>
  
                          <span
                              class="game__team"
                              :class="{'game__team--first': false}"
                          >
                              <img v-lazy="''" @error="changeSrcWhenImageError" />
                              {{ game.team2 }}
                          </span>
                          
                          <span class="game__info">
                              <span>{{ game.date }}</span>
                              <span class="game__pontuation">+500</span>
                          </span>
                        </div>
                        <div class="game__quotes">
                            <div
                                class="game__quota"
                                :class="{'game__quota--selected': true}"
                                @click="handleClick"
                            >
                                <span class="game__value-quota">
                                  1.00
                                </span>
                            </div>
                            <div
                                class="game__quota"
                                :class="{'game__quota--selected': false}"
                                @click="handleClick"
  
                            >
                                <span class="game__value-quota">
                                  1.00
                                </span>
                            </div>
                            <div
                                class="game__quota"
                                :class="{'game__quota--selected': false}"
                                @click="handleClick"
  
                            >
                                <span class="game__value-quota">
                                  1.00
                                </span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </template>
      </section>
    </div>
  </template>
  
  <script>
  import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
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
    import Collapse from '@/components/Collapse.vue'
  import IconArrowUp from "@/components/icons/IconArrowUp.vue";
  import IconArrowDown from "@/components/icons/IconArrowDown.vue";
  
  export default {
      name: 'sport-modality-view',
      mixins: [scrollMixin],
      components: {
        IconArrowDown,
        IconArrowUp,
        DynamicScroller,
        DynamicScrollerItem,
        Collapse,
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
          campeonatos: [
            { id: 1, title: "Campeonato A", games: this.generateGames(1) },
            { id: 2, title: "Campeonato B", games: this.generateGames(15) },
            { id: 3, title: "Campeonato C", games: this.generateGames(5) },
            { id: 4, title: "Campeonato D", games: this.generateGames(20) },
            { id: 5, title: "Campeonato E", games: this.generateGames(5) },
            { id: 6, title: "Campeonato F", games: this.generateGames(10) },
            { id: 7, title: "Campeonato G", games: this.generateGames(2) },
            { id: 8, title: "Campeonato H", games: this.generateGames(1) },
            { id: 9, title: "Campeonato I", games: this.generateGames(100) },
          ],
          isCollapsed: {},
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
        handleClick() {
          console.log('clicou')
        },
        iconArrowDinamic(index){
          return !this.isCollapsed[index] ? IconArrowUp : IconArrowDown;
        },
        generateGames(count) {
          return Array.from({ length: count }, (_, i) => ({
            team1: "Time " + (i + 1),
            team2: "Time " + (i + 2),
            date: `25/10 ${10 + i}:00`,
          }));
        },
        getItemSize(index) {
          return this.isCollapsed[index] ? 50 : 300;
        },
        
        toggleCollapse(index) {
          this.$set(this.isCollapsed, index, !this.isCollapsed[index]);
  
          this.$nextTick(() => {
            const itemRef = this.$refs[`scrollerItem-${index}`];
            if (itemRef && itemRef[0]) {
              itemRef[0].$emit("resize");
            }
          });
        },
        onInit(forceLoading = true) {
          if(this.liveActived) {
            this.prepareSocket();
          }
    
          this.pageLoad(forceLoading);
        },
        async pageLoad(forceLoading = true) {
          this.loading = forceLoading;
    
          if(Boolean(this.league) && this.league.id !== "region_ALL") {
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
  
            if ((!championships || championships.length === 0) && !this.liveActived) {
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
        async handleLeague(regionOrChampionship, forceLoading = false) {
          this.loading = forceLoading;
          this.regionSelected = '';
          this.handleCloseLeaguesModal();
    
          delete regionOrChampionship?.championships;
          this.homeStore.setLeague(regionOrChampionship);
    
          if(forceLoading) {
            this.homeStore.setPaginate(10);
            this.homeStore.setChampionshipList([]);
            this.$refs['game-list'].championshipListSecondary = [];
          }
  
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
  
  .collapse {
      width: 100%;
      background: transparent;
      min-height: 40px;
  
      &__item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 8px 16px;
          background: #0a0a0a;
          background: var(--league);
          color: #ffffff;
          color: var(--league-foreground);
          border-bottom: 1px solid rgba(var(--league-foreground-rgb), .1);
      }
  
      &__title {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #ffffff;
          color: var(--league-foreground);
          font-size: 14px;
          font-weight: 400;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: calc(100vw - 60px);
      }
  
      &__title img {
          max-width: 16px;
          max-height: 16px;
      }
  }
  
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
  
    .game-list {
      width: 100%;
      height: 100%;
      min-height: calc(100vh - 100px);
      display: block;
      flex-direction: column; 
      overflow-y: scroll;
      padding-bottom: 200px;
  
      &__items {
          margin-top: 1px;
          margin-bottom: 1px;
          display: flex;
          flex-direction: column;
      }
  
      &__item-empty {
          width: 100%;
          height: 30px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 0 16px;
          color: #ffffff;
          color: var(--foreground);
      }
  
      &__columns {
          width: 190px;
          display: flex;
      }
  
      &__column {
          width: 58px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF80;
          color: var(--foreground);
  
          &--second {
              margin: 0 8px;
          }
      }
  
      &__collapse img {
          border-radius: 50px;
          min-width: 16px;
          height: 16px;
          margin-right: 6px;
      }
  
       &__collapse svg {
          border-radius: 50px;
          min-width: 18px;
          height: 18px;
          margin-left: -1px;
          margin-right: 6px;
      }
  
      &__message {
          display: flex;
          width: 100%;
          padding: 8px 16px;
          font-size: 12px;
          color: #ffffff80;
          color: var(--foreground);
      }
  }
  
  .game {
      width: 100%;
  
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 13px 16px;
      background: #0a0a0a;
      background: var(--game);
      margin-top: 1px;
  
      color: #ffffff;
      color: var(--game-foreground);
  
      &__teams {
          display: flex;
          flex-direction: column;
      }
  
      &__team {
          display: flex;
          align-items: center;
          color: #ffffff;
          color: var(--game-foreground);
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: calc(100vw - 250px);
  
          &--first {
              margin-bottom: 8px;
          }
      }
  
      &__team img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
      }
  
      &__info {
          display: flex;
          align-items: center;
          font-size: 12px;
          line-height: 12px;
          font-weight: 400;
          color: #ffffff;
          color: var(--game-foreground);
          margin-top: 8px;
      }
  
      &__info span {
          color: rgba(255, 255, 255, 0.6);
          color: rgba(var(--game-foreground-rgb), 0.6);
      }
  
      &__pontuation {
          font-size: 10px;
          line-height: 10px;
          font-weight: 400;
          color: #35cd96 !important;
          color: var(--highlight) !important;
  
          border: 0.5px solid #35cd96;
          border: 0.5px solid var(--highlight);
          border-radius: 2px;
          padding: 0 5px;
  
          height: 15px;
          width: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 8px;
      }
  
      &__quotes {
          display: flex;
          justify-content: space-between;
          min-width: 190px;
          margin-top: auto;
          margin-bottom: auto;
      }
  
      &__quota {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 54px;
          border-radius: 4px;
          background: #181818;
          background: var(--button);
          color: #ffffff;
          color: var(--button-foreground);
          &--selected {
              background: #35cd96;
              background: var(--highlight);
              color: #181818;
              color: var(--highlight-foreground);
          }
      }
  
      &__value-quota {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
      }
  
      &__icon-quota {
          animation: blink 1s linear infinite;
      }
  
      &__live {
          color: #f61a1a;
          color: var(--warning);
          font-size: 12px;
          font-style: normal;
          font-weight: 300;
          line-height: normal;
      }
  
      &__time {
          color: rgba(255, 255, 255, 0.6);
          color: rgba(var(--game-foreground-rgb), 0.6);
          font-size: 12px;
          font-style: normal;
          font-weight: 300;
          line-height: normal;
          margin-left: 8px;
      }
  
      &__score {
          width: 10px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
      }
  
      &__score-number {
          margin-top: 4px;
          color: #ffffff;
          color: var(--game-foreground);
      }
      
  }
  
  .scroller {
    will-change: transform;
    contain: strict;
  }
  
  .game-list__item-empty {
    will-change: opacity, transform;
  }
  
  ::v-deep .spinner-loading {
      height: 25px;
      width: 25px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 10px;
  }
  </style>
  