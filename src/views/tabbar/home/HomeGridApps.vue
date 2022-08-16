<template>
  <div class="grid">
    <van-grid square :column-num="columnNum" :border="false">
      <van-grid-item
        v-for="item in subApps"
        :key="item.id"
        :class="['appitem-a', { 'active-class': nowIndex === item.id }]"
        @click="addClickStyle(item.id)"
      >
        <van-image width="42" height="42" fit="contain" :src="item.icon" />
        <div class="appitem-link van-ellipsis">{{ item.name }}</div>
      </van-grid-item>
      <van-grid-item to="/appsdrag" class="appitem-a">
        <van-image
          width="42"
          height="42"
          fit="contain"
          src="https://cndevdemo.oss-cn-shanghai.aliyuncs.com/images/mobile-design/icon-more.png"
        />
        <div class="appitem-link van-ellipsis">全部应用</div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columnNum: '4',
      nowIndex: '',
    }
  },
  methods: {
    addClickStyle(id) {
      this.nowIndex = id
      setTimeout(() => {
        window.location.href = `/k/m/${id}`
      }, 200)
    },
  },

  computed: {
    subApps() {
      return this.$store.state.appsSubscribed.subApps
    },
  },
  created() {
    this.$store.dispatch('getAppsSubscribed')
  },
}
</script>

<style scoped>
.grid {
  margin: 0 10px;
}

.appitem-a {
  height: 95px;
  text-align: center;
  opacity: 1;
}

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

.appitem-link {
  width: 70px;
  padding-top: 5px;
  font-size: 12px;
}
</style>
