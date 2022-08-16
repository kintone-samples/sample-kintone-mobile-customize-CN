<template>
  <div ref="appcards" class="container-water-fall waterfall">
    <van-empty v-if="error" description="请求失败" />
    <waterfall v-else :col="col" :data="list" @loadmore="loadmore" @scroll="refresh">
      <div v-for="(item, index) in list" :key="index" class="cell-item appitem">
        <div class="item-body">
          <a :href="item['Link'].value | toMobileUrl">
            <van-image fit="contain" :src="item['Image'].value" />
            <div class="appitem-link">{{ item['Name'].value }}</div>
          </a>
        </div>
      </div>
    </waterfall>
  </div>
</template>

<script>
import { GetRecords } from '@/services/kintoneApi'
import { config } from '@/config'

const appid = config.appCards
const limit = 20

export default {
  name: 'appcards',
  filters: {
    toMobileUrl(val) {
      const reg1 = /^\/k\/#\//
      const reg2 = /^\/k\//
      return reg1.test(val) ? val.replace(reg1, '/k/m/') : val.replace(reg2, '/k/m/')
    },
  },
  data() {
    return {
      list: [],
      col: 2,
      finished: false,
      offset: 0,
      error: false,
    }
  },
  computed: {
    message() {
      const message = '--没有更多内容啦--'
      return this.finished ? message : ''
    },
  },
  created() {
    this.getRecords(this.offset)
      .then((resp) => {
        const { records } = resp
        this.list = records
        this.offset += records.length
      })
      .catch(() => {
        this.error = true
      })
  },
  methods: {
    getRecords(offset) {
      const query = `order by sort desc limit ${limit} offset ${offset}`
      return GetRecords(appid, query)
    },
    refresh() {
      this.getRecords(0)
        .then((resp) => {
          const { records } = resp
          this.list = records
          this.offset += records.length
        })
        .catch(() => {
          this.error = true
        })
    },
    loadmore() {
      this.getRecords(this.offset)
        .then((resp) => {
          const { records } = resp
          this.offset += records.length
          this.list = [...this.list, ...records]
          if (records.length === 0) this.finished = true
        })
        .catch(() => {
          this.error = true
        })
    },
  },
}
</script>

<style scoped>
.waterfall {
  margin: 0 5px;
}

.appitem {
  margin: 10px 5px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px 1px 2px #ccc;
}

.appitem img {
  border-radius: 5px 5px 0 0;
}

.appitem-link {
  padding: 5px;
}
</style>
