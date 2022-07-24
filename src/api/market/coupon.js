import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/market.coupon/list',
  detail: '/market.coupon/detail',
  receive: '/market.coupon/receive',
  add: '/market.coupon/add',
  edit: '/market.coupon/edit',
  delete: '/market.coupon/delete'
}

/**
 * 列表记录
 */
export function list (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

/**
 * 详情记录
 */
export function detail (params) {
  return request({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 领取记录
 */
export function receive (params) {
  return request({
    url: api.receive,
    method: 'get',
    params
  })
}

/**
 * 新增记录
 * @param {*} data
 */
export function add (data) {
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
export function edit (data) {
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
export function deleted (data) {
  return request({
    url: api.delete,
    method: 'post',
    data: data
  })
}
