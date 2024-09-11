<template>
    <div class="card">
        <div class="card__container">
            <div class="card__title">
                <slot name="title"></slot>
                <div class="card__subtitle">
                    <slot name="subtitle"></slot>
                </div>
            </div>
            <div class="card__body">
                <slot name="body"></slot>
            </div>
            <div class="card__footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'card-bets',
}
</script>

<style lang="scss" scoped>

.card {

    background-color: #181818;
    background-color: var(--inputs-odds);
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    border-radius: 8px;

    &__container {
        padding: 24px 16px;
    }

    &__title {
        text-align: left;
    }

    &__subtitle {
        color: #ffffff80;
        color: var(--color-text-input);
        margin-bottom: 10px;
    }

    &__footer {
        padding-top: 10px;
    }
}
</style>