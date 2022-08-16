<template>
  <div>
    <div class="s-line"></div>
    <van-row type="flex" align="bottom" class="statistics">
      <van-col span="14">
        <div class="statistics-title">各个平台的销售数据</div>
        <bar-charts @newcount="setTotal" />
      </van-col>
      <van-col span="10">
        <div class="statistics-data statistics-text s-bigFont">
          +{{ total.quantity2 }}<span class="statistics-data-symbol">万元</span>
        </div>
        <div class="statistics-text">11.11销售额</div>
      </van-col>
    </van-row>
    <div class="s-line"></div>
    <van-row type="flex" justify="space-between" class="statistics">
      <van-col>
        <div class="statistics-title">总销售额</div>
        <div class="statistics-data">
          {{ total.quantity | filterMoney }}<span class="statistics-data-symbol">万元</span>
        </div>
      </van-col>
      <van-col>
        <div class="statistics-title">净利润</div>
        <div class="statistics-data">
          {{ total.profit | filterMoney }}<span class="statistics-data-symbol">万元</span>
        </div>
      </van-col>
    </van-row>
    <div class="s-line"></div>
  </div>
</template>

<script>
import barCharts from '@/components/Echarts/BarCharts.vue'

export default {
  components: {
    barCharts,
  },
  filters: {
    filterMoney(value) {
      return value.toFixed(2)
    },
  },
  data() {
    return {
      total: { quantity: 0, quantity2: 0, profit: 0 },
    }
  },
  methods: {
    setTotal(value) {
      this.total = value
    },
  },
}
</script>
<style scoped>
.s-line {
  width: 85%;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.statistics {
  margin: 0 10px;
  padding: 20px;
  color: #5c6168;
  font-size: 12px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 #ced3d4;
}

.statistics-title {
  text-align: left;
}

.statistics-data {
  color: #76a1c2;
  font-weight: bold;
  font-size: 24px;
  font-family: 'TeX Gyre Adventor', 'Arial', 'Verdana';
}

.statistics-data-symbol {
  padding-left: 5px;
  color: #5c6168;
  font-weight: 100;
  font-size: 12px;
}

.statistics-text {
  text-align: right;
}

.s-bigFont {
  font-size: 34px;
}
</style>
