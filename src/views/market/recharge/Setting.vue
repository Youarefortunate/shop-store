<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        class="plan-setting"
        ref="RechargeSetting"
        :label-width="labelWidth"
      >
        <el-form-item
          label="是否开启会员充值: "
          prop="is_entrance"
          size="small"
          :labelWidth="labelWidth"
          :rules="[
            {
              required: true,
              message: '请选择是否开启会员充值',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="form.is_entrance">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">如设置关闭则用户端不显示充值按钮</p>
          </div>
        </el-form-item>

        <el-form-item
          label="充值自定义金额: "
          prop="is_custom"
          size="small"
          :labelWidth="labelWidth"
          :rules="[
            {
              required: true,
              message: '请选择充值自定义金额',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="form.is_custom">
            <el-radio :label="1">允许</el-radio>
            <el-radio :label="0">不允许</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">是否允许用户填写自定义的充值金额</p>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.is_custom == 1"
          label="最低充值金额: "
          size="small"
          :labelWidth="labelWidth"
          prop="lowest_money"
          :rules="[
            {
              required: true,
              message: '最低充值金额不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0.01"
            :precision="2"
            controls-position="right"
            v-model="form.lowest_money"
          />
          <span class="ml-10">元</span>
          <div class="form-item-help">
            <p class="extra">低于该设定金额时不允许充值</p>
          </div>
        </el-form-item>

        <el-form-item
          label="自动匹配套餐: "
          prop="is_match_plan"
          size="small"
          :labelWidth="labelWidth"
          :rules="[
            {
              required: true,
              message: '请选择自动匹配套餐',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="form.is_match_plan">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">不开启</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">
              充值自定义金额时
              是否自动匹配充值套餐，如不开启则不参与套餐金额赠送
            </p>
          </div>
        </el-form-item>

        <el-form-item
          label="充值说明: "
          prop="describe"
          size="small"
          :labelWidth="labelWidth"
          :rules="[
            { required: true, message: '请输入充值说明', trigger: 'blur' },
          ]"
        >
          <el-input
            type="textarea"
            style="width: 500px"
            v-model="form.describe"
            :autosize="{ minRows: 4 }"
            placeholder="请输入充值说明"
          />
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
      form: {},
      // 文本宽度
      labelWidth: "150px",
      // 当前设置项的key
      key: "recharge",
      // loading状态
      loading: false,
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
    setFieldsValue() {
      this.$nextTick(() => {
        const newData = pick(this.record, [
          "is_entrance",
          "is_custom",
          "lowest_money",
          "is_match_plan",
          "describe",
        ]);
        this.form = newData;
      });
    },
    // 充值设置表单
    handleSubmit() {
      this.$refs.RechargeSetting.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "充值设置",
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
.plan-setting {
  padding: 30px 0 20px 70px;
}
</style>