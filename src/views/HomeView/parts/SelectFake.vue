<template>
    <div class="select-fake" @click="handleClick">
        <span class="select-fake__title">{{ text }}</span>
        <IconArrowDown />
    </div>
    
</template>

<script>
import IconArrowDown from '../../../components/icons/IconArrowDown.vue';

export default {
    components: {IconArrowDown},
    name: 'w-select-fake',
    props: {
        text: {
            type: String,
            default: ''
        },
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
    gap: 10px;
    align-items: center;
    justify-content: flex-start;

    &__title {
        font-size: 20px;
        font-weight: 400;
        line-height: 23.44px;
        color: var(--color-text);
    }
}
</style>