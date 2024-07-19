<template>
    <div class="game">
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
                <template v-if="isLive">
                    <span class="game__live">Ao vivo</span>
                    <span class="game__time">{{ liveTime }}</span>
                </template>

                <span v-else>{{ dateTime }}</span>
                <span class="game__pontuation">+{{ pontuation }}</span>
            </span>
        </div>
        <div class="game__quotes">
            <div
                class="game__quota"
                v-for="(quote, index) in quotes"
                :class="{'game__quota--disabled': !quote.hasPermission,}"
                :key="index"
                @click="handleItemClick(quote)"
            >
                <span class="game__value-quota" v-if="quote.hasPermission">
                    <IconArrowFillUp
                        class="game__icon-quota"
                        :size="14"
                        :color="isIncreasedQuote(quote) ? 'var(--color-success)' : 'transparent'"
                    />
                    {{ quote.finalValue }}
                    <IconArrowFillDown
                        class="game__icon-quota"
                        :size="14"
                        :color="isDecreasedQuote(quote) ? 'var(--color-danger)' : 'transparent'"
                    />
                </span>
                <IconLock
                    v-else
                    :size="14"
                    color="var(--color-text-input)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { convertInMomentInstance } from '@/utilities';
import IconLock from '@/components/icons/IconLock.vue';
import IconArrowFillUp from '@/components/icons/IconArrowFillUp.vue';
import { QuotaStatus } from '@/enums';
import IconArrowFillDown from '@/components/icons/IconArrowFillDown.vue';

export default {
  components: { IconLock, IconArrowFillUp, IconArrowFillDown },
    name: 'game-item',
    props: {
        game: {
            type: Object,
            required: true
        },
    },
    computed: {
        isLive() {
            return Boolean(this.game.ao_vivo);
        },
        liveTime() {
            return Boolean(this.game.info.tempo == 0)
                ? 'intervalo'
                : `${this.game.info.minutos}'`
        },
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
            return convertInMomentInstance(this.game.horario).format('DD/MM HH:mm');
        },
        quotes() {
            return (this.game.cotacoes ?? []).map(quote => ({
                ...quote,
                valor: quote.valor.toFixed(2)
            }));
        },
    },
    methods: {
        changeSrcWhenImageError (event) {
            event.target.src = 'https://cdn.wee.bet/img/times/m/default.png';
        },
        handleItemClick(odd) {
            event.stopPropagation();
            if(!odd.hasPermission) return;
            void odd;
        },
        isIncreasedQuote(quote) {
            return Boolean(quote.status) && quote.status === QuotaStatus.INCREASED;
        },
        isDecreasedQuote(quote) {
            return Boolean(quote.status) && quote.status === QuotaStatus.DECREASED;
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
        min-width: 190px;
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

    &__value-quota {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    &__icon-quota {
        animation: blink 1s linear infinite;
    }

    &__live {
        color: var(--color-danger);
        font-size: 12px;
        font-style: normal;
        font-weight: 300;
        line-height: normal;
    }

    &__time {
        color: var(--color-text-input);
        font-size: 12px;
        font-style: normal;
        font-weight: 300;
        line-height: normal;
    }
}

</style>