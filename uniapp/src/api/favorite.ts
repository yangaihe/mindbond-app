import request from '@/utils/request'

// 用户觉察记录列表
export function favoriteLogLists(params?: Record<string, any>) {
    return request.get({ url: '/favoriteLog/list', data:params })
}

// 用户觉察记录详情
export function favoriteLogDetail(params: Record<string, any>) {
    return request.get({ url: '/favoriteLog/detail', data:params })
}

// 用户觉察记录新增
export function favoriteLogAdd(params: Record<string, any>) {
    return request.post({ url: '/favoriteLog/add', data:params })
}

// 用户觉察记录编辑
export function favoriteLogEdit(params: Record<string, any>) {
    return request.post({ url: '/favoriteLog/edit', data:params })
}

// 用户觉察记录删除
export function favoriteLogDelete(params: Record<string, any>) {
    return request.post({ url: '/favoriteLog/del', data:params })
}
