<template>
  <div class="game-list-skeleton">
    <div class="game-list-skeleton__collapse game-list-skeleton__collapse--primary">
        <SquareSkeleton :height="30" :width="200"/>
        <SquareSkeleton :height="30" :width="30"/>
    </div>
    <div v-for="item in Array(3)" :key="item">
        <div v-if="showFirstCollapse" class="game-list-skeleton__collapse game-list-skeleton__collapse--secondary">
            <SquareSkeleton :height="30" :width="200"/>
            <SquareSkeleton :height="30" :width="30"/>
        </div>

        <div class="game-list-skeleton__scoreboard">
            <SquareSkeleton :height="10" :width="10"/>
            <SquareSkeleton :height="10" :width="10"/>
            <SquareSkeleton :height="10" :width="10"/>
        </div>
        <div class="game-list-skeleton__game-list">
            <div class="game-list-skeleton__game-item" v-for="item of Array(3)" :key="item">
                <div class="teams">
                    <SquareSkeleton :height="16" :width="134"/>
                    <SquareSkeleton :height="16" :width="134"/>

                    <span class="teams__info">
                        <SquareSkeleton :height="15" :width="80"/>
                        <SquareSkeleton :height="15" :width="30"/>
                    </span>
                </div>
                <div class="quotes">
                    <SquareSkeleton :height="54" :width="58"/>
                    <SquareSkeleton :height="54" :width="58"/>
                    <SquareSkeleton :height="54" :width="58"/>
                </div>
            </div>
        </div>
    </div>
    
  </div>
</template>

<script>
import SquareSkeleton from '@/components/skeletons/SquareSkeleton.vue'
export default {
    components: { SquareSkeleton },
    name: 'game-list-skeleton',
    props: {
        showFirstCollapse: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang="scss" scoped>
.game-list-skeleton {
    width: 100%;
    display: flex;
    flex-direction: column;

    &__collapse {
        height: 40px;
        width: 100%;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &--primary {
            background: var(--color-background);
            color: var(--color-text);
        }

        &--secondary {
            background: var(--color-background-input);
            color: var(--color-text);
        }
    }

    &__scoreboard {
        height: 30px;
        padding: 0 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 55px;
    }

    &__game-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2px;
        background: var(--color-background);
    }

    &__game-item {
        display: flex;
        justify-content: space-between;
        background: var(--color-background-input);
        width: 100%;
        padding: 16px 13px;
    }
}

.teams {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__info {
        display: flex;
        gap: 10px;
    }
}

.quotes {
    display: flex;
    gap: 8px;
}

</style>