<template>
    <page-root>
        <template v-slot:body>
            <view class="pt-[120rpx] pl-[32rpx] pr-[32rpx]">
                <view class="mb-[64rpx] flex flex-col items-center">
                    <image class="mb-[20rpx] w-[144rpx] h-[144rpx] rounded-[40rpx]"
                        :src="appStore?.config?.website?.logo" />
                    <text class="welcome-title">欢迎回来</text>
                    <text class="welcome-desc">登录 {{ appStore?.config?.website?.name }}，继续你的成长之旅</text>
                </view>

                <!-- Login Form -->
                <view class="form-section">
                    <template v-if="loginWay == LoginWayEnum.ACCOUNT && includeLoginWay(LoginWayEnum.ACCOUNT)">
                        <view class="input-group">
                            <text class="input-label">手机号</text>
                            <view class="input-wrapper">
                                <text class="fas fa-mobile-alt input-icon"></text>
                                <input v-model="formData.username" type="number" class="form-input" placeholder="请输入手机号"
                                    :maxlength="11" placeholder-class="input-placeholder">
                            </view>
                        </view>

                        <view class="input-group">
                            <text class="input-label">密码</text>
                            <view class="input-wrapper">
                                <text class="fas fa-lock input-icon"></text>
                                <input v-model="formData.password" :password="!showPassword" class="form-input"
                                    placeholder="请输入密码" placeholder-class="input-placeholder">
                                <view class="toggle-password" @click="showPassword = !showPassword">
                                    <text :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></text>
                                </view>
                            </view>
                        </view>
                    </template>

                    <template v-if="loginWay == LoginWayEnum.MOBILE && includeLoginWay(LoginWayEnum.MOBILE)">
                        <view class="input-group">
                            <text class="input-label">手机号</text>
                            <view class="input-wrapper">
                                <text class="fas fa-mobile-alt input-icon"></text>
                                <input v-model="formData.mobile" type="number" class="form-input" placeholder="请输入手机号"
                                    :maxlength="11" placeholder-class="input-placeholder">
                            </view>
                        </view>
                        <view class="input-group">
                            <text class="input-label">验证码</text>
                            <view class="input-wrapper relative">
                                <text class="fas fa-shield-alt input-icon"></text>
                                <input v-model="formData.code" type="number" class="form-input" placeholder="请输入验证码"
                                    :maxlength="8" placeholder-class="input-placeholder">

                                <view
                                    class="absolute right-[10rpx] h-[70%] flex items-center justify-center px-[32rpx] rounded-[16rpx]" 
                                    style="background-color: rgba(244, 208, 63, 0.2);color: var(--accent-gold);"
                                >
                                    <phone-message-code ref="phoneMessageCodeRef" :params="{
                                        scene: SMSEnum.LOGIN,
                                        mobile: formData.mobile
                                    }" />
                                </view>

                            </view>
                        </view>

                    </template>

                    <view class="form-options">
                        <view>
                            <view v-if="
                                loginWay == LoginWayEnum.MOBILE && includeLoginWay(LoginWayEnum.ACCOUNT)
                            " @click="changeLoginWay(LoginTypeEnum.ACCOUNT, LoginWayEnum.ACCOUNT)">
                                账号密码登录
                            </view>
                            <view v-if="
                                loginWay == LoginWayEnum.ACCOUNT && includeLoginWay(LoginWayEnum.MOBILE)
                            " @click="changeLoginWay(LoginTypeEnum.MOBILE, LoginWayEnum.MOBILE)">
                                短信验证码登录
                            </view>
                        </view>
                        <text class="forgot-link" @click="goto(allRoutePathMaps.forgetPwd)">忘记密码？</text>
                    </view>

                    <button class="login-btn" @click="handleLogin(formData.scene)" :disabled="!canLogin"
                        :loading="isLoading">
                        登录
                    </button>
                </view>

                <!-- Divider -->
                <view class="divider-section">
                    <view class="divider-line"></view>
                    <text class="divider-text">其他登录方式</text>
                    <view class="divider-line"></view>
                </view>

                <!-- Social Login -->

                <view class="social-login">
                    <view class="social-btn wechat" @click="wxLogin">
                        <text class="fab fa-weixin"></text>
                    </view>
                    <view class="social-btn apple" @click="">
                        <text class="fab fa-apple"></text>
                    </view>
                </view>

                <!-- Register Link -->
                <view class="register-section">
                    <text class="register-text">还没有账号？<text class="register-link"
                            @click="goto(allRoutePathMaps.register)">立即注册</text></text>
                </view>

                <!-- Agreement -->
                <view class="agreement flex items-center justify-center">
                    <u-checkbox v-model="isCheckAgreement" shape="circle" class="">
                        <text class="agreement-text">已阅读并同意
                            <text @click.stop="goto(`${allRoutePathMaps.agreement}?type=service`)"
                                class="agreement-link">服务协议</text>和
                            <text @click.stop="goto(`${allRoutePathMaps.agreement}?type=privacy`)"
                                class="agreement-link">隐私协议</text>
                        </text>
                    </u-checkbox>
                </view>
            </view>
        </template>

    </page-root>
    <mplogin-popup v-model:show="showLoginPopup" :logo="websiteConfig.logo" :title="websiteConfig.name"
        @update="handleUpdateUser" />
    <!-- <u-checkbox v-model="isCheckAgreement" shape="circle"></u-checkbox> -->

</template>

<script setup lang="ts">
import { mobileLogin, accountLogin, mnpLogin } from '@/api/account'
import { updateUser } from '@/api/user'
import { SMSEnum } from '@/enums/appEnums'
import { BACK_URL } from '@/enums/cacheEnums'
import { useLockFn } from '@/hooks/useLockFn'
import { allRoutePathMaps, goto } from '@/utils/untool'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import cache from '@/utils/cache'
import { isWeixinClient } from '@/utils/client'
import { reLaunch } from '@/utils/untool'
// #ifdef H5
import wechatOa from '@/utils/wechat'
// #endif
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, reactive, ref, shallowRef, watch } from 'vue'
enum LoginTypeEnum {
    MOBILE = 'mobile',
    ACCOUNT = 'account'
}

enum LoginWayEnum {
    ACCOUNT = 1,
    MOBILE = 2
}

enum LoginAuthEnum {
    WX = 1,
    QQ = 2
}
const isWeixin = ref(true)
const showLoginPopup = ref(false)
// #ifdef H5
isWeixin.value = isWeixinClient()
// #endif



const userStore = useUserStore()
const appStore = useAppStore()

const websiteConfig = computed(() => appStore.getWebsiteConfig)
const loginWay = ref<LoginWayEnum>()
const isCheckAgreement = ref(false)
const loginData = ref<any>({})
const formData = reactive({
    scene: '',
    username: '',
    password: '',
    code: '',
    mobile: ''
})
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

const canLogin = computed(() => {
    return formData.username && formData.password
})

const toggleRememberMe = () => {
    rememberMe.value = !rememberMe.value
}

const changeLoginWay = (type: LoginTypeEnum, way: LoginWayEnum) => {
    formData.scene = type
    loginWay.value = way
}

const includeLoginWay = (way: LoginWayEnum) => {
    return true
    // return appStore.getLoginConfig.loginWay.includes(way)
}

const includeAuthWay = (way: LoginAuthEnum) => {
    return appStore.getLoginConfig.autoLoginAuth.includes(way)
}

const isOpenAgreement = computed(() => appStore.getLoginConfig.openAgreement == 1)

const isOpenOtherAuth = computed(() => appStore.getLoginConfig.openOtherAuth == 1)
const isForceBindMobile = computed(() => appStore.getLoginConfig.forceBindMobile == 1)

const loginFun = async (scene: LoginTypeEnum) => {
    try {
        await checkAgreement()
        if (scene == LoginTypeEnum.ACCOUNT) {
            if (!formData.username) return uni.$u.toast('请输入账号/手机号码')
            if (!formData.password) return uni.$u.toast('请输入密码')
        }
        if (scene == LoginTypeEnum.MOBILE) {
            if (!formData.mobile) return uni.$u.toast('请输入手机号码')
            if (!formData.code) return uni.$u.toast('请输入验证码')
        }
        uni.showLoading({
            title: '请稍后...'
        })

        let data
        switch (scene) {
            case LoginTypeEnum.ACCOUNT:
                data = await accountLogin(formData)
                break
            case LoginTypeEnum.MOBILE:
                data = await mobileLogin(formData)

                break
        }
        if (data) {
            loginHandle(data)
        }
    } catch (error: any) {
        uni.hideLoading()
        uni.$u.toast(error)
    }
}

const loginHandle = async (data: any) => {
    const { token, isBindMobile } = data
    if (!isBindMobile && isForceBindMobile.value) {
        userStore.temToken = token
        uni.navigateTo({
            url: '/pages/bind_mobile/bind_mobile'
        })
        uni.hideLoading()
        return
    }
    userStore.login(data.token)
    await userStore.getUser()
    uni.$u.toast('登录成功')
    uni.hideLoading()
    isLoading.value = false
    const pages = getCurrentPages()
    if (pages.length > 1) {
        reLaunch({ url: allRoutePathMaps.listenbook.index })
        //} else if (cache.get(BACK_URL)) {
        //    uni.redirectTo({ url: cache.get(BACK_URL) })
    } else {
        reLaunch({ url: allRoutePathMaps.listenbook.index })
    }
    cache.remove(BACK_URL)
}

const { lockFn: handleLogin } = useLockFn(loginFun)

const checkAgreement = async () => {
    if (!isCheckAgreement.value && isOpenAgreement.value)
        return Promise.reject('请勾选已阅读并同意《服务协议》和《隐私协议》')
}
const { lockFn: wxLogin } = useLockFn(async () => {
    try {
        await checkAgreement()
        // #ifdef MP-WEIXIN
        uni.showLoading({
            title: '请稍后...'
        })
        isLoading.value = true
        const { code }: any = await uni.login({
            provider: 'weixin'
        })
        const data = await mnpLogin({
            code
        })
        loginData.value = data
        if (data.isNew) {
            isLoading.value = false
            uni.hideLoading()
            userStore.temToken = data.token
            showLoginPopup.value = true
            return
        }
        loginHandle(data)
        // #endif
        // #ifdef H5
        if (isWeixin.value) {
            wechatOa.getUrl()
        }
        // #endif
    } catch (error) {
        isLoading.value = false
        uni.$u.toast(error)
    }
})

const handleUpdateUser = async (value: any) => {
    await updateUser(value, { token: userStore.temToken })
    showLoginPopup.value = false
    loginHandle(loginData.value)
}

watch(
    () => appStore.getLoginConfig,
    (value) => {
        if (value.loginWay) {
            loginWay.value = value.loginWay[0]
            formData.scene = LoginTypeEnum[LoginWayEnum[loginWay.value]]
        }
    },
    {
        immediate: true
    }
)

onShow(async () => {
    try {
        if (userStore.isLogin) {
            uni.showLoading({
                title: '请稍后...'
            })
            await userStore.getUser()
            uni.hideLoading()
            uni.navigateBack()
        }
    } catch (error: any) {
        uni.hideLoading()
    }
})

onLoad(async (options) => {
    if (userStore.isLogin) {
        reLaunch({ url: allRoutePathMaps.listenbook.index })
        return
    }
    // #ifdef H5
    const { code } = options
    if (code) {
        uni.showLoading({
            title: '请稍后...'
        })

        try {
            const data = await wechatOa.authLogin(code)
            loginHandle(data)
        } catch (error: any) {
            uni.hideLoading()
            throw new Error(error)
        }
    }
    // #endif
})
</script>

<style lang="scss" scoped>
.welcome-title {
    display: block;
    font-size: 56rpx;
    color: #ffffff;
    font-weight: 700;
    margin-bottom: 16rpx;
}

.welcome-desc {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.6);
}

.form-section {
    margin-bottom: 48rpx;
}

.input-group {
    margin-bottom: 40rpx;
}

.input-label {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 16rpx;
    font-weight: 500;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 32rpx;
    color: rgba(255, 255, 255, 0.6);
    font-size: 32rpx;
    z-index: 1;
}

.form-input {
    width: 100%;
    padding: 32rpx 32rpx 32rpx 96rpx;
    background: rgba(255, 255, 255, 0.08);
    border: 2rpx solid rgba(255, 255, 255, 0.15);
    border-radius: 24rpx;
    color: #ffffff;
    font-size: 32rpx;
    box-sizing: border-box;
}

.input-placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.toggle-password {
    position: absolute;
    right: 32rpx;
    z-index: 1;
}

.toggle-password text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 32rpx;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48rpx;
}

.forgot-link {
    font-size: 28rpx;
    color: #F4D03F;
}

.login-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #F4D03F 0%, #E67E22 100%);
    border: none;
    border-radius: 24rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #1a1a2e;
    line-height: 96rpx;
}

.login-btn[disabled] {
    opacity: 0.5;
}

.divider-section {
    display: flex;
    align-items: center;
    gap: 32rpx;
    margin-bottom: 48rpx;
}

.divider-line {
    flex: 1;
    height: 2rpx;
    background: rgba(255, 255, 255, 0.15);
}

.divider-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
}

.social-login {
    display: flex;
    justify-content: center;
    gap: 40rpx;
    margin-bottom: 64rpx;
}

.social-btn {
    width: 112rpx;
    height: 112rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.social-btn text {
    font-size: 48rpx;
}

.social-btn.wechat {
    background: rgba(7, 193, 96, 0.2);
}

.social-btn.wechat text {
    color: #07c160;
}

.social-btn.apple {
    background: rgba(255, 255, 255, 0.1);
}

.social-btn.apple text {
    color: #ffffff;
}

.register-section {
    text-align: center;
    margin-bottom: 40rpx;
}

.register-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.6);
}

.register-link {
    color: var(--accent-orange);
    font-weight: 600;
}

.agreement-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
}

.agreement-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: underline;
}
</style>
