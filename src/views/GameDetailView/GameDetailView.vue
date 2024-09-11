<template>
    <div class="game-detail">
        <GameDetailSkeleton v-if="loading"/>
        <template v-else>
            <div class="game-detail__header">
                <GameDetailHeader
                    :game="game"
                    :type="gameHeaderType"
                    :fixed="headerFixed"
                />
            </div>
            <div class="game-detail__body" :class="{'game-detail__body--paddintTop': headerFixed}">
                <div class="game-detail__filters" v-if="isFutebolModality && hasQuotes">
                    <button
                        class="game-detail__filter"
                        v-for="({ title, selected, slug}, index) in filters"
                        :key="index"
                        :class="{'game-detail__filter--selected': selected}"
                        @click="handleGameFilter(slug)"
                    >
                        {{ title }}
                    </button>
                </div>

                <TimeQuotes v-if="!filteredPerPlayer" :quotes="options" :game="game"/>
                <PlayerQuotes v-if="filteredPerPlayer" :quotes="options" :game="game"/>
            </div>
        </template>
    </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import GameDetailHeader from './parts/GameDetailHeader.vue'
import { MarketTime, Modalities, QuotaStatus } from '@/enums'
import Collapse from '@/components/Collapse.vue'
import Button from '@/components/Button.vue'
import { getGame, hasQuotaPermission, calculateQuota, SocketService, prepareLiveQuote } from '@/services'
import { useConfigClient, useToastStore } from '@/stores'
import TimeQuotes from './parts/TimeQuotes.vue'
import PlayerQuotes from './parts/PlayerQuotes.vue'
import GameDetailSkeleton from './parts/GameDetailSkeleton.vue'

export default {
    components: {
        Header,
        GameDetailHeader,
        Collapse,
        Button,
        TimeQuotes,
        PlayerQuotes,
        GameDetailSkeleton,
    },
    name: 'game-detail',
    data() {
        return {
            headerFixed: false,
            game: {},
            filterSelected: MarketTime.FULL_TIME,
            markets: {
                [MarketTime.FULL_TIME]: [],
                [MarketTime.FIRST_TIME]: [],
                [MarketTime.SECOND_TIME]: [],
                [MarketTime.PLAYERS]: [],
                [MarketTime.TOTAL]: []
            },
            loading: false,
            socket: new SocketService(),
            toastStore: useToastStore(),
        }
    },
    async created() {
        this.loading = true;
        await this.prepareGameDetail();
        await this.prepareQuotes();

        if(!this.isFutebolModality) {
            this.filterSelected = MarketTime.TOTAL;
        }

        this.loading = false;
    },
    computed: {
        hasQuotes() {
            return Boolean(this.options.length);
        },
        isFutebolModality() {
            return this.game.sport_id === Modalities.SOCCER;
        },
        filteredPerPlayer() {
            return this.filterSelected == MarketTime.PLAYERS;
        },
        gameHeaderType() {
            return this.headerFixed ? 'slim' : 'normal'
        },
        filters() {
            const filters = [
                {
                    title: 'Tempo completo',
                    selected: this.filterSelected === MarketTime.FULL_TIME,
                    slug: MarketTime.FULL_TIME,
                    show: Boolean(this.game && this.markets[MarketTime.FULL_TIME].length)
                },
                {
                    title: 'Primeiro tempo',
                    selected: this.filterSelected === MarketTime.FIRST_TIME,
                    slug: MarketTime.FIRST_TIME,
                    show: Boolean(this.game && this.markets[MarketTime.FIRST_TIME].length)
                },
                {
                    title: 'Segundo tempo',
                    selected: this.filterSelected === MarketTime.SECOND_TIME,
                    slug: MarketTime.SECOND_TIME,
                    show: Boolean(this.game && this.markets[MarketTime.SECOND_TIME].length)
                },
                {
                    title: 'Jogadores',
                    selected: this.filterSelected === MarketTime.PLAYERS,
                    slug: MarketTime.PLAYERS,
                    show: Boolean(this.game && this.markets[MarketTime.PLAYERS].length)
                }
            ];
            return filters.filter(filter => filter.show)
        },
        options() {
            return this.markets[this.filterSelected]
        },
    },
    methods: {
        async prepareGameDetail() {
            try {
                const gameId = String(this.$route.params.id);
                this.game = await getGame(gameId);

                if(this.game.ao_vivo) {
                    await this.socket.connect();
                    this.socket.enterEventRoom(this.game._id);
                    this.behaviorLiveEvent(this.game._id);
                }
            } catch (error) {
                this.$router.back();
            }
        },
        async prepareQuotes() {
            const { betOptions } = useConfigClient();
            const quotes = Boolean(this.game.ao_vivo)
                ? this.game.cotacoes_aovivo ?? []
                : this.game.cotacoes ?? [];

            const markets = {
                [MarketTime.FULL_TIME]: {},
                [MarketTime.FIRST_TIME]: {},
                [MarketTime.SECOND_TIME]: {},
                [MarketTime.PLAYERS]: {},
                [MarketTime.TOTAL]: {}
            }

            for await (let quote of quotes) {
                const betType = betOptions[quote.chave];
                const isPlayerTime = betType?.tempo === MarketTime.PLAYERS;
                if(!Object.keys(markets).includes(betType?.tempo)) continue; // verifica os tipos de apostas permitidos

                const market = markets[betType.tempo];

                if(!Boolean(market[betType.cat_chave])){
                    market[betType.cat_chave] = {
                        'name': betType.cat_nome,
                        'key': betType.cat_chave,
                        'time': betType.tempo,
                        'odds': []
                    }
                }

                const finalValue = calculateQuota({
                    value: quote.valor,
                    key: quote.chave,
                    gameEventId: this.game.event_id,
                    favorite: this.game.favorito,
                    isLive: this.game.ao_vivo
                });

                market[betType.cat_chave]['odds'].push({
                    key: quote.chave,
                    label: isPlayerTime ? quote.nome : betType.nome,
                    og: quote.og,
                    value: quote.valor,
                    id: quote._id,
                    finalValue,
                    status: quote.status ?? QuotaStatus.DEFAULT,
                    hasPermission: hasQuotaPermission(finalValue)
                });
            }

            this.markets[MarketTime.FULL_TIME] = Object.values(markets[MarketTime.FULL_TIME]);
            this.markets[MarketTime.FIRST_TIME] = Object.values(markets[MarketTime.FIRST_TIME]);
            this.markets[MarketTime.SECOND_TIME] = Object.values(markets[MarketTime.SECOND_TIME]);
            this.markets[MarketTime.TOTAL] = Object.values(markets[MarketTime.TOTAL]);
            this.markets[MarketTime.PLAYERS] = this.preparePlayerQuotes(Object.values(markets[MarketTime.PLAYERS]));
        },
        preparePlayerQuotes(quotes) {
            let quoteGroups = [
                {
                    title: 'Marcadores de gols',
                    keys: ['jogador_marca_primeiro', 'jogador_marca_ultimo', 'jogador_marca_qualquer_momento'],
                    players: []
                },
                {
                    title: 'Multi marcadores',
                    keys: ['jogador_marca_2_ou_mais_gols', 'jogador_marca_3_ou_mais_gols'],
                    players: []
                },
                {
                    title: 'Cartões',
                    keys: ['jogador_recebera_primeiro_cartao', 'jogador_recebera_cartao', 'jogador_sera_expulso'],
                    players: []
                },
                {
                    title: `Gols casa - ${this.game.time_a_nome}`,
                    keys: ['jogador_marca_1st_gol_casa', 'jogador_marca_ultimo_gol_casa'],
                    players: []
                },
                {
                    title: `Gols fora - ${this.game.time_b_nome}`,
                    keys: ['jogador_marca_1st_gol_fora', 'jogador_marca_ultimo_gol_fora'],
                    players: []
                }
            ];

            for (const quote of quotes) {
                const groupIndex = quoteGroups.findIndex(group => group.keys.includes(quote.key));
                if(groupIndex == -1) continue;

                for (const odd of quote.odds) {
                    let playerIndex = quoteGroups[groupIndex].players.findIndex(player => player.name == odd.label)
                    if(playerIndex == -1) {
                        quoteGroups[groupIndex].players.push({
                            name: odd.label,
                            odds: []
                        })
                        playerIndex = quoteGroups[groupIndex].players.length - 1
                    }

                    const finalValue = calculateQuota({
                        value: odd.value,
                        key: odd.key,
                        gameEventId: this.game.event_id,
                        favorite: this.game.favorito,
                        isLive: this.game.ao_vivo
                    });

                    const playerKey = `player___${odd.label.replaceAll(' ', '_')}___${odd.key}`

                    quoteGroups[groupIndex].players[playerIndex].odds.push({
                        ...odd,
                        key: playerKey,
                        label: quote.name,
                        finalValue,
                        hasPermission: hasQuotaPermission(finalValue)
                    })
                }
            }

            return quoteGroups.filter(group => Boolean(group.players.length));
        },
        
        handleGameFilter(filter) {
            this.filterSelected = filter
        },
        behaviorLiveEvent(eventId) {
            this.socket.getEventDetail(eventId).subscribe((event) => {
                this.game.info = event.info;
                this.game.cotacoes_aovivo = prepareLiveQuote(this.game.cotacoes_aovivo ?? [], event.cotacoes_aovivo ?? []);
                this.prepareQuotes()
            })
        },

        handleCloseToast() {
            this.toastStore.setToastConfig({ message: '' });
        }
    },
    destroyed() {
        if(this.socket.connected()) {
            this.socket.exitEventRoom(this.game._id);
            this.socket.disconnect();
        }
    }
}
</script>

<style lang="scss" scoped>
.game-detail {
    padding-bottom: 20px;

    &__filters {
        position: relative;
        z-index: 1;
        height: 53px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        padding: 0 10px;

        width: 100%;
        overflow-y: auto;
        -ms-overflow-style: none;  
        scrollbar-width: none;  

        border-bottom: 1px solid #ffffff1a;
        background: #181818;
        background: var(--game);
    }

    &__filters::-webkit-scrollbar {
        display: none;  
    }

    &__filter {
        height: 100%;
        font-size: 16px;
        font-weight: 400;
        line-height: normal;

        background: transparent;
        border: none;
        white-space: nowrap;

        color: #ffffff80;
        border-bottom: 3px solid transparent;
        &--selected {
            color: #0AAF6D;
            border-color: #0AAF6D;
        }
    }

    &__body {
        padding: 0;
        &--paddintTop {
            padding-top: 155px;
        }
    }
}
</style>