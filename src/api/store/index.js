import request from '@/utils/request'

const api = {
  info: '/store/info',
  update: '/store/update'
}

/**
 * 获取当前登录的商城信息
 */
export function info (params) {
  return request({
    url: api.info,
    method: 'get',
    params
  })
}

/**
 * 更新商城信息
 * @param {*} data
 */
export function update (data) {
  return request({
    url: api.update,
    method: 'post',
    data
  })
}
