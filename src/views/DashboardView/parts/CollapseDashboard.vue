<template>
  <div class="collapse" @click="handleClick">
    <div class="collapse__item">
        <span class="collapse__title"><slot name="title"/></span>
        <component class="collapse__icon" :is="iconArrowDinamic"/>
    </div>
    <slot v-if="collapsed" />
  </div>
</template>

<script>
import IconArrowDown from '@/components/icons/IconArrowDown.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'

export default {
    name: 'collapse-dashboard',
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
            this.$emit('click', this.value);
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
        padding: 8px 14px;
        background: #181818;
        background: var(--input);
        border-radius: 6px;
        color: rgba(255, 255, 255, .5);
        color: rgba(var(--input-foreground-rgb), .5);
    }

    &__title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 400;
        color: rgba(255, 255, 255, .5);
        color: rgba(var(--input-foreground-rgb), .5);
    }

    &__title img {
        max-width: 16px;
        max-height: 16px;
    }

    &__icon {
        fill: rgba(255, 255, 255, .5);
        fill: rgba(var(--input-foreground-rgb), .5);
    }
}
</style>