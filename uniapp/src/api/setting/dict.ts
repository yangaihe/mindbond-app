import request from '@/utils/request'

// 字典数据列表
export function dictDataLists(params: any) {
    return request.get(
        { url: '/setting/dict/data/list',  data:params }
    )
}
