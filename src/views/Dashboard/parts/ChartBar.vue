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
        },
        dataChartApi: {
            type: Object
        }
    },
    data() {
        return {
            chartData: this.dataChartApi,            
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
                            font: {
                                size: 14,
                                color: '#fff'
                            }
                        }
                    }
                },
                scales: {
                   
                    y: {
                        grid: {
                        color: 'rgba(255, 366, 255, 0.3)', // Cor das linhas horizontais
                        borderDash: [5, 5], // Linhas horizontais pontilhadas
                        borderDashOffset: 0,
                        borderWidth: 0 // Ajusta a espessura das linhas horizontais
                        }
                    }
                },
            }
        }
    }
}
</script>
  