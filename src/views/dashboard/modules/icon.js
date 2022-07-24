/**
 * 首页图标库
 */
import fCoupon from '@/icons/svg/home/functions/coupon.svg?inline'
import fGoods from '@/icons/svg/home/functions/goods.svg?inline'
import fOrder from '@/icons/svg/home/functions/order.svg?inline'
import fRefund from '@/icons/svg/home/functions/refund.svg?inline'
import fStatistics from '@/icons/svg/home/functions/statistics.svg?inline'
import fUser from '@/icons/svg/home/functions/user.svg?inline'
import fDecorate from '@/icons/svg/home/functions/decorate.svg?inline'

import oSale from '@/icons/svg/home/overview/sale.svg?inline'
import oIncrease from '@/icons/svg/home/overview/increase.svg?inline'

import sGoods from '@/icons/svg/home/statistics/goods.svg?inline'
import sOrder from '@/icons/svg/home/statistics/order.svg?inline'
import sUser from '@/icons/svg/home/statistics/user.svg?inline'
import sConsume from '@/icons/svg/home/statistics/consume.svg?inline'


// 常用功能
const functions = {
  coupon: fCoupon,
  goods: fGoods,
  order: fOrder,
  refund: fRefund,
  statistics: fStatistics,
  user: fUser,
  decorate: fDecorate
}

// 实时概况
const overview = { sale: oSale, increase: oIncrease }

// 统计
const statistics = { goods: sGoods, order: sOrder, user: sUser, consume: sConsume }

export { functions, overview, statistics }
