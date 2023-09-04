import Vue from 'vue'
import { use } from 'echarts/core'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, PieChart, BarChart, GridComponent, TitleComponent, TooltipComponent, LegendComponent])

// 注册组件后即可使用
Vue.component('v-chart', VChart)
