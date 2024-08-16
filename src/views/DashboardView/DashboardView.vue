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
                    :chartData="chartData"
                />
            </div>

            <div class="dashboard__movements">
                <p class="dashboard__movements-title">Movimentações</p>
                <p @click="toMoviments()" class="dashboard__movements-filter">Visualizar todos</p>
            </div>

            

            <div class="dashboard__movements-dates">
                
                <p class="dashboard__movements-icon-range-dates">
                    <icon-calendar-month class="dashboard__movements-icon-calendar" fill="#ffffff80"/>
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
            ref="modalFilter"
        />
       
    </div>
</template>

<script>

import Header from '@/components/layouts/Header.vue'
import CardEntryDashboard from './parts/CardEntryDashboard.vue'
import CollapseDashboard from './parts/CollapseDashboard.vue'
import ChartBar from './parts/ChartBar.vue'

import { now } from '@/utilities'
import IconCalendarMonth from '@/components/icons/IconCalendarMonth.vue'
import CardMovementDashboard from './parts/CardMovementDashboard.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import ModalFilterDate from './parts/ModalFilterDate.vue'
import { getCashFlow, getFinancial, getMovements, getQtdBets, listMovements  } from '@/services'
import Toast from '@/components/Toast.vue'
import { ToastType } from '@/enums'
import { useToastStore } from '@/stores'

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
        ModalFilterDate,
        Toast
    },
    data() {
        return {
            showModalFilterDate: false,
            chartData: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                datasets: [
                    {
                        label: 'Entrada',
                        backgroundColor: '#6DA544',
                        data: []
                    },
                    {
                        label: 'Saida',
                        backgroundColor: '#F61A1A',
                        data: []
                    }
                ]
            },
            entryData: {
                categories: [],
                balance: 0,
            },
            movements: {     
                results: []
            },
            maxItems: 4,
            filterDateList: [
                {
                    id: 1,
                    name: 'Semana atual',
                    slug: 'semana-atual',
                    checked: true
                },
                {
                    id: 2,
                    name: 'Semana passada',
                    slug: 'semana-anterior',
                    checked: false
                }
            ],
            filterDate: {
                id: 1,
                name: 'Semana atual',
                slug: 'semana-atual',
                checked: false,
            },
            toastStore: useToastStore()
        }
    },
    methods: {
        toMoviments() {
            this.$router.push({ 
                name: 'movements',
                params: {
                    dateIni: this.dateFilterIni.format("YYYY-MM-DD"),
                    dateEnd: this.dateFilterEnd.format("YYYY-MM-DD")
                }
            });
        },
        closeModalChart() {
            this.showModalChart = false;
        },
        handleFluxo() {
            this.showModalChart = false;
        },
        handleReloadEntry() {
            this.fetchFinancial();
        },
        handleOpenModalFilterDate() {
            this.showModalFilterDate = true;
        },
        handleCloseModalFilterDate() {
            this.showModalFilterDate = false;
        },
        handleFilterDate(filterDateId) {
            this.filterDate = this.filterDateList.find(filterDate => filterDate.id === filterDateId);
            this.fetchDataCashFlow();
            this.$refs.modalFilter.handleClose();
            this.handleCloseModalFilterDate();
        },
        async fetchDataCashFlow() {
            const filter = {
                periodo: this.filterDate.slug
            }
            getCashFlow(filter)
                .then(resp => {
                    this.chartData = {
                        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                        datasets: [
                        { ...this.chartData.datasets[0], data: resp.results.entrada },
                        { ...this.chartData.datasets[1], data: resp.results.saida }
                        ]
                    }
                })
                .catch(error => {
                    this.toastStore.setToastConfig({
                        message: error.errors.message,
                        type: ToastType.DANGER,
                        duration: 5000
                    })
                });
        },
        async fetchFinancial(){ 
            getFinancial()
                .then(resp => {
                    this.entryData.categories = [];
                    for (let [title, value] of Object.entries(resp.results)) {
                        if(title !== 'saldo') {
                            this.entryData.categories.push({
                                title: title,
                                value: parseFloat(value ?? 0)
                            });
                        }else{
                            this.entryData.balance = parseFloat(value);
                        }
                        
                    }
                })
                .catch(error => {
                    this.toastStore.setToastConfig({
                        message: error.errors.message,
                        type: ToastType.DANGER,
                        duration: 5000
                    })
                });
        },
        async fetchhMoviments(){ 
            const queryParams = {
                'periodoDe': this.dateFilterIni.format('YYYY-MM-DD'),
                'periodoAte': this.dateFilterEnd.format('YYYY-MM-DD')
            }
            listMovements(queryParams)
                .then(resp => {
                    this.movements.results = [];
                    for (let [key, item]  of Object.entries(resp.results.movimentacoes)) {
                        this.movements.results.push({
                            date: item.data,
                            title: 'Comissão',
                            value: parseFloat(item.valor ?? 0),
                            type: item.descricao,
                        });
                    }
                })
                .catch(error => {
                    this.toastStore.setToastConfig({
                        message: error.errors.message,
                        type: ToastType.DANGER,
                        duration: 5000
                    })
                });
        }
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
    },
    mounted() {
        this.fetchDataCashFlow();
        this.fetchFinancial();
        this.fetchhMoviments();
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
        color: #ffffff80;
        color: var(--color-text-input);
    }

    &__movements-dates {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 8px 0px;
        font-size: 14px;
        color: #ffffff80;
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
}
</style>