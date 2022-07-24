<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        class="setting-trade"
        :model="form"
        ref="SettingTrade"
        label-width="120px"
        style="padding: 30px 0 20px 100px"
      >
        <el-form-item
          label="未支付订单: "
          prop="order.closeHours"
          size="small"
          :rules="[
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0"
            style="width: 160px"
            v-model="form.order.closeHours"
            controls-position="right"
          />
          <span class="input-text_right">小时后自动关闭</span>
          <div class="form-item-help">
            <p class="extra">
              如果在期间订单未付款，系统自动关闭，设置0小时不自动关闭
            </p>
          </div>
        </el-form-item>

        <el-form-item
          label="已发货订单: "
          prop="order.receive_days"
          size="small"
          :rules="[
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0"
            style="width: 160px"
            v-model="form.order.receive_days"
            controls-position="right"
          />
          <span class="input-text_right">天后自动确认收货</span>
          <div class="form-item-help">
            <p class="extra">
              如果在期间未确认收货，系统自动完成收货，设置0天不自动收货
            </p>
          </div>
        </el-form-item>

        <el-form-item
          label="已完成订单: "
          prop="order.refund_days"
          size="small"
          :rules="[
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0"
            style="width: 160px"
            v-model="form.order.refund_days"
            controls-position="right"
          />
          <span class="input-text_right">天后允许申请售后</span>
          <div class="form-item-help">
            <p class="extra">
              订单完成后，用户在指定期限内可申请售后，设置0天不允许申请
            </p>
          </div>
        </el-form-item>

        <el-divider content-position="left">运费设置</el-divider>
        <el-form-item required label="运费组合策略: " size="small">
          <el-radio-group v-model="form.freight_rule">
            <div class="radio-item">
              <el-radio :style="radioStyle" label="10">叠加</el-radio>
              <div class="form-item-help">
                <p class="extra">
                  订单中的商品有多个运费模板时，将每个商品的运费之和订为订单总运费
                </p>
              </div>
            </div>
            <div class="radio-item">
              <el-radio :style="radioStyle" label="20">以最低运费结算</el-radio>
              <div class="form-item-help">
                <p class="extra">
                  订单中的商品有多个运费模板时，取订单中运费最少的商品的运费计为订单总运费
                </p>
              </div>
            </div>
            <div class="radio-item">
              <el-radio :style="radioStyle" label="30">以最高运费结算</el-radio>
              <div class="form-item-help">
                <p class="extra">
                  订单中的商品有多个运费模板时，取订单中运费最多的商品的运费计为订单总运费
                </p>
              </div>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import pick from "lodash.pick";
import * as Api from "@/api/setting/store";

export default {
  data() {
    return {
      // 表单数据
      form: {
        order: {
          // 未支付订单
          closeHours: "",
          // 已发货订单
          receive_days: "",
          // 已完成订单
          refund_days: "",
        },
        // 运费组合策略
        freight_rule: "10",
      },
      // 加载
      loading: false,
      // 当前设置项的key
      key: "trade",
      // 单选框样式
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      // 当前记录详情
      record: {},
    };
  },
  // 初始化数据
  created() {
    // 获取当前详情记录
    this.getDetail();
  },
  methods: {
    // 获取当前详情记录
    async getDetail() {
      this.loading = true;
      const { data: result } = await Api.detail(this.key);
      this.record = result.data.values;
      // 设置默认值
      this.setFieldsValue();
      this.loading = false;
    },
    // 设置默认值
    setFieldsValue() {
      const { record, $nextTick } = this;
      $nextTick(() => {
        const newData = pick(record.order, [
          "closeHours",
          "receive_days",
          "refund_days",
        ]);
        this.form.freight_rule = record.freight_rule;
        this.form.order = newData;
      });
    },
    // 提交表单
    handleSubmit() {
      this.$refs.SettingTrade.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "交易设置",
            message: data.message,
            duration: 1500,
          });
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.input-text_right {
  margin-left: 10px;
}
.radio-item {
  margin-bottom: 26px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 40px;
}
</style>