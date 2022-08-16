<template>
  <div class="appslist">
    <a
      v-for="(appinfo, appindex) in apps"
      :key="appindex"
      :href="`/k/m/${appinfo.appId}`"
      :class="['appitem-a', { 'active-class': nowIndex === appindex }]"
      @click="active(appindex)"
    >
      <van-image fit="contain" :src="appinfo.appIcon" />
      <div class="appitem-link">{{ appinfo.appName }}</div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    apps: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      nowIndex: '',
    }
  },
  methods: {
    active(index) {
      this.nowIndex = index
    },
  },
}
</script>
<style scoped>
.appitem-a {
  display: flex;
  padding: 0 20px;
  line-height: 70px;
}

.appitem-link {
  width: 100%;
  margin-left: 20px;
  color: #4b4b4b;
  line-height: 70px;
  vertical-align: middle;
  border-bottom: 1px solid #dfe9f1;
}

.appslist a:last-child .appitem-link {
  border-bottom: 0;
}

.active-class {
  background-color: #e9eff4;
}
</style>
