<template>
    <div class="game" @click="handleGameDetailClick">
        <div class="game__teams">
            <span
                class="game__team"
                v-for="(team, index) in teams"
                :key="index"
            >
                <img :src="team.image" @error="changeSrcWhenImageError" />
                {{ team.name }}
            </span>
            <span class="game__info">
                {{ dateTime }}
                <span class="game__pontuation">+{{ pontuation }}</span>
            </span>
        </div>
        <div class="game__quotes">
            <div
                class="game__quota"
                v-for="(quote, index) in quotes"
                :key="index"
            >
                {{ quote.valor }}
            </div>
        </div>
    </div>
</template>

<script>
import { convertInMomentInstance } from '@/utilities';
export default {
    name: 'game-item',
    props: {
        game: {
            type: Object,
            required: true
        },
    },
    computed: {
        teams() {
            return [
                {
                    image: `https://cdn.wee.bet/img/times/m/${this.game.time_a_img ?? 'default'}.png`,
                    name: this.game.time_a_nome,
                },
                {
                    image: `https://cdn.wee.bet/img/times/m/${this.game.time_b_img ?? 'default'}.png`,
                    name: this.game.time_b_nome,
                }
            ]
        },
        pontuation() {
            return this.game.total_cotacoes;
        },
        dateTime() {
            return convertInMomentInstance(this.game.horario).format('DD/MM hh:mm');
        },
        quotes() {
            return this.game.cotacoes.map(quote => ({
                ...quote,
                valor: quote.valor.toFixed(2)
            }));
        }
    },
    methods: {
        handleGameDetailClick() {
            this.$router.push({
                name: 'game-detail',
                params: {
                    id: this.game._id
                }
            });

            event.stopPropagation();
        },
        changeSrcWhenImageError (event) {
            event.target.src = 'https://cdn.wee.bet/img/times/m/default.png';
        }
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
        padding: 0 5px;

        height: 15px;
        width: auto;
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
</style>v