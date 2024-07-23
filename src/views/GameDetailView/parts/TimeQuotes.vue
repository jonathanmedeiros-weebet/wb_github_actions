<template>
    <div class="time-quotes">
        <span v-if="!hasQuotes" class="time-quotes__message">Nenhuma cotação disponível no momento</span>
        
        <Collapse
            v-else
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
                        'collapse__option--selected': odd.selected,
                        'collapse__option--live': isDecreasedOdd(odd) || isIncreasedOdd(odd),
                    }"
                    @click="handleItemClick(odd, option.name)"
                >
                    <template v-if="odd.hasPermission">
                        <IconArrowFillUp
                            class="collapse__icon-option"
                            v-if="isIncreasedOdd(odd)"
                            :size="14"
                            color="var(--color-success)"
                        />
                        <span class="collapse__label">{{ odd.label }}</span>
                        <span class="collapse__value">{{ odd.finalValue }}</span>
                        <IconArrowFillDown
                            class="collapse__icon-option"
                            v-if="isDecreasedOdd(odd)"
                            :size="14"
                            color="var(--color-danger)"
                        />
                    </template>
                    <template v-else>
                        <span class="collapse__label">{{ odd.label }}</span>
                        <IconLock :size="14" color="var(--color-text-input)"/>
                    </template>
                </button>
            </div>
        </Collapse>
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
            const quoteKey = this.ticketStore.items[this.game._id]
                ? this.ticketStore.items[this.game._id].quoteKey
                : null;

            return this.quotes.map(quote => ({
                ...quote,
                odds: quote.odds.map(odd => ({
                    ...odd,
                    selected: odd.key == quoteKey
                }))
            }))
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
                    eventId: this.game.event_id,
                    live: this.game.ao_vivo,
                    quoteKey: odd.key,
                    quoteValue: odd.value,
                    quoteName: odd.label,
                    quoteGroup: groupName
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
    background: var(--color-background);
    &__message {
        display: flex;
        width: 100%;
        padding: 8px 16px;
        font-size: 12px;
        color: var(--color-text-input);
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

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 7px;

        &--live {
            gap: 0;
        }

        &--selected {
            background: var(--color-primary);
        }
    }

    &__option--selected &__label,
    &__option--selected &__value {
        color: var(--color-background);
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
