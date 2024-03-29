<template>
  <van-pull-refresh v-model="refreshing" disabled @refresh="onRefresh">
    <van-skeleton title avatar :row="3" :loading="loading" avatar-size="48px" round avatar-shape="square"
      class="skeleton">
      <div ref="spaceList">
        <van-list v-model="loading" class="app" :finished="finished" :finished-text="$t('SpaceList.noMore')"
          :error.sync="error" :error-text="$t('ErrorInfo.failedRetry')" @load="onLoad">
          <van-collapse v-for="(item, index) in spaceList" :key="index" v-model="activeNames" accordion size="large">
            <div style="position: relative">
              <van-collapse-item class="spacelist-item " :name="item.id">
                <template #title>
                  <div :class="[{ 'overlay': item.isGuest }]"></div>
                  <div class="spacelist-item-link" @click.stop="goto(item.id)">
                    <van-image class="spacelist-item-link-icon" fit="cover" radius="5" :src="item.coverUrl" />
                    <span class="spacelist-item-link-text van-ellipsis">{{ item.name }}</span>
                  </div>
                  <div class="van-multi-ellipsis--l3 spacelist-item-wrap">{{ item.body | filterHtml }}</div>
                </template>
                <apps-list :apps="item.apps" />
              </van-collapse-item>
            </div>
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

export default {
  name: 'spaceList',
  components: {
    appsList,
  },
  filters: {
    filterHtml(val) {
      if (val === null) return ''
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
    onLoad() {
      GetMySpacesWithApps(this.offset)
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
      let url = ''
      for (let i = 0; i < this.spaceList.length; i++) {
        if (this.spaceList[i].id === val) {
          const spaceInfo = this.spaceList[i]
          url = spaceInfo.isGuest ? `/k/guest/${val}/m/space/${val}/thread/${spaceInfo.defaultThread}` : `/k/m/space/${val}#`
          break
        }
      }
      window.location.href = url
    },
  },
}
</script>
<style scoped>
@import '@/assets/spaceList.css';
</style>
