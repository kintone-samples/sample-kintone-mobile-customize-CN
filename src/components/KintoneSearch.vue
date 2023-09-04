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
      hint: this.$t("KintoneSearch.hint"),
    }
  },
  methods: {
    onSearch(val) {
      window.location.href = `/k/m/search?keyword=${val}`
    },
  },
}
</script>
