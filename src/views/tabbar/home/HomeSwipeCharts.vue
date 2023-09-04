<template>
  <van-swipe :loop="false" @change="onChange" class='container-swipe group-module-background'>
    <van-swipe-item><line-charts /></van-swipe-item>
    <van-swipe-item><pie-charts /></van-swipe-item>
    <template #indicator>
      <div class="custom-indicator">{{ current + 1 }}/2</div>
    </template>
  </van-swipe>
</template>

<script>
import lineCharts from '@/components/Echarts/LineCharts.vue'
import pieCharts from '@/components/Echarts/PieCharts.vue'

export default {
  components: {
    lineCharts,
    // barCharts,
    pieCharts,
  },
  data() {
    return {
      current: 0,
    }
  },

  methods: {
    onChange(index) {
      this.current = index
    },
  },
}
</script>

<style scoped>
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}

.container-swipe {
  position: relative;
  margin: 10px 10px;
  /* padding: 10px; */
  /* color: #5c6168; */
  font-size: 12px;
  /* background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 #ced3d4; */
}
</style>
