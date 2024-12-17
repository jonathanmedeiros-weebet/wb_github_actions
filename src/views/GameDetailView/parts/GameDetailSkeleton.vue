<template>
  <div class="game-detail-skeleton">
    <div class="game-detail-skeleton__header">
        <Header class="game-detail-skeleton__navbar" :showBackButton="true" />
        <SquareSkeleton width="full" :height="250" />
    </div>
    <div class="game-detail-skeleton__filters">
        <SquareSkeleton :width="100" :height="20" />
        <SquareSkeleton :width="100" :height="20" />
        <SquareSkeleton :width="100" :height="20" />
    </div>
    <div class="game-detail-skeleton__results">
        <div v-for="item of Array(5)" :key="item">
            <div class="game-detail-skeleton__collapse">
                <SquareSkeleton :height="20" :width="200"/>
                <SquareSkeleton :height="20" :width="30"/>
            </div>
            <div class="game-detail-skeleton__quotes">
                <SquareSkeleton :height="54" width="full"/>
                <SquareSkeleton :height="54" width="full"/>
                <SquareSkeleton :height="54" width="full"/>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import SquareSkeleton from '@/components/skeletons/SquareSkeleton.vue'
import Header from '@/components/layouts/Header.vue'
export default {
  components: { SquareSkeleton, Header },

}
</script>

<style lang="scss" scoped>
.game-detail-skeleton {
    display: flex;
    flex-direction: column;
    width: 100%;

    &__header {
        width: 100%;
        height: 250px;
    }

    &__navbar {
        position: absolute;
        background: transparent;
        border: 0;
    }

    &__filters {
        height: 53px;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: flex-start;
        padding: 0 16px;
        background: #181818;
        background: var(--inputs-odds);
    }

    &__collapse {
        height: 40px;
        width: 100%;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #181818;
        background: var(--background);
        color: #ffffff;
        color: var(--foreground);
    }

    &__quotes {
        display: flex;
        justify-content: space-between;
        padding: 13px 16px;
        gap: 10px;
    }
}
</style>