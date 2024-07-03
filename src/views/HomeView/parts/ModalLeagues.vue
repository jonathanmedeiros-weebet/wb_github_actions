<template>
    <WModal :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-leagues__title">Selecione um campeonato</span>
      </template>

      <template #body>
        <div class="modal-leagues__items">
            <template v-for="(league, leagueIndex) in items">
                <a
                    type="button"
                    class="modal-leagues__item"
                    :key="leagueIndex"
                    @click="handleSelect(league.title)"
                >
                    <img :src="league.image">
                    {{ league.title }}
                </a>

                <a
                    type="button"
                    class="modal-leagues__subitem"
                    v-for="(championship, championshipIndex) in league.championships"
                    :key="`${championshipIndex}-${leagueIndex}`"
                    @click="handleSelect(championship)"
                >
                    {{ championship }}
                </a>
            </template>
        </div>
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import { leagueList } from '@/constants';

export default {
    name: 'modal-leagues',
    components: {WModal},
    data() {
        return {
            items: leagueList
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(league) {
            this.$emit('click', league);
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-leagues {
    &__title {
        color: #FFFFFF80;
        font-size: 16px;
        font-weight: 500;
    }

    &__items {
        padding: 0 20px 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;

        color: var(--color-text);
        font-size: 16px;
        font-weight: 400;
    }

    &__subitem {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;

        color: #FFFFFF99;
        font-size: 14px;
        font-weight: 400;
    }

    &__item img {
        width: 18px;
        height: 18px;
    }
}
</style>