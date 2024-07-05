<template>
    <div class="dashboard">
        <Header title="Dashboard" :showBackButton="true" />
        <div class="dashboard__container">
            <card-entry-dashboard :data="entryData"/>
        </div>
    </div>
</template>

<script>

import Header from '@/components/layouts/Header.vue'
import CardEntryDashboard from './parts/CardEntryDashboard.vue'

export default {
    name: 'dashboard-view',
    components: {
        Header,
        CardEntryDashboard
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
    
    width: 100%;

    &__container {
        padding: 12px;
    }
}
</style>