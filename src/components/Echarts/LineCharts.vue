<template>
  <v-chart class="echarts-line-charts" :option="option" />
</template>

<script>
import { GetOneAppInfo, GetRecords, GetFormFields } from '@/services/kintoneApi'
import { config } from '@/config'

import {
  useEChartOption,
  DimensionType,
  MetricType,
  useLineArea
} from 'echarts-composables'


const app = config.lineCharts
const query = 'order by month asc limit 11'

export default {
  name: "LineCharts",

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
          key: 'month',
          visual: DimensionType.CategoryAxis,
        },
        {
          key: 'type',
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
          visual: MetricType.Line,
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
      const formSetting = await GetFormFields(app)
      // console.log(formSetting)
      const { records } = resp
      // console.log(records)

      let dataset = []
      for (const item of records) {
        const { month, channel1, channel2, channel3, channel4 } = item
        dataset.push({
          month: month.value,
          type: 'channel1',
          value: channel1.value
        })
        dataset.push({
          month: month.value,
          type: 'channel2',
          value: channel2.value
        })
        dataset.push({
          month: month.value,
          type: 'channel3',
          value: channel3.value
        })
        dataset.push({
          month: month.value,
          type: 'channel4',
          value: channel4.value
        })
      }

      const addons = [
        useLineArea()
      ]
      // console.log('dataset', dataset)

      const echartsOptions = useEChartOption({
        dataset, dimensions, metrics, meta, addons
      })
      // console.log('echartsOptions', echartsOptions)
      //删除legend属性
      // delete echartsOptions.legend
      echartsOptions.series = echartsOptions.series.map(r => {
        r.smooth = true
        return r
      })

      echartsOptions.title = {
        left: 'auto',
        text: appInfo.name,
        top: '10',
        textStyle: {
          fontSize: 18,
          color: '#5c6168',
        },
      }


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
.echarts-line-charts {
  height: 20rem;
  padding: 10px;
}
</style>
