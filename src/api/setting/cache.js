import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  items: '/setting.cache/items',
  clear: '/setting.cache/clear'
}

/**
 * 获取设置
 */
export function items () {
  return request({
    url: api.items,
    method: 'get'
  })
}

/**
 * 清理缓存
 * @param {*} data
 */
export function clear (data) {
  return request({
    url: api.clear,
    method: 'post',
    data
  })
}
