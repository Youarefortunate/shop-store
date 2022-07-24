import request from '@/utils/request'

const api = {
    list: '/store.role/list',
    add: '/store.role/add',
    edit: '/store.role/edit',
    delete: '/store.role/delete'
}

// 角色列表
export function list() {
    return request({
        url: api.list,
        method: 'get'
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

//  删除记录
export function deleted(data) {
    return request({
        url: api.delete,
        method: 'post',
        data
    })
}
