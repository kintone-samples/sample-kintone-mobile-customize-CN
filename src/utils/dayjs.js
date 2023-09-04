import moment from 'moment'

//获取指定年月的第一天
export const GetThisMonthFirstDay = (month, year) => {
  let newMonth = month
  if (month < 10) {
    newMonth = 0 + month.toString()
  }
  return moment(`${year}-${newMonth}`).startOf('month').format('YYYY-MM-DD')
}

//获取指定年月的最后一天
export const GetThisMonthLastDay = (month, year) => {
  let newMonth = month
  if (month < 10) {
    newMonth = 0 + month.toString()
  }
  return moment(`${year}-${newMonth}`).endOf('month').format('YYYY-MM-DD')
}

//判断是否是今天
export const IsToday = (someDate) => {
  const today = moment()
  return moment(someDate).isSame(today, 'day')
}

export const formatToDate = (date) => {
  return moment(date).format('YYYY-MM-DD')
}

export const formatToTime = (date) => {
  return moment(date).format('HH:mm')
}

export const formatToComplete = (date) => {
  return moment(date).format('YYYY MM-DD HH:mm')
}

export const formatToCompleteZh = (date) => {
  return moment(date).format('YYYY/MM/DD HH:mm')
}

export const getRegionDates = (startDate, endDate) => {
  let daysList = []
  let SDate = moment(startDate)
  let EDate = moment(endDate)

  daysList.push(SDate.format('YYYY-MM-DD'))
  if (SDate.format('YYYY-MM-DD') != EDate.format('YYYY-MM-DD')) {
    while (moment(SDate.add(1, 'days').format('YYYY-MM-DD')).isBefore(moment(EDate.format('YYYY-MM-DD')))) {
      // 注意这里add方法处理后SDate对象已经改变。
      daysList.push(SDate.format('YYYY-MM-DD'))
    }
    daysList.push(EDate.format('YYYY-MM-DD'))
  }
  return daysList
}

//start 开始时间
//month 月份差
export const getDatePass = ([year, month], monthPass) => {
  return {
    month: moment([year, month]).subtract(monthPass, 'months').get('month') + 1,
    year: moment([year, month]).subtract(monthPass, 'months').get('year'),
  }
}

export const getToday = () => {
  return moment().format('YYYY-MM-DD')
}

export const getCurrentTime = () => {
  return moment().format('HH:mm')
}
