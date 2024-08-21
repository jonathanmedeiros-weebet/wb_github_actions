<template>
  <div class="games">
    <div class="games__items" v-for="item in Array(4)" :key="item">
        <div class="games__datetime">
          <SquareSkeleton  :height="14" :width="100"/>
        </div>
      <div class="games__team">
        <div class="games__team-left">
          <SquareSkeleton class="games__team-name-left" :height="30" :width="200"/>
        </div>

        <div >
          <div>
            <span class="games__scores">
              <SquareSkeleton :height="10" :width="10"/>  
              <SquareSkeleton :height="10" :width="10"/>
              <SquareSkeleton :height="10" :width="10"/>
            </span>
          </div>
        </div>
        <div class="games__team-right">
          <SquareSkeleton class="games__team-name-right" :height="30" :width="200"/>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import SquareSkeleton from '@/components/skeletons/SquareSkeleton.vue'
export default {
  name: 'game-item-result-skeleton',
  components: { SquareSkeleton }
}
</script>

<style lang="scss" scoped>
.games {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #181818;
  background: var(--color-background-input);
  
  &__items {
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #ffffff1a;  
  }

  &__datetime {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0px 0px 20px 0px;
  }

  &__team {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between; 
  }

  &__team-left,
  &__team-right {
    font-size: 14px;
    flex: 1;
    padding-bottom: 20px;
  }

  &__team-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 37%;
    text-align: left;   
  }

  &__scores {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px;
    padding-bottom: 20px;
  }

  &__scores--secondary {
    font-size: 12px;
    color: #ffffff80;
    color: var(--color-text-input);
    padding-top: 0;
  }

  &__team-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 37%;
    
  }

  
}
</style>
