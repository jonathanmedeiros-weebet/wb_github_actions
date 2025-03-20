<template>
    <div class="game">
        <div class="game__teams">
            <span
                v-for="(team, index) in teams"
                class="game__team"
                :class="{'game__team--first': index == 0}"
                :key="index"
            >
                <img v-lazy="team.image" @error="changeSrcWhenImageError" />
                {{ team.name }}
            </span>
            
            <span class="game__info">
                <template v-if="isLive">
                    <span class="game__live">Ao vivo</span>
                    <span class="game__time">{{ liveTime }}</span>
                </template>

                <span v-else>{{ dateTime }}</span>
                <span class="game__pontuation">+{{ pontuation }}</span>
            </span>
        </div>
        <div class="game__score" v-if="isLive">
            <span class="game__score-number"><strong>{{ teamScoreA }}</strong></span>
            <span class="game__score-number"><strong>{{ teamScoreB }}</strong></span>
        </div>
        <div class="game__quotes">
            <div
                class="game__quota"
                v-for="(quote, index) in quotes"
                :class="{'game__quota--selected': quote.chave == quoteSelected}"
                :key="index"
                @click="handleItemClick(quote)"
            >
                <span class="game__value-quota" v-if="quote.hasPermission">
                    <IconArrowFillUp
                        class="game__icon-quota"
                        :size="14"
                        :color="isIncreasedQuote(quote) ? '#6da544' : 'transparent'"
                    />
                    {{ quote.finalValue }}
                    <IconArrowFillDown
                        class="game__icon-quota"
                        :size="14"
                        :color="isDecreasedQuote(quote) ? '#f61a1a' : 'transparent'"
                    />
                </span>
                <IconLock
                    v-else
                    :size="14"
                    color="#ffffff80"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { formatShortDateTimeBR } from '@/utilities';
import IconLock from '@/components/icons/IconLock.vue';
import IconArrowFillUp from '@/components/icons/IconArrowFillUp.vue';
import { QuotaStatus } from '@/enums';
import IconArrowFillDown from '@/components/icons/IconArrowFillDown.vue';
import { useTicketStore } from '@/stores';

export default {
  components: { IconLock, IconArrowFillUp, IconArrowFillDown },
    name: 'game-item',
    props: {
        game: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            ticketStore: useTicketStore()
        }
    },
    computed: {
        isLive() {
            return Boolean(this.game.ao_vivo);
        },
        liveTime() {
            return Boolean(this.game.info.tempo == 0)
                ? 'intervalo'
                : `${this.game.info.minutos}'`
        },
        teams() {
            return [
                {
                    image: `https://wb-assets.com/img/times/m/${this.game.time_a_img ?? 'https://wb-assets.com/img/times/m/default.png'}.png`,
                    name: this.game.time_a_nome,
                },
                {
                    image: `https://wb-assets.com/img/times/m/${this.game.time_b_img ?? 'https://wb-assets.com/img/times/m/default.png'}.png`,
                    name: this.game.time_b_nome,
                }
            ]
        },
        pontuation() {
            return this.game.total_cotacoes;
        },
        dateTime() {
            return formatShortDateTimeBR(this.game.horario);
        },
        quotes() {
            const quotes = this.game.cotacoes ?? [];
            const newQuotes = [];

            const homeQuote = quotes.find(quote => quote.chave.includes('casa'));
            if(Boolean(homeQuote)) newQuotes.push(homeQuote);

            const drawQuote = quotes.find(quote => quote.chave.includes('empate'));
            if(Boolean(drawQuote)) newQuotes.push(drawQuote);

            const outOfHomeQuote = quotes.find(quote => quote.chave.includes('fora'));
            if(Boolean(outOfHomeQuote)) newQuotes.push(outOfHomeQuote);

            return newQuotes;
        },
        teamScoreA() {
            return this.game.info.time_a_resultado ?? 0;
        },
        teamScoreB() {
            return this.game.info.time_b_resultado ?? 0;
        },
        quoteSelected() {
            return this.ticketStore.items[this.game._id]?.quoteKey ?? null;
        }
    },
    methods: {
        changeSrcWhenImageError (event) {
            event.target.src = 'https://wb-assets.com/img/times/m/default.png';
        },
        handleItemClick(quota) {
            event.stopPropagation();
            if(!quota.hasPermission) return;

            const { items, addQuote, removeQuote } = useTicketStore();
            const gameExist = Boolean(items[this.game._id]);
            const quoteExist = items[this.game._id]?.quoteKey == quota.chave;

            let quoteLabel = quota.chave.includes('casa') ? 'Casa' : null;
            if(!quoteLabel) {
                quoteLabel = quota.chave.includes('fora') ? 'Fora' : 'Empate';
            }

            if(gameExist && quoteExist) {
                removeQuote(this.game._id);
            } else {
                addQuote({
                    gameId: this.game._id,
                    gameName: this.game.nome,
                    gameDate: this.game.horario,
                    eventId: this.game.event_id,
                    live: this.game.ao_vivo,
                    quoteKey: quota.chave,
                    quoteValue: Number(quota.valor),
                    finalQuoteValue: Number(quota.finalValue),
                    quoteName: quoteLabel,
                    quoteGroupName: 'Resultado final',
                    favorite: this.game.favorito,
                    modalityId: this.game.sport_id,
                    championshipId: this.game?.campeonato?._id
                })
            }
        },
        isIncreasedQuote(quote) {
            return Boolean(quote.status) && quote.status === QuotaStatus.INCREASED;
        },
        isDecreasedQuote(quote) {
            return Boolean(quote.status) && quote.status === QuotaStatus.DECREASED;
        },
    }
}
</script>

<style lang="scss" scoped>
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
</style>