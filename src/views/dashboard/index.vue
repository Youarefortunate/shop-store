<template>
  <div id="home">
    <!-- 实时概况 -->
    <div class="card">
      <div class="card-title">
        <span>实时概况</span>
      </div>
      <el-row :gutter="32">
        <!-- 销售额 -->
        <el-col :span="6">
          <div class="item">
            <div class="col-left-icon" style="color: #1890ff">
              <i class="el-icon-data-analysis"></i>
            </div>
            <div class="col-right-text">
              <div class="name">销售额 (元)</div>
              <p class="value">{{ data.overview.orderTotalPrice.tday }}</p>
            </div>
          </div>
        </el-col>
        <!-- 支付订单 -->
        <el-col :span="6">
          <div class="item">
            <div class="col-right-text">
              <div class="name">支付订单数</div>
              <p class="value">{{ data.overview.orderTotal.tday }}</p>
            </div>
          </div>
        </el-col>
        <!-- 新增会员数 -->
        <el-col :span="6">
          <div class="item">
            <div class="col-left-icon" style="color: #1890ff">
              <i class="el-icon-data-line"></i>
            </div>
            <div class="col-right-text">
              <div class="name">新增会员数</div>
              <p class="value">{{ data.overview.newUserTotal.tday }}</p>
            </div>
          </div>
        </el-col>
        <!-- 付款会员数 -->
        <el-col :span="6">
          <div class="item">
            <div class="col-right-text">
              <div class="name">付款会员数</div>
              <p class="value">{{ data.overview.consumeUserTotal.tday }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 商品总数量、会员总人数、付款订单总量、消费总人数 -->
    <div class="statistics-card">
      <el-row :gutter="20">
        <!-- 商品总数量 -->
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item">
              <div class="col-left-icon" style="color: #1890ff">
                <i class="el-icon-shopping-bag-1"></i>
              </div>
              <div class="col-right-text">
                <div class="name">商品总数量</div>
                <p class="value">{{ data.statistics.goodsTotal }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- 会员总人数 -->
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item">
              <div class="col-left-icon" style="color: #1890ff">
                <i class="el-icon-user"></i>
              </div>
              <div class="col-right-text">
                <div class="name">会员总人数</div>
                <p class="value">{{ data.statistics.userTotal }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- 付款订单总量 -->
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item">
              <div class="col-left-icon" style="color: #1890ff">
                <i class="el-icon-document"></i>
              </div>
              <div class="col-right-text">
                <div class="name">付款订单总量</div>
                <p class="value">{{ data.statistics.orderTotal }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- 消费总人数 -->
        <el-col :span="6">
          <el-card shadow="always">
            <div class="item">
              <div class="col-left-icon" style="color: #1890ff">
                <i class="el-icon-s-finance"></i>
              </div>
              <div class="col-right-text">
                <div class="name">消费总人数</div>
                <p class="value">{{ data.statistics.consumeUserTotal }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 待办事项 -->
    <el-card shadow="always" class="backlog">
      <el-row :gutter="32">
        <!--待发货订单  -->
        <el-col :span="6">
          <div class="item">
            <router-link to="/order/list/delivery">
              <div class="name">待发货订单(笔)</div>
              <p class="value">{{ data.pending.deliverOrderTotal }}</p>
            </router-link>
          </div>
        </el-col>
        <!-- 售后单 -->
        <el-col :span="6">
          <div class="item">
            <router-link to="/order/refund/index">
              <p class="name">售后单(笔)</p>
              <p class="value">{{ data.pending.refundTotal }}</p>
            </router-link>
          </div>
        </el-col>
        <!-- 代付款订单 -->
        <el-col :span="6">
          <div class="item">
            <router-link to="/order/list/pay">
              <p class="name">待付款订单(笔)</p>
              <p class="value">{{ data.pending.paidOrderTotal }}</p>
            </router-link>
          </div>
        </el-col>
        <!-- 已售馨商品 -->
        <el-col :span="6">
          <div class="item">
            <router-link
              :to="{ path: '/goods/index', query: { listType: 'sold_out' } }"
            >
              <p class="name">已售罄商品</p>
              <p class="value">{{ data.pending.soldoutGoodsTotal }}</p>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 常用功能 -->
    <el-card class="functions">
      <div class="card-title">
        <span>常用功能</span>
      </div>
      <el-row :gutter="32">
        <el-col :span="6" v-for="(item, index) in functions" :key="index">
          <div class="item" @click="handleLink(item.link)">
            <div class="functions-item">
              <div
                :style="{ backgroundColor: item.color }"
                style="fontsize: 15px; color: #fff"
                class="functions-icon"
              >
                <i :class="item.icon"></i>
              </div>
              <span class="name">{{ item.name }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 近七日交易走势 -->
    <el-card class="echarts">
      <div class="echarts-card-title">
        <span>近七日交易走势</span>
      </div>
      <div class="echarts-body">
        <div id="main" style="width: 100%; height: 400px"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts/theme/fresh-cut";
import * as Api from "@/api/home";
import * as Icons from "./modules/icon";

// 常用功能
const functions = [
  {
    name: "发布商品",
    icon: "el-icon-s-goods",
    color: "#00BF57",
    link: "/goods/create",
  },
  {
    name: "店铺装修",
    icon: "el-icon-s-open",
    color: "#f15858",
    link: "/page/index",
  },
  {
    name: "会员管理",
    icon: "el-icon-user-solid",
    color: "#139dff",
    link: "/user/index",
  },
  {
    name: "订单管理",
    icon: "el-icon-s-order",
    color: "#139dff",
    link: "/order/list/all",
  },
  {
    name: "售后管理",
    icon: "el-icon-phone",
    color: "#139dff",
    link: "/order/refund/index",
  },
  {
    name: "优惠券",
    icon: "el-icon-s-ticket",
    color: "#f15858",
    link: "/market/coupon/index",
  },
  {
    name: "数据统计",
    icon: "el-icon-s-data",
    color: "#139dff",
    link: "/statistics",
  },
];
const data = {
  overview: {
    orderTotalPrice: {
      tday: "0.00",
      ytd: "0.00",
    },
    orderTotal: {
      tday: "0",
      ytd: "0",
    },
    newUserTotal: {
      tday: "0",
      ytd: "0",
    },
    consumeUserTotal: {
      tday: "0",
      ytd: "0",
    },
  },
  statistics: {
    goodsTotal: "0",
    userTotal: "0",
    orderTotal: "0",
    consumeUserTotal: "0",
  },
  pending: {
    deliverOrderTotal: 0,
    refundTotal: 0,
    paidOrderTotal: 0,
    soldoutGoodsTotal: 0,
  },
  tradeTrend: {
    date: [],
    orderTotal: [],
    orderTotalPrice: [],
  },
};

export default {
  name: "Dashboard",
  data() {
    return {
      Icons,
      data,
      functions,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let result = await Api.data();
      this.data = result.data.data.data;
      this.$nextTick(() => this.myEcharts());
    },

    // 常用功能点击事件
    handleLink(link) {
      this.$router.push(link);
    },

    myEcharts() {
      const { data } = this;
      // 初始化echart
      const myChart = echarts.init(
        document.getElementById("main"),
        "fresh-cut"
      );
      // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["成交量", "成交额"],
        },
        toolbox: {
          show: true,
          showTitle: false,
          feature: {
            mark: { show: true },
            magicType: { show: true, type: ["line", "bar"] },
          },
        },
        calculable: true,
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.tradeTrend.date,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "成交额",
            type: "line",
            data: data.tradeTrend.orderTotalPrice,
          },
          {
            name: "成交量",
            type: "line",
            data: data.tradeTrend.orderTotal,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  background-color: rgb(240, 242, 245);
  position: absolute;
  top: 0;
  left: 0;
}
.card {
  margin: 30px;
  // height: 100px;
  padding: 24px;
  background-color: rgb(255, 255, 255);
  .card-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
p {
  margin: 5px;
}
.item {
  display: flex;
  align-items: center;
  padding: 13px 0;
  .name {
    font-size: 13px;
    color: #666;
  }
  .value {
    font-size: 24px;
  }
  .col-left-icon {
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background-color: #eff6ff;
    margin-right: 35px;
  }
}
.statistics-card {
  margin: 30px;
}
.backlog {
  margin: 30px;
  zoom: 1;

  .item {
    text-align: center;
    .name {
      font-weight: bold;
      font-size: 13.6px;
      &:hover {
        color: #1890ff;
      }
    }
    .value {
      color: red;
      font-weight: bold;
      font-size: 16px;
    }
  }
}

.functions {
  margin: 30px;
  .card-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
.functions-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  .functions-icon {
    width: 28px;
    height: 28px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .name {
    margin-left: 12px;
    &:hover {
      color: #1890ff;
    }
  }
}
.echarts {
  margin: 30px;
  .echarts-card-title {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>
