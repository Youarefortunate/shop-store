<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        class="create-coupon"
        :model="form"
        ref="CreateCoupon"
        label-width="120px"
      >
        <el-form-item
          label="优惠券名称: "
          prop="name"
          size="small"
          :rules="[
            { required: true, message: '请输入优惠券名称', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.name"
            style="width: 420px"
            placeholder="请输入优惠券名称"
          />
        </el-form-item>

        <el-form-item
          label="优惠券类型: "
          prop="coupon_type"
          size="small"
          :rules="[
            { required: true, message: '请选择优惠券类型', trigger: 'change' },
          ]"
        >
          <el-radio-group v-model="form.coupon_type">
            <el-radio :label="10">满减卷</el-radio>
            <el-radio :label="20">折扣卷</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="form.coupon_type == 10"
          label="减免金额: "
          prop="reduce_price"
          size="small"
          :rules="[
            { required: true, message: '请输入减免金额', trigger: 'blur' },
          ]"
        >
          <el-input-number
            :min="0.01"
            :precision="2"
            v-model="form.reduce_price"
            controls-position="right"
          />
          <span class="ml-5">元</span>
        </el-form-item>

        <el-form-item
          v-if="form.coupon_type == 20"
          label="折扣率: "
          prop="discount"
          size="small"
          :rules="[
            { required: true, message: '请输入折扣率', trigger: 'blur' },
          ]"
        >
          <el-input-number
            :min="0"
            :max="9.9"
            :precision="1"
            v-model="form.discount"
            controls-position="right"
          />
          <span class="ml-5">%</span>
          <div class="form-item-help">
            <p class="extra">折扣率范围 0-9.9，8代表打8折，0代表不折扣</p>
          </div>
        </el-form-item>

        <el-form-item
          label="最低消费金额: "
          prop="min_price"
          size="small"
          :rules="[
            {
              required: true,
              message: '请输入最低消费金额',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0.01"
            :precision="2"
            v-model="form.min_price"
            controls-position="right"
          />
          <span class="ml-5">元</span>
        </el-form-item>

        <el-form-item
          class="expire_type"
          label="到期类型: "
          prop="expire_type"
          size="small"
          :rules="[
            { required: true, message: '请选择到期类型', trigger: 'change' },
          ]"
        >
          <el-radio-group v-model="form.expire_type">
            <el-radio :label="10">领卷后生效</el-radio>
            <el-radio :label="20">固定时间</el-radio>
          </el-radio-group>
          <el-form-item
            v-show="form.expire_type == 10"
            prop="expire_day"
            size="small"
            :rules="[
              {
                required: true,
                message: '请输入有效期天数',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              :min="1"
              :precision="0"
              v-model="form.expire_day"
              controls-position="right"
            />
            <span class="font-color">(有效期{{ form.expire_day }}天)</span>
          </el-form-item>

          <el-form-item
            v-if="form.expire_type == 20"
            prop="betweenTime"
            size="small"
            :rules="[
              {
                required: true,
                message: '请输入请选择有效期范围',
                trigger: 'change',
              },
            ]"
          >
            <el-date-picker
              v-model="form.betweenTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-form-item>

        <el-form-item
          label="卷适用范围: "
          prop="apply_range"
          size="small"
          :rules="[
            { required: true, message: '请选择卷适用范围', trigger: 'change' },
          ]"
        >
          <el-radio-group v-model="form.apply_range">
            <el-radio :label="10">全场通用</el-radio>
            <el-radio :label="20">指定商品</el-radio>
          </el-radio-group>
          <!-- 指定商品, 显示选择商品组件 -->
          <el-form-item
            v-if="form.apply_range == 20"
            prop="apply_range_config.applyGoodsIds"
            size="small"
            :rules="[
              {
                type: 'array',
                required: true,
                message: '请选择指定商品',
                trigger: 'blur',
              },
            ]"
          >
            <SelectGoods
              :defaultList="containGoodsList"
              v-model="form.apply_range_config.applyGoodsIds"
            />
          </el-form-item>
        </el-form-item>

        <el-form-item
          label="发放总数量: "
          prop="total_num"
          size="small"
          :rules="[
            {
              required: true,
              message: '请选择发放总数量',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="-1"
            :precision="0"
            v-model="form.total_num"
            controls-position="right"
          />
          <span class="ml-5">张</span>
          <div class="form-item-help">
            <p class="extra">发放的优惠券总数量，-1为不限制</p>
          </div>
        </el-form-item>

        <el-form-item
          label="显示状态: "
          prop="status"
          size="small"
          :rules="[
            { required: true, message: '请选择显示状态', trigger: 'change' },
          ]"
        >
          <el-radio-group v-model="form.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">如果设为隐藏将不会展示在用户端页面</p>
          </div>
        </el-form-item>

        <el-form-item label="优惠券描述: " size="small">
          <el-input
            type="textarea"
            style="width: 420px"
            :autosize="{ minRows: 4 }"
            placeholder="请输入优惠券描述"
            v-model="form.describe"
          />
        </el-form-item>

        <el-form-item
          label="排序: "
          prop="sort"
          size="small"
          :rules="[
            {
              required: true,
              message: '请输入排序值',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0"
            v-model="form.sort"
            controls-position="right"
          />
          <div class="form-item-help">
            <p class="extra">数字越小越靠前</p>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="isBtnLoading"
            @click="handleSubmit"
            >提 交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import { pick, get } from "lodash";
import * as GoodsApi from "@/api/goods";
import { isEmpty } from "@/utils/util";
import * as Api from "@/api/market/coupon";
import { SelectGoods } from "@/components";
import {
  ApplyRangeEnum,
  CouponTypeEnum,
  ExpireTypeEnum,
} from "@/common/enum/coupon";

export default {
  components: { SelectGoods },
  data() {
    return {
      // 当前表单元素
      form: {
        // 优惠券类型
        coupon_type: 10,
        // 折扣率
        discount: 9.9,
        // 到期类型
        expire_type: 10,
        // 到期类型,有效期天数
        expire_day: 7,
        // 到期类型,有效期范围
        betweenTime: this.defaultDate,
        // 卷适用范围
        apply_range: 10,
        // 指定选择的商品
        apply_range_config: {
          applyGoodsIds: [],
        },
        // 发放总数量
        total_num: -1,
        // 显示状态
        status: 1,
        // 排序
        sort: 100,
      },
      // 默认日期范围
      defaultDate: [moment(), moment()],
      // 枚举类
      ApplyRangeEnum,
      CouponTypeEnum,
      ExpireTypeEnum,
      // 正在加载
      loading: false,
      isBtnLoading: false,
      // 优惠券ID
      couponId: null,
      // 当前记录
      record: {},
      // 适用范围：指定的商品
      containGoodsList: [],
    };
  },
  async created() {
    // 记录优惠券id
    this.couponId = this.$route.query.couponId
    // 获取当前记录
    await this.getDetail()
    // 使用范围: 指定的商品
    await this.getContainGoodsList()
  },
  methods: {
    // 获取当前记录
    async getDetail() {
      const { couponId } = this
      this.loading = true
      const { data: result } = await Api.detail({ couponId })
      // 当前记录
      this.record = result.data.detail
      // 设置默认值
      this.setFieldsValue()
      this.loading = false
    },
    // 获取指定的商品列表
    async getContainGoodsList() {
      const { record } = this
      const goodsIds = get(record, 'apply_range_config.applyGoodsIds')
      if(goodsIds !== undefined && goodsIds.length) {
        this.loading = true
        await GoodsApi.listByIds(goodsIds) 
          .then(result => {
            this.containGoodsList = result.data.data.list
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    // 设置默认值
    setFieldsValue() {
      const { record, $nextTick } = this
      // 设置表单内容
      !isEmpty(this.form) && $nextTick(() => {
        const data = pick(record, [
          'name', 'coupon_type', 'reduce_price', 'discount', 'min_price', 'status',
          'expire_type', 'expire_day', 'apply_range', 'total_num', 'describe', 'sort',
          'apply_range_config.applyGoodsIds'
        ])
        // 时间范围
        data.betweenTime = this.getBetweenTime(record)
        this.form = data
      })
    },
    // 格式化时间范围
    getBetweenTime(record) {
      if(record.expire_type === ExpireTypeEnum.FIXED_TIME.value) {
        return [moment(new Date(record.start_time)), moment(new Date(record.end_time))]
      }
      return this.defaultDate
    },
    // 提交创建优惠券表单
    handleSubmit() {
      console.log(this.form);
      this.$refs.CreateCoupon.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          this.isBtnLoading = true;
          const { data } = await Api.edit({ couponId: this.couponId, form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "编辑优惠券",
            message: data.message,
            duration: 1500,
          });
          this.loading = false;
          this.isBtnLoading = false;
          setTimeout(() => {
            this.$router.push("./index");
          }, 1500);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// 创建优惠券表单
.create-coupon {
  padding: 30px 0 20px 70px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 40px;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.expire_type {
  margin-bottom: 10px;
}
</style>