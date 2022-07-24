import request from '@/utils/request'

/**
 * api接口列表
 */
const api = {
  list: '/page/list',
  defaultData: '/page/defaultData',
  detail: '/page/detail',
  add: '/page/add',
  edit: '/page/edit',
  delete: '/page/delete',
  setHome: '/page/setHome'
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
export function defaultData (params) {
  return request({
    url: api.defaultData,
    method: 'get',
    params
  })
}

/**
 * 页面详情
 */
export function detail (params) {
  return request({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 设置默认首页
 * @param {*} data
 */
export function setHome (data) {
  return request({
    url: api.setHome,
    method: 'post',
    data: data
  })
}

/**
 * 新增页面
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
 * 编辑页面
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
