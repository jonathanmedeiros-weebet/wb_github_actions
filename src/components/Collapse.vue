<template>
    <div class="collapse">
        <div class="collapse__item" @click="handleClick">
            <span class="collapse__title"><slot name="title"/></span>
            <component :is="iconArrowDinamic"/>
        </div>
        <slot v-if="collapsed" />
    </div>
</template>

<script>
import IconArrowDown from './icons/IconArrowDown.vue'
import IconArrowUp from './icons/IconArrowUp.vue'

export default {
    name: 'collapse',
    components: { IconArrowDown, IconArrowUp },
    props: {
        initCollapsed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            collapsed: this.initCollapsed
        }
    },
    computed: {
        iconArrowDinamic() {
            return this.collapsed ? IconArrowUp : IconArrowDown;
        }
    },
    methods: {
        handleClick() {
            this.collapsed = !this.collapsed;
        }
    },
    watch: {
        initCollapsed(newVal) {
            this.collapsed = newVal;
        }
    }
}
</script>

<style lang="scss" scoped>
.collapse {
    width: 100%;
    background: transparent;
    min-height: 40px;

    &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 8px 16px;
        background: #181818;
        background: var(--league);
        color: #ffffff;
        color: var(--foreground-league);
    }

    &__title {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        color: #ffffff;
        color: var(--color-text);
        font-size: 14px;
        font-weight: 400;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: calc(100vw - 60px);
    }

    &__title img {
        max-width: 16px;
        max-height: 16px;
    }
}
</style>