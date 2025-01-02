<template>
        <div
            class="game-detail-header"
            :class="{
                'game-detail-header--slim': type === 'slim',
                'game-detail-header--fixed': fixed,
            }"
        >
            <div class="background" :class="{'background--slim': type === 'slim'}">
                <div class="background__image" :style="{'backgroundImage': `url(${teamA.image})`}"></div>
                <div class="background__image" :style="{'backgroundImage': `url(${teamB.image})`}"></div>
            </div>
            
            <div class="game-detail-header__container">
                <Header :showBackButton="true">
                    <span class="game-detail-header__title" v-if="isHeaderNormal">
                        <span> {{ championshipName }} </span>
                        <span> {{ dateTime }} </span>
                    </span>

                    <div class="game-detail-header__teams game-detail-header__teams--slim" v-if="isHeaderSlim">
                        <div class="team">
                            <img class="team__image" :src="teamA.image" @error="changeSrcWhenImageError">
                        </div>
                        <span class="team__versus">
                            <template v-if="isLive">
                                <span class="team__time">{{ liveTime }}</span>
                                <span class="team__score">{{ teamScoreA }} - {{ teamScoreB }}</span>
                            </template>

                            <span v-else>X</span>
                        </span>
                        <div class="team">
                            <img class="team__image" :src="teamB.image" @error="changeSrcWhenImageError">
                        </div>
                    </div>

                </Header>

                <div class="game-detail-header__teams" v-if="isHeaderNormal">
                    <div class="team">
                        <img class="team__image" :src="teamA.image" @error="changeSrcWhenImageError">
                        <span class="team__name">{{ teamA.name }}</span>
                    </div>
                    <span class="team__versus">
                        <template v-if="isLive">
                            <span class="team__time">{{ liveTime }}</span>
                            <span class="team__score">{{ teamScoreA }} - {{ teamScoreB }}</span>
                        </template>
                        <span v-else>X</span>
                    </span>
                    <div class="team">
                        <img class="team__image" :src="teamB.image" @error="changeSrcWhenImageError">
                        <span class="team__name">{{ teamB.name }}</span>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import { convertInMomentInstance } from '@/utilities';

export default {
  components: { Header },
    name: 'game-detail-header',
    props: {
        game: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            default: 'normal'
        },
        fixed: {
            type: Boolean,
            default: false
        }
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
        isHeaderNormal() {
            return this.type === 'normal';
        },
        isHeaderSlim() {
            return this.type === 'slim';
        },
        championshipName() {
            return this.game?.campeonato?.nome ?? ''
        },
        dateTime() {
            const formatDateOrigin = this.isLive ? "ddd, DD MMM YYYY HH:mm:ss [GMT]" : 'YYYY-MM-DD HH:mm:ss';
            return convertInMomentInstance(this.game.horario, formatDateOrigin).format('DD/MM HH:mm');
        },
        teamA() {
            return {
                name: this.game.time_a_nome,
                image: `https://cdn.wee.bet/img/times/m/${this.game.time_a_img ?? 'default'}.png`
            }
        },
        teamB() {
            return {
                name: this.game.time_b_nome,
                image: `https://cdn.wee.bet/img/times/m/${this.game.time_b_img ?? 'default'}.png`
            }
        },
        teamScoreA() {
            return this.game.info.time_a_resultado ?? 0;
        },
        teamScoreB() {
            return this.game.info.time_b_resultado ?? 0;
        }
    },
    methods: {
        changeSrcWhenImageError (event) {
            event.target.src = 'https://cdn.wee.bet/img/times/m/default.png';
        }
    }
}
</script>

<style lang="scss" scoped>
.game-detail-header {
    display: flex;
    min-height: 201px;
    padding-bottom: 26px;
    padding-top: 10px;
    transition: 1s;
    
    &--slim {
        height: 73px;
        min-height: 0;
        padding: 0;
        align-items: center;

        transition: 0.5s;
    }

    &--fixed {
        transition: 0.5s;
        position: fixed;
        z-index: 2;
        width: 100%;
        background: #181818;
        background: var(--background);
    }

    &__container {
        z-index: 2;

        display: flex;
        flex-direction: column;
        width: 100%;
    }

    ::v-deep .header {
        background: transparent;
        border: none;
        margin-bottom: 20px;
    }

    &__title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        margin-left: -20px;

        max-width: 250px;
        text-align: center;
        color: #FFFFFF80;
        color: var(--foreground);
        opacity: 0.8;
    }

    &__teams {
        display: flex;
        justify-content: center;
        align-items: flex-start;

        &--slim {
            gap: 0;
            align-items: center;
        }
    }

    &__teams--slim .team,
    &__teams--slim .team__image {
        height: 30px;
        width: 30px;
        margin-bottom: 0;
    }

    &__teams--slim .team__versus {
        margin-top: 0;
        margin-left: 18px;
        margin-right: 18px;
    }
} 

.team {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;

    &__versus {
        margin-left: 50px;
        margin-right: 50px;
    }

    &__image {
        width: 50px;
        height: 50px;
        margin-bottom: 20px;
    }

    &__name {
        color: #ffffff;
        color: var(--foreground);
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
    }

    &__versus {
        font-size: 20px;
        font-weight: 400;
        margin-top: 16px;
        color: #ffffff;
        color: var(--foreground);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    &__time {
        color: #ffffff80;
        color: var(--foreground);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    &__score {
        color: #ffffff;
        color: var(--foreground);
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
}

.background {
    z-index: 1;
    position: absolute;
  
    width: 100%;
    height: 201px;
    overflow: hidden;
    display: flex;
    filter: blur(40px);
    -webkit-filter: blur(40px);
    background: #ffffff05;
    
    &--slim {
        height: 73px;
        top: 0;
        left: 0;
        clip-path: inset(0);
    }

    &__image {
        width: 50%;
        height: 100%;
        background-size: 600%;
        background-position: center;
    }
}

@keyframes slim {
  from {
    transform: translateX(100px);
  }
  to {
    transform: translateX(0);
  }
}
</style>