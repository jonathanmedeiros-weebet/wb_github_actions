<template>
    <div class="player-quotes">
        <Collapse
            :initCollapsed="true"
            v-for="(option, index) in quotes"
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
                            :class="{'collapse__option--selected': false}"
                            @click="handleItemClick(odd)"
                        >
                            <span class="collapse__value" v-if="odd.hasPermission">{{ odd.finalValue }}</span>
                            <IconLock v-else :size="14" color="var(--color-text-input)"/>
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

export default {
    name: 'player-quotes',
    components: { Collapse, IconLock },
    props: {
        quotes: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handleItemClick(odd) {
            event.stopPropagation();
            if(!odd.hasPermission) return;
            void odd;
        },
    }
}
</script>

<style lang="scss" scoped>
.collapse {
    &__options {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 5px;

        padding: 5px;
        background: var(--color-background-input);

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
        background: var(--color-background);
        border: none;
        border-radius: 4px;

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
    background: var(--color-background);
    padding: 13px 24px;
}
</style>
