<template>
    <div class="game" @click="handleClick">
        <div class="game__teams">
            <span
                class="game__team"
                v-for="(team, index) in game.teams"
                :key="index"
            >
                <img :src="team.image">
                {{ team.name }}
            </span>
            <span class="game__info">
                {{ game.dateTime }}
                <span class="game__pontuation">{{ game.pontuation }}</span>
            </span>
        </div>
        <div class="game__quotes">
            <div class="game__quota">{{ game.quotes.host }}</div>
            <div class="game__quota">{{ game.quotes.draw }}</div>
            <div class="game__quota">{{ game.quotes.visitor }}</div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'game-item',
    props: {
        game: {
            type: Object,
            required: true
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
.game {
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 16px;
    background: var(--color-background-input);

    &__teams {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    &__team {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--color-text);
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: calc(100vw - 240px);
    }

    &__team img {
        width: 16px;
        height: 16px;
    }

    &__info {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        color: #666666;
    }

    &__pontuation {
        font-size: 10px;
        line-height: 10px;
        font-weight: 400;
        color: var(--color-primary);

        border: 0.5px solid var(--color-primary);
        border-radius: 2px;

        height: 15px;
        width: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__quotes {
        display: flex;
        justify-content: space-between;
        gap: 8px;
    }

    &__quota {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        height: 54px;
        border-radius: 4px;
        background: var(--color-background);
    }
}
</style>