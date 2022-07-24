import request from '@/utils/request'

// 接口列表
const api = {
    info: '/store.user/info',
    list: '/store.user/list',
    add: '/store.user/add',
    edit: '/store.user/edit',
    delete: '/store.user/delete',
    renew: '/store.user/renew'
}

// 获取当前登录的用户信息
export function getInfo() {
    return request({
        url: api.info,
        method: 'get'
    })
}

// 更新当前管理员的信息
export function renew(data) {
    return request({
        url: api.renew,
        method: 'post',
        data
    })
}

// 管理员列表
export function list(params) {
    return request({
        url: api.list,
        method: 'get',
        params
    })
}

// 新增记录
export function add(data) {
    return request({
        url: api.add,
        method: 'post',
        data
    })
}

// 编辑记录
export function edit(data) {
    return request({
        url: api.edit,
        method: 'post',
        data
    })
}

// 删除记录
export function deleted(data) {
    return request({
        url: api.delete,
        method: 'post',
        data
    })
}