<template>
    <page-root>
        <template v-slot:header>
        
        </template>
        <template v-slot:body>
            <!-- 头部修改头像 -->
            <view class="header bg-white py-[30rpx]">
                <view class="flex">
                    <button
                        class="flex flex-col items-center after:border-0"
                        hover-class="none"
                        open-type="chooseAvatar"
                        style="background-color: transparent; flex: 1 0 0;"
                        @click="chooseAvatar"
                        @chooseavatar="chooseAvatar"
                    >
                        <image :src="userInfo?.avatar"></image>
                        <view class="mt-[10rpx] text-center text-muted text-xs"> 点击修改头像 </view>
                    </button>
                </view>
            </view>

            <!-- 用户ID -->
            <view
                class="item text-nr flex justify-between"
            >
                <!-- @click=";(showUserName = true), (newUsername = userInfo?.username)" -->
                <view class="label">账号</view>
                <view class="content">{{ userInfo?.username }}</view>
                <!-- <u-icon name="arrow-right" size="22" color="#666"></u-icon> -->
            </view>

            <!-- 昵称 -->
            <view
                class="item text-nr flex justify-between"
                @click=";(showNickName = true), (newNickname = userInfo?.nickname)"
            >
                <view class="label">昵称</view>
                <view class="content">{{ userInfo?.nickname }}</view>
                <u-icon name="arrow-right" size="22" color="#666"></u-icon>
            </view>

            <!-- 性别 -->
            <view class="item text-nr flex justify-between" @click="changeSex">
                <view class="label">性别</view>
                <view class="content">{{ userInfo?.sex }}</view>
                <u-icon name="arrow-right" size="22" color="#666"></u-icon>
            </view>

            <!-- 手机号 -->
            <view class="item text-nr flex justify-between">
                <view class="label">手机号</view>
                <view class="content">{{
                    userInfo?.mobile == '' ? '未绑定手机号' : userInfo?.mobile
                }}</view>

                <!-- #ifdef MP-WEIXIN -->
                <u-button
                    open-type="getPhoneNumber"
                    @getphonenumber="getPhoneNumber"
                    type="primary"
                    shape="circle"
                    size="mini"
                    :plain="true"
                >
                    {{ userInfo?.mobile == '' ? '绑定手机号' : '更换手机号' }}
                </u-button>
                <!-- #endif -->
                <!-- #ifndef MP-WEIXIN -->
                <u-button
                    @click="goto(allRoutePathMaps.bindMobile)"
                    size="mini"
                    type="primary"
                    shape="circle"
                    :plain="true"
                >
                    {{ userInfo?.mobile == '' ? '绑定手机号' : '更换手机号' }}
                </u-button>
                <!-- #endif -->
            </view>

            <!-- 注册时间 -->
            <view class="item text-nr flex justify-between">
                <view class="label">注册时间</view>
                <view class="content">{{ userInfo?.createTime }}</view>
            </view> 
            <view
                class="item text-nr flex justify-between"
            >
                <view class="label">设备Id</view>
                <view @click="setClipboardData(systemInfo?.deviceId)" class="content" style="word-wrap: break-word;">{{ systemInfo?.deviceId }}</view>
            </view>
        </template>
        <template v-slot:footer>
            <view class="mt-[60rpx] mx-[26rpx]">
                <u-button type="primary" shape="circle" @click="logoutHandle"> 退出登录 </u-button>
            </view> 
        </template>
    </page-root>
    
    <!-- 昵称修改组件 -->
    <u-popup
        v-model="showNickName"
        :closeable="true"
        mode="center"
        :maskCloseAble="false"
        border-radius="20"
    >
        <view class="px-[50rpx] py-[40rpx] bg-white" style="width: 85vw">
            <form @submit="changeNameConfirm">
                <view class="mb-[70rpx] text-xl text-center">修改昵称</view>
                <u-form-item borderBottom>
                    <input
                        class="nr h-[60rpx] w-full"
                        :value="userInfo.nickname"
                        name="nickname"
                        type="nickname"
                        placeholder="请输入昵称"
                    />
                </u-form-item>
                <view class="mt-[80rpx]">
                    <button
                        class="bg-primary text-white w-full h-[80rpx] !text-lg !leading-[80rpx] rounded-full"
                        form-type="submit"
                        hover-class="none"
                        size="mini"
                    >
                        确定
                    </button>
                </view>
            </form>
        </view>
    </u-popup>

    <!-- 账号修改组件 -->
    <u-popup v-model="showUserName" :closeable="true" mode="center" border-radius="20">
        <view class="px-[50rpx] py-[40rpx] bg-white" style="width: 85vw">
            <view class="mb-[70rpx] text-xl text-center">修改账号</view>
            <u-form-item borderBottom>
                <u-input
                    class="flex-1"
                    v-model="newUsername"
                    placeholder="请输入账号"
                    :border="false"
                />
            </u-form-item>
            <view class="mt-[80rpx]">
                <u-button @click="changeUserNameConfirm" type="primary" shape="circle">
                    确定
                </u-button>
            </view>
        </view>
    </u-popup>

    <!-- 性别修改组件 -->
    <u-picker
        mode="selector"
        v-model="showPicker"
        confirm-color="#4173FF"
        :default-selector="[0]"
        :range="sexList"
        @confirm="changeSexConfirm"
    />

    
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import { onShow, onUnload } from '@dcloudio/uni-app'
import { getUserInfo, userEdit, userMnpMobile } from '@/api/user'
import { FieldType, SMSEnum } from '@/enums/appEnums'
import { uploadImage } from '@/api/app'
import { useUserStore } from '@/stores/user'
import { allRoutePathMaps, goto, setClipboardData } from '@/utils/untool'
import { getSystemInfo } from '@/utils/appUpdate'

const userStore = useUserStore()
const systemInfo = ref<any>({})
// 用户信息
const userInfo = ref<any>({})
// 用户信息的枚举
const fieldType = ref(FieldType.NONE)
//选择性别数据
const sexList = ref<Array<string> | null>(['男', '女'])

//显示昵称弹窗
const showNickName = ref<boolean | null>(false)
//显示账户弹窗
const showUserName = ref<boolean | null>(false)
//显示性别选择弹窗
const showPicker = ref<boolean | null>(false)

//新昵称
const newNickname = ref<string>('')
//新账号
const newUsername = ref<string>('')


// 获取用户信息
const getUser = async (): Promise<void> => {
    userStore.getUser() // 更新全局用户信息
    userInfo.value = await getUserInfo()
}

// 修改用户信息
const setUserInfoFun = async (value: string): Promise<void> => {
    await userEdit({
        field: fieldType.value,
        value: value
    })
    uni.$u.toast('操作成功')
    getUser()
}

// 上传头像
const chooseAvatar = (e: any) => {
    fieldType.value = FieldType.AVATAR
    // #ifndef MP-WEIXIN
    uni.navigateTo({
        url: '/uni_modules/vk-uview-ui/components/u-avatar-cropper/u-avatar-cropper?destWidth=300&rectWidth=200&fileType=jpg'
    })
    // #endif
    // #ifdef MP-WEIXIN
    if (e.detail.avatarUrl) {
        uploadAvatar(e.detail.avatarUrl)
    }
    // #endif
}

// 显示修改用户性别弹窗
const changeSex = () => {
    showPicker.value = true
    fieldType.value = FieldType.SEX
}

// 修改用户性别
const changeSexConfirm = (value) => {
    setUserInfoFun(value[0] + 1)
    showPicker.value = false
}

// 修改用户账号
const changeUserNameConfirm = async () => {
    if (newUsername.value == '') return uni.$u.toast('账号不能为空')
    if (newUsername.value.length > 10) return uni.$u.toast('账号长度不得超过十位数')

    fieldType.value = FieldType.USERNAME
    await setUserInfoFun(newUsername.value)
    showUserName.value = false
}

// 修改用户昵称
const changeNameConfirm = async (e: any) => {
    newNickname.value = e.detail.value.nickname
    if (newNickname.value == '') return uni.$u.toast('昵称不能为空')
    if (newNickname.value.length > 10) return uni.$u.toast('昵称长度不得超过十位数')
    fieldType.value = FieldType.NICKNAME
    await setUserInfoFun(newNickname.value)

    showNickName.value = false
}

// 微信小程序 绑定｜｜修改用户手机号
const getPhoneNumber = async (e): Promise<void> => {
    const { encryptedData, iv, code } = e.detail
    const data = {
        code,
        encrypted_data: encryptedData,
        iv
    }
    if (encryptedData) {
        await userMnpMobile({
            ...data
        })
        uni.$u.toast('操作成功')
        getUser()
    }
}


const uploadAvatar = (path: string) => {
    uni.showLoading({
        title: '正在上传中...',
        mask: true
    })
    uploadImage(path)
        .then((res) => {
            uni.hideLoading()
            setUserInfoFun(res.url)
        })
        .catch(() => {
            uni.hideLoading()
            uni.$u.toast('上传失败')
        })
}

// 监听从裁剪页发布的事件，获得裁剪结果
uni.$on('uAvatarCropper', (path) => {
    uploadAvatar(path)
})

onShow(async () => {
    getUser()
    systemInfo.value = getSystemInfo()
})

onUnload(() => {
    uni.$off('uAvatarCropper')
})

// 退出登录
const logoutHandle = () => {
    uni.showModal({
        content: '是否退出登录？',
        confirmColor: '#4173FF',
        success: ({ cancel }) => {
            if (cancel) return
            userStore.logout()
            goto(allRoutePathMaps.listenbook.index, 2)
        }
    })
}
</script>

<style lang="scss" scoped>
.header {
    width: 100%;

    image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
    }
}



.item {
    margin-top: 2rpx;
    padding: 30rpx;
    background-color: #ffffff;

    .label {
        width: 150rpx;
    }

    .content {
        flex: 1;
        width: 80%;
    }
}
</style>
