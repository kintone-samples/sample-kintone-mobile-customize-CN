<template>
  <div ref="app" class="portal">
    <div id="mylistview" class="viewlist">
      <keep-alive :exclude="exclude">
        <router-view v-if="isRouterAlive" />
      </keep-alive>
    </div>
    <van-tabbar v-model="active" class="tabbar" placeholder route :border="false" v-if="$route.meta.show"
      active-color="#00cfff" inactive-color="#e4e9f2">
      <van-tabbar-item replace to="/">
        <span>{{ $t('Tab.home') }}</span>
        <template #icon="props">
          <img :src="props.active ? require(`@/assets/icons/home_active.svg`) : require(`@/assets/icons/home.svg`)"
            :class="props.active ? 'animate__heartBeat' : ''" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/contacts">
        <span>{{ $t('Tab.contacts') }}</span>
        <template #icon="props">
          <img
            :src="props.active ? require(`@/assets/icons/contacts_active.svg`) : require(`@/assets/icons/contacts.svg`)"
            :class="props.active ? 'animate__heartBeat' : ''" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/space">
        <span>{{ $t('Tab.space') }}</span>
        <template #icon="props">
          <img :src="props.active ? require(`@/assets/icons/space_active.svg`) : require(`@/assets/icons/space.svg`)"
            :class="props.active ? 'animate__heartBeat' : ''" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/appcards">
        <span>{{ $t('Tab.star') }}</span>
        <template #icon="props">
          <img :src="props.active ? require(`@/assets/icons/star_active.svg`) : require(`@/assets/icons/star.svg`)"
            :class="props.active ? 'animate__heartBeat' : ''" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/todo" :badge="assignedCount">
        <span>{{ $t('Tab.todo') }}</span>
        <template #icon="props">
          <img :src="props.active ? require(`@/assets/icons/todo_active.svg`) : require(`@/assets/icons/todo.svg`)"
            :class="props.active ? 'animate__heartBeat' : ''" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
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
  computed: {
    ...mapState({ 'assignedCount': state => state.assignedCount.assignedCount }),
  },
  created() {
    this.active = 0
    this.getAssigned()
  },
  methods: {
    ...mapActions(['getAssigned']),
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
@import 'animate.css';
</style>
