import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/user/list',
  detail: '/user/detail',
  recharge: '/user/recharge',
  grade: '/user/grade',
  delete: '/user/delete'
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
 * 会员充值
 * @param {*} data
 */
export function recharge (data) {
  return request({
    url: api.recharge,
    method: 'post',
    data
  })
}

/**
 * 修改会员等级
 * @param {*} data
 */
export function grade (data) {
  return request({
    url: api.grade,
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
