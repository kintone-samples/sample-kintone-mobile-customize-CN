import Vue from 'vue'
import {
  Tabbar,
  TabbarItem,
  List,
  Cell,
  PullRefresh,
  Col,
  Row,
  Image as VanImage,
  Collapse,
  CollapseItem,
  Grid,
  GridItem,
  Swipe,
  SwipeItem,
  Search,
  Lazyload,
  Skeleton,
  Empty,
  Step,
  Steps,
  Tab,
  Tabs,
  Switch,
  Icon,
  // IndexBar,
  // IndexAnchor,
} from 'vant'

Vue.use(Skeleton)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(List)
Vue.use(Cell)
Vue.use(PullRefresh)
Vue.use(Col)
Vue.use(Row)
Vue.use(VanImage)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Search)
Vue.use(Empty)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Switch)
Vue.use(Icon)
Vue.use(Lazyload, {
  lazyComponent: true,
})
