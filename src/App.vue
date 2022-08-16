<template>
  <div ref="app" class="portal">
    <div id="mylistview" class="viewlist">
      <keep-alive :exclude="exclude">
        <router-view v-if="isRouterAlive" />
      </keep-alive>
    </div>
    <van-tabbar
      v-model="active"
      class="tabbar"
      placeholder
      route
      active-color="#3facfa"
      inactive-color="#e4e9f2"
      :border="false"
      v-if="$route.meta.show"
    >
      <van-tabbar-item replace icon="wap-home" to="/">门户</van-tabbar-item>
      <van-tabbar-item replace icon="friends" to="/contacts">通讯录</van-tabbar-item>
      <van-tabbar-item replace icon="comment" to="/space">空间</van-tabbar-item>
      <van-tabbar-item replace icon="star" to="/appcards">收藏</van-tabbar-item>
      <van-tabbar-item replace icon="todo-list" to="/todo">待办</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
const exclude = ['todo']

export default {
  provide() {
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      active: 0,
      isRouterAlive: true,
      exclude: exclude,
    }
  },
  created() {
    this.active = 0
  },
  methods: {
    reload(name) {
      this.isRouterAlive = false
      this.exclude.push(name)
      this.$nextTick(() => {
        this.exclude.pop()
        this.isRouterAlive = true
      })
    },
  },
}
</script>

<style scoped>
@import '@/assets/app.css';
</style>
