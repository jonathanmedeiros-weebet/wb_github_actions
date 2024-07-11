<template>
    <div class="game-list">
        <Collapse
            class="game-list__collapse"
            :initCollapsed="true"
            v-for="(championship, index) in championshipList"
            :key="index"
        >
            <template #title>
                <img
                    v-if="championship.image"
                    :src="championship.image"
                    @error="changeSrcWhenImageError"
                />
                <component v-if="championship.icon" :is="championship.icon" color="var(--color-primary)" />
                {{ championship.nome }}
            </template>

            <div class="game-list__items"> 
                <div class="game-list__item-empty">
                    <div class="game-list__columns">
                    <span class="game-list__column">1</span>
                    <span class="game-list__column">x</span>
                    <span class="game-list__column">2</span>
                    </div>
                </div>
                <GameItem
                    v-for="(game, index) in championship.jogos"
                    :key="index"
                    :game="game"
                    @click="handleClick(game)"
                />
            </div>
        </Collapse>
    </div>
</template>

<script>
import Collapse from '@/components/Collapse.vue';
import GameItem from './GameItem.vue';
import { useHomeStore } from '@/stores';
import IconGlobal from '@/components/icons/IconGlobal.vue';
export default {
  components: { Collapse, GameItem, IconGlobal },
    name: 'game-list',
    data() {
        return {
            homeStore: useHomeStore()
        }
    },
    computed: {
        championshipList() {
            return this.homeStore.championshipList.map((championship) => {
                if(championship.regiao_sigla !== 'ww') {
                    championship.image = `https://cdn.wee.bet/flags/1x1/${championship.regiao_sigla}.svg`;
                } else {
                    championship.icon = IconGlobal;
                }
                
                return championship;
            });
        }
    },
    methods: {
        handleClick(game) {
            this.$emit('click', game);
        },
        changeSrcWhenImageError (event) {
            event.target.src = 'https://cdn.wee.bet/img/times/m/default.png';
        }
    }
}
</script>

<style lang="scss" scoped>
.game-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1px;

    &__items {
        margin-top: 1px;
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    &__item-empty {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 16px;
    }

    &__columns {
        width: 190px;
        display: flex;
        gap: 8px;
    }

    &__column {
        width: 58px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF80;
    }

    &__collapse img {
        border-radius: 50px;
        width: 16px;
        height: 16px;
    }
}
</style>