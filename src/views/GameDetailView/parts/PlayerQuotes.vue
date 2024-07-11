<template>
    <div class="player-quotes">
        <Collapse
            :initCollapsed="true"
            v-for="(option, index) in quotes"
            :key="index"
        > 
            <template #title>{{ option.name }}</template>

            <div class="collapse__items">
                <div
                    class="collapse__item"
                    v-for="(odd, oddIndex) in option.odds"
                    :key="`${oddIndex}-${index}`"
                >
                    <span class="collapse__title">{{ odd.label }}</span>
                    <div class="collapse__options">
                        <button
                            class="collapse__option"
                            :class="{'collapse__option--selected': false}"
                            @click="handleItemClick(odd)"
                        >
                            <span class="collapse__value">{{ odd.value }}</span>
                        </button>
                        <button
                            class="collapse__option"
                            :class="{'collapse__option--selected': false}"
                            @click="handleItemClick(odd)"
                        >
                            <span class="collapse__value">{{ odd.value }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Collapse>
    </div>
</template>

<script>
import Collapse from '@/components/Collapse.vue';

export default {
    name: 'player-quotes',
    components: { Collapse },
    props: {
        quotes: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handleItemClick(odd) {
            void odd;
            event.stopPropagation();
        },
    }
}
</script>

<style lang="scss" scoped>
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
