<template>
    <div class="game-list">
        <span class="game-list__message" v-if="!hasChampionshipList">Nenhum evento disponível</span>
        <template v-else-if="homeStore.selectedSearch == false">
            <DynamicScroller
                :items="championshipList"
                :prerender="5"
                :min-item-size="150"
                class="scroller game-list__container"
                ref="scroller"
                keyField="_id"
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
                                <span class="collapse__title">
                                    <img
                                        class="game-list__collapse-icon"
                                        v-if="item.image"
                                        v-lazy="item.image"
                                        @error="changeSrcWhenImageError"
                                    />
                                    <component
                                        class="game-list__collapse-icon"
                                        v-if="item.icon"
                                        :is="item.icon"
                                        color="#0be58e"
                                    />
                                    {{ item.nome }}
                                </span>
                                <component :is="iconArrowDinamic(index)" color="var(--league-foreground)"/>
                            </div>
                            <div class="game-list__items" v-if="!isCollapsed[index]"> 
                                <div class="game-list__item-empty">
                                    <div class="game-list__columns">
                                        <span class="game-list__column">1</span>
                                        <span class="game-list__column game-list__column--second">x</span>
                                        <span class="game-list__column">2</span>
                                    </div>
                                </div>
                                <GameItem
                                    v-for="(game, index) in item.jogos"
                                    :key="index"
                                    :game="game"
                                    @click.native="handleClick(game._id)"
                                />
                            </div>
                        </div>
                    </DynamicScrollerItem>
            </template>

            </DynamicScroller>
        </template>
    </div>
</template>

<script>
import Collapse from '@/components/Collapse.vue';
import GameItem from './GameItem.vue';
import { useConfigClient, useHomeStore, useTicketStore } from '@/stores';
import IconGlobal from '@/components/icons/IconGlobal.vue';
import { hasQuotaPermission, calculateQuota } from '@/services';
import SpinnerLoading from '@/components/SpinnerLoading.vue';
import _ from 'lodash';
import IconArrowDown from '@/components/icons/IconArrowDown.vue';
import IconArrowUp from '@/components/icons/IconArrowUp.vue';
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";

export default {
    components: {
        Collapse,
        GameItem,
        IconGlobal,
        SpinnerLoading,
        IconArrowDown,
        IconArrowUp,
        DynamicScroller,
        DynamicScrollerItem,
    },
    name: 'game-list',
    data() {
        return {
            homeStore: useHomeStore(),
            ticketStore: useTicketStore(),
            configClientStore: useConfigClient(),
            isLoading: false,
            isCollapsed: {},
        }
    },
    computed: {
        hasChampionshipList() {
            return Boolean(this.championshipList.length);
        },
        championshipList() {
            return this.homeStore.championshipList.map(this.transformChampionshipList);
        },
        allCollapsed() {
            return this.configClientStore.settings.championshipExpanded;
        }
    },
    methods: {
        iconArrowDinamic(index){
          return !this.isCollapsed[index] ? IconArrowUp : IconArrowDown;
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
        transformChampionshipList(championship) {
            const newChampionship = { ...championship };
            if(newChampionship.regiao_sigla !== 'ww') {
                newChampionship.image = `https://wb-assets.com/flags/1x1/${newChampionship.regiao_sigla}.svg`;
            } else {
                newChampionship.icon = IconGlobal;
            }

            newChampionship.jogos = championship.jogos.map((game) => {
                const newGame = { ...game };
                newGame.cotacoes = newGame.cotacoes.map(quota => {
                    const finalValue = calculateQuota({
                        value: quota.valor,
                        key: quota.chave,
                        gameEventId: newGame.event_id,
                        favorite: newGame.favorito,
                        isLive: newGame.ao_vivo
                    });

                    const hasPermission = hasQuotaPermission(finalValue)

                    return {
                        ...quota,
                        hasPermission,
                        finalValue,
                    };
                })
                return newGame;
            })
            
            return newChampionship;
        },
        handleClick(gameId) {
            this.$emit('gameClick', gameId);
        },
        changeSrcWhenImageError (event) {
            event.target.src = 'https://wb-assets.com/img/times/m/default.png';
        },
        championshipWasOpened(championshipId) {
            return (this.ticketStore.championshipOpened ?? []).includes(championshipId);
        },
    }
}
</script>

<style lang="scss" scoped>
.game-list {
    width: 100%;
    height: 100%;
    overflow-y: hidden;

    &__container {
        width: 100%;
        height: 100%;
        min-height: calc(100vh - 100px);

        overflow-y: scroll;
        padding-bottom: 200px;
        position: fixed;
    }
   
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

::v-deep .spinner-loading {
    height: 25px;
    width: 25px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
}

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
</style>