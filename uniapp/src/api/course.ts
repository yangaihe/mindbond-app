import request from '@/utils/request'

const commonPageParams = {
    pageSize: 60,
}


// 获取首页配置数据
export function getIndexPageData(data: any = {}) {
    return request.get({ url: '/index/index', data }, { })
}

// 获取售卖商品列表
export function getSellBooksList(data: any = {}) {
    return request.get({ url: '/product/list', data }, { })
}

// 商品分类列表
export function getSellBooksCategoryList(data: any = {}) {
    return request.get({ url: '/product/category/list', data }, { })
}

// 书籍-购买订单创建
export function addBookOrder(data: any = {}) {
    return request.post({ url: '/order/add', data }, { })
}

// 获取支付方式
export function getPayWayTypeList(data: any = {}) {
    return request.get({ url: '/pay/payWay', data }, { })
}

// 支付订单
export function confirmPayOrder(data: any = {}) {
    return request.post({ url: '/pay/prepay', data }, { })
}

// 订单列表
export function getOrderList(data: any = {}) {
    return request.get({ url: '/order/list', data: { ...commonPageParams, ...data, } }, { })
}

// 书籍分组列表（包含一级、二级）
export function getBookGroups(data: any = {}) {
    return request.get({ url: '/category/list', data }, { })
}

// 书籍列表
export function getBookList(data: any = {}) {
    return request.get({ url: '/course/list', data: { ...commonPageParams, ...data, } }, { })
}

// 书籍-详情
export function getBookDetail(data: any = {}) {
    return request.get({ url: '/course/detail', data }, { })
}

// 书籍-章节目录列表
export function getBookChapterList(data: any = {}) {
    return request.get({ url: '/chapter/list', data: { ...commonPageParams, ...data, } }, { })
}

// 书籍-章节-课时列表
export function getBookLessonList(data: any = {}) {
    return request.get({ url: '/lesson/list', data: { ...commonPageParams, ...data, } }, { })
}

// 书籍-章节-课时详情
export function getBookLessonDetail(data: any = {}) {
    return request.get({ url: '/lesson/detail', data }, { })
}

// 书籍-章节-课程、课时 学习历史记录
export function getBookLessonStudyHistoryList(data: any = {}) {
    return request.get({ url: '/progress/listCourse', data: { ...commonPageParams, ...data, } }, { })
}

// 课程学习--已购课程
export function getMyBuyCourseList(data: any = {}) {
    return request.get({ url: '/order/myCourseList', data: { ...commonPageParams, ...data, } }, { })
}

// 书籍-章节-课时(学习进度列表)
export function getBookStudyList(data: any = {}) {
    return request.get({ url: '/progress/list', data: { ...commonPageParams, ...data, } }, { })
}

// 书籍-章节-课时(学习进度创建)
export function addBookStudyProgress(data: any = {}) {
    return request.post({ url: '/progress/add', data }, { })
}

// 书籍-章节-课时(学习进度更新)
export function updateBookStudyProgress(data: any = {}) {
    return request.post({ url: '/progress/edit', data }, { })
}

// 书籍-章节-课时(评论列表)
export function getBookLessonCommentList(data: any = {}) {
    return request.get({ url: '/comment/list', data: { ...commonPageParams, ...data, } }, { })
}

// 书籍-章节-课时(评论创建)
export function addBookLessonComment(data: any = {}) {
    return request.post({ url: '/comment/add', data }, { })
}

// 课时点赞
export function lessonLiked(data: any = {}) {
    return request.post({ url: '/collect/add', data }, { })
}

// 课时取消点赞
export function lessonUnLike(data: any = {}) {
    return request.post({ url: '/collect/edit', data }, { })
}

// 课程兑换
export function redeemCourseVoucher(data: any = {}) {
    return request.post({ url: '/voucher/redeem', data }, { })
}

