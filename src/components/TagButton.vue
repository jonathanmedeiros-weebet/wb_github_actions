<template>
    <button
        :id="id"
        :value="value"
        type="button"
        class="button"
        @click="handleClick"
    >
        {{ text }}
    </button>
</template>

<script>
export default {
    name: 'tag-button',
    props: {
        id: {
            type: String,
        },
        text: {
            type: String,
            required: true
        },
        value: {
            type: String,
            default: 'button'
        }
    },
    methods: {
        handleClick(){
            this.$emit('click', this.value);
        }
    }
}
</script>

<style lang="scss" scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    padding: 10px 17px;
    border-radius: 37px;
    border: none;
    font-size: 16px;
    font-weight: 400;
    line-height: 14px;
    color: #181818;
    color: var(--background);
    background: #35cd96;
    background: var(--highlight);

    &--primary {
        color: #181818;
        color: var(--background);
        background: #35cd96;
        background: var(--highlight);
    }

    &--secondary {
        color: #ffffff;
        color: var(--input-foreground);
        background: #181818;
        background: var(--input);
    }
}
</style>