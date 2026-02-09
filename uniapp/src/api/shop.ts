import request from '@/utils/request'

//首页数据
export function getIndex() {
    return request.get({ url: '/index/index' })
}

// 装修页面
export function getDecorate(data: any) {
    //  id：1：商城首页，2：个人中心，3：客服设置，5：商品购买页，6：学习中心
    return request.get({ url: '/index/decorate', data })
}

/**
 * @description 热门搜索
 * @return { Promise }
 */
export function getHotSearch() {
    return request.get({ url: '/index/hotSearch' })
}
