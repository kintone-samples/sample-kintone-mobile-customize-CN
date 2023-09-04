<template>
  <div class="todo">
    <van-tabs v-model="active" line-width="60" color="#ffbf00" background="none" animated sticky>
      <van-tab :title="$t('Todo.myCalendar')">
        <calendarList />
      </van-tab>
      <van-tab :title="$t('Todo.todo')" :badge="assignedCount">
        <assigned />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import assigned from '@/views/tabbar/TodoAssigned.vue'
import calendarList from '@/views/tabbar/TodoCalendarList.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    assigned,
    calendarList,
  },
  name: 'todo',
  data() {
    return {
      active: 0,
    }
  },
  computed: {
    ...mapState({ 'assignedCount': state => state.assignedCount.assignedCount }),
  },
  created() {
    this.getAssigned()
  },
  methods: {
    ...mapActions(['getAssigned']),
  }
}
</script>
<style scoped>
.todo {
  background-image: linear-gradient(180deg, #abc3d4, #e3e7e8, #e3e7e8);
  background-repeat: no-repeat;
}

:deep(.van-tab--active) {
  font-weight: 700;
  font-size: 15px;
}
</style>
