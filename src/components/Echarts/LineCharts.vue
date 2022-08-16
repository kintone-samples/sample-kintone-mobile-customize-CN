<template>
  <div ref="linecharts" class="echarts-line-charts"></div>
</template>

<script>
import { GetRecords } from '@/services/kintoneApi'
import { config } from '@/config'

const app = config.lineCharts
const query = 'order by date asc limit 11'

export default {
  data() {
    return {
      line: {},
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
          const xDate = records.map((record) => {
            return record.date.value.slice(5)
          })
          const ySales = records.map((record) => {
            return [
              record.channel1.value,
              record.channel2.value,
              record.channel3.value,
              record.channel4.value,
              record.channel5.value,
            ].reduce((prev, item) => {
              return parseInt(prev, 10) + parseInt(item, 10)
            })
          })
          this.line = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            // 标题
            title: {
              left: 'center',
              text: '双十一销售额',
              top: '10',
              textStyle: {
                fontSize: 20,
                color: '#5c6168',
              },
            },
            grid: {
              width: '78%',
              left: '15%',
              height: '46%',
            },
            // x轴
            xAxis: {
              type: 'category',
              data: xDate,
              axisLabel: {
                fontSize: 10,
                fontWeight: 'normal',
                margin: 14,
                color: '#5c6168',
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  width: 0,
                },
              },
              axisTick: {
                show: false,
              },
            },
            // y轴
            yAxis: {
              name: '万元',
              nameTextStyle: {
                fontSize: 14,
                color: '#5c6168',
                fontWeight: 'normal',
                align: 'right',
                lineHeight: 50,
              },
              offset: -5,
              type: 'value',
              axisLabel: {
                fontSize: 10,
                fontWeight: 'normal',
                color: '#5c6168',
                margin: 14,
                // fontStyle: 'oblique',
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#4f90be',
                  type: [3, 4],
                  dashOffset: 5,
                  width: 1,
                },
              },
              min: 10,
              minInterval: 10,
            },
            // 数据
            series: [
              {
                data: ySales,
                type: 'line',
                color: '#65a3d3',
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                  width: 3,
                },
              },
            ],
          }
          const myEcharts = this.$echarts.init(this.$refs.linecharts)
          myEcharts.setOption(this.line)
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
.echarts-line-charts {
  height: 20rem;
}
</style>
