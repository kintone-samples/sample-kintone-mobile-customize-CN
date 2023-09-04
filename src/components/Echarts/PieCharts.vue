<template>
  <v-chart class="echarts-pie-charts" :option="option" />
</template>

<script>
import { GetOneAppInfo, GetRecords, GetFormFields } from '@/services/kintoneApi'
import { config } from '@/config'

import {
  useEChartOption,
  DimensionType,
  MetricType,
} from 'echarts-composables'


const app = config.pieCharts
const query = 'order by month asc limit 11'

export default {
  name: "PieCharts",

  data() {
    return {
      option: {},
    }
  },

  mounted() {
    this.initEcharts()
  },

  methods: {
    async initEcharts() {

      const dimensions = [
        {
          key: 'name',
          visual: DimensionType.Series,
        },
        {
          key: 'value',
          visual: DimensionType.Series,
        },
      ]

      const metrics = [
        {
          key: 'value',
          visual: MetricType.Pie,
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
      // console.log("pie appInfo", appInfo)
      //通过表单设置获取单位，产品名称
      const formSetting = await GetFormFields(app)
      // console.log(formSetting)
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
      }

      const addons = [
        // useLineArea()
      ]
      // console.log('dataset', dataset)

      const echartsOptions = useEChartOption({
        dataset, dimensions, metrics, meta, addons
      })

      echartsOptions.title = {
        left: 'auto',
        text: appInfo.name,
        top: '10',
        textStyle: {
          fontSize: 12,
          color: '#5c6168',
        },
      }
      echartsOptions.series[0].name = "Total"
      echartsOptions.series[0].radius = '55%'
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
.echarts-pie-charts {
  height: 20rem;
}
</style>
