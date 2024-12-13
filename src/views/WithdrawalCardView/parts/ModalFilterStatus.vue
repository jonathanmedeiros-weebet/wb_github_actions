<template>
    <WModal :backdropClick="true" @close="handleCloseModal">
      <template #title>
        <span class="modal-modalities__title">Selecione</span>
      </template>

      <template #body>
        <div class="modal-modalities__items">
            <template v-for="(item, index) in items">
                <a
                    type="button"
                    class="modal-modalities__item"
                    :key="index"
                    @click="handleSelect(item.id)"
                >
                    {{ item.name }}
                    <IconCheck v-if="item.checked" class="modal-modalities__icon"/>
                </a>
            </template>
        </div>
      </template>
    </WModal>
</template>

<script>
import WModal from '@/components/Modal.vue'
import IconCheck from '@/components/icons/IconCheck.vue'


export default {
    name: 'modal-filter-date',
    components: { WModal, IconCheck },
    props: {
        dateId: {
            type: Number | String,
            default: 1
        }
    },
    data() {
        return {
            items: [
            {
                    id: 1,
                    name: 'Aprovado',
                    slug: 'aprovado',
                    checked: false
                },
                {
                    id: 2,
                    name: 'Não aprovado',
                    slug: 'não aprovado',
                    checked: false
                }
            ].map((filterDate) => ({
                ...filterDate,
                checked: filterDate.id === this.dateId
            })),
        }
    },
    methods: {
        handleCloseModal() {
            this.$emit('closeModal');
        },
        handleSelect(dateId) {
            this.$emit('click', dateId);
        },
        handleClose() {
            document.body.style.overflow = 'initial'
            this.$emit('close');
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-modalities {
    &__title {
        color: #FFFFFF80;
        color: var(--foreground-inputs-odds);
        font-size: 16px;
        font-weight: 500;
    }

    &__items {
        padding: 0 20px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        color: var(--foreground-inputs-odds);
        font-size: 16px;
        
        font-weight: 400;
        padding-bottom: 20px;
    }

    &__item img {
        width: 18px;
        height: 18px;
    }

    &__icon {
        margin-bottom: 10px;
        margin-left: 10px;
    }
}
</style>