<template>
    <page-root >
        <template v-slot:body>
            <view class="syscontainer">
                <view class="menuList">
                    <view v-for="item in menuList" :key="item.url" class="menuItem"
                        @click="goto(item.url)"
                    >
                        <view style="flex: 1;">{{ item.name }}</view>
                        <view class="xgn-jinru xgn-iconfont"></view>
                    </view>
                </view>
            </view>
        </template>
    </page-root>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { AgreementEnum } from '@/enums/agreementEnums'
import { allRoutePathMaps, goto } from '@/utils/untool';

const menuList = ref([
    {
        name: '《隐私协议》',
        url: `${allRoutePathMaps.agreement}?type=${AgreementEnum.PRIVACY}`
    },
    {
        name: '《服务协议》',
        url: `${allRoutePathMaps.agreement}?type=${AgreementEnum.SERVICE}`
    }
])

onLoad((options: any) => {
    
})
</script>

<style lang="scss" scoped>
.syscontainer{
    padding: 30rpx;
}
.menuList {
    padding: 10rpx 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
}
.menuItem {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    color: #333;
    font-size: 32rpx;
    &::after{
        position: absolute;
        content: '';
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1rpx;
        background-color: #E5E5E5;
        transform: scaleY(0.5);
    }
    &:last-child::after{
        display: none;
    }
}
</style>
