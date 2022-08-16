<template>
  <van-pull-refresh v-model="refreshing" disabled @refresh="onRefresh">
    <van-skeleton
      title
      avatar
      :row="3"
      :loading="loading"
      avatar-size="48px"
      round
      avatar-shape="square"
      class="skeleton"
    >
      <div ref="spaceList">
        <van-list
          v-model="loading"
          class="app"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="onLoad"
        >
          <van-collapse v-for="(item, index) in spaceList" :key="index" v-model="activeNames" accordion size="large">
            <van-collapse-item class="spacelist-item" :name="item.id">
              <template #title>
                <div class="spacelist-item-link" @click.stop="goto(item.id)">
                  <van-image class="spacelist-item-link-icon" fit="cover" radius="5" :src="item.coverUrl" />
                  <span class="spacelist-item-link-text van-ellipsis">{{ item.name }}</span>
                </div>
                <div class="van-multi-ellipsis--l3 spacelist-item-wrap">{{ item.body | filterHtml }}</div>
              </template>
              <apps-list :apps="item.apps" />
            </van-collapse-item>
          </van-collapse>
        </van-list>
      </div>
    </van-skeleton>
  </van-pull-refresh>
</template>

<script>
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { GetMySpacesWithApps } from '@/services/kintoneApi'
import appsList from '@/components/AppsList.vue'

BScroll.use(ObserveDOM)

const size = 5
const spaceDefaultInfo = '这是一个空间'

export default {
  name: 'spaceList',
  components: {
    appsList,
  },
  filters: {
    filterHtml(val) {
      if (val === null) return spaceDefaultInfo
      return val.replace(/<[^>]*>/g, '')
    },
  },
  data() {
    return {
      spaceList: [],
      activeNames: [],
      hasMore: false,
      offset: 0,
      loading: false,
      error: false,
      finished: false,
      refreshing: false,
    }
  },
  mounted() {
    const height = document.body.clientHeight
    this.$refs.spaceList.style.height = `${height - 144}px`
  },
  methods: {
    getMySpaces(offset) {
      return GetMySpacesWithApps(offset, size)
    },
    onLoad() {
      if (this.refreshing) {
        this.spaceList = []
        this.offset = 0
        this.hasMore = false
        this.refreshing = false
      }
      this.getMySpaces(this.offset)
        .then((resp) => {
          const { spaceList, hasMore } = resp
          this.spaceList = [...this.spaceList, ...spaceList]
          this.hasMore = hasMore
          this.offset += spaceList.length
          this.loading = false
          if (hasMore === false) {
            this.finished = true
          }
          setTimeout(() => {
            this.scroll = new BScroll(this.$refs.spaceList, { click: true, observeDOM: true })
          }, 20)
        })
        .catch(() => {
          this.loading = false
          this.error = true
        })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    goto(val) {
      window.location.href = `/k/m/space/${val}#`
    },
  },
}
</script>
<style scoped>
@import '@/assets/spaceList.css';
</style>
