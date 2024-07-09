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
                            <img class="team__image" :src="teamA.image">
                        </div>
                        <span class="team__versus">X</span>
                        <div class="team">
                            <img class="team__image" :src="teamB.image">
                        </div>
                    </div>

                </Header>

                <div class="game-detail-header__teams" v-if="isHeaderNormal">
                    <div class="team">
                        <img class="team__image" :src="teamA.image">
                        <span class="team__name">{{ teamA.name }}</span>
                    </div>
                    <span class="team__versus">X</span>
                    <div class="team">
                        <img class="team__image" :src="teamB.image">
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
            return convertInMomentInstance(this.game.horario).format('DD/MM hh:mm');
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
    },
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
        width: 100%;
        background: var(--color-background);
    }

    &__container {
        z-index: 2;

        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }

    ::v-deep .header {
        background: transparent;
        border: none;
    }

    &__title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        margin-left: -20px;

        color: #FFFFFF80
    }

    &__teams {
        display: flex;
        justify-content: center;
        gap: 50px;
        align-items: flex-start;

        &--slim {
            gap: 18px;
            align-items: center;
        }
    }

    &__teams--slim .team,
    &__teams--slim .team__image {
        height: 30px;
        width: 30px;
    }

    &__teams--slim .team__versus {
        margin-top: 0;
    }
} 

.team {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100px;
    &__image {
        width: 50px;
        height: 50px;
    }

    &__name {
        color: var(--color-text);
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
        color: var(--color-text);
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
    background: rgba(255, 255, 255, 0.02);
    
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