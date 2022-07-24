<template>
  <div id="order-index">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模块 -->
        <el-row class="row-item-search">
          <el-form
            inline
            ref="orderForm"
            class="search-form"
            label-position="right"
            :model="searchForm"
            :label-width="labelWidth"
          >
            <el-form-item
              label="订单查询: "
              size="small"
              :label-width="labelWidth"
            >
              <el-input
                placeholder="请输入关键词"
                v-model="searchForm.searchValue"
                style="width: 342px"
                class="input-with-select"
              >
                <el-select
                  v-model="searchForm.searchType"
                  slot="prepend"
                  style="width: 100px"
                >
                  <el-option
                    v-for="(item, index) in SearchTypeEnum"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-input>
            </el-form-item>

            <el-form-item
              v-for="(itm, idx) in searchSelectItem"
              :key="idx"
              :label="itm.label"
              size="small"
              :label-width="labelWidth"
            >
              <el-select v-model="searchForm[itm.model]">
                <el-option label="全部" :value="-1" />
                <el-option
                  v-for="(item, index) in itm.EnumData.data"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              label="下单时间: "
              size="small"
              :label-width="labelWidth"
            >
              <el-date-picker
                v-model="searchForm.betweenTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item class="search-btn" size="small">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
                >搜 索</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <!-- 列表内容 -->
      <el-table 
        v-loading="loading"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :data="orderList.data"
        :header-cell-style="getRowClass"
        
      >
        <el-table-column 
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
        <template>
          <!-- 商品信息 -->
          <span v-if="item.text == 'goods'"></span>
        </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { inArray, assignment } from "@/utils/util";
import * as Api from "@/api/order";
import * as EventApi from "@/api/order/event";
import PlatformIcon from "@/components/PlatformIcon";
import { GoodsItem, UserItem } from "@/components";
import {
  DeliveryStatusEnum,
  DeliveryTypeEnum,
  OrderSourceEnum,
  OrderStatusEnum,
  PayStatusEnum,
  PayTypeEnum,
  ReceiptStatusEnum,
} from "@/common/enum/order";
import { DeliveryForm, CancelForm } from "./modules";

// 搜索关键词类型枚举
const SearchTypeEnum = [
  { name: "订单号", value: 10 },
  { name: "会员昵称", value: 20 },
  { name: "会员ID", value: 30 },
];
// 表格字段
const columns = [
  {
    label: "商品信息",
    text: "goods",
    width: '185'
  },
  {
    label: "单价/数量",
    text: 'unit_price',
    width: '185'
  },
  {
    label: "付款金额",
    text: "pay_price",
    width: '185'
  },
  {
    label: "买家",
    text: "user",
    width: '185'
  },
  {
    label: "售后类型",
    text: "pay_type",
    width: '185'
  },
  {
    label: "处理进度",
    text: "delivery_type",
    width: '185'
  },
  {
    label: "售后单状态",
    text: "status",
    width: '185'
  },
  {
    label: "操作",
    text: "action",
  },
];

export default {
  name: "Order",
  components: {
    PlatformIcon,
    GoodsItem,
    UserItem,
  },
  data() {
    const searchSelectItem = [
      {
        label: "订单来源: ",
        model: "orderSource",
        EnumData: OrderSourceEnum,
      },
      {
        label: "支付方式: ",
        model: "payType",
        EnumData: PayTypeEnum,
      },
      {
        label: "配送方式: ",
        model: "deliveryType",
        EnumData: DeliveryTypeEnum,
      },
    ];
    return {
      // 订单类型
      dataType: this.getDataType(),
      // 搜索模块表单
      searchForm: {
        // 订单查询
        searchValue: "",
        // 订单查询搜索类型
        searchType: 10,
        // 订单来源
        orderSource: -1,
        // 支付方式
        payType: -1,
        // 配送方式
        deliveryType: -1,
        // 选择时间
        betweenTime: [],
      },
      // 表头
      columns,
      // 循环el-form-item项
      searchSelectItem,
      labelWidth: "100px",
      // 查询参数
      queryParam: {},
      // 正在加载
      loading: false,
      // 当前页码
      page: 1,
      // 列表数据
      orderList: { data: [], total: 0, per_page: 10 },
    };
  },
  beforeCreate() {
    // 批量给当前实例赋值
    assignment(this, {
      inArray,
      DeliveryStatusEnum,
      DeliveryTypeEnum,
      OrderSourceEnum,
      OrderStatusEnum,
      PayStatusEnum,
      PayTypeEnum,
      ReceiptStatusEnum,
      SearchTypeEnum,
    });
  },
  created() {
    // 初始化页面
    this.init();
  },
  watch: {
    // 监听路由变化
    $route() {
      this.init();
    },
  },
  methods: {
    // 初始化页面
    init() {
      this.dataType = this.getDataType();
      this.queryParam = {};
      this.handleRefresh(true);
    },
    // 获取当前标签
    getDataType() {
      return this.$route.path.split("/")[3];
    },
    // 获取列表数据
    getList() {
      const { dataType, queryParam, page } = this;
      this.loading = true;
      return Api.list({ dataType, ...queryParam, page })
        .then((response) => {
          const {
            data: { list },
          } = response.data;
          this.orderList = list.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 渲染订单状态标签颜色
    rendOrderStatusColor(orderStatus) {
      const { OrderStatusEnum } = this;
      const ColorEnum = {
        [OrderStatusEnum.NORMAL.value]: "info", // 10
        [OrderStatusEnum.CANCELLED.value]: "error", // 20
        [OrderStatusEnum.APPLY_CANCEL.value]: "error", // 21
        [OrderStatusEnum.COMPLETED.value]: "success", // 30
      };
      return ColorEnum[orderStatus];
    },
    // 确认搜索搜索
    handleSearch() {
      this.queryParam = { ...this.queryParam, ...this.searchForm };
      this.handleRefresh(true);
    },
    // 删除记录
    handleDelete(item) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await EventApi.deleted(item.order_id);
          this.$notify({
            type: data.success == 200 ? "success" : "error",
            title: "删除记录",
            message: data.message,
            duration: 1500,
          });
          this.handleRefresh();
        })
        .catch(() => {});
    },
    // 订单发货
    handleDelivery(record) {
      this.$refs.DeliveryForm.show(record);
    },

    // 审核取消订单
    handleCancel(record) {
      this.$refs.CancelForm.show(record);
    },
    // 刷新列表
    async handleRefresh(bool = false) {
      this.loading = true;
      bool && (this.page = 1);
      await this.getList();
      this.loading = false;
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
#order-index::v-deep {
  .el-card {
    // 标题
    .card-title {
      font-size: 14.5px;
      margin-bottom: 30px;
      color: rgba(0, 0, 0, 0.75);
    }
    // 操作模板
    .table-operator {
      .row-item-search .search-form {
        .el-form-item--small .el-form-item__content,
        .el-form-item--small .el-form-item__label {
          font-weight: 500;
        }
        // 搜索、重置按钮样式
        .search-btn .el-button {
          height: 35px;
          line-height: 1px;
          border-radius: 1px;
          // 第一个按钮(搜索按钮)
          &:nth-child(0) {
            margin-left: 10px;
            width: 80px;
          }
        }
      }
    }
  }
}
</style>