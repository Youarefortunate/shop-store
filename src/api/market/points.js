import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  log: '/market.points/log'
}

/**
 * 积分明细
 */
export function log (params) {
  return request({
    url: api.log,
    method: 'get',
    params
  })
}
