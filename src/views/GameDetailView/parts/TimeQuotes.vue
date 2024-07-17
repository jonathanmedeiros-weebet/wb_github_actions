<template>
    <div class="time-quotes">
        <span v-if="!hasQuotes" class="time-quotes__message">Nenhuma cotação disponível no momento</span>
        
        <Collapse
            v-else
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
    computed: {
        hasQuotes() {
            return Boolean(this.quotes.length)
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
