import request from '@/utils/request'

// api接口列表
const api = {
    list: '/store.menu/list'
}

// 菜单权限列表
export function list(params) {
    return request({
        url: api.list,
        method: 'get',
        params
    })
}
