import request from '@/utils/request'

// 用户觉察记录列表
export function awarenessLists(params?: Record<string, any>) {
    return request.get({ url: '/awareness/list',  data:params })
}

// 用户觉察记录详情
export function awarenessDetail(params: Record<string, any>) {
    return request.get({ url: '/awareness/detail',  data:params })
}

// 用户觉察记录详情
export function awarenessSelectOne(params: Record<string, any>) {
    return request.get({ url: '/awareness/selectOne',  data:params })
}

// 用户觉察记录详情
export function awarenessHomeInfo(params: Record<string, any>) {
    return request.get({ url: '/awareness/homeInfo',  data:params })
}

// 用户觉察记录新增
export function awarenessAdd(params: Record<string, any>) {
    return request.post({ url: '/awareness/add',  data:params }, { isAuth: true })
}

// 用户觉察记录编辑
export function awarenessEdit(params: Record<string, any>) {
    return request.post({ url: '/awareness/edit',  data:params }, { isAuth: true })
}

// 用户觉察记录删除
export function awarenessDelete(params: Record<string, any>) {
    return request.post({ url: '/awareness/del',  data:params }, { isAuth: true })
}

// 用户觉察统计
export function awarenessMoodTrends(params: Record<string, any>) {
    return request.get({ url: '/awareness/moodTrends',  data:params })
}

// 用户觉察洞见
export function awarenessInsights(params: Record<string, any>) {
    return request.get({ url: '/awareness/insights',  data:params }, { isAuth: true })
}

// 用户统计
export function awarenessGetStatists(params: Record<string, any>) {
    return request.get({ url: '/awareness/getStatists',  data:params })
}