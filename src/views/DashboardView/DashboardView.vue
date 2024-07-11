<template>
    <div class="dashboard">
        <Header title="Dashboard" :showBackButton="true" />
        <div class="dashboard__container">
            <card-entry-dashboard :data="entryData" @click="handleReloadEntry"/>

            <div class="dashboard__chart-header">
                <p class="dashboard__chart-header-title">Fluxo de caixa</p>
                
                <collapse-dashboard @click="handleOpenModalFilterDate">
                    <template #title>{{ filterDate.name }}</template>
                </collapse-dashboard>

            </div>
            <div class="dashboard__chart">
                <chart-bar 
                    :width="313"
                    :height="250"
                    :dataChartApi="entryData.charData"
                />
            </div>

            <div class="dashboard__movements">
                <p class="dashboard__movements-title">Movimentações</p>
                <p @click="toMoviments()" class="dashboard__movements-filter">Visualizar todos</p>
            </div>

            

            <div class="dashboard__movements-dates">
                
                <p class="dashboard__movements-icon-range-dates">
                    <icon-calendar-month class="dashboard__movements-icon-calendar" fill="var(--color-text-input)"/>
                    {{ dateFilterIni.format('DD/MM/YYYY') }} - {{ dateFilterEnd.format('DD/MM/YYYY') }}</p>  
            </div>
        

            <card-movement-dashboard 
                v-for="(movement, movementsIndex) in momentsResults" 
                :key="movementsIndex"
                :movement="movement"
            />

        </div>

        <modal-filter-date
            v-if="showModalFilterDate"
            :dateId="filterDate.id"
            @closeModal="handleCloseModalFilterDate"
            @click="handleFilterDate"
        />
       
    </div>
</template>

<script>

import Header from '@/components/layouts/Header.vue'
import CardEntryDashboard from './parts/CardEntryDashboard.vue'
import CollapseDashboard from './parts/CollapseDashboard.vue'
import ChartBar from './parts/ChartBar.vue'

import { now } from '@/utilities/date.utitlity.ts'
import IconCalendarMonth from '@/components/icons/IconCalendarMonth.vue'
import CardMovementDashboard from './parts/CardMovementDashboard.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import ModalFilterDate from './parts/ModalFilterDate.vue'

export default {
    name: 'dashboard-view',
    components: {
        Header,
        CardEntryDashboard,
        CollapseDashboard,
        ChartBar,
        IconCalendarMonth,
        CardMovementDashboard,
        IconCheck,
        ModalFilterDate
    },
    data() {
        return {
            showModalFilterDate: false,
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
                ],
                charData: {
                    labels: ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'],
                    datasets: [
                        {
                            label: 'Entrada',
                            backgroundColor: '#6DA544',
                            data: [460, 210, 110, 0, 0, 0, 0 ]
                        },
                        {
                            label: 'Saida',
                            backgroundColor: '#F61A1A',
                            data: [350, 290, 110, 0, 0, 0, 0 ]
                        },
                    ]
                },
            },
            movements: {     
                results: [
                    {
                        date: '2024-06-03',
                        title: 'Comissão',
                        value: 200,
                        type: 'Débito',
                    },
                    {
                        date: '2024-06-03',
                        title: 'Comissão',
                        value: 150,
                        type: 'Crédito',
                    },
                    {
                        date: '2024-06-03',
                        title: 'Comissão',
                        value: 150,
                        type: 'Crédito',
                    },
                    {
                        date: '2024-06-03',
                        title: 'Comissão',
                        value: 200,
                        type: 'Débito',
                    },

                ]
            },
            maxItems: 4,
            filterDateList: [
                {
                    id: 1,
                    name: 'Semana atual',
                    checked: true
                },
                {
                    id: 2,
                    name: 'Mês atual',
                    checked: false
                }
            ],
            filterDate: {
                id: 1,
                name: 'Semana atual',
                checked: false
            }
            
        }
    },
    methods: {
        toMoviments() {
            alert('Abrir view de movimentações');
        },
        closeModalChart() {
            this.showModalChart = false;
        },
        handleFluxo() {
            this.showModalChart = false;
        },
        handleReloadEntry() {
            alert('atualizar');
        },
        handleOpenModalFilterDate() {
            this.showModalFilterDate = true;
        },
        handleCloseModalFilterDate() {
            this.showModalFilterDate = false;
        },
        handleFilterDate(filterDateId) {
            this.filterDate = this.filterDateList.find(filterDate => filterDate.id === filterDateId);
            this.handleCloseModalFilterDate();
        },
    },
    computed: {
        momentsResults() {
            return this.movements.results.slice(0,this.maxItems);
        },
        dateFilterIni() {
            return now().subtract(6, 'd');
        },
        dateFilterEnd() { 
            return now();
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard{
    padding-bottom: 100px;

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

    &__movements {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0; 
    }

    &__movements-title {
        font-size: 16px;
    }

    &__movements-filter {
        font-size: 12px;
        color: var(--color-text-input);
    }

    &__movements-dates {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 8px 0px;
        font-size: 14px;
        color: var(--color-text-input);
        
    }

    &__movements-icon-calendar {
        width: 20px;
        height: 20px;
        font-size: 14px;
        margin-right: 8px;
    }

    &__movements-icon-range-dates {
        display: flex;
        flex-direction: row;
        max-width: fit-content;
        padding: 8px 14px;
        border-radius: 6px;
        background: rgba(24, 24, 24, 0.50);
        color: rgba(255, 255, 255, 0.70);
    }

    &__modal-items {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: var(--color-text);
        font-size: 16px;
        font-weight: 400;
    }

    &__modal-title {
        color: rgba(255, 255, 255, 0.5019607843);
        font-size: 16px;
        font-weight: 500;
    }
}
</style>