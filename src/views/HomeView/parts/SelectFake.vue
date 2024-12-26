<template>
    <div class="select-fake" @click="handleClick">
        <span
            class="select-fake__title"
            :class="`select-fake__title--${titleSize}`"
        >
            <slot/>
        </span>
        <IconArrowDown :color="iconColor" />
    </div>
</template>

<script>
import IconArrowDown from '../../../components/icons/IconArrowDown.vue';

export default {
    components: {IconArrowDown},
    name: 'w-select-fake',
    props: {
        titleSize: {
            type: String,
            default: 'large'
        },
        iconColor: {
            type: String,
            default: 'var(--foreground-header)'
        }
    },
    methods: {
        handleClick() {
            this.$emit('click');
        },
    }
}
</script>

<style lang="scss" scoped>
.select-fake {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #0a0a09;
    background-color: var(--header);

    &__title {
        display: flex;
        align-items: center;
        margin-right: 10px;
        font-weight: 400;
        line-height: 23.44px;
        
        color: #ffffff;
        color: var(--foreground-header);

        &--large {
            font-size: 20px;
        }
        &--medium {
            font-size: 16px;
        }
        &--small {
            font-size: 12px;
        }
    }
}
</style>