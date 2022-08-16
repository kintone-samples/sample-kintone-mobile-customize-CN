<template>
  <div ref="piecharts" class="echarts-pie-charts"></div>
</template>

<script>
import { GetRecords } from '@/services/kintoneApi'
import { config } from '@/config'

const app = config.pieCharts
const query = 'order by date asc limit 7'

export default {
  data() {
    return {
      total: 0,
    }
  },

  mounted() {
    this.initEcharts()
  },

  methods: {
    initEcharts() {
      GetRecords(app, query)
        .then((resp) => {
          const { records } = resp
          const ySales = [
            { value: 0, name: '京东' },
            { value: 0, name: '淘宝' },
            { value: 0, name: '拼多多' },
            { value: 0, name: '天猫' },
            { value: 0, name: '考拉' },
          ]

          // eslint-disable-next-line no-restricted-syntax
          for (const record of records) {
            ySales[0].value += parseInt(record.channel1.value, 10)
            ySales[1].value += parseInt(record.channel2.value, 10)
            ySales[2].value += parseInt(record.channel3.value, 10)
            ySales[3].value += parseInt(record.channel4.value, 10)
            ySales[4].value += parseInt(record.channel5.value, 10)
          }

          const option = {
            title: {
              text: '各渠道实时销量统计',
              textStyle: {
                color: '#5c6168',
                fontSize: 14,
              },
              left: '20',
              top: '3',
            },
            tooltip: {
              trigger: 'item',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            series: [
              {
                type: 'pie',
                id: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                data: ySales,

                label: {
                  color: '#fff',
                  borderType: 'solid',
                  borderWidth: 8,
                  borderColor: '#76a1c2',
                  borderDashOffset: 0,
                  borderRadius: [1],
                  backgroundColor: '#76a1c2',
                  lineHeight: 7,
                  verticalAlign: 'bottom',
                  align: 'center',
                  fontSize: 12,
                },
                labelLine: {
                  show: true,
                  length: 15,
                  length2: 20,
                  smooth: true,
                  lineStyle: {
                    width: 1.5,
                  },
                },
              },
            ],
          }
          const myEcharts = this.$echarts.init(this.$refs.piecharts)
          myEcharts.setOption(option)
        })
        .catch(() => {})
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
