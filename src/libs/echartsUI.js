import * as echarts from 'echarts/core'
import { TitleComponent, GridComponent, TooltipComponent } from 'echarts/components'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([TitleComponent, GridComponent, BarChart, LineChart, CanvasRenderer, TooltipComponent, PieChart])

export default echarts
