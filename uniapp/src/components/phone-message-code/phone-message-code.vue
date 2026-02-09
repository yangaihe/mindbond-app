<template>
  <view @click="sendSms">
    <u-verification-code ref="uCodeRef" :seconds="60" @change="codeChange" change-text="x秒" />
    <text style="color: var(--accent-gold);">
      {{ codeTips }}
    </text>
  </view>

  <u-popup v-model="showCaptcha" mode="center" closeable border-radius="20">
    <view class="captcha-container">
      <view class="captcha-tips">请拖动图形到正确位置</view>
      <view style="display: flex; justify-content: center; padding: 40rpx 0;">
        <movable-area ref="captchaAreaRef" class="captcha-area" :style="`background-image: url(${captchaData.backgroundImage});`">
          <movable-view direction="horizontal" ref="moveImgRef" class="captcha-slider" :style="`background-image: url(${captchaData.sliderImage});`"
            :x="moverGapX" @change="handleCaptchaChange"
          ></movable-view>
        </movable-area>	
      </view>
      <view style="text-align: center;">
        <u-button type="primary" @click="confirmedSend">完成验证</u-button>
      </view>
    </view>	
	</u-popup>
  
</template>

<script setup lang="ts">
import { addUnit } from '@/utils/util'
import { showToast } from '@/utils/untool'
import {
  ref, defineProps, defineEmits, watch,
  computed, CSSProperties, onUnmounted, onMounted, onBeforeMount,
  shallowRef,
} from 'vue';
import { getCaptchaCode, smsSend } from '@/api/app';

const baseMoveWidth = 296

// 定义组件属性
const props = defineProps({
  params: {
    type: Object,
    default: {}
  },

});

const emit = defineEmits<{
  (event: string, value?: any): void
}>()

const uCodeRef = shallowRef()
const captchaAreaRef = shallowRef()
const codeTips = ref('')
const showCaptcha = ref(false)
const captchaData = ref({
  backgroundImage: '',
  sliderImage: '',
  userGapUUID: '',
})
const moverGapX = ref(0)
const subMoveX = computed(() => {
  let renderWidth = captchaAreaRef.value.$el.clientWidth
  return (baseMoveWidth / renderWidth) * moverGapX.value
})

// const handleScrollBottom = (e:any)=> {
//   console.log("=====scroll to bottom=====")
//   emit('scrolltolower', e)
// }

const codeChange = (text: string) => {
  codeTips.value = text
}

const sendSms = async () => {
  let { scene, mobile } = props.params || {}
  if (!mobile) {
    showToast('请输入手机号')
    return
  }
  if (!(uCodeRef.value?.canGetCode)) {
    return
  }
  let capData = await getCaptchaCode({})
  showCaptcha.value = true
  captchaData.value = capData
  moverGapX.value = 0
}

const handleCaptchaChange = (e: any) => {
  console.log("captchaChange=================",e)
  moverGapX.value = e.detail.x
}

const confirmedSend = async () => {
  await smsSend({
    userGapUUID: captchaData.value.userGapUUID,
    userGapX: subMoveX.value, // 滑动位置
    ...props.params,
  })
  showToast('发送成功')
  uCodeRef.value?.start()
  showCaptcha.value = false
}

onBeforeMount(() => {

})
onMounted(() => {

})

onUnmounted(() => {

})

</script>

<style scoped lang="scss">
  .captcha-container{
    padding: 30rpx 30rpx;
    width: 660rpx;
    height: 600rpx;
  }
  .captcha-tips{
    margin-bottom: 30rpx;
    text-align: center;
    font-size: 32rpx;
    color: #333;
  }
  .captcha-area{
    overflow: hidden;
    width: 600rpx;
    height: 300rpx;
    background-color: #f5f5f5;
    position: relative;
    background-size: 100% 100%;
  }
  .captcha-slider{
    margin-top: 100rpx;
    width: 100rpx;
    height: 100rpx;
    background-size: 100% 100%;
    background-color: #fff;
  }
</style>