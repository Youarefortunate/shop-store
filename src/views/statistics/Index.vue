<template>
  <div class="container" v-loading="loading">
    <el-card class="overview">
      <!-- 数据概况 -->
      <div class="card-title">
        <span>数据概况</span>
      </div>
      <div class="screen flex flex-x-center">
        <el-date-picker
          size="small"
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onPickerChange"
        >
        </el-date-picker>
        <!-- 快捷选项 -->
        <div class="shortcut">
          <div class="shortcut-days">
            <a href="javascript:void(0);" @click="handleFastDate(7)">7天</a>
            <a href="javascript:void(0);" @click="handleFastDate(30)">30天</a>
            <a href="javascript:void(0);" @click="handleFastDate(0)">清空</a>
          </div>
        </div>
      </div>
      <el-row class="mt-20" :gutter="32">
        <el-col :span="8">
          <div class="item flex">
            <div class="col-left">
              <div
                class="icon-body flex flex-x-center flex-y-center col-left-icon"
                style="color: #1890ff"
              >
                <i class="el-icon-s-marketing"></i>
                <!-- <i :class="Icon.overview.sale"></i> -->
              </div>
            </div>
            <div class="col-right">
              <div class="name">销售额 (元)</div>
              <div class="value">{{ data.overview.orderTotalPrice }}</div>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="item flex">
            <div class="col-left small">
              <div
                class="icon-body flex flex-x-center flex-y-center col-left-icon"
                style="color: #1890ff"
              >
                <i class="el-icon-s-order"></i>
                <!-- <i :class="Icon.statistics.order"></i> -->
              </div>
            </div>
            <div class="col-right">
              <div class="name">支付订单数 (笔)</div>
              <div class="value">{{ data.overview.orderTotal }}</div>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="item flex">
            <div class="col-left small">
              <div
                class="icon-body flex flex-x-center flex-y-center col-left-icon"
                style="color: #1890ff"
              >
                <i class="el-icon-s-goods"></i>
              </div>
            </div>
            <div class="col-right">
              <div class="name">商品数量 (件)</div>
              <div class="value">{{ data.overview.goodsTotal }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row class="mt-20" :gutter="32">
        <el-col class :span="8">
          <div class="item flex">
            <div class="col-left">
              <div
                class="icon-body flex flex-x-center flex-y-center col-left-icon"
                style="color: #1890ff"
              >
                <i class="el-icon-user-solid"></i>
                <!-- <i :class="Icons.statistics.user"></i> -->
              </div>
            </div>
            <div class="col-right">
              <div class="name">会员数量</div>
              <div class="value">{{ data.overview.userTotal }}</div>
            </div>
          </div>
        </el-col>
        <el-col class :span="8">
          <div class="item flex">
            <div class="col-left">
              <div
                class="icon-body flex flex-x-center flex-y-center col-left-icon"
                style="color: #1890ff"
              >
                <i class="el-icon-s-marketing"></i>
              </div>
            </div>
            <div class="col-right">
              <div class="name">消费人数</div>
              <div class="value">{{ data.overview.consumeUsers }}</div>
            </div>
          </div>
        </el-col>
        <el-col class :span="8">
          <div class="item flex">
            <div class="col-left">
              <div
                class="icon-body flex flex-x-center flex-y-center col-left-icon"
                style="color: #1890ff"
              >
                <i class="el-icon-s-finance"></i>
                <!-- <i :class="Icons.statistics.recharge"></i> -->
              </div>
            </div>
            <div class="col-right">
              <div class="name">用户充值总额 (元)</div>
              <div class="value">{{ data.overview.rechargeTotalMoney }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 近七日交易走势 -->
    <el-card class="trade-trend mt-20">
      <div class="card-title">
        <span>近七日交易走势</span>
      </div>
      <div class="echarts-body">
        <div id="main" style="width: 100%; height: 400px"></div>
      </div>
    </el-card>

    <el-row class="ranking mt-20" :gutter="32">
      <el-col class="ranking-item" :span="12">
        <el-card>
          <div class="card-title">
            <span>商品销售榜</span>
          </div>
          <el-table
            row-key="goods_id"
            style="width: 100%"
            empty-text="数据都跑空啦~"
            :data="data.goodsRanking"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              v-for="(item, index) in goodsRankingColumns"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
            >
              <template slot-scope="scope">
                <span v-if="item.text == 'index'">
                  <div
                    v-if="scope.row.index < 3 && scope.row.total_sales_num > 0"
                    class="ranking-img"
                  >
                    <el-image
                      fit="scale-down"
                      style="width: 50px; height: 50px"
                      :src="`static/img/statistics/ranking/0${
                        scope.row.index + 1
                      }.png`"
                    />
                  </div>
                  <span v-else>{{ scope.row.index }}</span>
                </span>
                <span v-if="item.text == 'goods_name'">
                  <div class="oneline-hide" style="width: 240px">
                    {{ scope.row.goods_name }}
                  </div>
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col class="ranking-item" :span="12">
        <el-card>
          <div class="card-title">
            <span>用户消费榜</span>
          </div>
          <el-table
            row-key="user_id"
            style="width: 100%"
            empty-text="数据都跑空啦~"
            :data="data.userExpendRanking"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              v-for="(item, index) in userRankingColumns"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
            >
              <template slot-scope="scope">
                <span v-if="item.text == 'index'">
                  <div
                    v-if="scope.row.index < 3 && scope.row.expend_money > 0"
                    class="ranking-img"
                  >
                    <el-image
                      fit="scale-down"
                      style="width: 50px; height: 50px"
                      :src="`static/img/statistics/ranking/0${
                        scope.row.index + 1
                      }.png`"
                    />
                  </div>
                  <span v-else>{{ scope.row.index + 1 }}</span>
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import "echarts/theme/fresh-cut";
import * as Api from "@/api/statistics/data";
import * as Icons from "./modules/icon";
import { getDateByDay } from "@/utils/util";
import moment from "moment";

// 商品销售榜 (table字段)
const goodsRankingColumns = [
  {
    label: "排名",
    text: "index",
  },
  {
    label: "商品名称",
    text: "goods_name",
  },
  {
    label: "销量 (件)",
    prop: "total_sales_num",
  },
  {
    label: "销售额 (元)",
    prop: "sales_volume",
  },
];

// 用户消费榜 (table字段)
const userRankingColumns = [
  {
    label: "排名",
    text: "index",
    width: "100",
  },
  {
    label: "会员昵称",
    text: "nick_name",
  },
  {
    label: "实际消费金额 (元)",
    prop: "expend_money",
    width: "160",
  },
];

// 默认数据
const data = {
  overview: {
    userTotal: "0",
    consumeUsers: "0",
    orderTotal: "0",
    orderTotalPrice: "0.00",
    goodsTotal: "0",
    rechargeTotalMoney: "0",
  },
  tradeTrend: {
    date: [],
    orderTotal: [],
    orderTotalPrice: [],
  },
  goodsRanking: [],
  userExpendRanking: [],
};

export default {
  data() {
    return {
      Icons,
      // 正在提交
      loading: false,
      // 页面数据
      data,
      // 日期筛选
      dateValue: [],
      // 排行榜字段
      goodsRankingColumns,
      userRankingColumns,
    };
  },
  created() {
    // 获取页面数据
    this.getData();
  },
  methods: {
    // 监听事件：日期选择器
    onPickerChange() {
      // 获取数据概况
      this.getSurvey();
    },
    // 获取页面数据
    getData() {
      this.loading = true;
      Api.data()
        .then((result) => {
          this.data = result.data.data.data;
          // 渲染走势图
          this.$nextTick(() => {
            this.myEcharts();
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 事件：快捷选择日期
    handleFastDate(days) {
      // 清空日期
      if (days === 0) {
        this.dateValue = [];
      } else {
        this.dateValue = [moment(getDateByDay(-days)), moment(getDateByDay(0))]
      }
      // 获取数据概况
      this.getSurvey();
    },
    // 获取数据概况
    getSurvey() {
      this.loading = true;
      const { dateValue } = this;
      const data = { startDate: null, endDate: null };
      if (dateValue.length) {
        data.startDate = dateValue[0].format("YYYY-MM-DD");
        data.endDate = dateValue[1].format("YYYY-MM-DD");
      }
      Api.survey(data)
        .then((result) => {
          this.data.overview = result.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 渲染走势图
    myEcharts() {
      const { data } = this;
      // 初始化echarts实例
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
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(250,250,250); font-weight: 500; color: black;";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
}
// 实时概况
.overview {
  a {
    color: unset;

    &:hover {
      color: #1890ff;
    }
  }

  .screen {
    margin-top: -22px;
    margin-bottom: 30px;
    text-align: center;
    .shortcut-days {
      font-size: 14px;
      margin-left: 10px;
      line-height: 32px;
      color: #999;
      a {
        margin: 0 3px;
      }
    }
  }

  .item {
    padding: 13px 20px;
    display: flex;
    align-items: center;
  }

  .col-left {
    color: #66aaff;
    font-size: 28px;
    &.small {
      font-size: 26px;
    }

    .icon-body {
      font-size: 28px;
      margin-right: 35px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background-color: #eff6ff;
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

  .col-right {
    .name {
      font-size: 14px;
      color: #666;
    }

    .value {
      color: #000;
      font-size: 24px;
    }

    .yesterday {
      display: none;
      font-size: 12px;
      color: #999;
    }
  }
}

.ranking-img {
  text-align: center;
}
</style>