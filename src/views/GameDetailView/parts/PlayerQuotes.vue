<template>
    <div class="player-quotes">
        <span v-if="!hasQuotes" class="player-quotes__message">Nenhuma cotação disponível no momento</span>
        <template v-if="hasQuotes">
            <Collapse
                :iconColor="'var(--game-foreground)'"
                :initCollapsed="true"
                v-for="(option, index) in options"
                :key="index" 
                ref="collapse"
            > 
                <template #title>{{ option.title }}</template>
              <div class="collapse__items">
                <div
                    class="collapse__headers"
                >
                  <div class="collapse__columns" v-if="option.title === 'Marcadores de gols'"
                  >
                      <span class="collapse__column">Primeiro</span>
                      <span class="collapse__column collapse__column--second">Último</span>
                      <span class="collapse__column">Partida</span>

                  </div>

                  <div class="collapse__columns" v-if="option.title === 'Multi marcadores'"
                  >
                    <span class="collapse__column"></span>
                    <span class="collapse__column collapse__column--second" style="padding-right: 20px">2 ou +</span>
                    <span class="collapse__column">3 ou +</span>

                  </div>

                  <div class="collapse__columns" v-if="option.title === 'Cartões'"
                  >
                    <span class="collapse__column">1º Cartão</span>
                    <span class="collapse__column collapse__column--second" >Recebe</span>
                    <span class="collapse__column">Expulso</span>

                  </div>

                  <div class="collapse__columns" v-if="option.title === `Gols casa - ${game?.time_a_nome}`"
                  >
                    <span class="collapse__column"></span>
                    <span class="collapse__column collapse__column--second" style="padding-right: 20px">Primeiro</span>
                    <span class="collapse__column">Último</span>

                  </div>

                  <div class="collapse__columns" v-if="option.title === `Gols fora - ${game?.time_b_nome}`"
                  >
                    <span class="collapse__column"></span>
                    <span class="collapse__column collapse__column--second" style="padding-right: 20px">Primeiro</span>
                    <span class="collapse__column">Último</span>

                  </div>
                </div>

                <div class="collapse__items">
                    <div
                        class="collapse__item"
                        v-for="(player, playerIndex) in option.players"
                        :key="`${playerIndex}-${index}`"
                    >
                        <span class="collapse__label">{{ player.name }}</span>
                        <div
                            class="collapse__options"
                            :class="{
                                'collapse__options--three-column': player.odds.length == 3,
                                'collapse__options--two-column': player.odds.length == 2,
                            }"
                        >
                            <button
                                class="collapse__option"
                                v-for="odd in player.odds"
                                :key="odd.id"
                                :class="{
                                    'collapse__option--selected': odd.key === quoteSelected,
                                    'collapse__option--live': isDecreasedOdd(odd) || isIncreasedOdd(odd)
                                }"
                                @click="handleItemClick(odd, player.name)"
                            >
                                <template v-if="odd.hasPermission">
                                    <IconArrowFillUp
                                        class="collapse__icon-option"
                                        v-if="isIncreasedOdd(odd)"
                                        :size="14"
                                        color="var(--success)"
                                    />
                                    <span class="collapse__value">{{ odd.finalValue }}</span>
                                    <IconArrowFillDown
                                        class="collapse__icon-option"
                                        v-if="isDecreasedOdd(odd)"
                                        :size="14"
                                        color="var(--warning)"
                                    />
                                </template>

                                <IconLock v-else :size="14" color="var(--league-foreground)"/>
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            </Collapse>
        </template>
    </div>
</template>

<script>
import Collapse from '@/components/Collapse.vue';
import IconLock from '@/components/icons/IconLock.vue';
import { QuotaStatus } from '@/enums';
import IconArrowFillDown from '@/components/icons/IconArrowFillDown.vue';
import IconArrowFillUp from '@/components/icons/IconArrowFillUp.vue';
import { useTicketStore } from '@/stores';

export default {
    name: 'player-quotes',
    components: { Collapse, IconLock, IconArrowFillDown, IconArrowFillUp },
    props: {
        quotes: {
            type: Array,
            default: () => []
        },
        game: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            ticketStore: useTicketStore()
        }
    },
    created() {
        this.$refs["collapse"].iconColor = '#ffffff';
    },
    computed: {
        hasQuotes() {
            return Boolean(this.quotes.length)
        },
        options() {
            return this.quotes;
        },
        quoteSelected() {
            return this.ticketStore.items[this.game._id]?.quoteKey ?? null;
        }
    },
    methods: {
        handleItemClick(odd, playerName) {
            event.stopPropagation();
            if(!odd.hasPermission) return;

            const { items, addQuote, removeQuote } = useTicketStore();
            const gameExist = Boolean(items[this.game._id]);
            const quoteExist = items[this.game._id]?.quoteKey == odd.key;

            if(gameExist && quoteExist) {
                removeQuote(this.game._id);
            } else {
                addQuote({
                    gameId: this.game._id,
                    gameName: this.game.nome,
                    gameDate: this.game.horario,
                    eventId: this.game.event_id,
                    live: this.game.ao_vivo,
                    quoteKey: odd.key,
                    quoteValue: Number(odd.value),
                    finalQuoteValue: Number(odd.finalValue),
                    quoteName: playerName,
                    quoteGroupName: odd.label,
                    favorite: this.game.favorito,
                    modalityId: this.game.sport_id,
                    championshipId: this.game?.campeonato?._id
                })
            }
        },
        isIncreasedOdd(odd) {
            return Boolean(odd.status) && odd.status === QuotaStatus.INCREASED;
        },
        isDecreasedOdd(odd) {
            return Boolean(odd.status) && odd.status === QuotaStatus.DECREASED;
        }
    }
}
</script>

<style lang="scss" scoped>
.player-quotes {
    position: relative;
    z-index: 1;
    height: calc(100vh - 100px);
    background: #0a0a0a;
    background: var(--background);

    &__message {
        display: flex;
        width: 100%;
        padding: 8px 16px;
        font-size: 12px;
        color: rgba(255, 255, 255, .5);
        color: rgba(var(--foreground-rgb), .5);
    }
}

.collapse {
    &__items {
      flex-direction: column;
      background: var(--game);
    }

    &__headers {
      width: 100%;
      height: 20px;
      display: flex;
      justify-content: flex-end;
      padding: 0 22px;
    }

    &__columns {
      width: 200px;
      display: flex;
    }

    &__column {
      width: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 10px;


      &--second {
        margin: 0 8px;
      }
    }

    &__options {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 5px;
        padding: 5px;
        background: #181818;
        background: var(--game);

        &--three-column {
            width: 200px;
        }
        &--two-column {
            width: 150px;
        }
    }

    &__options--three-column &__option {
        min-width: calc(180px / 3);
    }
    &__options--two-column &__option {
        min-width: calc(130px / 2);
    }

    &__option {
        min-width: calc(150px / 3);
        background: #0a0a0a;
        background: var(--button);
        color: #ffffff;
        color: var(--button-foreground);
        border: none;
        border-radius: 4px;
        padding-top: 5px;
        padding-bottom: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &--live {
            gap: 0;
        }

        &--selected {
            background: #35cd96;
            background: var(--highlight);
        }
    }

    &__option--selected &__label,
    &__option--selected &__value {
        color: #0a0a0a;
        color: var(--highlight-foreground);
    }

    &__icon-option {
        animation: blink 1s linear infinite;
    }

    &__label {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        max-width: 100px;
        margin-bottom: 7px;
        color: rgba(255, 255, 255, .5);
        color: rgba(var(--button-foreground-rgb), .5);
    }

    &__value {
        color: #ffffff;
        color: var(--button-foreground);
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    &__item {
        display: flex;
        gap: 5px;
    }
    
    &__item  &__title {
        color: red;
    }
}

::v-deep .collapse__item {
    background: #0a0a0a;
    background: var(--league);
    padding: 13px 24px;
}
::v-deep .collapse__label {
    color: #0a0a0a;
    color: var(--league-foreground);
}
::v-deep .collapse__title {
    color: #ffffff;
    color: var(--league-foreground);
}
</style>
