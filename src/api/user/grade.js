import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/user.grade/list',
  all: '/user.grade/all',
  add: '/user.grade/add',
  edit: '/user.grade/edit',
  delete: '/user.grade/delete'
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
 * 全部记录
 */
export function all (params) {
  return request({
    url: api.all,
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
