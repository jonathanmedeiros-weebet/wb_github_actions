<template>
  <div class="collapse" @click="handleClick">
    <div class="collapse__item">
        <span class="collapse__title"><slot name="title"/></span>
        <component fill="rgba(255, 255, 255, 0.5)" :is="iconArrowDinamic"/>
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
        background: var(--inputs-odds);
        border-radius: 6px;
        color: #ffffff80;
        color: var(--color-text-input);
    }

    &__title {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        color: #ffffff;
        color: var(--color-text);
        font-size: 14px;
        font-weight: 400;
        color: #ffffff80;
        color: var(--color-text-input);
    }

    &__title img {
        max-width: 16px;
        max-height: 16px;
        
    }

    &__icon {
        color: #ffffff80;
        color: var(--color-text-input);
    }
}
</style>