<template>
    <page-root >
        <template v-slot:body>
            <view class="customer-service">
                <view v-for="(item, index) in state.pages" :key="index">
                    <template v-if="item.name == 'customer-service'">
                        <w-customer-service :content="item.content" :styles="item.styles" />
                    </template>
                </view>
            </view>
        </template>
    </page-root>
    
</template>

<script setup lang="ts">
import { getDecorate } from '@/api/shop'
import { reactive } from 'vue'
const state = reactive<{
    pages: any[]
}>({
    pages: []
})
const getData = async () => {
    const data = await getDecorate({ id: 3 })
    state.pages = JSON.parse(data.pages)
}
getData()
</script>

<style scoped lang="scss">
.customer-service {
    padding-top: 16rpx;
}
</style>
