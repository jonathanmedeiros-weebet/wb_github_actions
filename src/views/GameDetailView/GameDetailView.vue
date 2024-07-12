<template>
    <div class="game-detail">
        <div class="game-detail__header">
           <GameDetailHeader :game="game" :type="gameHeaderType" :fixed="headerFixed"/>
        </div>
        <div class="game-detail__body" :class="{'game-detail__body--paddintTop': headerFixed}">
           <div class="game-detail__filters">
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

            <TimeQuotes v-if="!filteredPerPlayer" :quotes="options"/>
            <PlayerQuotes v-if="filteredPerPlayer" :quotes="options"/>
        </div>
    </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import GameDetailHeader from './parts/GameDetailHeader.vue'
import { MarketTime } from '@/enums'
import Collapse from '@/components/Collapse.vue'
import Button from '@/components/Button.vue'
import { getGame } from '@/services'
import { useConfigClient } from '@/stores'
import TimeQuotes from './parts/TimeQuotes.vue'
import PlayerQuotes from './parts/PlayerQuotes.vue'

const FAVORITE_QUOTE_HOME = 'casa'
const FAVORITE_QUOTE_OUTSIDE = 'fora'

export default {
    components: {
        Header,
        GameDetailHeader,
        Collapse,
        Button,
        TimeQuotes,
        PlayerQuotes
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
                [MarketTime.PLAYERS]: []
            }
        }
    },
    async created() {
        await this.prepareGameDetail();
        this.prepareQuotes();
    },
    mounted() {
        document.addEventListener("scroll", () => {
            if(window.pageYOffset > 75) {
                this.headerFixed = true;
            } else {
                this.headerFixed = false;
            };
        });
    },
    computed: {
        filteredPerPlayer() {
            return this.filterSelected == MarketTime.PLAYERS;
        },
        gameHeaderType() {
            return this.headerFixed ? 'slim' : 'normal'
        },
        filters() {
            return [
                {
                    title: 'Tempo completo',
                    selected: this.filterSelected === MarketTime.FULL_TIME,
                    slug: MarketTime.FULL_TIME,
                },
                {
                    title: 'Primeiro tempo',
                    selected: this.filterSelected === MarketTime.FIRST_TIME,
                    slug: MarketTime.FIRST_TIME
                },
                {
                    title: 'Segundo tempo',
                    selected: this.filterSelected === MarketTime.SECOND_TIME,
                    slug: MarketTime.SECOND_TIME
                },
                {
                    title: 'Jogadores',
                    selected: this.filterSelected === MarketTime.PLAYERS,
                    slug: MarketTime.PLAYERS
                },
            ]
        },
        options() {
            return this.markets[this.filterSelected]
        }
    },
    methods: {
        async prepareGameDetail() {
            const gameId = String(this.$route.params.id);
            const response = await getGame(gameId);
            this.game = response.result;
        },
        async prepareQuotes() {
            const { betOptions } = useConfigClient();
            const quotes = this.game.cotacoes;
            const markets = {
                [MarketTime.FULL_TIME]: {},
                [MarketTime.FIRST_TIME]: {},
                [MarketTime.SECOND_TIME]: {},
                [MarketTime.PLAYERS]: {}
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

                const finalValue = this.calculateQuota({
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
                    hasPermission: this.hasQuotaPermission(finalValue)
                });
            }

            this.markets[MarketTime.FULL_TIME] = Object.values(markets[MarketTime.FULL_TIME]);
            this.markets[MarketTime.FIRST_TIME] = Object.values(markets[MarketTime.FIRST_TIME]);
            this.markets[MarketTime.SECOND_TIME] = Object.values(markets[MarketTime.SECOND_TIME]);
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

                    const finalValue = this.calculateQuota({
                        value: odd.value,
                        key: odd.key,
                        gameEventId: this.game.event_id,
                        favorite: this.game.favorito,
                        isLive: this.game.ao_vivo
                    });

                    quoteGroups[groupIndex].players[playerIndex].odds.push({
                        ...odd,
                        label: quote.name,
                        finalValue,
                        hasPermission: this.hasQuotaPermission(finalValue)
                    })
                }
            }

            return quoteGroups.filter(group => Boolean(group.players.length));
        },
        hasQuotaPermission(quotaValue) {
            const { options } = useConfigClient();
            return Number(quotaValue) >= Number(options.bloquear_cotacao_menor_que || 1.05);
        },
        calculateQuota({
            value = 0,
            key,
            gameEventId,
            favorite,
            isLive = false
        }) {
            const { betOptions, localQuotes, options } = useConfigClient();
            const betType = betOptions[key] ?? undefined;

            // Cotacação Local
            if (localQuotes[gameEventId] && localQuotes[gameEventId][key]) {
                value = parseFloat(localQuotes[gameEventId][key].valor);
            }

            if (Boolean(betType)) {
                if (isLive) {
                    // Fator ao vivo
                    const liveFactor = Boolean(betType.fator_ao_vivo)
                        ? parseFloat(betType.fator_ao_vivo)
                        : 1;

                    value = value * liveFactor;
                } else {
                    const factor = Boolean(betType.fator)
                        ? parseFloat(betType.fator)
                        : 1;

                    value = value * factor;

                    if (Boolean(favorite)) {
                        // Favorito e Zebra
                        const favoriteZebraQuotes = [
                            'casa_90',
                            'fora_90',
                            'casa_empate_90',
                            'fora_empate_90'
                        ];

                        if (favoriteZebraQuotes.includes(key)) {
                            if (/casa/.test(key)) {
                                value *= (favorite === FAVORITE_QUOTE_HOME)? options.fator_favorito : options.fator_zebra;
                            } else {
                                value *= (favorite === FAVORITE_QUOTE_OUTSIDE) ? options.fator_favorito : options.fator_zebra;
                            }
                        }
                    }
                }

                // Limite
                if (value > betType.limite) {
                    value = parseFloat(betType.limite);
                }
            }

            return value.toFixed(2);
        },
        handleGameFilter(filter) {
            this.filterSelected = filter
        },
    }
}
</script>

<style lang="scss" scoped>
.game-detail {
    padding-bottom: 100px;

    &__filters {
        height: 53px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        padding: 0 10px;

        width: 100%;
        overflow-y: auto;
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */

        border-bottom: 1px solid #ffffff1a;
        background: var(--color-background-input);
    }

    &__filters::-webkit-scrollbar {
        display: none;  /* WebKit-based browsers */
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