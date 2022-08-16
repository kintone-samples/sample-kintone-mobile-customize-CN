<template>
  <div class="container" v-bounce>
    <van-empty v-if="error" description="请求失败" />
    <div v-else>
      <div class="switch">
        <div class="title">首页展示应用</div>
        <van-switch v-model="checked" size="24px" />
      </div>

      <draggable
        ref="subscribed"
        v-model="subApps"
        group="apps"
        :class="['list', { 'no-data-subapps': noSubsApps }]"
        :disabled="!checked"
      >
        <div
          v-for="item in subApps"
          :key="item.id"
          :class="['item', { 'active-class': nowIndex === item.id }]"
          @click="!checked && addClickStyle(item.id)"
        >
          <van-image width="42" height="42" fit="contain" :src="item.icon" />
          <div class="appitem-link van-ellipsis">{{ item.name }}</div>
        </div>
      </draggable>

      <div class="title">所有应用</div>

      <!-- 骨架屏 -->
      <div v-if="loading" class="list">
        <div class="item" v-for="(item, index) in 16" :key="index">
          <div class="loading-img"></div>
          <div class="loading-text"></div>
        </div>
      </div>

      <draggable
        v-else
        ref="all"
        v-model="allApps"
        group="apps"
        :class="['list', { 'no-data-allapps': noAllApps }]"
        :disabled="!checked"
      >
        <div
          v-for="item in allApps"
          :key="item.id"
          :class="['item', { 'active-class': nowIndex === item.id }]"
          @click="!checked && addClickStyle(item.id)"
        >
          <van-image width="42" height="42" fit="contain" :src="item.icon" />
          <div class="appitem-link van-ellipsis">{{ item.name }}</div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { GetAppsList } from '@/services/kintoneApi'
import { mapActions } from 'vuex'

export default {
  name: 'appSubs',
  components: {
    draggable,
  },
  computed: {
    subApps: {
      get() {
        return this.$store.state.appsSubscribed.subApps
      },
      set(value) {
        let obj = {}
        value.filter((value) => {
          const key = value.id
          return obj.hasOwnProperty(key) ? false : (obj[key] = true)
        })
        this.updateAppsSubscribed(value)
      },
    },
  },
  activated() {
    this.checked = false
    this.initApps()
  },
  data() {
    return {
      allApps: [],
      checked: false,
      nowIndex: '',
      loading: false,
      noSubsApps: false,
      noAllApps: false,
    }
  },
  watch: {
    subApps: function (newAllApps) {
      newAllApps.length === 0 ? (this.noSubsApps = true) : (this.noSubsApps = false)
    },
    allApps: function (newAllApps) {
      newAllApps.length === 0 ? (this.noAllApps = true) : (this.noAllApps = false)
    },
  },
  methods: {
    ...mapActions(['getAppsSubscribed', 'updateAppsSubscribed']),
    async initApps() {
      this.allApps.length === 0 ? (this.loading = true) : (this.loading = false)

      await this.getAppsSubscribed()
      const subApps = this.$store.state.appsSubscribed.subApps

      const idList = subApps.map((item) => {
        return item.id
      })
      const appsList = await this.getAllApps()
      this.allApps = appsList.filter((item) => {
        return !idList.includes(item.id)
      })
    },

    addClickStyle(id) {
      this.nowIndex = id
      setTimeout(() => {
        window.location.href = `/k/m/${id}`
      }, 200)
    },
    async getAllApps() {
      const apps = await GetAppsList().catch(() => {})
      this.loading = false
      if (typeof apps == 'undefined') return []
      const result = apps.result.appList
      return result.map((item) => {
        return {
          id: item.id,
          icon: item.icons.NORMAL,
          name: item.name,
        }
      })
    },
  },
}
</script>
<style scoped>
.active-class {
  opacity: 1;
  animation: appactive 0.2s 1 normal;
}

@keyframes appactive {
  from {
    opacity: 0.1;
  }

  to {
    opacity: 1;
  }
}

.container {
  height: calc(100vh - 120px);
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.container::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.switch {
  display: flex;
  justify-content: space-between;
  margin: 20px 10px 0 0;
}

.lock {
  padding: 5px 0 0 10px;
  font-weight: bold;
  font-size: 15px;
}

.title {
  margin-left: 14px;
  color: #5c6168;
  font-weight: bold;
  font-size: 18px;
}

.list {
  display: flex;
  flex-wrap: wrap;
  min-height: 100px;
  margin: 10px 10px 20px;
  padding: 5px 10px 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 #d1dce5;
}

.item {
  position: relative;
  flex-basis: 25%;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
}

.appitem-link {
  width: 70px;
  padding: 5px;
  font-size: 12px;
}

.no-data-subapps {
  background: #fff url('https://cndevdemo.oss-cn-shanghai.aliyuncs.com/images/mobile-design/bg-subapps.png') center
    center no-repeat;
}

.no-data-allapps {
  background: #fff url('https://cndevdemo.oss-cn-shanghai.aliyuncs.com/images/mobile-design/bg-allapps.png') center
    center no-repeat;
}

.loading-img {
  width: 42px;
  height: 42px;
  margin: 0 auto;
  background-color: #f1f3f3;
  border-radius: 10px;
}

.loading-text {
  width: 50px;
  height: 12px;
  margin: 0 auto;
  margin-top: 13px;
  background-color: #f1f3f3;
  border-radius: 10px;
}
</style>
