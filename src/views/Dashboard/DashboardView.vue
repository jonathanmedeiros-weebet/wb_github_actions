<template>
    <div class="dashboard">
        <Header title="Dashboard" :showBackButton="true" />
        <div class="dashboard__container">
            <card-entry-dashboard :data="entryData"/>

            <div class="dashboard__chart-header">
                <p class="dashboard__chart-header-title">Fluxo de caixa</p>
                
                <collapse-dashboard>
                    <template #title>Semana passada</template>
                </collapse-dashboard>

            </div>
            <div class="dashboard__chart">
                <chart-bar width="313.624px" height="250.792px"/>
            </div>

        </div>
    </div>
</template>

<script>

import Header from '@/components/layouts/Header.vue'
import CardEntryDashboard from './parts/CardEntryDashboard.vue'
import CollapseDashboard from './parts/CollapseDashboard.vue'
import ChartBar from './parts/ChartBar.vue'

export default {
    name: 'dashboard-view',
    components: {
        Header,
        CardEntryDashboard,
        CollapseDashboard,
        ChartBar
    },
    data() {
        return {
            entryData: {
                categories: [
                    {
                        tile: 'Total de apostas',
                        value: 500.35,            
                    },
                    {
                        tile: 'Apostas em aberto',
                        value: 238.00
                    },
                    {
                        tile: 'Prêmios',
                        value: 118.24
                    },
                    {
                        tile: 'Comissões',
                        value: 75.00
                    },
                    {
                        tile: 'Repasse gerente',
                        value: 68.15
                    }
                ]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard{
    display: flex;
    flex-direction: column;
    height: 100%;
    
    width: 100%;

    &__container {
        padding: 12px;
    }

    &__chart-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 24px 12px;
        width: 100%;
    }

    &__chart-header-title {
        font-size: 16px;
        
    }

    &__chart-header-title {
        font-size: 16px;
        width: 80%;
    }

    &__chart {
        padding-bottom: 70px;
    }
}
</style>