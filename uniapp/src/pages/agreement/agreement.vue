<template>
    <page-root >
        <template v-slot:body>
            <view class="">
                <rich-text :nodes="agreementContent"></rich-text>
            </view>
        </template>
    </page-root>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { AgreementEnum } from '@/enums/agreementEnums'
import { getPolicy } from '@/api/app'

let agreementType = ref('' as any) // 协议类型
const agreementContent = ref('') // 协议内容

const getData = async (type: AgreementEnum) => {
    const res = await getPolicy({ type })
    console.log(res, 'res')

    agreementContent.value = res.content

    uni.setNavigationBarTitle({
        title: res.name
    })
}

onLoad((options: any) => {
    // 协议类型 privacy | service
    if (options.type) {
        agreementType.value = options.type
        getData(agreementType.value)
    }
})
</script>

<style lang="scss" scoped></style>
