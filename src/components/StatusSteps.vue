<template>
  <van-steps direction="vertical" :active="0">
    <van-step  v-for="(item, index) in steps"
      :key="index">
      <h3>{{item.state.label}}</h3>
      <p>{{item.assignees[0].name}}</p>
      <p>{{item.dateTime}}</p>
    </van-step>
</template>

<script>
import { GetRecordSteps } from '@/services/kintoneApi'

export default {
  props: {
    app:{
      type: String,
      default() {
        return ''
      },
    },
    recordId: {
      type: String,
      default() {
        return ''
      },
    },
  },
  data(){
    return {
      steps:[]
    }
  },
  created(){
    return GetRecordSteps(this.app,this.recordId).then((resp) => {
        const {result} = resp
        const {items} = result
        this.steps = items
      }).catch(() => {})

  }
}
</script>
