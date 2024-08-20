<template>
    <div class="select-fake" @click="handleClick">
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

    background-color: #181818;
    background-color: var(--color-background-input);
    padding: 18px 16px;

    &__title {
        display: flex;
        align-items: center;
        margin-right: 10px;
        font-weight: 400;
        line-height: 23.44px;
        color: #ffffff80;
        color: var(--color-text-input);

        &--large {
            font-size: 20px;
        }
        &--medium {
            font-size: 14px;
        }
        &--small {
            font-size: 12px;
        }
    }
}
</style>