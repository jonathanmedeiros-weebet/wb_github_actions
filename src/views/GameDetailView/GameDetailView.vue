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
            <Collapse
                :initCollapsed="true"
                v-for="(option, index) in options"
                :key="index"
            > 
                <template #title>{{ option.name }}</template>

                <div class="collapse__options" :class="{'collapse__options--grid': option.odds.length > 3}">
                    <button
                        class="collapse__option"
                        v-for="(odd, oddIndex) in option.odds"
                        :key="`${oddIndex}-${index}`"
                        :class="{'collapse__option--selected': oddIndex === 0}"
                        @click="handleItemClick(odd)"
                    >
                        <span class="collapse__label">{{ odd.label }}</span>
                        <span class="collapse__value">{{ odd.value }}</span>
                    </button>
                </div>
            </Collapse>
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

export default {
  components: { Header, GameDetailHeader, Collapse, Button },
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

            this.markets[MarketTime.FULL_TIME] = Object.values(markets[MarketTime.FULL_TIME]);
            this.markets[MarketTime.FIRST_TIME] = Object.values(markets[MarketTime.FIRST_TIME]);
            this.markets[MarketTime.SECOND_TIME] = Object.values(markets[MarketTime.SECOND_TIME]);
            this.markets[MarketTime.PLAYERS] = Object.values(markets[MarketTime.PLAYERS]);

            console.log(this.options)
        },
        handleGameFilter(filter) {
            this.filterSelected = filter
        },
        handleItemClick(odd) {
            console.log(odd);
            event.stopPropagation();
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

.collapse {
    &__options {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;

        padding: 13px 16px;

        background: var(--color-background-input);

        &--grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    &__option {
        height: 54px;
        width: 100%;
        background: var(--color-background);
        border: none;
        border-radius: 4px;
        padding: 9px 15px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 7px;

        &--selected {
            background: var(--color-primary);
        }
    }

    &__option--selected &__label,
    &__option--selected &__value {
        color: #000;
    }

    &__label {
        overflow: hidden;
        color: #f2f2f280;
        text-overflow: ellipsis;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    &__value {
        color: var(--color-text);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
}

::v-deep .collapse__item {
    background: var(--color-background);
    padding: 13px 24px;
}

</style>