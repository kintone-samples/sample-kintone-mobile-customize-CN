<template>
  <v-chart class="echarts-bar-charts" :option="option" />
</template>

<script>
import { GetOneAppInfo, GetRecords, GetFormFields } from '@/services/kintoneApi'
import { config } from '@/config'

import {
  useEChartOption,
  DimensionType,
  MetricType,
} from 'echarts-composables'


const app = config.barCharts
const query = 'order by month asc limit 11'

export default {
  name: "BarCharts",

  data() {
    return {
      option: {},
      total: {},
    }
  },

  mounted() {
    this.initEcharts()
  },

  methods: {
    setTotalCount() {
      this.$emit('newcount', this.total)
    },

    async initEcharts() {

      const dimensions = [
        {
          key: 'name',
          visual: DimensionType.CategoryAxis,
        },
      ]

      const metrics = [
        {
          key: 'value',
          visual: MetricType.Bar,
        },
      ]

      const meta = [
        { key: 'channel1', alias: 'Garoon' },
        { key: 'channel2', alias: 'Mailwise' },
        { key: 'channel3', alias: 'kintone' },
        { key: 'channel4', alias: 'Office' },
      ]

      const resp = await GetRecords(app, query)
      const appInfo = await GetOneAppInfo(app)

      //通过表单设置获取单位，产品名称
      // const formSetting = await GetFormFields(app)
      const { records } = resp
      // console.log(records)

      let dataset = [
        { value: 0, name: 'Garoon' },
        { value: 0, name: 'Mailwise' },
        { value: 0, name: 'kintone' },
        { value: 0, name: 'Office' },
      ]

      for (const item of records) {
        const { channel1, channel2, channel3, channel4 } = item
        dataset[0].value += parseInt(channel1.value, 10)
        dataset[1].value += parseInt(channel2.value, 10)
        dataset[2].value += parseInt(channel3.value, 10)
        dataset[3].value += parseInt(channel4.value, 10)
        if (item.month.value === 'Nov.') {
          this.total.quantity2 =
            parseInt(channel1.value, 10) +
            parseInt(channel2.value, 10) +
            parseInt(channel3.value, 10) +
            parseInt(channel4.value, 10)
        }
      }

      // console.log('dataset', dataset)

      this.total.quantity = 0
      for (const item of dataset) {
        this.total.quantity += Number(item.value)
      }

      // console.log(this.total.quantity)
      const profit = Number(this.total.quantity) * 0.3
      // console.log(profit)
      this.total.profit = profit
      this.setTotalCount()

      const addons = [
        // useBarStack()
      ]

      const echartsOptions = useEChartOption({
        dataset, dimensions, metrics, meta, addons
      })
      echartsOptions.grid = {
        height: 50,
        top: 10,
        left: -5,
      }
      echartsOptions.series[0].showBackground = true
      echartsOptions.series[0].itemStyle = {
        color: '#76a1c2',
        shadowBlur: 0,
        borderRadius: 3,
      }

      echartsOptions.series[0].backgroundStyle = {
        color: '#eaedf1',
        borderRadius: 3,
      }
      echartsOptions.series[0].barWidth = '40%'
      echartsOptions.xAxis[0].axisTick = {
        alignWithLabel: true,
        show: false,
      }
      echartsOptions.xAxis[0].axisLine = {
        show: false,
      }
      echartsOptions.xAxis[0].axisLabel = {
        interval: 0,
        color: '#5c6168',
        fontSize: 10,
      }
      echartsOptions.yAxis[0].show = false
      delete echartsOptions.legend
      this.option = echartsOptions
    },
  },
}
</script>

<style scoped>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.echarts-bar-charts {
  height: 80px;
}
</style>
