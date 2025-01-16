<template>
    <div class="lottery-skeleton">
        <div class="lottery-skeleton__collapse">
            <SquareSkeleton class="lottery-skeleton__collapse-item" :height="10" :width="100"/>
            <SquareSkeleton class="lottery-skeleton__collapse-item" :height="10" :width="100"/>
        </div>
        <div class="lottery-skeleton__body">
            <SquareSkeleton class="lottery-skeleton__message" :height="10" :width="150"/>

            <div class="lottery-skeleton__options">
                <SquareSkeleton
                    class="lottery-skeleton__option"
                    :height="46"
                    :width="46"
                    v-for="i in 80" :key="i"
                />
            </div>
        </div>
    </div>
</template>
  
<script>
import SquareSkeleton from '@/components/skeletons/SquareSkeleton.vue'
export default {
    components: { SquareSkeleton },
    name: 'lottery-skeleton',
    props: {
        showFirstCollapse: {
            type: Boolean,
            default: true
        }
    }
}
</script>
  
<style lang="scss" scoped>
    .lottery-skeleton {
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
            background: #0a0a0a;
            background: var(--background);
            color: #ffffff;
            color: var(--league-foreground);
        }
        
        &__message,
        &__collapse-item {
            border-radius: 2px;
        }

        &__body {
            height: 90vh;
            width: 100vw;
            padding: 16px;

            background: var(--background);
        }

        &__options {
            margin-top: 16px;
            display: grid;
            grid-template-columns: repeat(5, auto);
            gap: 10px;
        }

        &__option {
          margin: auto;
          border-radius: 50px;
        }
    }
</style>