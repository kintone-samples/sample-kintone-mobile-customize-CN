<template>
  <form action="/">
    <van-search v-model="value" shape="round" background="none" :placeholder="hint" @search="onSearch" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      hint: '请输入搜索关键词',
    }
  },
  methods: {
    onSearch(val) {
      window.location.href = `/k/m/search?keyword=${val}`
    },
  },
}
</script>
