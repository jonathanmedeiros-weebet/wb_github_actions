<template>
    <Bar
        :options="chartOptions"
        :data="chartData"
        :id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
    />
</template>
  
<script>
import { Bar } from 'vue-chartjs'
  
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
  
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
export default {
    name: 'BarChart',
    components: {
        Bar
    },
    props: {
        chartId: {
            type: String,
            default: 'bar-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 400
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => {}
        },
        plugins: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            chartData: {
                labels: [
                    'Seg',
                    'Ter',
                    'Qua',
                    'Qui',
                    'Sex',
                    'Sab',
                    'Dom'
                ],
                datasets: [
                    {
                        label: 'Entrada',
                        backgroundColor: '#6DA544',
                        data: [450, 210, 0, 0, 0, 0, 0 ]
                     },
                    {
                        label: 'Saida',
                        backgroundColor: '#F61A1A',
                        data: [350, 290, 0, 0, 0, 0, 0 ]
                    },
                ]
            },            
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 14,
                            useBorderRadius: true,
                            borderRadius: 2,
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgb(255,255,255,0.5)',
                            stacked: true,
                            borderDash: [1],
                            borderDashOffset: 0,
                            borderWidth: 1

                        }
                    }
                }
            }
        }
    }
}
</script>
  