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

                    <component class="modal-leagues__icon" v-if="region.icon" :is="region.icon" color="var(--color-primary)" />

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

export default {
    name: 'modal-leagues',
    components: {
        WModal,
        IconTrophy,
        IconGlobal
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
    }

    &__items {
        padding: 0 0 20px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        text-transform: uppercase;

        color: var(--color-text);
        font-size: 16px;
        font-weight: 400;
        text-align: left;
    }

    &__subitem {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;

        color: #FFFFFF99;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
    }

    &__image {
        border-radius: 50px;
        width: 18px;
        height: 18px;

        background-size: contain;
        background-position: 50%;
        background-repeat: no-repeat;
        background-color: var(--color-primary);

        clip-path: circle();
    }

    &__icon {
        border-radius: 50px;
        width: 18px;
        height: 18px;
    }
}
</style>