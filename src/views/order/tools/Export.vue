<template>
  <div class="container">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <el-alert
        type="warning"
        description="功能说明：此功能用于订单数据导出，导出后的文件请用Excel打开查看"
        :show-icon="false"
      />
      <!-- 表单部分 -->
      <el-form
        class="my-form"
        v-loading="loading"
        :model="myForm"
        ref="ExportForm"
        label-position="left"
      >
        <el-row :gutter="24">
          <el-col :span="12" class="el-col-item">
            <el-form-item
              label="下单时间: "
              size="small"
              :label-width="labelWidth"
              prop="betweenTime"
              :rules="[
                {
                  type: 'array',
                  required: true,
                  message: '请选择下单时间',
                  trigger: 'change',
                },
              ]"
            >
              <el-date-picker
                v-model="myForm.betweenTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col
            v-for="(itm, idx) in elSelectItem"
            :key="idx"
            :span="12"
            class="el-col-item"
          >
            <el-form-item
              :label="`${itm.label}: `"
              size="small"
              :prop="itm.model"
              :rules="itm.rules"
              :label-width="labelWidth"
            >
              <el-select v-model="myForm[itm.model]">
                <el-option label="全部" :value="-1" />
                <el-option
                  v-for="(item, index) in itm.EnumData.data"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="el-col-item">
            <el-form-item
              size="small"
              class="item-main"
              label="导出的字段: "
              :label-width="labelWidth"
              :rules="[
                {
                  type: 'array',
                  required: true,
                  message: '请选择导出的字段',
                  trigger: 'change',
                },
              ]"
            >
              <el-checkbox-group v-model="myForm.columns">
                <el-checkbox
                  v-for="(item, index) in columnData"
                  :key="index"
                  :label="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="el-col-item">
            <el-form-item class="form-btn" size="small">
              <el-button
                class="btn-main"
                type="primary"
                icon="el-icon-download"
                :loading="isBtnLoading"
                @click="handleSubmit"
                >导出</el-button
              >
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div class="card-title">历史导出记录</div>
      <export-list ref="ExportList" />
    </el-card>
  </div>
</template>

<script>
import { inArray, assignment } from "@/utils/util";
import * as Api from "@/api/order/export";

import {
  DeliveryTypeEnum,
  OrderSourceEnum,
  PayTypeEnum,
  OrderStatusEnum,
} from "@/common/enum/order";
import { ExportList } from "./modules";

// 订单字段记录
const columnData = [
  { label: "订单ID", value: "order_id" },
  { label: "订单号", value: "order_no" },
  { label: "商品信息", value: "goods_detail" },
  { label: "商品总额", value: "total_price" },
  { label: "优惠券抵扣金额", value: "coupon_money" },
  { label: "积分抵扣金额", value: "points_money" },
  { label: "后台改价", value: "update_price" },
  { label: "运费金额", value: "express_price" },
  { label: "订单实付款", value: "pay_price" },
  { label: "支付方式", value: "pay_type" },
  { label: "下单时间", value: "create_time" },
  { label: "买家信息", value: "user_info" },
  { label: "买家留言", value: "buyer_remark" },
  { label: "配送方式", value: "delivery_type" },
  { label: "收货人", value: "receipt_name" },
  { label: "联系电话", value: "receipt_phone" },
  { label: "收货地址", value: "receipt_address" },
  { label: "物流公司", value: "express_company" },
  { label: "物流单号", value: "express_no" },
  { label: "付款状态", value: "pay_status" },
  { label: "付款时间", value: "pay_time" },
  { label: "发货状态", value: "delivery_status" },
  { label: "发货时间", value: "delivery_time" },
  { label: "收货状态", value: "receipt_status" },
  { label: "收货时间", value: "receipt_time" },
  { label: "订单状态", value: "order_status" },
  { label: "是否已评价", value: "is_comment" },
  { label: "订单来源", value: "order_source" },
];
// 默认选中的字段
const columnValue = [
  "order_no",
  "goods_detail",
  "total_price",
  "coupon_money",
  "points_money",
  "update_price",
  "express_price",
  "pay_price",
  "pay_type",
  "create_time",
  "user_info",
  "buyer_remark",
  "delivery_type",
  "receipt_name",
  "receipt_phone",
  "receipt_address",
  "express_company",
  "express_no",
  "pay_status",
  "pay_time",
  "delivery_status",
  "delivery_time",
  "receipt_status",
  "receipt_time",
  "order_status",
  "order_source",
];
const elSelectItem = [
  {
    label: "订单来源",
    rules: [{ required: true, message: "请选择订单来源", trigger: "change" }],
    model: "orderSource",
    EnumData: OrderSourceEnum,
  },
  {
    label: "支付方式",
    rules: [{ required: true, message: "请选择支付方式", trigger: "change" }],
    model: "payType",
    EnumData: PayTypeEnum,
  },
  {
    label: "配送方式",
    model: "deliveryType",
    EnumData: DeliveryTypeEnum,
  },
];
export default {
  components: { ExportList },
  data() {
    return {
      myForm: {
        // 下单时间
        betweenTime: [],
        // 订单来源
        orderSource: -1,
        // 支付方式
        payType: -1,
        // 配送方式
        deliveryType: -1,
        // 导出的字段
        columns: columnValue,
      },
      columnData,
      columnValue,
      elSelectItem,
      labelWidth: "100px",
      // 按钮加载
      isBtnLoading: false,
      // 页面加载
      loading: false,
    };
  },
  beforeCreate() {
    // 批量给当前实例赋值
    assignment(this, {
      inArray,
      DeliveryTypeEnum,
      OrderSourceEnum,
      OrderStatusEnum,
      PayTypeEnum,
    });
  },
  methods: {
    // 提交表单
    handleSubmit() {
      this.$refs.ExportForm.validate((valid) => {
        if (valid) {
          this.isBtnLoading = true;
          this.loading = true;
          Api.exportOrder(this.myForm)
            .then((result) => {
              result.status &&
                this.$notify({
                  type: result.status == 200 ? "success" : "error",
                  title: "导出订单",
                  message: result.message,
                  showClose: true,
                  duration: 1500,
                });
            })
            .finally(() => {
              this.isBtnLoading = false;
              this.loading = false;
            });
        }
      });
    },
    // 重置表单
    handleReset() {
      this.$refs.ExportForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.container::v-deep {
  .el-card {
    margin-bottom: 20px;
  }
  .el-card__body {
    .el-alert--warning.is-light {
      margin-bottom: 20px;
    }
  }
}
.my-form::v-deep {
  width: 980px;
  padding-left: 15px;
  // 多选框对齐排列
  .item-main {
    .el-checkbox-group {
      text-align: left; //这个很关键，否则最后一行是居中状态
    }
    .el-checkbox {
      margin-left: 0px;
      margin-right: 25px;
      width: 150px; //根据内容设置宽度
      padding-left: 0px;
      text-align: left; //这个很关键，否则每一行都是居中状态
    }
  }
  .el-col-item {
    margin-bottom: 18px;
  }
}
</style>