<template>
    <div class="game-list">
        <Collapse
            class="game-list__collapse"
            :initCollapsed="true"
            v-for="({title, image, games}, index) in data"
            :key="index"
        >
            <template #title>
                <img :src="image" />
                {{ title }}
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
                    v-for="(game, index) in games"
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
export default {
  components: { Collapse, GameItem },
    name: 'game-list',
    props: {
        data: {
            type: Array,
            required: true
        },
    },
    methods: {
        handleClick(game) {
            this.$emit('click', game);
        },
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
        width: 16px;
        height: 16px;
    }
}
</style>