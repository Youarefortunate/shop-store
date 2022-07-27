import router from './router'
import store from './store'
import storage from 'store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { isEmpty } from '@/utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已登录
  const hasToken = getToken()
  const localToken = localStorage.getItem('token')
  if (hasToken && localToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles
      if (isEmpty(hasRoles)) {
        // 获取用户信息
        store.dispatch('user/getInfo')
          .then(data => {
            const roles = data.roles
            // 根据roles权限生成可访问的路由表
            store.dispatch('GenerateRoutes', { roles })
              .then(routers => {
                // 手动导入添加动态路由规则
                router.options.routes = routers[0].children
                // 动态添加可访问路由表
                router.addRoutes(routers)
                // 请求中带有redirect重定向时，登录自动重定向到改地址
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
              .catch(async (error) => {
                await store.dispatch('user/resetToken')
                Message.error('请求用户信息失败,请重试')
                // 获取用户信息失败时，调出登录，清空历史保留记录
                store.dispatch('user/logout').then(() => {
                  next(`/login?redirect=${to.path}`)
                  NProgress.done()
                })
              })
          })
      } else {
        next()
      }
    }
  } else {
    /* 没有token*/
    // indexOf()方法找不到时返回-1,当路径不存在白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // 重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
