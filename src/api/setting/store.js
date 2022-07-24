import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  detail: '/setting/detail',
  update: '/setting/update'
}

/**
 * 获取设置
 */
export function detail (key) {
  return request({
    url: api.detail,
    method: 'get',
    params: { key }
  })
}

/**
 * 更新设置
 * @param {*} data
 */
export function update (key, data) {
  return request({
    url: api.update,
    method: 'post',
    data: { key, ...data }
  })
}
