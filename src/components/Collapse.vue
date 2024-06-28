<template>
  <div class="collapse" @click="handleClick">
    <div class="collapse__item">
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
            console.log('clicou');
            this.collapsed = !this.collapsed;
        }
    }
}
</script>

<style lang="scss" scoped>
.collapse {
    width: 100%;
    background: transparent;

    &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        height: 40px;
        padding: 8px 16px 8px 16px;
        background: var(--color-background-input);
    }

    &__title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;

        color: var(--color-text);
        font-size: 14px;
        font-weight: 400;
    }

    &__title img {
        max-width: 16px;
        max-height: 16px;
    }
}
</style>