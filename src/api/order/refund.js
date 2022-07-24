import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/order.refund/list',
  detail: '/order.refund/detail',
  audit: '/order.refund/audit',
  receipt: '/order.refund/receipt'
}

// 列表记录
export function list (params) {
  return request({
    url: api.list,
    method: 'get',
    params
  })
}

// 详情记录
export function detail (params) {
  return request({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 商家审核
 * @param {*} data
 */
export function audit (data) {
  return request({
    url: api.audit,
    method: 'post',
    data
  })
}

/**
 * 确认收货
 * @param {*} data
 */
export function receipt (data) {
  return request({
    url: api.receipt,
    method: 'post',
    data
  })
}
