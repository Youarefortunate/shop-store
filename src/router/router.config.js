/* Layout */
import Layout from '@/layout'

const RouteView = {
  name: 'RouteView',
  // render()函数,参数也是一个函数,叫createElement
  render: (h) => h('router-view')
}


// 异步路由
export const asyncRouterMap = [
  { // 首页
    path: '/',
    name: 'root',
    // alwaysShow: true,
    component: Layout,
    children: [
      {
        path: '/index',
        name: 'index',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', noCache: false, icon: 'el-icon-s-home', permission: ['/index'] } // title在左侧导航栏和面包屑处显示
      },
      // 管理员
      {
        path: '/manage',
        name: 'manage',
        component: RouteView,
        redirect: '/manage/user/index',
        // redirect: 'noRedirect',
        meta: { title: '管理员', icon: 'el-icon-s-custom', permission: ['/manage'] },
        children: [
          {
            path: '/manage/user/index',
            component: () => import('@/views/manage/user/index'),
            meta: { title: '管理员列表', noCache: true, permission: ['/manage/user/index'] }
          },
          {
            path: '/manage/role/index',
            component: () => import('@/views/manage/role/index'),
            meta: { title: '角色管理', noCache: true, permission: ['/manage/role/index'] }
          },
        ]
      },
      // 店铺管理
      {
        path: '/store',
        name: 'store',
        component: RouteView,
        // redirect: 'noRedirect',
        redirect: '/store/setting',
        meta: { title: '店铺管理', icon: 'el-icon-s-shop', permission: ['/store'] },
        children: [
          {
            path: '/store/setting',
            component: () => import('@/views/store/Setting'),
            meta: { title: '店铺设置', noCache: true, permission: ['/store/setting'] }
          },
          {
            path: '/store/address/index',
            component: () => import('@/views/store/address/Index'),
            meta: { title: '地址管理', noCache: true, permission: ['/store/address/index'] }
          },
          {
            path: '/page',
            // redirect: 'noRedirect',
            component: RouteView,
            meta: { title: '店铺设计' },
            children: [
              {
                path: '/page/index',
                component: () => import('@/views/page/design/Index'),
                meta: { title: '页面设计', noCache: true, permission: ['/page/index'] }
              },
              {
                path: '/page/create',
                component: () => import('@/views/page/Create'),
                meta: { title: '新增页面', noCache: true, permission: ['/page/create'], activeMenu: '/page/index' },
                hidden: true,
              },
              {
                path: '/page/update',
                component: () => import('@/views/page/Update'),
                meta: { title: '编辑页面', noCache: true, permission: ['/page/update'], activeMenu: '/page/index' },
                hidden: true,
              },
              {
                path: '/page/category',
                component: () => import('@/views/page/category/Index'),
                meta: { title: '分类模板', noCache: true, permission: ['/page/category'] }
              },
            ]
          },
        ]
      },
      // 商品管理
      {
        path: '/goods',
        component: RouteView,
        // redirect: 'noRedirect',
        redirect: '/goods/index',
        meta: { title: '商品管理', icon: 'el-icon-s-goods', permission: ['/goods'] },
        children: [
          {
            path: '/goods/index',
            component: () => import('@/views/goods/index'),
            meta: { title: '商品列表', noCache: true, permission: ['/goods/index'] }
          },
          {
            path: '/goods/category/index',
            component: () => import('@/views/goods/category'),
            meta: { title: '商品分类', noCache: true, permission: ['/goods/category/index'] }
          },
          {
            path: '/goods/service/index',
            component: () => import('@/views/goods/service'),
            meta: { title: '服务承诺', noCache: true, permission: ['/goods/service/index'] }
          },
          {
            path: '/goods/comment/index',
            component: () => import('@/views/goods/comment'),
            meta: { title: '商品评价', noCache: true, permission: ['/goods/comment/index'] }
          },
          {
            path: '/goods/create',
            hidden: true,
            component: () => import('@/views/goods/Create'),
            meta: { title: '创建商品', noCache: true, activeMenu: '/goods/index', permission: ['/goods/create'] }
          },
          {
            path: '/goods/update',
            hidden: true,
            component: () => import('@/views/goods/Update'),
            meta: { title: '编辑商品', noCache: true, activeMenu: '/goods/index', permission: ['/goods/update'] }
          },
        ]
      },
      // 订单管理 
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        // redirect: 'noRedirect',
        redirect: '/order/list/all',
        meta: { title: '订单管理', icon: 'el-icon-s-claim', permission: ['/order'] },
        children: [
          {
            path: '/order/list/all',
            component: () => import('@/views/order/index'),
            meta: { title: '全部订单', noCache: true, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/delivery',
            component: () => import('@/views/order/index'),
            meta: { title: '待发货', noCache: true, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/receipt',
            component: () => import('@/views/order/index'),
            meta: { title: '待收货', noCache: true, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/pay',
            component: () => import('@/views/order/index'),
            meta: { title: '待付款', noCache: true, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/complete',
            component: () => import('@/views/order/index'),
            meta: { title: '已完成', noCache: true, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/cancel',
            component: () => import('@/views/order/index'),
            meta: { title: '已取消', noCache: true, permission: ['/order/list/all'] }
          },
          {
            path: '/order/detail',
            component: () => import('@/views/order/Detail'),
            meta: { title: '订单详情', noCache: true, permission: ['/order/detail'] },
            hidden: true
          },
          {
            path: '/order/refund/index',
            component: () => import('@/views/order/refund/Index'),
            meta: { title: '售后管理', noCache: true, permission: ['/order/refund/index'] }
          },
          {
            path: '/order/refund/detail',
            component: () => import('@/views/order/refund/Detail'),
            meta: { title: '售后单详情', noCache: true, permission: ['/order/refund/detail'] },
            hidden: true
          },
          {
            path: '/order/tools',
            // redirect: 'noRedirect',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            component: RouteView,
            meta: { title: '订单处理', noCache: true, permission: ['/order/tools'] },
            children: [
              {
                path: '/order/tools/export',
                component: () => import('@/views/order/tools/Export'),
                meta: { title: '订单导出', noCache: true, permission: ['/order/tools/export'] }
              },
            ]
          },
        ]
      },
      // 会员管理
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        // redirect: 'noRedirect',
        meta: { title: '会员管理', icon: 'el-icon-user-solid', permission: ['/user'] },
        children: [
          {
            path: '/user/index',
            component: () => import('@/views/user/index'),
            meta: { title: '会员列表', noCache: true, permission: ['/user/index'] }
          },
          {
            path: '/user/grade/index',
            component: () => import('@/views/user/grade/Index'),
            meta: { title: '会员等级', noCache: true, permission: ['/user/grade/index'] }
          },
          {
            path: '/user/balance',
            // redirect: 'noRedirect',
            redirect: '/user/balance/index',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            component: RouteView,
            meta: { title: '余额记录', noCache: true, permission: ['/user/balance'] },
            children: [
              {
                path: '/user/recharge/index',
                component: () => import('@/views/user/recharge/Index'),
                meta: { title: '充值记录', noCache: true, permission: ['/user/recharge/index'] }
              },
              {
                path: '/user/balance/index',
                component: () => import('@/views/user/balance/Index'),
                meta: { title: '余额明细', noCache: true, permission: ['/user/balance/index'] }
              },
            ]
          },
        ]
      },
      // 内容管理
      {
        path: '/content',
        name: 'content',
        component: RouteView,
        // redirect: 'noRedirect',
        meta: { title: '内容管理', icon: 'el-icon-s-comment', permission: ['/content'] },
        children: [
          {
            path: '/content/article',
            // redirect: 'noRedirect',
            redirect: '/content/article/index',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            component: RouteView,
            meta: { title: '文章管理', noCache: true, permission: ['/content/article'] },
            children: [
              {
                path: '/content/article/index',
                component: () => import('@/views/content/article/Index'),
                meta: { title: '文章列表', noCache: true, permission: ['/content/article/index'] }
              },
              {
                path: '/content/article/category/index',
                component: () => import('@/views/content/article/category/Index'),
                meta: { title: '文章分类', noCache: true, permission: ['/content/article/category/index'] }
              },
            ]
          },
          {
            path: '/content/files',
            // redirect: 'noRedirect',
            redirect: '/content/files/index',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            component: RouteView,
            meta: { title: '文件库管理', noCache: true, permission: ['/content/files'] },
            children: [
              {
                path: '/content/files/index',
                component: () => import('@/views/content/files/Index'),
                meta: { title: '文件列表', noCache: true, permission: ['/content/files/index'] }
              },
              {
                path: '/content/files/group/index',
                component: () => import('@/views/content/files/group/Index'),
                meta: { title: '文章分组', noCache: true, permission: ['/content/files/group/index'] }
              },
            ]
          },
          {
            path: '/content/help/index',
            component: () => import('@/views/content/help/Index'),
            meta: { title: '帮助中心', noCache: true, permission: ['/content/help/index'] }
          },
        ]
      },
      // 营销管理
      {
        path: '/market',
        name: 'market',
        component: RouteView,
        // redirect: 'noRedirect',
        meta: { title: '营销管理', icon: 'el-icon-s-marketing', permission: ['/market'] },
        children: [
          {
            path: '/market/coupon',
            // redirect: 'noRedirect',
            redirect: '/market/coupon/index',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            component: RouteView,
            meta: { title: '优惠券', noCache: true, permission: ['/market/coupon'] },
            children: [
              {
                path: '/market/coupon/index',
                component: () => import('@/views/market/coupon/Index'),
                meta: { title: '优惠券列表', noCache: true, permission: ['/market/coupon/index'] }
              },
              {
                path: '/market/coupon/create',
                component: () => import('@/views/market/coupon/Create'),
                meta: { title: '创建优惠券', noCache: true, activeMenu: '/market/coupon/index', permission: ['/market/coupon/create'] },
                hidden: true
              },
              {
                path: '/market/coupon/update',
                component: () => import('@/views/market/coupon/Update'),
                // 当路由设置了该属性，则会高亮相对应的侧边栏。
                // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
                // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
                meta: { title: '编辑优惠券', noCache: true, activeMenu: '/market/coupon/index', permission: ['/market/coupon/update'] },
                hidden: true
              },
              {
                path: '/market/coupon/receive/index',
                component: () => import('@/views/market/coupon/Receive'),
                meta: { title: '领卷记录', noCache: true, permission: ['/market/coupon/receive/index'] }
              },
            ]
          },
          {
            path: '/market/recharge',
            // redirect: 'noRedirect',
            redirect: '/market/recharge/plan/index',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            component: RouteView,
            meta: { title: '会员充值', noCache: true, permission: ['/market/recharge'] },
            children: [
              {
                path: '/market/recharge/plan/index',
                component: () => import('@/views/market/recharge/plan/Index'),
                meta: { title: '充值套餐', noCache: true, permission: ['/market/recharge/plan/index'] }
              },
              {
                path: '/market/recharge/setting',
                component: () => import('@/views/market/recharge/Setting'),
                meta: { title: '充值设置', noCache: true, permission: ['/market/recharge/setting'] }
              },
            ]
          },
          {
            path: '/market/points',
            // redirect: 'noRedirect',
            redirect: '/market/points/setting',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            component: RouteView,
            meta: { title: '积分管理', noCache: true, permission: ['/market/points'] },
            children: [
              {
                path: '/market/points/setting',
                component: () => import('@/views/market/points/Setting'),
                meta: { title: '积分设置', noCache: true, permission: ['/market/points/setting'] }
              },
              {
                path: '/market/points/log',
                component: () => import('@/views/market/points/Log'),
                meta: { title: '积分明细', noCache: true, permission: ['/market/points/log'] }
              },
            ]
          },
          {
            path: '/market/full-free',
            component: () => import('@/views/market/FullFree'),
            meta: { title: '满额包邮', noCache: true, permission: ['/market/full-free'] },
          }
        ]
      },
      // 数据统计
      {
        path: '/statistics',
        name: 'statistics',
        component: () => import('@/views/statistics/Index'),
        meta: { title: '数据统计', noCache: true, icon: 'el-icon-s-data', permission: ['/statistics'] }
      },
      // 客户端
      {
        path: '/client',
        name: 'client',
        component: RouteView,
        // redirect: 'noRedirect',
        meta: { title: '客户端', icon: 'el-icon-s-promotion rgb(54,179,19)', permission: ['/client'] },
        children: [
          {
            path: '/client/register',
            component: () => import('@/views/client/Register'),
            meta: { title: '注册设置', noCache: true, permission: ['/client/register'] },
          },
          {
            path: '/client/wxapp',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            // redirect: 'noRedirect',
            redirect: '/client/wxapp/setting',
            component: RouteView,
            meta: { title: '微信小程序', noCache: true, permission: ['/client/wxapp'] },
            children: [
              {
                path: '/client/wxapp/setting',
                component: () => import('@/views/client/wxapp/Setting'),
                meta: { title: '小程序设置', noCache: true, permission: ['/client/wxapp/setting'] },
              }
            ]
          },
          {
            path: '/client/h5',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            // redirect: 'noRedirect',
            redirect: '/client/h5/setting',
            component: RouteView,
            meta: { title: 'H5端', noCache: true, permission: ['/client/h5'] },
            children: [
              {
                path: '/client/h5/setting',
                component: () => import('@/views/client/h5/Setting'),
                meta: { title: '站点设置', noCache: true, permission: ['/client/h5/setting'] },
              }
            ]
          },
        ]
      },
      // 设置
      {
        path: '/setting',
        name: 'setting',
        component: RouteView,
        // redirect: 'noRedirect',
        redirect: '/setting/trade',
        meta: { title: '设置', icon: 'el-icon-s-tools', permission: ['/setting'] },
        children: [
          {
            path: '/setting/trade',
            component: () => import('@/views/setting/Trade'),
            meta: { title: '交易设置', noCache: true, permission: ['/setting/trade'] }
          },
          {
            path: '/setting/storage',
            component: () => import('@/views/setting/Storage'),
            meta: { title: '上传设置', noCache: true, permission: ['/setting/storage'] }
          },
          {
            path: '/setting/sms',
            component: () => import('@/views/setting/Sms'),
            meta: { title: '短信通知', noCache: true, permission: ['/setting/sms'] }
          },
          {
            path: '/setting/delivery',
            // redirect: 'noRedirect',
            redirect: '/setting/delivery/setting',
            meta: { title: '配送设置', noCache: true, permission: ['/setting/delivery'] },
            component: RouteView,
            children: [
              {
                path: '/setting/delivery/setting',
                component: () => import('@/views/setting/delivery/Setting'),
                meta: { title: '配送方式', noCache: true, permission: ['/setting/delivery/setting'] }
              },
              {
                path: '/setting/delivery/template/index',
                component: () => import('@/views/setting/delivery/template/Index'),
                meta: { title: '运费模板', noCache: true, permission: ['/setting/delivery/template/index'] }
              },
              {
                path: '/setting/delivery/template/create',
                component: () => import('@/views/setting/delivery/template/Create'),
                meta: { title: '新增运费模板', noCache: true, activeMenu: '/setting/delivery/template/index', permission: ['/setting/delivery/template/create'] },
                hidden: true
              },
              {
                path: '/setting/delivery/template/update',
                component: () => import('@/views/setting/delivery/template/Update'),
                meta: { title: '编辑运费模板', noCache: true, activeMenu: '/setting/delivery/template/index', permission: ['/setting/delivery/template/update'] },
                hidden: true
              },
              {
                path: '/setting/delivery/express/index',
                component: () => import('@/views/setting/delivery/express/Index'),
                meta: { title: '物流公司', noCache: true, permission: ['/setting/delivery/express/index'] }
              },
            ]
          },
          {
            path: '/setting/other',
            // 只有一个子菜单的时候也一直显示根路由
            alwaysShow: true,
            // redirect: 'noRedirect',
            redirect: '/setting/other/clear',
            meta: { title: '其他设置', noCache: true, permission: ['/setting/other'] },
            component: RouteView,
            children: [
              {
                path: '/setting/other/clear',
                component: () => import('@/views/setting/other/Clear'),
                meta: { title: '清理缓存', noCache: true, permission: ['/setting/other/clear'] }
              }
            ]
          }
        ]
      },
    ]
  },
  
  // 更新账户信息
  {
    name: 'renew',
    path: '/manage',
    redirect: '/manage/renew',
    component: Layout,
    hidden: true,
    meta: { title: '更新账户信息', onCache: true },
    children: [
      {
        path: 'renew',
        component: () => import('@/views/manage/renew')
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 基础路由
export const constantRouterMap = [
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
]