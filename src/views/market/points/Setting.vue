<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        class="points-setting"
        style="padding: 30px 0 20px 70px"
        ref="PointsSetting"
        label-width="150px"
      >
        <el-form-item
          label="积分名称: "
          prop="points_name"
          size="small"
          :rules="[
            { required: true, message: '请输入积分名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.points_name"
            style="width: 550px"
            placeholder="请输入积分名称"
          />
          <div class="form-item-help">
            <p class="extra">
              注：商家使用自定义的积分名称来做品牌运营。如京东把积分称为“京豆”，淘宝把积分称为“淘金币”
            </p>
          </div>
        </el-form-item>

        <el-form-item
          label="积分说明: "
          prop="describe"
          size="small"
          :rules="[
            { required: true, message: '请输入充值说明', trigger: 'blur' },
          ]"
        >
          <el-input
            type="textarea"
            style="width: 550px"
            v-model="form.describe"
            :autosize="{ minRows: 4 }"
            placeholder="请输入积分说明"
          />
        </el-form-item>

        <el-divider content-position="left">积分赠送</el-divider>
        <el-form-item
          label="积分赠送: "
          prop="is_shopping_gift"
          size="small"
          :rules="[
            {
              required: true,
              message: '请选择积分赠送',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="form.is_shopping_gift">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">
              积分赠送规则：1. 订单确认收货已完成； 2.
              已完成订单超出后台设置的申请售后期限
            </p>
          </div>
        </el-form-item>

        <div v-if="form.is_shopping_gift == 1">
          <el-form-item
            label="积分赠送比例: "
            size="small"
            prop="gift_ratio"
            :rules="[
              {
                required: true,
                message: '积分赠送比例不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              :min="0.01"
              :max="100"
              :precision="1"
              controls-position="right"
              v-model="form.gift_ratio"
            />
            <span class="ml-10">%</span>
            <div class="form-item-help">
              <p class="extra">
                注：赠送比例请填写数字0~100；订单的运费不参与积分赠送
              </p>
              <p class="extra">
                例：订单付款金额(100.00元) * 积分赠送比例(100%) =
                实际赠送的积分(100积分)
              </p>
            </div>
          </el-form-item>
        </div>
        <el-divider content-position="left">积分抵扣</el-divider>
        <el-form-item
          label="下单使用积分抵扣: "
          prop="is_shopping_discount"
          size="small"
          :rules="[
            {
              required: true,
              message: '请选择下单使用积分抵扣',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="form.is_shopping_discount">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">
              注：如开启则用户下单时可选择使用积分抵扣订单金额
            </p>
          </div>
        </el-form-item>

        <div v-if="form.is_shopping_discount == 1">
          <el-form-item
            label="积分抵扣比例: "
            size="small"
            prop="discount.discount_ratio"
            :rules="[
              {
                required: true,
                message: '积分抵扣比例不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              :min="0.01"
              :precision="2"
              controls-position="right"
              v-model="form.discount.discount_ratio"
            />
            <span style="margin-left: 10px; color: rgba(0, 0, 0, 0.45)"
              >(1个积分可抵扣{{ form.discount.discount_ratio }}元)</span
            >
            <div class="form-item-help">
              <p class="extra">
                例如：设置1个积分可抵扣0.1元，则10积分可抵扣1元，100积分可抵扣10元
              </p>
            </div>
          </el-form-item>

          <el-form-item
            label="最高抵扣金额: "
            size="small"
            prop="discount.full_order_price"
            :rules="[
              {
                required: true,
                message: '抵扣条件不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              :min="0.01"
              :precision="2"
              controls-position="right"
              v-model="form.discount.full_order_price"
            />
            <span style="margin-left: 10px; color: rgba(0, 0, 0, 0.45)"
              >(订单满{{ form.discount.full_order_price }}元)</span
            >
          </el-form-item>

          <el-form-item
            size="small"
            prop="discount.max_money_ratio"
            :rules="[
              {
                required: true,
                message: '最高抵扣金额不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              :min="0.01"
              :max="90"
              :precision="1"
              controls-position="right"
              v-model="form.discount.max_money_ratio"
            />
            <span style="margin-left: 10px; color: rgba(0, 0, 0, 0.45)"
              >(最高可抵扣金额{{ form.discount.max_money_ratio }}%)</span
            >
            <div class="form-item-help">
              <p class="extra">
                例如：设置最高可抵扣10%，订单金额100元，此时用户可抵扣10元
              </p>
            </div>
          </el-form-item>
        </div>
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
      form: {},
      // loading状态
      loading: false,
      // 当前设置项的key
      key: "points",
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
      this.loading = false;
      this.record = result.data.values;
      // 设置默认值
      this.setFieldsValue();
    },
    /**
     * 设置默认值
     */
    setFieldsValue() {
      const { record, $nextTick } = this;
      $nextTick(() => {
        const newData = pick(record, [
          "points_name",
          "describe",
          "is_shopping_gift",
          "gift_ratio",
          "is_shopping_discount",
          "discount",
        ]);
        this.form = newData;
      });
    },
    // 提交积分设置表单
    handleSubmit() {
      this.$refs.PointsSetting.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "积分设置",
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
</style>