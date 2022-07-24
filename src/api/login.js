import request from '@/utils/request'

const apiPath = {
  login: '/passport/login',
  logout: '/passport/logout'
}

// 用户登录
export function login(data) {
  return request({
    url: apiPath.login,
    method: 'post',
    data
  })
}

// 退出登录
export function logout() {
  return request({
    url: apiPath.logout,
    method: 'post'
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}


