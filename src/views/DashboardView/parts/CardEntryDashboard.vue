<template>
    <div class="card">
        <div class="card__body">

            <div class="card__body-title">
                <!-- TODO: BUSCAR NA API O TOTAL DE ENTRADAS -->
                <!-- <p class="card__body-title">Total de Entrada</p> -->
                <p class="card__body-title">Saldo</p>
                <p class="card__body-title-value">{{ formatCurrencyMoney(data.balance) }}</p>
            </div>
            <div class="card__body-icon" @click="handleClick">
                <icon-restart
                    width="24px" 
                    height="24px"
                    fill="var(--color-text-input)"
                />
            </div>
        </div>
        <div class="card__bars">
            <div 
                
                v-for="(item, categoryIndex) in data.categories" 
                :key="categoryIndex"
               
                :class="{
                    'card__bar-category--first': isFirst(categoryIndex),
                    'card__bar-category--last': isLast(categoryIndex)
                }"
                :style="{ width: percentage(item.value) + '%', backgroundColor: colors[categoryIndex], height: '23px' }"
                
            >
            </div>
            
        </div>
        <div class="card__footer">
            <div 
                class="card__categories" 
                v-for="(item, categoryIndex) in data.categories" 
                :key="categoryIndex"
                 
            >

                <div class="card__categories-title">
                    <p>
                        <icon-circle
                        class="card__categories-icon"
                        width="10.465px"
                        height="10.465px"
                        
                        :fill="colors[categoryIndex]"
                        />{{ item.title }}</p>
                </div>

                <div class="card__categories-value">
                    <p>{{ formatCurrencyMoney(item.value) }}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

import IconRestart from '@/components/icons/IconRestart.vue'
import IconCircle from '@/components/icons/IconCircle.vue';
import { formatCurrency } from '@/utilities'

export default {
  components: { IconRestart, IconCircle },
    name: 'card-entry-dashboard',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data(){
        return {
            colors: ['#3879EB', '#7BCDFC', '#79C8CC', '#A65AE5', '#5256D4']
        }
    },
    methods: {
        percentage(part) {
            return ((part / this.totalValue) * 100).toFixed(2);
        },
        isFirst(index) {
            return index === 0;
        },
        isLast(index) {
            return index === this.data.categories.length - 1;
        },
        handleClick(event) {
            return this.$emit('click', event.value);
        },
        formatCurrencyMoney(value) {
            return formatCurrency(value);
        }
    },
    computed: {
        totalValue() {
            return this.data.categories.reduce((sum, category) => {
                return sum + category.value;
            }, 0);
        },
    },
}
</script>

<style lang="scss" scoped>
.card {
    display: flex;
    flex-direction: column;
    padding: 25px 12px;
    border-radius: 8px;
    background: var(--color-background-input);
    
    &__body {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
    }

    &__body-title {
        display: flex;
        flex-direction: column;
        align-items: start;
        font-size: 14px;
        color: var(--color-text-input);
        gap: 12px;
    }

    &__body-title-value {
        font-size: 24px;
        color: var(--color-text);
        padding-bottom: 20px;
    }

    &__body-icon {
        color: var(--color-text-input);
    }

    &__bars {
        display: flex;
        flex-direction: row;
        gap: 2px;
    }

    &__bar-category {
        display: flex;
        flex-direction: row;
        min-height: 23px;
        
        &--first {
            border-radius: 6px 0px 0px 6px;
        }

        &--last {
            border-radius: 0px 6px 6px 0px;
        }
    }

    &__footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding-top: 24px;
    }

    &__categories {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0px 16px 0px 0px;
        
    }

    &__categories-title,
    &__categories-value {
        font-size: 14px;
        white-space: nowrap;
     
    }
    &__categories-value {
        font-size: 12px;
        color: var(--color-text-input);
        margin: 0px 0px 0px 15px;
    }

    &__categories-icon {
        margin: 0px 5px 0px 0px;
    }

}
</style>