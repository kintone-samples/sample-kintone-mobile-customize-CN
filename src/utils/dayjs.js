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
  return moment(date).format('YYYY-MM-DD HH:mm')
}
