<template>
  <div class="todo">
    <van-tabs v-model="active" line-width="60" color="#ffbf00" background="none" animated sticky>
      <van-tab title="我的日程"><calendarList /></van-tab>
      <van-tab title="未处理" :badge="assignedCount"><assigned /></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import assigned from '@/views/tabbar/TodoAssigned.vue'
import calendarList from '@/views/tabbar/TodoCalendarList.vue'
import { GetAssigned } from '@/services/kintoneApi'

export default {
  components: {
    assigned,
    calendarList,
  },
  name: 'todo',
  data() {
    return {
      active: 0,
      assignedCount: 0,
    }
  },
  created() {
    GetAssigned()
      .then((resp) => {
        this.assignedCount = resp.result.assignedAppList.reduce((prev, cur) => {
          return prev + cur.count
        }, 0)
      })
      .catch(() => {})
  },
}
</script>
<style scoped>
.todo {
  background-image: linear-gradient(180deg, #abc3d4, #e3e7e8, #e3e7e8);
  background-repeat: no-repeat;
}

/deep/ .van-tab--active {
  font-weight: 700;
  font-size: 15px;
}
</style>
