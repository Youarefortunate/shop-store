import { login, logout } from '@/api/login'
import { getInfo } from '@/api/store/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
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
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data: data } = response;
        commit('SET_TOKEN', data.data.token)
        setToken(data.data.token)
        localStorage.setItem('token', data.data.token); // 保存用户token
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    const admin = 'admin'
    const avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    commit('SET_NAME', admin)
    commit('SET_AVATAR', avatar)
    // return new Promise((resolve, reject) => {
    //   getInfo().then(response => {
    //     const data = response
    //     const roles = data.roles
    //     // 遍历整理 actionList
    //     roles.permissions.map(item => {
    //       item.actionList = [];
    //       if (item.actionEntitySet && item.actionEntitySet.length > 0) {
    //         item.actionList = item.actionEntitySet.map(action => action.action)
    //       }
    //     })
    //     roles.permissionList = roles.permissions.map(item => item.permissionId)
    //     console.log(response);
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
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

