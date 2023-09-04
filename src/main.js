import Vue from 'vue'
import '@/libs/vantUI'
import '@/libs/cubeUI'
import i18n from '@/libs/i18n'
//百度统计,解决spa页面的统计问题
// import baiduAnalytics from 'vue-baidu-analytics'
// import echarts from '@/libs/echartsUI'
import '@/libs/echarts'
//瀑布流显示
import waterfall from 'vue-waterfall2'
import VCalendar from 'v-calendar'
//解决ios的弹性回弹问题
import Bounce from 'vue-bounce'

import store from '@/vuex/store'
import App from '@/App.vue'
import router from '@/router'
import { config } from '@/config'

Vue.use(Bounce)
Vue.use(VCalendar)
Vue.use(waterfall)
// Vue.prototype.$echarts = echarts

router.beforeEach((to, from, next) => {
  // to（当前页面） form（前一页面）
  // 判断当前页是不是目标页，再判断前一页面是否要缓存
  // if (to.name === 'interviewDetail' && from.name === 'interviewManagement') {
  //   from.meta.keepAlive = true
  // } else {
  //   from.meta.keepAlive = false
  // }
  next()
})

// Vue.use(baiduAnalytics, {
//   router: router,
//   siteIdList: [config.baiduTongjiSiteId],
//   isDebug: false,
// })

kintone.events.on('mobile.portal.show', (event) => {
  const contentSpaceElement = kintone.mobile.portal.getContentSpaceElement()
  Vue.config.productionTip = false
  new Vue({
    i18n,
    router,
    store,
    render: (h) => h(App),
  }).$mount(contentSpaceElement)
  return event
})
