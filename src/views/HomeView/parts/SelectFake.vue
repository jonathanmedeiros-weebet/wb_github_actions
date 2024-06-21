<template>
    <div class="select-fake" @click.once="handleClick">
        <span
            class="select-fake__title"
            :class="`select-fake__title--${titleSize}`"
        >
            <slot/>
        </span>
        <IconArrowDown />
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
    gap: 10px;

    &__title {
        display: flex;
        align-items: center;
        gap: 8px;

        font-weight: 400;
        line-height: 23.44px;
        color: var(--color-text);

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