import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  delivery: '/order.event/delivery',
  updatePrice: '/order.event/updatePrice',
  confirmCancel: '/order.event/confirmCancel',
  delete: '/order.event/delete',
}

/**
 * 确认发货
 * @param {*} data
 */
export function delivery (data) {
  return request({
    url: api.delivery,
    method: 'post',
    data
  })
}

/**
 * 修改订单价格
 * @param {*} data
 */
export function updatePrice (data) {
  return request({
    url: api.updatePrice,
    method: 'post',
    data
  })
}

/**
 * 审核：用户取消订单
 * @param {*} data
 */
export function confirmCancel (data) {
  return request({
    url: api.confirmCancel,
    method: 'post',
    data
  })
}

/**
 * 删除订单记录
 * @param {*} data
 */
export function deleted (orderId) {
  return request({
    url: api.delete,
    method: 'post',
    data: { orderId }
  })
}
