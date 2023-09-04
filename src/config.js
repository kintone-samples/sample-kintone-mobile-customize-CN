export const config = {
  appCards: process.env.VUE_APP_APPCARDS,
  barCharts: process.env.VUE_APP_BARCHARTS,
  lineCharts: process.env.VUE_APP_LINECHARTS,
  pieCharts: process.env.VUE_APP_PIECHARTS,
  calendar: process.env.VUE_APP_CALENDAR,
  todo: process.env.VUE_APP_TODO,
  appsDrag: process.env.VUE_APP_APPSDRAG,
  baiduTongjiSiteId: process.env.VUE_APP_BAIDUTONGJI_SITEID,
}

export const statusColorList = {
  会議: 'green',
  休み: 'red',
  出社: 'gray',
  往訪: 'orange',
  TODO: 'purple',
}

export const calendarField = {
  startDateField: 'startDate',
  endDateField: 'endDate',
  titleField: 'title',
  statusField: 'type',
  usersField: 'users',
  shareField: 'share',
}

export const chartsField = {}
