import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

const RouteView = {
  name: 'RouteView',
  // render()函数,参数也是一个函数,叫createElement
  render: (h) => h('router-view')
}



export const constantRoutes = [
  // 当子路由大于一个时自动变成嵌套的模式,每一个children下面的路由作为一个子菜单
  {
    path: '/login',
    component: () => import('@/views/passport/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  { // 首页
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' } // title在左侧导航栏和面包屑处显示
    }]
  },
  // 管理员
  {
    path: '/manage',
    component: Layout,
    // redirect: '/manage/user/index',
    redirect: 'noRedirect',
    meta: { title: '管理员', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'user/index',
        name: 'UserManage',
        component: () => import('@/views/manage/user/index'),
        meta: { title: '管理员列表' }
      },
      {
        path: 'role/index',
        name: 'RoleManage',
        component: () => import('@/views/manage/role/index'),
        meta: { title: '角色管理' }
      },
      { // 更新账户信息
        path: 'renew',
        name: 'Renew',
        hidden: true,
        component: () => import('@/views/manage/renew'),
        meta: { title: '更新账户信息' },
      },
    ]
  },
  // 店铺管理
  {
    path: '/store',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '店铺管理', icon: 'el-icon-s-shop' },
    children: [
      {
        path: 'setting',
        component: () => import('@/views/store/Setting'),
        meta: { title: '店铺设置' }
      },
      {
        path: 'address/index',
        name: 'Address',
        component: () => import('@/views/store/address/Index'),
        meta: { title: '地址管理' }
      },
      {
        path: '/page',
        redirect: 'noRedirect',
        component: () => import('@/views/page/index'),
        meta: { title: '店铺设计' },
        children: [
          {
            path: 'index',
            name: 'Page',
            component: () => import('@/views/page/design/Index'),
            meta: { title: '页面设计' }
          },
          {
            path: 'category',
            name: 'Index',
            component: () => import('@/views/page/category/Index'),
            meta: { title: '分类模板' }
          },
        ]
      },
    ]
  },
  // 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '商品管理', icon: 'el-icon-s-goods' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品列表' }
      },
      {
        path: 'category/index',
        component: () => import('@/views/goods/category'),
        meta: { title: '商品分类' }
      },
      {
        path: 'service/index',
        component: () => import('@/views/goods/service'),
        meta: { title: '服务承诺' }
      },
      {
        path: 'comment/index',
        component: () => import('@/views/goods/comment'),
        meta: { title: '商品评价' }
      },
      {
        path: 'create',
        hidden: true,
        component: () => import('@/views/goods/Create'),
        meta: { title: '创建商品' }
      },
      {
        path: 'update',
        hidden: true,
        component: () => import('@/views/goods/Update'),
        meta: { title: '编辑商品' }
      },
    ]
  },
  // 订单管理 
  {
    path: '/order',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '订单管理', icon: 'el-icon-s-claim' },
    children: [
      {
        path: 'list/all',
        component: () => import('@/views/order/index'),
        meta: { title: '全部订单' }
      },
      {
        path: 'list/delivery',
        component: () => import('@/views/order/index'),
        meta: { title: '待发货' }
      },
      {
        path: 'list/receipt',
        component: () => import('@/views/order/index'),
        meta: { title: '待收货' }
      },
      {
        path: 'list/pay',
        component: () => import('@/views/order/index'),
        meta: { title: '待付款' }
      },
      {
        path: 'list/complete',
        component: () => import('@/views/order/index'),
        meta: { title: '已完成' }
      },
      {
        path: 'list/cancel',
        component: () => import('@/views/order/index'),
        meta: { title: '已取消' }
      },
      {
        path: 'detail',
        component: () => import('@/views/order/Detail'),
        meta: { title: '订单详情' },
        hidden: true
      },
      {
        path: 'refund/index',
        component: () => import('@/views/order/refund/Index'),
        meta: { title: '售后管理' }
      },
      {
        path: 'refund/detail',
        component: () => import('@/views/order/refund/Detail'),
        meta: { title: '售后单详情' },
        hidden: true
      },
      {
        path: 'tools',
        redirect: 'noRedirect',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        component: () => import('@/views/order/tools/index'),
        meta: { title: '订单处理' },
        children: [
          {
            path: 'export',
            component: () => import('@/views/order/tools/Export'),
            meta: { title: '订单导出' }
          },
        ]
      },
    ]
  },
  // 会员管理
  {
    path: '/user',
    name: 'User',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '会员管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        meta: { title: '会员列表' }
      },
      {
        path: 'grade/index',
        component: () => import('@/views/user/grade/Index'),
        meta: { title: '会员等级' }
      },
      {
        path: 'balance',
        redirect: 'noRedirect',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        component: () => import('@/views/user/balance/RouterView'),
        meta: { title: '余额记录' },
        children: [
          {
            path: '/user/recharge/index',
            component: () => import('@/views/user/recharge/Index'),
            meta: { title: '充值记录' }
          },
          {
            path: 'index',
            component: () => import('@/views/user/balance/Index'),
            meta: { title: '余额明细' }
          },
        ]
      },
    ]
  },
  // 内容管理
  {
    path: '/content',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '内容管理', icon: 'el-icon-s-comment' },
    children: [
      {
        path: 'article',
        redirect: 'noRedirect',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        component: () => import('@/views/content/index'),
        meta: { title: '文章管理' },
        children: [
          {
            path: 'index',
            component: () => import('@/views/content/article/Index'),
            meta: { title: '文章列表' }
          },
          {
            path: 'category/index',
            component: () => import('@/views/content/article/category/Index'),
            meta: { title: '文章分类' }
          },
        ]
      },
      {
        path: 'files',
        redirect: 'noRedirect',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        component: () => import('@/views/content/index'),
        meta: { title: '文件库管理' },
        children: [
          {
            path: 'index',
            component: () => import('@/views/content/files/Index'),
            meta: { title: '文件列表' }
          },
          {
            path: 'category/index',
            component: () => import('@/views/content/files/group/Index'),
            meta: { title: '文章分组' }
          },
        ]
      },
      {
        path: 'help/index',
        component: () => import('@/views/content/help/Index'),
        meta: { title: '帮助中心' }
      },
    ]
  },
  // 营销管理
  {
    path: '/market',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '营销管理', icon: 'el-icon-s-marketing' },
    children: [
      {
        path: 'coupon',
        redirect: 'noRedirect',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        component: () => import('@/views/market/index'),
        meta: { title: '优惠券' },
        children: [
          {
            path: 'index',
            component: () => import('@/views/market/coupon/Index'),
            meta: { title: '优惠券列表' }
          },
          {
            path: 'create',
            component: () => import('@/views/market/coupon/Create'),
            meta: { title: '创建优惠券', activeMenu: '/market/coupon/index' },
            hidden: true
          },
          {
            path: 'update',
            component: () => import('@/views/market/coupon/Update'),
            // 当路由设置了该属性，则会高亮相对应的侧边栏。
            // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
            // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
            meta: { title: '编辑优惠券', activeMenu: '/market/coupon/index' },
            hidden: true
          },
          {
            path: 'receive/index',
            component: () => import('@/views/market/coupon/Receive'),
            meta: { title: '领卷记录' }
          },
        ]
      },
      {
        path: 'recharge',
        redirect: 'noRedirect',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        component: () => import('@/views/market/index'),
        meta: { title: '会员充值' },
        children: [
          {
            path: 'plan/index',
            component: () => import('@/views/market/recharge/plan/Index'),
            meta: { title: '充值套餐' }
          },
          {
            path: 'setting',
            component: () => import('@/views/market/recharge/Setting'),
            meta: { title: '充值设置' }
          },
        ]
      },
      {
        path: 'points',
        redirect: 'noRedirect',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        component: () => import('@/views/market/index'),
        meta: { title: '积分管理' },
        children: [
          {
            path: 'setting',
            component: () => import('@/views/market/points/Setting'),
            meta: { title: '积分设置' }
          },
          {
            path: 'log',
            component: () => import('@/views/market/points/Log'),
            meta: { title: '积分明细' }
          },
        ]
      },
      {
        path: 'full-free',
        component: () => import('@/views/market/FullFree'),
        meta: { title: '满额包邮' },
      }
    ]
  },
  // 数据统计
  {
    path: '/statistics',
    component: Layout,
    redirect: 'noRedirect',
    children: [{
      path: '',
      component: () => import('@/views/statistics/Index'),
      meta: { title: '数据统计', icon: 'el-icon-s-data' }
    }]
  },
  // 客户端
  {
    path: '/client',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '客户端', icon: 'el-icon-s-promotion rgb(54,179,19)' },
    children: [
      {
        path: 'register',
        component: () => import('@/views/client/Register'),
        meta: { title: '注册设置' },
      },
      {
        path: 'wxapp',
        name: 'WxApp',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        redirect: 'noRedirect',
        component: () => import('@/views/client/index'),
        meta: { title: '微信小程序' },
        children: [
          {
            path: 'setting',
            component: () => import('@/views/client/wxapp/Setting'),
            meta: { title: '小程序设置' },
          }
        ]
      },
      {
        path: 'h5',
        name: 'H5',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        redirect: 'noRedirect',
        component: () => import('@/views/client/index'),
        meta: { title: 'H5端' },
        children: [
          {
            path: 'setting',
            component: () => import('@/views/client/h5/Setting'),
            meta: { title: '站点设置' },
          }
        ]
      },
    ]
  },
  // 设置
  {
    path: '/setting',
    name: 'Setting',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '设置', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'trade',
        component: () => import('@/views/setting/Trade'),
        meta: { title: '交易设置' }
      },
      {
        path: 'storage',
        component: () => import('@/views/setting/Storage'),
        meta: { title: '上传设置' }
      },
      {
        path: 'sms',
        component: () => import('@/views/setting/Sms'),
        meta: { title: '短信通知' }
      },
      {
        path: 'delivery',
        redirect: 'noRedirect',
        meta: { title: '配送设置' },
        component: () => import('@/views/setting/index'),
        children: [
          {
            path: 'setting',
            component: () => import('@/views/setting/delivery/Setting'),
            meta: { title: '配送方式' }
          },
          {
            path: 'template/index',
            component: () => import('@/views/setting/delivery/template/Index'),
            meta: { title: '运费模板' }
          },
          {
            path: 'template/create',
            component: () => import('@/views/setting/delivery/template/Create'),
            meta: { title: '新增运费模板', activeMenu: '/setting/delivery/template/index' },
            hidden: true
          },
          {
            path: 'template/update',
            component: () => import('@/views/setting/delivery/template/Update'),
            meta: { title: '编辑运费模板', activeMenu: '/setting/delivery/template/index' },
            hidden: true
          },
          {
            path: 'express/index',
            component: () => import('@/views/setting/delivery/express/Index'),
            meta: { title: '物流公司' }
          },
        ]
      },
      {
        path: 'other',
        // 只有一个子菜单的时候也一直显示根路由
        alwaysShow: true,
        redirect: 'noRedirect',
        meta: { title: '其他设置' },
        component: () => import('@/views/setting/index'),
        children: [
          {
            path: 'clear',
            component: () => import('@/views/setting/other/Clear'),
            meta: { title: '清理缓存' }
          }
        ]
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
