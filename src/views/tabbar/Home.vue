<template>
  <div ref="home" class="scroll-list-wrap">
    <cube-scroll ref="scroll" :options="options" @pulling-down="onPullingDown">
      <kintoneSearch />
      <swiper-charts />
      <favorites />
      <statistics />
    </cube-scroll>
  </div>
</template>

<script>
import kintoneSearch from '@/components/KintoneSearch.vue'
import swiperCharts from '_tabbar/home/HomeSwipeCharts.vue'
import favorites from '_tabbar/home/HomeGridApps.vue'
import statistics from '_tabbar/home/HomeStatistics.vue'
const componentName = 'home'

export default {
  name: componentName,
  inject: ['reload'],
  components: {
    kintoneSearch,
    swiperCharts,
    favorites,
    statistics,
  },
  data() {
    return {
      options: {
        probeType: 0,
        pullDownRefresh: {
          threshold: 60,
          stop: 40,
          txt: '更新成功',
        },
      },
    }
  },
  mounted() {
    const height = document.body.clientHeight
    this.$refs.home.style.height = `${height - 144}px`
  },
  methods: {
    onPullingDown() {
      this.reload(componentName)
    },
  },
}
</script>
<style scoped>
.scroll-list-wrap {
  background-image: linear-gradient(180deg, #abc3d4, #e3e7e8, #e3e7e8);
  background-repeat: no-repeat;
}
</style>
