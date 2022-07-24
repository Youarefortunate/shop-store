import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
    list: '/goods/list',
    listByIds: '/goods/listByIds',
    detail: '/goods/detail',
    basic: '/goods/basic',
    add: '/goods/add',
    edit: '/goods/edit',
    delete: '/goods/delete',
    state: '/goods/state'
}

/**
 * 列表记录
 */
export function list(params) {
    return request({
        url: api.list,
        method: 'get',
        params
    })
}

/**
 * 根据商品ID集获取列表记录
 */
export function listByIds(goodsIds, params) {
    return request({
        url: api.listByIds,
        method: 'get',
        params: { goodsIds, ...params }
    })
}

/**
 * 商品详情(详细信息)
 */
export function detail(params) {
    return request({
        url: api.detail,
        method: 'get',
        params
    })
}

/**
 * 商品详情(基础信息)
 */
export function basic(goodsId, params) {
    return request({
        url: api.basic,
        method: 'get',
        params: { goodsId, ...params }
    })
}

/**
 * 更新状态
 * @param {*} data
 */
export function state(data) {
    return request({
        url: api.state,
        method: 'post',
        data
    })
}

/**
 * 新增记录
 * @param {*} data
 */
export function add(data) {
    return request({
        url: api.add,
        method: 'post',
        data
    })
}

/**
 * 编辑记录
 * @param {*} data
 */
export function edit(data) {
    return request({
        url: api.edit,
        method: 'post',
        data
    })
}

/**
 * 删除记录
 * @param {*} data
 */
export function deleted(data) {
    return request({
        url: api.delete,
        method: 'post',
        data: data
    })
}
