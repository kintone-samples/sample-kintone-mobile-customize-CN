import { GetRecords, UpdateRecord, AddRecord } from '@/services/kintoneApi'
import { config } from '@/config'
const appid = config.appsDrag
const updatekey = 'username'
const settingField = 'item'
const user = kintone.getLoginUser()

const state = {
  subApps: [],
}

const actions = {
  async getAppsSubscribed(context) {
    const query = `${updatekey} = "${user.code}" limit 1`
    let data = []
    const result = await GetRecords(appid, query).catch(() => {})
    if (typeof result == 'undefined') return
    const { totalCount, records } = result
    if (totalCount == 0) {
      const record = { [settingField]: { value: '[]' }, [updatekey]: { value: user.code } }
      AddRecord(appid, record).catch(() => {})
    } else {
      data = JSON.parse(records[0][settingField].value)
    }
    context.commit('SETAPPSSUBSCRIBED', data)
  },

  updateAppsSubscribed(context, value) {
    const newValue = JSON.stringify(JSON.parse(JSON.stringify(value)))
    const record = { [settingField]: { value: newValue } }
    const updateKey = {
      field: updatekey,
      value: user.code,
    }
    context.commit('SETAPPSSUBSCRIBED', value)
    UpdateRecord(appid, updateKey, record)
  },
}

const mutations = {
  SETAPPSSUBSCRIBED(state, value) {
    state.subApps = value
  },
}

export default {
  state,
  actions,
  mutations,
}
