<template>
  <div>
    <div class="calendarList">
      <v-calendar
        ref="calendar"
        is-expanded
        :attributes="attrs"
        @update:from-page="changeMonth"
        @dayclick="onDayClick"
      />
    </div>
    <div class="myCalendar">
      <div class="title">
        <div class="text">我的日程</div>
        <van-icon name="add" color="#1989fa" size="32" @click="add" />
      </div>
      <div class="list">
        <van-empty v-if="error" description="请求失败" />
        <van-empty v-else-if="selectDayEvents.length === 0" description="暂无日程" image-size="139" />
        <ul v-else>
          <li
            v-for="(item, index) in selectDayEvents"
            :key="index"
            class="item"
            :style="{ 'border-color': item.color }"
            @click="goto(item.id)"
          >
            <span class="time">{{ item.dates | toComplete }}</span>
            <span class="text van-ellipsis">{{ item.title }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { GetAppViews, GetRecords } from '@/services/kintoneApi'
import { GetThisMonthFirstDay, GetThisMonthLastDay, IsToday, formatToComplete, formatToTime } from '@/utils/dayjs'
import { config } from '@/config'

const appid = config.todo
const query = 'date >= LAST_MONTH(1) and date <= NEXT_MONTH(LAST) limit 500'
const calendarListName = 'calendar'
const colorList = {
  gray: '#a0aec0',
  red: '#f56565',
  orange: '#ed8936',
  yellow: '#ecc94b',
  green: '#48bb78',
  teal: '#38b2ac',
  blue: '#4299e1',
  indigo: '#667eea',
  purple: '#9f7aea',
  pink: '#ed64a6',
}

export default {
  filters: {
    toTime(val) {
      return formatToTime(val)
    },
    toComplete(val) {
      return formatToComplete(val)
    },
  },
  data() {
    return {
      attrs: [],
      query,
      titleField: '',
      dateField: '',
      selectDayEvents: [],
      firstLoad: true,
      error: false,
    }
  },
  mounted() {
    const calendar = this.$refs.calendar
    const date = new Date()
    calendar.focusDate(date)
  },
  methods: {
    goto(val) {
      window.location.href = `/k/m/${appid}/show?record=${val}#`
    },
    add() {
      window.location.href = `/k/m/${appid}/edit#/`
    },
    onDayClick(data) {
      const { attributes } = data
      this.selectDayEvents = attributes.map((item, index) => {
        const { customData } = item
        return customData
      })
    },
    changeMonth(date) {
      if (!this.titleField || !this.dateField) {
        this.getView().then((resp) => {
          this.setData(date)
        })
      } else {
        this.setData(date)
      }
    },
    getView() {
      return GetAppViews(appid)
        .then((resp) => {
          const { views } = resp
          if (calendarListName in views) {
            this.titleField = views[calendarListName].title
            this.dateField = views[calendarListName].date
          }
        })
        .catch((resp) => {
          this.error = true
        })
    },
    setQuery(date) {
      const { month, year } = date
      const dayStart = GetThisMonthFirstDay(month, year)
      const dayEnd = GetThisMonthLastDay(month, year)
      this.query = `${this.dateField} >= "${dayStart}" and ${this.dateField} <= "${dayEnd}" limit 500`
    },
    setData(date) {
      if (!this.titleField || !this.dateField) return
      this.setQuery(date)
      GetRecords(appid, this.query)
        .then((resp) => {
          const { records } = resp
          const colors = Object.keys(colorList)
          this.attrs = records.map((record, index) => {
            // 取模来定义颜色的索引
            const temp = index % colors.length
            const date = record[this.dateField].value
            const title = record[this.titleField].value
            const id = record.$id.value
            const todo = {
              title,
              dates: date,
              id,
              color: colors[temp],
            }
            const dateObj = new Date(date)
            if (IsToday(dateObj) && this.firstLoad) {
              this.selectDayEvents.push(todo)
            }
            const item = {
              bar: todo.color,
              dates: dateObj,
              customData: todo,
            }

            return item
          })
          this.firstLoad = false
        })
        .catch((resp) => {
          this.error = true
        })
    },
  },
}
</script>

<style lang="less" scoped>
.calendarList {
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 #d1dce5;
}

.vc-container {
  background-color: unset;
  border: 0;
}

.myCalendar {
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 #d1dce5;

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #e3e7e8;

    .text {
      padding-top: 5px;
      color: #5c6168;
      font-weight: 700;
      font-size: 16px;
    }
  }

  .list {
    max-height: 185px;
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;

    .van-empty {
      padding: 0 0 10px;
    }

    .item {
      margin: 0 0 15px 5px;
      font-size: 14px;
      line-height: 150%;
      border-left: 3px solid #fff;

      .time {
        display: block;
        padding-left: 10px;
      }

      .text {
        display: inline-block;
        width: 90%;
        margin-bottom: 5px;
        padding-left: 10px;
        font-weight: 700;
        vertical-align: middle;
      }
    }
  }

  .list::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
