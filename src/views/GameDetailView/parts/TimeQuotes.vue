<template>
    <div class="time-quotes">
        <span v-if="!hasQuotes" class="time-quotes__message">Nenhuma cotação disponível no momento</span>
        <template v-if="hasQuotes">
            <Collapse
                :iconColor="'var(--game-foreground)'"
                :initCollapsed="true"
                v-for="(option, groupIndex) in options"
                :key="groupIndex"
            > 
                <template #title>{{ option.name }}</template>
                <div class="collapse__options" :class="{'collapse__options--grid': option.odds.length > 3}">
                    <button
                        class="collapse__option"
                        v-for="(odd, oddIndex) in option.odds"
                        :key="`${oddIndex}-${groupIndex}`"
                        :class="{
                            'collapse__option--selected': odd.key === quoteSelected,
                            'collapse__option--live': isDecreasedOdd(odd) || isIncreasedOdd(odd),
                        }"
                        @click="handleItemClick(odd, option.name)"
                    >
                        <template v-if="odd.hasPermission">
                            <IconArrowFillUp
                                class="collapse__icon-option"
                                v-if="isIncreasedOdd(odd)"
                                :size="14"
                                color="var(--success)"
                            />
                            <span class="collapse__label">{{ odd.label }}</span>
                            <span class="collapse__value">{{ odd.finalValue }}</span>
                            <IconArrowFillDown
                                class="collapse__icon-option"
                                v-if="isDecreasedOdd(odd)"
                                :size="14"
                                color="var(--warning)"
                            />
                        </template>
                        <template v-else>
                            <span class="collapse__label">{{ odd.label }}</span>
                            <IconLock :size="14" color="var(--league-foreground)"/>
                        </template>
                    </button>
                </div>
            </Collapse>
        </template>
    </div>
</template>

<script>
import Collapse from '@/components/Collapse.vue';
import IconLock from '@/components/icons/IconLock.vue';
import IconArrowFillUp from '@/components/icons/IconArrowFillUp.vue';
import IconArrowFillDown from '@/components/icons/IconArrowFillDown.vue';
import { QuotaStatus } from '@/enums';
import { useTicketStore } from '@/stores';

export default {
    name: 'time-quotes',
    components: { Collapse, IconLock, IconArrowFillUp, IconArrowFillDown },
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
        handleItemClick(odd, groupName) {
            event.stopPropagation();
            if(!odd.hasPermission) return;

            const gameExist = Boolean(this.ticketStore.items[this.game._id]);
            const quoteExist = this.ticketStore.items[this.game._id]?.quoteKey == odd.key;

            if(gameExist && quoteExist) {
                this.ticketStore.removeQuote(this.game._id);
            } else {
                this.ticketStore.addQuote({
                    gameId: this.game._id,
                    gameName: this.game.nome,
                    gameDate: this.game.horario,
                    eventId: this.game.event_id,
                    live: this.game.ao_vivo,
                    quoteKey: odd.key,
                    quoteValue: Number(odd.value),
                    finalQuoteValue: Number(odd.finalValue),
                    quoteName: odd.label,
                    quoteGroupName: groupName,
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
.time-quotes {
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
        color: rgba(255, 255, 255, .5);
        color: rgba(var(--foreground-rgb), .5);
    }
}

.collapse {
    background: #0a0a0a;
    background: var(--league);

    &__title {
        color: red;
    }
    &__options {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 10px;
        padding: 13px 16px;
        background: #181818;
        background: var(--game);

        &--grid {
            display: flex;
            flex-wrap: wrap;
        }
    }

    &__option {
        height: 54px;
        width: 100%;
        background: #0a0a0a;
        background-color: var(--button);
        border: none;
        border-radius: 4px;

        flex: 1 0 100px; /* Cada item ocupa pelo menos 100px */

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 7px;
        margin-left: 10px;
        margin-top: 10px;

        &--live {
            gap: 0;
        }

        &--selected {
            background: #35cd96;
            background: var(--highlight);
        }
    }

    &__option:nth-child(1),
    &__option:nth-child(4),
    &__option:nth-child(7),
    &__option:nth-child(10),
    &__option:nth-child(13),
    &__option:nth-child(16),
    &__option:nth-child(19),
    &__option:nth-child(22),
    &__option:nth-child(25),
    &__option:nth-child(28),
    &__option:nth-child(31),
    &__option:nth-child(34),
    &__option:nth-child(37),
    &__option:nth-child(40),
    &__option:nth-child(43),
    &__option:nth-child(46),
    &__option:nth-child(49),
    &__option:nth-child(52),
    &__option:nth-child(55),
    &__option:nth-child(58)
    {
        margin-left: 0;
    }

    &__option:nth-child(1),
    &__option:nth-child(2),
    &__option:nth-child(3) {
        margin-top: 0;
    }

    &__option--selected &__label,
    &__option--selected &__value {
        color: #0a0a0a;
        color: var(--highlight-foreground);
    }

    &__icon-option {
        animation: blink 1s linear infinite;
    }

    &__label {
        overflow: hidden;
        color: rgba(255, 255, 255, .5);
        color: rgba(var(--button-foreground-rgb), .5);
        
        text-overflow: ellipsis;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    &__value {
        color: #ffffff;
        color: var(--button-foreground);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
}

::v-deep .collapse__item {
    background: #0a0a0a;
    background: var(--league);
    padding: 13px 24px;
}
::v-deep .collapse__title {
    color: #ffffff;
    color: var(--league-foreground);
}
</style>
