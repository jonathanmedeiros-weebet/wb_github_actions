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
            filterSelected: MarketTime.PLAYERS,
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

                market[betType.cat_chave]['odds'].push({
                    key: quote.chave,
                    label: isPlayerTime ? quote.nome : betType.nome,
                    og: quote.og,
                    value: quote.valor,
                    id: quote._id
                });
            }

            console.log(markets[MarketTime.PLAYERS])

            this.markets[MarketTime.FULL_TIME] = Object.values(markets[MarketTime.FULL_TIME]);
            this.markets[MarketTime.FIRST_TIME] = Object.values(markets[MarketTime.FIRST_TIME]);
            this.markets[MarketTime.SECOND_TIME] = Object.values(markets[MarketTime.SECOND_TIME]);
            this.markets[MarketTime.PLAYERS] = this.preparePlayerQuotes(Object.values(markets[MarketTime.PLAYERS]));
        },
        preparePlayerQuotes(quotes) {
            const playerQuotes = [];
            for (const quote of quotes) {
                console.log(quote)
                
                // mercados[chave].odds.forEach((odd) => {
                //     const casaFora = chave.includes('casa') ? 'casa' : chave.includes('fora') ? 'fora' : null;
                //     let chaveJogador = null;

                //     const verificacaoJogador = jogadoresMercados.some((item, key) => {
                //         chaveJogador = key;
                //         return item.nome === odd.nome;
                //     });

                //     if (!verificacaoJogador) {
                //         const temp = {
                //             nome: odd.nome,
                //             m_gols: {},
                //             m_marcadores: {},
                //             m_cartoes: {},
                //             m_gols_casa: {},
                //             m_gols_fora: {},
                //             casa_fora: casaFora
                //         };
                //         jogadoresMercados.push(temp);
                //     } else {
                //         if (!jogadoresMercados[chaveJogador].casa_fora) {
                //             jogadoresMercados[chaveJogador].casa_fora = casaFora;
                //         }
                //     }
                // });
            }

            // jogadoresMercados.forEach((jogador) => {
            //     const mercadosJogador = {};
            //     for (const chave in mercados) {
            //         const mercadoTemp = mercados[chave].odds.filter((odd) => {
            //             return (odd.nome === jogador.nome && odd.nome !== 'No Bookings');
            //         });

            //         mercadosJogador[chave] = mercadoTemp[0] ? mercadoTemp[0] : {};
            //     }

            //     jogador['m_gols']['jogador_marca_primeiro'] = this.checkEmpty(mercadosJogador['jogador_marca_primeiro']);
            //     jogador['m_gols']['jogador_marca_ultimo'] = this.checkEmpty(mercadosJogador['jogador_marca_ultimo']);
            //     jogador['m_gols']['jogador_marca_qualquer_momento'] = this.checkEmpty(mercadosJogador['jogador_marca_qualquer_momento']);

            //     jogador['m_marcadores']['jogador_marca_2_ou_mais_gols'] = this.checkEmpty(mercadosJogador['jogador_marca_2_ou_mais_gols']);
            //     jogador['m_marcadores']['jogador_marca_3_ou_mais_gols'] = this.checkEmpty(mercadosJogador['jogador_marca_3_ou_mais_gols']);

            //     jogador['m_cartoes']['jogador_recebera_primeiro_cartao'] = this.checkEmpty(mercadosJogador['jogador_recebera_primeiro_cartao']);
            //     jogador['m_cartoes']['jogador_recebera_cartao'] = this.checkEmpty(mercadosJogador['jogador_recebera_cartao']);
            //     jogador['m_cartoes']['jogador_sera_expulso'] = this.checkEmpty(mercadosJogador['jogador_sera_expulso']);

            //     if (jogador.casa_fora === 'casa') {
            //         jogador['m_gols_casa']['jogador_marca_1st_gol_casa'] = this.checkEmpty(mercadosJogador['jogador_marca_1st_gol_casa']);
            //         jogador['m_gols_casa']['jogador_marca_ultimo_gol_casa'] = this.checkEmpty(mercadosJogador['jogador_marca_ultimo_gol_casa']);
            //     }

            //     if (jogador.casa_fora === 'fora') {
            //         jogador['m_gols_fora']['jogador_marca_1st_gol_fora'] = this.checkEmpty(mercadosJogador['jogador_marca_1st_gol_fora']);
            //         jogador['m_gols_fora']['jogador_marca_ultimo_gol_fora'] = this.checkEmpty(mercadosJogador['jogador_marca_ultimo_gol_fora']);
            //     }
            // });

            return quotes;
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