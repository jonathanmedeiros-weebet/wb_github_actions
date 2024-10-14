<template>
    <div class="player-quotes">
        <span v-if="!hasQuotes" class="player-quotes__message">Nenhuma cotação disponível no momento</span>

        <Collapse
            v-else
            :initCollapsed="true"
            v-for="(option, index) in options"
            :key="index"
        > 
            <template #title>{{ option.title }}</template>

            <div class="collapse__items">
                <div
                    class="collapse__item"
                    v-for="(player, playerIndex) in option.players"
                    :key="`${playerIndex}-${index}`"
                >
                    <span class="collapse__label">{{ player.name }}</span>
                    <div
                        class="collapse__options"
                        :class="{
                            'collapse__options--three-column': player.odds.length == 3,
                            'collapse__options--two-column': player.odds.length == 2,
                        }"
                    >
                        <button
                            class="collapse__option"
                            v-for="odd in player.odds"
                            :key="odd.id"
                            :class="{
                                'collapse__option--selected': odd.key === quoteSelected,
                                'collapse__option--live': isDecreasedOdd(odd) || isIncreasedOdd(odd)
                            }"
                            @click="handleItemClick(odd, player.name)"
                        >
                            <template v-if="odd.hasPermission">
                                <IconArrowFillUp
                                    class="collapse__icon-option"
                                    v-if="isIncreasedOdd(odd)"
                                    :size="14"
                                    color="var(--color-success)"
                                />
                                <span class="collapse__value">{{ odd.finalValue }}</span>
                                <IconArrowFillDown
                                    class="collapse__icon-option"
                                    v-if="isDecreasedOdd(odd)"
                                    :size="14"
                                    color="var(--color-danger)"
                                />
                            </template>
                        
                            <IconLock v-else :size="14" color="var(--foreground-league-input)"/>
                        </button>
                    </div>
                </div>
            </div>
        </Collapse>
    </div>
</template>

<script>
import Collapse from '@/components/Collapse.vue';
import IconLock from '@/components/icons/IconLock.vue';
import { QuotaStatus } from '@/enums';
import IconArrowFillDown from '@/components/icons/IconArrowFillDown.vue';
import IconArrowFillUp from '@/components/icons/IconArrowFillUp.vue';
import { useTicketStore } from '@/stores';

export default {
    name: 'player-quotes',
    components: { Collapse, IconLock, IconArrowFillDown, IconArrowFillUp },
    props: {
        quotes: {
            type: Array,
            default: () => []
        },
        game: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            ticketStore: useTicketStore()
        }
    },
    computed: {
        hasQuotes() {
            return Boolean(this.quotes.length)
        },
        options() {
            return this.quotes;
        },
        quoteSelected() {
            return this.ticketStore.items[this.game._id]?.quoteKey ?? null;
        }
    },
    methods: {
        handleItemClick(odd, playerName) {
            event.stopPropagation();
            if(!odd.hasPermission) return;

            const { items, addQuote, removeQuote } = useTicketStore();
            const gameExist = Boolean(items[this.game._id]);
            const quoteExist = items[this.game._id]?.quoteKey == odd.key;

            if(gameExist && quoteExist) {
                removeQuote(this.game._id);
            } else {
                addQuote({
                    gameId: this.game._id,
                    gameName: this.game.nome,
                    gameDate: this.game.horario,
                    eventId: this.game.event_id,
                    live: this.game.ao_vivo,
                    quoteKey: odd.key,
                    quoteValue: odd.value,
                    quoteName: playerName,
                    quoteGroupName: odd.label,
                    favorite: this.game.favorito,
                    modalityId: this.game.sport_id,
                    championshipId: this.game?.campeonato?._id
                })
            }
        },
        isIncreasedOdd(odd) {
            return Boolean(odd.status) && odd.status === QuotaStatus.INCREASED;
        },
        isDecreasedOdd(odd) {
            return Boolean(odd.status) && odd.status === QuotaStatus.DECREASED;
        }
    }
}
</script>

<style lang="scss" scoped>
.player-quotes {
    position: relative;
    z-index: 1;
    height: calc(100vh - 100px);
    background: #0a0a0a;
    background: var(--background);

    &__message {
        display: flex;
        width: 100%;
        padding: 8px 16px;
        font-size: 12px;
        color: #ffffff80;
        color: var(--foreground-league-input);
    }
}

.collapse {
    &__options {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 5px;

        padding: 5px;
        background: #ffffff80;
        background: var(--inputs-odds);

        &--three-column {
            width: 200px;
        }
        &--two-column {
            width: 150px;
        }
    }

    &__options--three-column &__option {
        min-width: calc(180px / 3);
    }
    &__options--two-column &__option {
        min-width: calc(130px / 2);
    }

    &__option {
        min-width: calc(150px / 3);
        background: #0a0a0a;
        background: var(--background);
        border: none;
        border-radius: 4px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &--live {
            gap: 0;
        }

        &--selected {
            background: #0be58e;
            background: var(--highlight);
        }
    }

    &__option--selected &__label,
    &__option--selected &__value {
        color: #000;
    }

    &__icon-option {
        animation: blink 1s linear infinite;
    }

    &__label {
        overflow: hidden;
        color: #f2f2f280;
        text-overflow: ellipsis;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        max-width: 100px;
        margin-bottom: 7px;
    }

    &__value {
        color: #ffffff;
        color: var(--foreground-league);
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    &__item {
        display: flex;
        gap: 5px;
        
    }
}

::v-deep .collapse__item {
    background: var(--game);
    padding: 13px 24px;
}
</style>
