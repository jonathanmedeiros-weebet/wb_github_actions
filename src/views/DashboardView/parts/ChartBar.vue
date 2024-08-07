<template>
    <div>
      <Bar
        :options="chartOptions"
        :data="internalChartData"
        :id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
        ref="barChart"
      />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  
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
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        internalChartData: this.chartData,
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
                color: 'rgba(255, 366, 255, 0.3)',
                borderDash: [5, 5],
                borderDashOffset: 0,
                borderWidth: 0
              }
            }
          }
        }
      }
    },
    watch: {
      chartData: {
        handler(newData) {

        console.log('chartData atualizado:', newData)
          this.updateChart()
        },
        deep: true
      }
    },
    methods: {
      updateChart() {
        this.internalChartData = { ...this.chartData }
        this.$nextTick(() => {
          if (this.$refs.barChart && this.$refs.barChart.chartInstance) {
            this.$refs.barChart.chartInstance.update()
          }
        })
      }
    }
  }
  </script>