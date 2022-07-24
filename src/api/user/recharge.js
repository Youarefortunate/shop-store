import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  order: '/user.recharge/order'
}

/**
 * 列表记录
 */
export function order (params) {
  return request({
    url: api.order,
    method: 'get',
    params
  })
}
