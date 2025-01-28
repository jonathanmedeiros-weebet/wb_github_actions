<template>
    <div class="game-list">
        <span class="game-list__message" v-if="!hasChampionshipList">Nenhum evento disponível</span>
        <template v-else-if="homeStore.selectedSearch == false">
            <Collapse
                class="game-list__collapse"
                v-for="(championship, index) in championshipList"
                :initCollapsed="allCollapsed || championshipWasOpened(championship._id)"
                :key="index"
            >
                <template #title>
                    <img
                        class="game-list__collapse-icon"
                        v-if="championship.image"
                        v-lazy="championship.image"
                        @error="changeSrcWhenImageError"
                    />
                    <component
                        class="game-list__collapse-icon"
                        v-if="championship.icon"
                        :is="championship.icon"
                        color="#0be58e"
                    />
                    {{ championship.nome }}
                </template>

                <div class="game-list__items"> 
                    <div class="game-list__item-empty">
                        <div class="game-list__columns">
                        <span class="game-list__column">1</span>
                        <span class="game-list__column game-list__column--second">x</span>
                        <span class="game-list__column">2</span>
                        </div>
                    </div>
                    <GameItem
                        v-for="(game, index) in championship.jogos"
                        :key="index"
                        :game="game"
                        @click.native="handleClick(game._id)"
                    />
                </div>
            </Collapse>
            <spinner-loading v-if="isLoading" />
            <div ref="scrollEnd" style="height: 1px;"></div>
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

export default {
    components: {
        Collapse,
        GameItem,
        IconGlobal,
        SpinnerLoading
    },
    name: 'game-list',
    data() {
        return {
            homeStore: useHomeStore(),
            ticketStore: useTicketStore(),
            configClientStore: useConfigClient(),
            isLoading: false,
            championshipListSecondary: []
        }
    },
    mounted() {
        const options = {
            root: this.$root.$refs.appElement,
            rootMargin: '10px',
            threshold: 1.0,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            this.isLoading = true;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.infiniteHandler();
                }
            });
        }, options);

        observer.observe(this.$refs.scrollEnd);
    },
    computed: {
        hasChampionshipList() {
            return Boolean(this.championshipList.length);
        },
        championshipList() {
            if(this.homeStore.isLive){
                this.championshipListSecondary = this.homeStore.championshipList.slice(0, this.homeStore.paginate).map(this.transformChampionshipList);
            } else {
                const championshipList = this.homeStore.championshipList.slice(this.championshipListSecondary.length, this.homeStore.paginate).map(this.transformChampionshipList);
                this.championshipListSecondary.push(...championshipList);
            }
            this.isLoading = false;
            return this.championshipListSecondary;
        },
        allCollapsed() {
            return this.configClientStore.settings.championshipExpanded;;
        }
    },
    methods: {
        transformChampionshipList(championship) {
            const newChampionship = { ...championship };
            if(newChampionship.regiao_sigla !== 'ww') {
                newChampionship.image = `https://cdn.wee.bet/flags/1x1/${newChampionship.regiao_sigla}.svg`;
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
            event.target.src = 'https://cdn.wee.bet/img/times/m/default.png';
        },
        championshipWasOpened(championshipId) {
            return (this.ticketStore.championshipOpened ?? []).includes(championshipId);
        },
        infiniteHandler() {
            if (this.homeStore.paginate >= this.homeStore.championshipList.length) {
                this.isLoading = false;
                return;
            }

            this.homeStore.setPaginate(this.homeStore.paginate + 5);
        }
    }
}
</script>

<style lang="scss" scoped>
.game-list {
    width: 100%;
    min-height: calc(100vh - 100px);
    overflow-y: auto;
    display: flex;
    flex-direction: column; 
    overflow-y: hidden;
    margin-bottom: 200px;

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
</style>