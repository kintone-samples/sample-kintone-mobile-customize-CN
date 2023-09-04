import { GetAssigned } from '@/services/kintoneApi'

const state = {
  assignedCount: null,
}

const actions = {
  getAssigned(context) {
    GetAssigned()
      .then((resp) => {
        let data = resp.result.assignedAppList.reduce((prev, cur) => {
          return prev + cur.count
        }, 0)

        if (data == 0) {
          data = null
        }
        context.commit('SETASSIGNEDCOUNT', data)
      })
      .catch(() => {})
  },
}

const mutations = {
  SETASSIGNEDCOUNT(state, value) {
    state.assignedCount = value
  },
}

export default {
  state,
  actions,
  mutations,
}
