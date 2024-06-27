<template>
    <button
        :id="id"
        :value="value"
        type="button"
        class="button"
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
    }
}
</script>

<style lang="scss" scoped>
.button {
    
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    padding: 10px 17px 10px 17px;
    gap: 10px;
    border-radius: 37px;
    border: none;
    font-size: 16px;
    font-weight: 400;
    line-height: 14px;
    color: var(--color-background);
    background: var(--color-primary);
    
    &--primary {
        color: var(--color-background);
        background: var(--color-primary);
    }

    &--secondary {
        color: var(--color-text);
        background: var(--color-background-input);
    }
}
</style>