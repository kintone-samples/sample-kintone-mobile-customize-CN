<template>
  <div ref="box" class="box">
    <van-empty v-if="error" description="请求失败" />
    <div v-else ref="listView" class="list-view">
      <ul>
        <li v-for="(item, index) in list" :key="index" ref="listGroup" class="list-group">
          <h2 class="list-group-title">{{ item.name }}</h2>
          <ul>
            <li
              v-for="(v, i) in item.item"
              :key="i"
              :class="['list-group-item', { 'active-class': nowIndex === index + '-' + i }]"
              @click.stop="goto(v.code, index + '-' + i)"
            >
              <van-image radius="5" fit="cover" :src="v.photoUrl" />
              <span class="name">{{ v.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut">
        <ul>
          <li
            v-for="(sitem, sindex) in shortcutList"
            :key="sitem.id"
            class="item"
            :data-index="sindex"
            :class="{ current: currentIndex === sindex }"
            @touchstart="onShortcutStart"
            @touchmove.stop.prevent="onShortcutMove"
          >
            {{ sitem }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import { GetContacts } from '@/services/kintoneApi'
import firstLetterSort from '@/utils/pinyinSort'

export default {
  name: 'contacts',
  data() {
    return {
      list: [],
      nowIndex: '',
      scrollY: 0,
      currentIndex: 0,
      error: false,
    }
  },
  computed: {
    shortcutList() {
      return this.list.map((group) => {
        return group.name.substr(0, 1)
      })
    },
  },
  watch: {
    scrollY(newVal) {
      // 向下滑动的时候 newVal 是一个负数，所以当 newVal > 0 时，currentIndex 直接为 0
      if (newVal > 0) {
        this.currentIndex = 0
        return
      }

      // 计算 currentIndex 的值
      for (let i = 0; i < this.listHeight.length - 1; i += 1) {
        const height1 = this.listHeight[i]
        const height2 = this.listHeight[i + 1]
        if (-newVal >= height1 && -newVal < height2) {
          this.currentIndex = i
          return
        }
      }

      // 当超 -newVal > 最后一个高度的时候
      // 因为 this.listHeight 有头尾，所以需要 - 2
      this.currentIndex = this.listHeight.length - 2
    },
  },
  created() {
    this.touch = {}
    GetContacts()
      .then((resp) => {
        const data = resp.result.items
        this.list = firstLetterSort(data, 'name')
        setTimeout(() => {
          this.setHeight()
          this.initSrcoll()
          this.calculateHeight()
        }, 20)
      })
      .catch((resp) => {
        this.error = true
      })

    // 初始化 better-scroll 必须要等 dom 加载完毕
  },

  methods: {
    goto(val, index) {
      this.nowIndex = index
      window.location.href = `/k/m/people/user/${val}#`
    },
    onShortcutStart(e) {
      // 获取到绑定的 index
      const index = e.target.getAttribute('data-index')
      // 使用 better-scroll 的 scrollToElement 方法实现跳转
      this.scrollToElement(index)
      // 记录一下点击时候的 Y坐标 和 index
      const firstTouch = e.touches[0].pageY
      this.touch.y1 = firstTouch
      this.touch.anchorIndex = index
    },
    onShortcutMove(e) {
      // 再记录一下移动时候的 Y坐标，然后计算出移动了几个索引
      const touchMove = e.touches[0].pageY
      this.touch.y2 = touchMove
      // 这里的 16.7 是索引元素的高度
      const delta = Math.floor((this.touch.y2 - this.touch.y1) / 16.7)
      // 计算最后的位置
      // * 1 是因为 this.touch.anchorIndex 是字符串，用 * 1 偷懒的转化一下
      const index = this.touch.anchorIndex * 1 + delta
      this.scrollToElement(index)
    },
    scrollToElement(index) {
      // 处理边界情况
      // 因为 index 通过滑动距离计算出来的
      // 所以向上滑超过索引框框的时候就会 < 0，向上就会超过最大值
      if (index < 0) {
        return
      }
      let newIndex = index
      if (index > this.listHeight.length - 2) {
        newIndex = this.listHeight.length - 2
      }
      // listHeight 是正的， 所以加个 -
      this.scrollY = -this.listHeight[newIndex]
      this.scroll.scrollToElement(this.$refs.listGroup[newIndex])
    },

    setHeight() {
      const height = document.body.clientHeight
      this.$refs.box.style.height = `${height - 144}px`
    },
    initSrcoll() {
      this.scroll = new BScroll(this.$refs.listView, {
        probeType: 3,
        click: true,
      })
      this.scroll.on('scroll', (pos) => {
        this.scrollY = pos.y
      })
    },
    calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.active-class {
  background-color: #e9eff4;
}

.box {
  position: fixed;
  width: 100vw;
  height: 100%;
}

.list-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #e3e7e8;

  ul {
    box-shadow: 0 0 5px 0 #ced3d4;
  }

  .list-group {
    background-color: rgb(255, 255, 255);

    ul li:last-child .name {
      border-bottom: 0;
    }

    .list-group-title {
      height: 30px;
      padding-left: 20px;
      color: #fff;
      font-size: 12px;
      line-height: 30px;
      background-color: #9ea7b3;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      margin: 0 auto;
      padding-left: 30px;

      .name {
        width: 100%;
        margin-left: 20px;
        color: rgb(0, 0, 0);
        font-size: 14px;
        line-height: 70px;
        border-bottom: 1px solid #dfe9f1;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 30;
    width: 20px;
    padding: 20px 0;
    // font-family: Helvetica;
    text-align: center;
    background: rgba(167, 167, 167, 0.5);
    border-radius: 10px;
    transform: translateY(-50%);

    .item {
      padding: 3px;
      color: rgb(0, 0, 0);
      font-size: 11px;
      line-height: 1;

      &.current {
        color: #c20c0c;
        // font-weight: bold;
      }
    }
  }
}
</style>
