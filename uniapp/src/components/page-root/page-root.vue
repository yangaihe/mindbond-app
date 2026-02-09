<template>

  <view class="root-container" :style="rootStyles">
    <layout-view>
       
      <template v-if="$slots.header || !headConfig.hideNavbar" v-slot:header>
        <view :style="headStyle" class="root-header-top">
          <!-- 安全高度占位 -->
          <view :style="`padding-top:${safeAreaTop};`"></view>
          <view v-if="!headConfig.hideNavbar" class="custom-nav-bar" :style="`height:${navBarHeight};`">
            <!-- 左侧返回按钮（示例） -->
            <view v-if="hasPrePage" class="nav-left" @click="handleBack">
              <view class="back-icon fas fa-arrow-left"></view>
            </view>
            <!-- 中间标题 -->
            <view class="nav-title">{{ headConfig.title }}</view>
            <!-- 右侧占位（宽度与胶囊对齐，微信小程序专用） -->
            <view class="nav-right" :style="`width:${capsuleWidth};`"></view>
          </view>
          <slot v-if="$slots.header" name="header"></slot>
        </view>
      </template>

      <template v-slot:body>
        <scroll-view class="scrollCont" scroll-y           
          @scrolltoupper="handleScrollTop" @scrolltolower="handleScrollBottom" 
          @scroll="handleScrollChange"
          :style="bodyStyle"
        >
          <slot name="body"></slot>  
        </scroll-view>
          
      </template>

      <template v-slot:footer>
        <slot name="footer"></slot>
      </template>

    </layout-view>
  </view>
</template>

<script setup lang="ts">
import { addUnit } from '@/utils/util'
import { addCaclueUnit, getCurPage, getHasPreviousPage, getNavBarInfo, goBack } from '@/utils/untool'
import { ref, defineProps, defineEmits, watch, 
  computed, CSSProperties, onUnmounted, onMounted, onBeforeMount,
} from 'vue';
import useNodeHeight from '@/hooks/useNodeHeight';

const { height, getHeight } = useNodeHeight('.root-header-top');


let defaultHeadOpt = {
  backgroundColor: 'transparent',
  position: '',
  hideNavbar: false,
  title: '',
}

// 定义组件属性
const props = defineProps({
  custStyle: {
    type: Object,
    default: {}
  },
  headOpt: {
    type: Object as () => {
      backgroundColor: any
      position: String
      hideNavbar: boolean
      title: String
    },
    default: {}
  },

});
const safeAreaTop = ref('');
const navBarHeight = ref('');
const capsuleWidth = ref(''); // 胶囊宽度（微信小程序用于右侧占位对齐）

const rootStyles = computed<CSSProperties>(() => {
  let str:CSSProperties = {
    ...props.custStyle,
  }
  return str
})

const emit = defineEmits<{
  (event: string, value?: any): void
}>()

const scrollTop = ref(0)

const headConfig = computed(() => {
  let { navigationBarTitleText, navigationStyle } = getCurPage()._style
  let obj = Object.assign({  }, defaultHeadOpt, { hideNavbar: navigationStyle != 'custom', title: navigationBarTitleText, }, props.headOpt)
  return obj
})

const headStyle = computed<string>(() => {
  let str = ''
  str += `position: ${headConfig.value.position};background-color: ${headConfig.value.backgroundColor};`
  if(headConfig.value.position == 'fixed') {
    str +=  `left: 0;right: 0;top: 0;z-index: 10;`
    let opacity = (scrollTop.value / height.value )
    opacity = opacity > 1 ? 1 : opacity
    if(scrollTop.value > 0){
      let bgColor = headConfig.value.backgroundColor ? '' : 'transparent'
      str += `background-color: ${bgColor};transition: background-color 0.8s ease;opacity: ${opacity};`
    }
  }
  return str
})

const bodyStyle = computed<string>(() => {
  let str = ''
  if(headConfig.value.position == 'fixed') {
    // str += `padding-top: ${addCaclueUnit(height.value)};`
  }
  return str
})

const handleScrollTop = ()=> {
  console.log("=====scroll to top=====")
}

const handleScrollBottom = (e:any)=> {
  console.log("=====scroll to bottom=====")
  emit('scrolltolower', e)
}
const handleScrollChange = (e:any)=> {
  scrollTop.value = e.detail.scrollTop
}

onBeforeMount(()=> {
  
})
onMounted(()=> {
  const navBarInfo = getNavBarInfo();
  safeAreaTop.value = addCaclueUnit(navBarInfo.safeAreaTop);
  navBarHeight.value = addCaclueUnit(navBarInfo.navBarHeight);
  capsuleWidth.value = addCaclueUnit(navBarInfo.capsuleWidth);
})

// 返回按钮点击事件
const handleBack = () => {
  emit('back');
  // 默认返回上一页（可根据需求修改，如关闭当前页面）
  goBack()
};

const hasPrePage = computed<Boolean>(() => {
  let hasPrevious = getHasPreviousPage()
  return hasPrevious
})

onUnmounted(() => {
  
})

</script>

<style scoped lang="scss">
.root-container {
  z-index: 10;
  position: relative;
  z-index: 10;
  height: 100%;
  min-height: 100%;
  background: var(--bg-gradient);

  box-shadow:
    0 0 0 24px #1a1a2e,
    0 0 0 28px #2d2d44,
    var(--shadow-lg);
}
.root-header-top{
  color: #ecd7d7;
}
.nav-left{
  margin-left: 32rpx;
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #fff;
}
.nav-right{
  margin-right: 32rpx;
}
.nav-left,.nav-right{
  height: 100%;
  display: flex;
  align-items: center;
}
.custom-nav-bar{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.back-icon{
  
}
.nav-title{
  padding: 0 32rpx;
  font-size: 34rpx;
  flex: 1 0 0;
  text-align: left;
}

.scrollCont{
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
    display: none;
  }
}
</style>