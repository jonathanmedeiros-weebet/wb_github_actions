<template>
  <div class="games" @click="handleClick">
    <div class="games__items" v-for="(game, i) in games" :key="i">
      <p class="games__datetime">{{ game.dateTime }}</p>
      <div class="games__team">
        <div class="games__team-left">
          <span class="games__team-name-left">{{ game.teams[0].name }}</span>
        </div>

        <div class="games__scores">
          <div v-for="(result, resultsIndex) in game.results" :key="resultsIndex">
            <span v-if="resultsIndex == 0">
              {{ result.team0 }} x {{ result.team1 }}
            </span>
            <span v-else class="games__scores games__scores--secondary">
              ({{ result.team0 }} x {{ result.team1 }})
            </span>
          </div>
        </div>
        <div class="games__team-right">
          <span class="games__team-name-right">{{ game.teams[1].name }}</span>
        </div>
      </div>
      <div class="games__half-time">
        <span class="games__scores-half">({{ game.halfTime.team0 }} x {{ game.halfTime.team1 }})</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'game-item-result',
  props: {
    games: {
      type: Array,
      required: true,
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
    changeSrcWhenImageError(event) {
      event.target.src = 'https://cdn.wee.bet/img/times/m/default.png';
    }
  }
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
    padding: 15px 8px;
    align-items: center;
    text-align: center;
    color: #ffffff80;
    color: var(--color-text-input);
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 20px;
    padding: 5px;
    flex: 0 0 30%; 
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
    margin-left: 5px;
  }

  &__half-time {
    margin-top: 8px; 
    text-align: center;
    font-size: 14px;
    color: #ffffff80;
    color: var(--color-text-input);
  }

  &__scores-half {
    color: #ffffff80;
    color: var(--color-text-input);
  }

  &__team-image-left {
    margin-left: 10px
  }

  &__team-image-right {
    margin-right: 10px
  }
}
</style>
