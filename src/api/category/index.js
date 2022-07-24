import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/category/list',
  add: '/category/add',
  edit: '/category/edit',
  delete: '/category/delete'
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
    data
  })
}
