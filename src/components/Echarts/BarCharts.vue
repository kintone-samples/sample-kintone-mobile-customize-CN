<template>
  <div ref="barcharts" class="echarts-bar-charts"></div>
</template>

<script>
import { GetRecords } from '@/services/kintoneApi'
import { config } from '@/config'

const app = config.barCharts
const query = 'order by date asc limit 7'

export default {
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
    initEcharts() {
      GetRecords(app, query)
        .then((resp) => {
          const { records } = resp
          const xDate = ['京东', '淘宝', '拼多多', '天猫', '考拉']
          const ySales = [0, 0, 0, 0, 0]
          // eslint-disable-next-line no-restricted-syntax
          for (const record of records) {
            ySales[0] += parseInt(record.channel1.value, 10)
            ySales[1] += parseInt(record.channel2.value, 10)
            ySales[2] += parseInt(record.channel3.value, 10)
            ySales[3] += parseInt(record.channel4.value, 10)
            ySales[4] += parseInt(record.channel5.value, 10)
            if (record.date.value === '2019-11-11') {
              this.total.quantity2 =
                parseInt(record.channel1.value, 10) +
                parseInt(record.channel2.value, 10) +
                parseInt(record.channel3.value, 10) +
                parseInt(record.channel4.value, 10) +
                parseInt(record.channel5.value, 10)
            }
          }
          this.total.quantity = ySales.reduce((x, y) => x + y)
          this.total.profit = Number(this.total.quantity) * 0.3
          this.setTotalCount()
          this.option = {
            grid: {
              height: 50,
              top: 10,
              left: -5,
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            // title: {
            //   left: 'left',
            //   text: '各渠道总销售额',
            // },
            xAxis: {
              type: 'category',
              data: xDate,
              axisTick: {
                alignWithLabel: true,
                show: false,
              },
              axisLine: {
                show: false,
              },
              axisLabel: {
                interval: 0,
                color: '#5c6168',
                fontSize: 10,
              },
              offset: 2,
              boundaryGap: true,
              max: 5,
            },
            yAxis: {
              type: 'value',
              show: false,
            },
            series: [
              {
                itemStyle: {
                  color: '#76a1c2',
                  shadowBlur: 0,
                  borderRadius: 3,
                },
                data: ySales,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                  color: '#eaedf1',
                  borderRadius: 3,
                },
                barWidth: 15,
              },
            ],
          }
          const myEcharts = this.$echarts.init(this.$refs.barcharts)
          myEcharts.setOption(this.option)
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
.echarts-bar-charts {
  height: 80px;
}
</style>
