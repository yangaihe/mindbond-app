<template>
    <page-root>
        <template v-slot:header>

        </template>
        <template v-slot:body>
            <view class="bg-white min-h-full flex flex-col items-center px-[40rpx] pt-[40rpx] box-border">
                <view class="w-full">
                    <view v-if="!showChangeForm" class="flex flex-col items-center">
                        <view class="bindedicon flex items-center justify-center">
                            <view class="xgn-iconfont xgn-bindedphone" style="color: #457ec1;font-size: 100rpx;"></view>
                        </view>
                        <view class="text-[26rpx] mt-[40rpx]">当前绑定手机号</view>
                        <view class="text-[38rpx] font-bold mt-[10rpx]">{{ userInfo.mobile }}</view>
                        <u-button class="prm-btn mt-[30rpx]" style="flex: 1;width: 100%;" type="primary" shape="circle"
                            @click="handleChangePhone"> 换绑手机号</u-button>
                        <view class="text-[24rpx] text-muted mt-[30rpx]">
                            换绑手机号成功后，仅更换当前账号绑定的手机号信息当前登录的账号资产信息不受影响
                        </view>
                    </view>
                    <view v-if="showChangeForm">
                        <u-form borderBottom :label-width="150">
                            <u-form-item label="" class="form-item-cont" :border-bottom="false">
                                <u-input class="flex-1" v-model="formData.mobile" maxlength="11" :border="false"
                                    placeholder="请输入手机号码" />
                            </u-form-item>
                            <u-form-item label="" class="form-item-cont" :border-bottom="false">
                                <u-input class="flex-1" v-model="formData.code" placeholder="请输入验证码" :border="false" />
                                <view
                                    class="border-l border-solid border-0 border-light pl-3 text-muted leading-4 ml-3 w-[180rpx]"
                                >
                                    <phone-message-code ref="phoneMessageCodeRef" 
                                        :params="{
                                            scene: SMSEnum.BIND_MOBILE,
                                            mobile: formData.mobile
                                        }" 
                                    />
                                </view>
                            </u-form-item>
                        </u-form>
                        <view class="mt-[80rpx]">
                            <u-button class="prm-btn" type="primary" shape="circle" @click="handleConfirm"
                                :disabled="!formData.mobile || !formData.code"> 确定 </u-button>
                        </view>
                    </view>
                </view>
            </view>
        </template>
    </page-root>
</template>

<script setup lang="ts">
import { userBindMobile } from '@/api/user'
import { SMSEnum } from '@/enums/appEnums'
import { reactive, ref, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const { userInfo } = storeToRefs(useUserStore())
const uCodeRef = shallowRef()

const showChangeForm = ref(!userInfo.value?.mobile)

const userStore = useUserStore()


const formData = reactive({
    type: 'bind',
    mobile: '',
    code: ''
})

const handleChangePhone = () => {
    showChangeForm.value = true
}


const handleConfirm = async () => {
    if (!formData.mobile) return uni.$u.toast('请输入手机号码')
    if (!formData.code) return uni.$u.toast('请输入验证码')
    await userBindMobile(formData, { token: userStore.temToken })
    uni.$u.toast('绑定成功')
    userStore.login(userStore.temToken!)
    setTimeout(() => {
        uni.navigateBack()
    }, 1000)
}
</script>

<style lang="scss" scoped>
.bindedicon {
    margin-top: 10rpx;
    height: 200rpx;
    width: 200rpx;
    font-size: 100rpx;
    background-color: #f5f5f5;
    border-radius: 50%;
}

.form-item-cont {
    border-radius: 40rpx;
    background-color: #f5f5f5;
    padding: 12rpx 26rpx;
    margin-bottom: 36rpx;
}

.prm-btn {
    height: 90rpx;
    line-height: 90rpx;
}
</style>
