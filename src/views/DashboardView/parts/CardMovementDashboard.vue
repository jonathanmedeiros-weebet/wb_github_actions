<template>
    <div class="card">
        <div class="card__icon">
            <icon-money/>
        </div>
        <div class="card__description">
            <p class="card__title">{{ movement.title }}</p>
            <p class="card__subtitle">{{ movement.type}}</p>
            <p class="card__date">{{ movement.date }}</p>
        </div>
        <div class="card__value" :class="typeColor(movement.type)">
            <p>R$ {{ formatCurrencyMoney(movement.value) }}</p>
        </div>
    </div>
</template>

<script>
import { convertInMomentInstance, formatCurrency } from '@/utilities'
import IconMoney from '@/components/icons/IconMoney.vue';

export default {
  components: { IconMoney },
    name: 'card-moviment-dashboard',
    props: {
        movement: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatDate(date) {
            return convertInMomentInstance(date).format('DD/MM/YYYY');
        },
        typeColor(type) {
            return type == 'Débito' ? 'card__value--danger' : 'card__value--success'
        },
        formatCurrencyMoney(value) {
            return formatCurrency(value);
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 8px;
    padding: 18px 15px;
    background: #181818;
    background: var(--background);
    margin: 4px 0px 4px 0px;

    &__description {
        flex-grow: 1;
        text-align: left;
        align-items: center;
    }
    &__value {
        font-size: 14px;
        text-align: right;

        &--success {
            color: #6da544;
            color: var(--color-success);
        }

        &--danger {
            color: #f61a1a;
            color: var(--color-danger);
        }
    }

    &__title {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 16px;
        margin-bottom: 8;
        margin-top: -1px;
    }

    &__subtitle,
    &__date {
        font-size: 14px;
        color: #ffffff80;        
        color: var(--foreground-inputs-odds);        
    }

    &__subtitle {
        margin-bottom: 6px;
    }

    &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 13px;
        background-color: #181818;
        background-color: var(--background);
        width: 24px;
        height: 24px;
        border-radius: 100%;
    }
}
</style>