<template>
    <div class="time-quotes">
        <Collapse
            :initCollapsed="true"
            v-for="(option, index) in quotes"
            :key="index"
        > 
            <template #title>{{ option.name }}</template>
            <div class="collapse__options" :class="{'collapse__options--grid': option.odds.length > 3}">
                <button
                    class="collapse__option"
                    v-for="(odd, oddIndex) in option.odds"
                    :key="`${oddIndex}-${index}`"
                    :class="{'collapse__option--selected': false}"
                    @click="handleItemClick(odd)"
                >
                    <span class="collapse__label">{{ odd.label }}</span>
                    <span class="collapse__value" v-if="odd.hasPermission">{{ odd.finalValue }}</span>
                    <IconLock v-else :size="14" color="var(--color-text-input)"/>
                </button>
            </div>
        </Collapse>
    </div>
</template>

<script>
import Collapse from '@/components/Collapse.vue';
import IconLock from '@/components/icons/IconLock.vue';

export default {
    name: 'time-quotes',
    components: { Collapse, IconLock },
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
