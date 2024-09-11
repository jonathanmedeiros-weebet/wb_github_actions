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
            <SquareSkeleton class="game-list-skeleton__scoreboard-items" :height="10" :width="10"/>
            <SquareSkeleton class="game-list-skeleton__scoreboard-items" :height="10" :width="10"/>
            <SquareSkeleton class="game-list-skeleton__scoreboard-items" :height="10" :width="10"/>
        </div>
        <div class="game-list-skeleton__game-list">
            <div class="game-list-skeleton__game-item" v-for="item of Array(3)" :key="item">
                <div class="teams">
                    <SquareSkeleton class="teams__name" :height="16" :width="134"/>
                    <SquareSkeleton class="teams__name" :height="16" :width="134"/>

                    <span class="teams__info">
                        <SquareSkeleton class="teams__info-items" :height="15" :width="80"/>
                        <SquareSkeleton class="teams__info-items" :height="15" :width="30"/>
                    </span>
                </div>
                <div class="quotes">
                    <SquareSkeleton class="quotes__items" :height="54" :width="58"/>
                    <SquareSkeleton class="quotes__items" :height="54" :width="58"/>
                    <SquareSkeleton class="quotes__items" :height="54" :width="58"/>
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
            background: #0a0a0a;
            background: var(--background);
            color: #ffffff;
            color: var(--color-text);
        }

        &--secondary {
            background: #181818;
            background: var(--inputs-odds);
            color: #ffffff;
            color: var(--color-text);
        }
    }

    &__scoreboard {
        height: 30px;
        padding: 0 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__scoreboard-items {
        margin-left: 55px;
    }

    &__game-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2px;
        background: #0a0a0a;
        background: var(--background);
    }

    &__game-item {
        display: flex;
        justify-content: space-between;
        background: #181818;
        background: var(--inputs-odds);
        width: 100%;
        padding: 16px 13px;
        
    }
}

.teams {
    display: flex;
    flex-direction: column;
    // gap: 8px;
    

    &__info {
        display: flex;
    }

    &__info-items {
        margin-right: 8px;
    }
    
    &__name {
        margin-bottom: 8px;
    }
}

.quotes {
    display: flex;

    &__items {
        margin-left: 8px;
    }
    
}

</style>