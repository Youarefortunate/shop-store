import request from '@/utils/request'

const api = {
  data: '/home/data'
}


// 后台首页
export function data() {
  return request({
    url: api.data,
    method: 'get'
  })
}