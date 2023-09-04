<template>
  <div>
    <div class="calendarList">
      <v-calendar ref="calendar" is-expanded :attributes="attrs" @update:from-page="changeMonth" @dayclick="onDayClick"
        :locale="$i18n.locale" />
    </div>
    <div class="myCalendar">
      <div class="title">
        <div class="text">{{ $t("TodoCalendarList.myCalendar") }}</div>
        <van-icon name="add" color="#1989fa" size="32" @click="add" />
      </div>
      <div class="list">
        <van-empty v-if="error" :description="$t('ErrorInfo.requestFailed')" />
        <van-empty v-else-if="selectDayEvents.length === 0" :description="$t('TodoCalendarList.noCalendar')"
          image-size="139" />
        <ul v-else>
          <li v-for="(item, index) in selectDayEvents" :key="index" class="item" :style="{ 'border-color': item.color }"
            @click="goto(item.id)">
            <span class="time">
              <span>{{ item.duringDate[0] }}</span> ~
              <span>{{ item.duringDate[1] }}</span>
            </span>

            <span class="text van-ellipsis">
              <span v-if="item.shareFlag" class="share">{{ $t("TodoCalendarList.share") }}</span>
              <span class="lable" :style="{ 'background-color': item.statusColor }">{{ item.status }}</span>
              {{ item.title }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { GetRecords } from '@/services/kintoneApi'
import { GetThisMonthFirstDay, GetThisMonthLastDay, IsToday, formatToComplete, formatToCompleteZh, getRegionDates } from '@/utils/dayjs'
import { config, statusColorList, calendarField } from '@/config'
import moment from 'moment'

const appid = config.todo
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
  data() {
    return {
      attrs: [],
      query: '',
      selectDayEvents: [],
      firstLoad: true,
      error: false,
      statusColorMapping: {},
      colorList,
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
      let list = []
      attributes.forEach(function (item, index, arr) {
        if (typeof (item.customData) !== "undefined") {
          list.push(item.customData)
        }
      });
      this.selectDayEvents = list
    },
    changeMonth(date) {
      this.setQuery(date)
      this.setRecord(date)
    },

    setQuery(date) {
      const { month, year } = date
      const thisMonthFirstDay = GetThisMonthFirstDay(month, year)
      const thisMonthLastDay = GetThisMonthLastDay(month, year)
      this.query = `${calendarField.startDateField} <= "${thisMonthLastDay}" and ${calendarField.endDateField} >= "${thisMonthFirstDay}" and
      (${calendarField.usersField} in (LOGINUSER()) or ${calendarField.shareField} in (LOGINUSER()))`
    },

    fetchRecords(offset = 0, limit = 500, allRecords = []) {
      const queryWithLimit = `${this.query} order by ${calendarField.startDateField} asc limit ${limit} offset ${offset}`
      return GetRecords(appid, queryWithLimit)
        .then((resp) => {
          const { records } = resp
          allRecords = allRecords.concat(records);
          if (records.length === limit) {
            return this.fetchRecords(offset + limit, limit, allRecords);
          }
          return allRecords;
        });
    },

    async setRecord(date) {
      const allRecords = await this.fetchRecords()
      const { month, year } = date
      const thisMonthFirstDay = GetThisMonthFirstDay(month, year)
      const thisMonthLastDay = GetThisMonthLastDay(month, year)
      const colors = Object.keys(colorList)

      let attendRecords = []
      let shareRecords = []

      //日程排序： 个人日程排前面，共享日程排后面
      const loginUser = kintone.getLoginUser()

      allRecords.forEach((record, index) => {
        const attendsValue = record[calendarField.usersField].value
        const attends = attendsValue.map((v) => {
          return v.code
        })
        record.$shareFlag = !attends.includes(loginUser.code) ? true : false
        if (record.$shareFlag) {
          shareRecords.push(record)
        }
        else {
          attendRecords.push(record)
        }
      })
      const newAllRecords = attendRecords.concat(shareRecords)

      this.attrs = newAllRecords.map((record, index) => {
        // 取模来定义颜色的索引
        const temp = index % colors.length
        const startdate = record[calendarField.startDateField].value
        const enddate = record[calendarField.endDateField].value
        const shareFlag = record.$shareFlag

        //比较，开始时间比本月第一天小的，直接取本月第一天，结束时间比本月最后天大的，直接取本月最后天
        const chooseStartDate = moment(startdate).isBefore(thisMonthFirstDay) ? thisMonthFirstDay : startdate
        const chooseEndDate = moment(enddate).isAfter(thisMonthLastDay) ? thisMonthLastDay : enddate
        const dates = getRegionDates(chooseStartDate, chooseEndDate)
        const status = record[calendarField.statusField].value
        const statusColorsObj = Object.keys(statusColorList)
        const statusTempColorsObj = Object.keys(this.statusColorMapping)

        const tempColor = colors[temp]
        let statusColor = colors[temp]
        if (statusColorsObj.includes(status)) {
          statusColor = statusColorList[status]
        }
        else if (statusTempColorsObj.includes(status)) {
          statusColor = this.statusColorMapping[status]
        }
        else {
          this.statusColorMapping[status] = tempColor
        }
        const duringDate = loginUser.language === 'zh' ? [formatToCompleteZh(startdate), formatToCompleteZh(enddate)] : [formatToComplete(startdate), formatToComplete(enddate)]
        const title = record[calendarField.titleField].value
        const id = record.$id.value
        const todo = {
          title,
          duringDate,
          status,
          id,
          statusColor,
          color: colors[temp],
          shareFlag: shareFlag
        }
        if (this.firstLoad) {
          dates.forEach((dateObj) => {
            if (IsToday(dateObj)) {
              this.selectDayEvents.push(todo)
            }
          });
        }

        const item = {
          bar: todo.color,
          dates: dates,
          customData: todo,
        }
        return item
      })

      const todayCheck = {
        key: 'today',
        highlight: 'red',
        dates: new Date(),
      }
      this.attrs.push(todayCheck)
      this.firstLoad = false
    }
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
    height: 210px;
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;

    .van-empty {
      padding: 0 0 10px;
    }

    .item {
      margin: 0 0 15px 5px;
      padding-left: 5px;
      font-size: 14px;
      line-height: 150%;
      border-left: 3px solid #fff;

      .time {
        display: block;

        span {
          display: inline-block;
          padding: 0 4px;
          font-size: 13px;
          background-color: #efefef;
          border-radius: 3px;
        }
      }

      .text {
        display: inline-block;
        width: 90%;
        font-weight: 700;
        vertical-align: middle;

        .share {
          border: 1px solid #ff0000;
          padding: 0 6px;
          margin-right: 5px;
          border-radius: 4px;
        }

        .lable {
          display: inline-block;
          margin: 5px 0px;
          padding: 0 6px;
          color: #fff;
          border-radius: 4px;
        }
      }
    }
  }

  .list::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }
}
</style>
