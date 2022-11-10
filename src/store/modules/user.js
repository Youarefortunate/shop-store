import { login, logout } from '@/api/login'
import { getInfo } from '@/api/store/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: {},
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data: result } = response;
        commit('SET_TOKEN', result.data.token)
        setToken(result.data.token)
        localStorage.setItem('token', result.data.token); // 保存用户token
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        const data = response.data.data
        const roles = data.roles
        console.log(roles);
        // 遍历整理 actionList
        roles.permissions.map(item => {
          item.actionList = [];
          if (item.actionEntitySet && item.actionEntitySet.length > 0) {
            item.actionList = item.actionEntitySet.map(action => action.action)
          }
        })
        roles.permissionList = roles.permissions.map(item => item.permissionId)
        commit('SET_ROLES', roles)
        commit('SET_INFO', data.userInfo)
        commit('SET_NAME', data.userInfo.real_name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        // 重置state状态
        commit('RESET_STATE')
        // 清空用户信息
        commit('SET_ROLES', [])
        localStorage.removeItem('token')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

