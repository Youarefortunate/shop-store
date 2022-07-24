<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        ref="DeliverySetting"
        label-width="160px"
        style="padding: 30px 0 20px 100px"
      >
        <el-form-item
          label="配送方式: "
          prop="delivery_type"
          size="small"
          :rules="[
            {
              required: true,
              message: '配送方式至少选择一个',
              trigger: 'change',
            },
          ]"
        >
          <el-checkbox-group v-model="form.delivery_type">
            <el-checkbox :label="10">快递配送</el-checkbox>
          </el-checkbox-group>
          <div class="form-item-help">
            <p class="extra">用户下单时可以选择的配送方式</p>
          </div>
        </el-form-item>

        <el-divider content-position="left">物流查询API</el-divider>
        <el-form-item label="快递100 Customer: " size="small">
          <el-input v-model="form.kuaidi100.customer" style="width: 420px" />
          <div class="form-item-help">
            <p class="extra">
              用于查询快递/物流信息，需快递100企业版API
              <a href="https://api.kuaidi100.com/home" target="_blank" style="color: dodgerblue; margin-left: 8px">去申请</a>
            </p>
          </div>
        </el-form-item>

        <el-form-item label="快递100 Key: " size="small">
          <el-input v-model="form.kuaidi100.key" style="width: 420px" />
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
import { isEmpty } from "@/utils/util";

export default {
  data() {
    return {
      // 表单数据
      form: {
        delivery_type: 10,
        kuaidi100: {
          customer: "",
          key: "",
        },
      },
      // 加载
      loading: false,
      // 当前设置项的key
      key: "delivery",
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
        const newData = pick(record, ["delivery_type", "kuaidi100"]);
        this.form = newData;
      });
    },
    // 提交表单
    handleSubmit() {
      this.$refs.DeliverySetting.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "配送方式",
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