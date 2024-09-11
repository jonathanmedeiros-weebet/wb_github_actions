<template>
    <WModal ref="wmodal" :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-leagues__title">Selecione um campeonato</span>
      </template>

      <template #body>
        <div class="modal-leagues__items">
            <template v-for="(region, regionIndex) in items">
                <a
                    type="button"
                    class="modal-leagues__item"
                    :key="regionIndex"
                    @click="handleSelect(region)"
                >
                    <span
                        v-if="region.image"
                        class="modal-leagues__image"
                        :style="{'backgroundImage': `url(${region.image})`}"
                    />

                    <component class="modal-leagues__icon" v-if="region.icon" :is="region.icon" color="#0be58e" />

                    {{ region.name }}
                </a>

                <a
                    type="button"
                    class="modal-leagues__subitem"
                    v-for="(championship, championshipIndex) in region.championships"
                    :key="`${championshipIndex}-${regionIndex}`"
                    @click="handleSelect(championship)"
                >
                    {{ championship.name }}
                </a>
            </template>
        </div>
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import { useHomeStore } from '@/stores';
import IconTrophy from '@/components/icons/IconTrophy.vue';
import IconGlobal from '@/components/icons/IconGlobal.vue';
import IconFootball from '@/components/icons/IconFootball.vue'
import IconCombat from '@/components/icons/IconCombat.vue'
import IconAmericanFootball from '@/components/icons/IconAmericanFootball.vue'
import IconTennis from '@/components/icons/IconTennis.vue'
import IconHockey from '@/components/icons/IconHockey.vue'
import IconBasketball from '@/components/icons/IconBasketball.vue'
import IconFutsal from '@/components/icons/IconFutsal.vue'
import IconVoleiball from '@/components/icons/IconVoleiball.vue'
import IconESport from '@/components/icons/IconESport.vue'

export default {
    name: 'modal-leagues',
    components: {
        WModal,
        IconTrophy,
        IconGlobal,
        IconFootball,
        IconCombat,
        IconAmericanFootball,
        IconTennis,
        IconHockey,
        IconBasketball,
        IconFutsal,
        IconVoleiball,
        IconESport
    },
    data() {
        return {
            homeStore: useHomeStore()
        }
    },
    computed: {
        items() {
            return this.homeStore.championshipPerRegionList;
        }
    },
    
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(item) {
            this.$refs['wmodal'].handleClose();
            this.$emit('click', {...item});
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
        min-height: 26px;
    }

    &__items {
        padding: 0 0 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        // gap: 20px;
        height: 100%;
        overflow-y: auto;
        max-height: calc(80% - 56px);
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        text-transform: uppercase;
        min-height: 30px;

        color: #ffffff;
        color: var(--color-text);
        font-size: 16px;
        font-weight: 400;
        text-align: left;

        margin-top: 10px;
        margin-bottom: 10px;
    }

    &__subitem {
        width: 100%;
        display: flex;
        align-items: center;
        
        min-height: 30px;

        color: #FFFFFF99;
        font-size: 14px;
        font-weight: 400;
        text-align: left;

        margin-top: 10px;
        margin-bottom: 10px;
    }

    &__image {
        border-radius: 50px;
        width: 18px;
        height: 18px;
        margin-right: 10px;

        background-size: contain;
        background-position: 50%;
        background-repeat: no-repeat;
        background-color: #0be58e;
        background-color: var(--highlight);

        clip-path: circle();
    }

    &__icon {
        border-radius: 50px;
        width: 18px;
        height: 18px;
        margin-right: 10px;
        margin-left: -1px;
    }
}
</style>