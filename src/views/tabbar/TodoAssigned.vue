<template>
  <div class="item-shadow">
    <van-empty v-if="error" description="请求失败" />
    <van-empty v-else-if="list.length === 0 && loaded" description="没有未处理" />
    <van-cell
      v-else
      v-for="(item, index) in list"
      :key="index"
      class="item"
      size="large"
      value-class="assignedcount-badge"
      title-class="title van-ellipsis"
      center
      :value="item.count"
      is-link
      :url="item.id + '/?bview=ASSIGN#/'"
    >
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <van-image class="item-link-icon" fit="cover" radius="5" :src="item.icon" />
        <span class="item-link-text">{{ item.name }}</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { GetAssigned } from '@/services/kintoneApi'

export default {
  name: 'assigned',
  data() {
    return {
      list: [],
      loaded: false,
      error: false,
    }
  },
  created() {
    GetAssigned()
      .then((resp) => {
        this.list = resp.result.assignedAppList
        this.loaded = true
      })
      .catch((resp) => {
        this.error = true
      })
  },
}
</script>
<style scoped>
.van-cell {
  background-color: unset;
}

.item-shadow {
  margin: 10px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 0 0 5px 0 #d1dce5;
}

.item {
  padding: 0 16px;
  line-height: 70px;
}

.item-link-icon {
  width: 45px;
  margin-right: 10px;
  vertical-align: middle;
}

.item-link-icon img {
  width: 100%;
  height: 100%;
}

.item-link-text {
  font-size: 14px;
}

.title {
  flex: auto;
}

.assignedcount-badge {
  flex: initial;
  width: 50px;
}

.assignedcount-badge span {
  display: inline-block;
  box-sizing: border-box;
  min-width: 20px;
  max-height: 20px;
  padding: 1px 5px;
  color: #fff;
  line-height: 1.5;
  text-align: center;
  background-color: #d82509;
  border-radius: 16px;
}
</style>
