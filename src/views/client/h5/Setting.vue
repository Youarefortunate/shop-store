<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        class="client-h5"
        style="padding: 30px 0 20px 70px"
        ref="ClientH5"
        label-width="150px"
      >
        <el-form-item required label="是否开启访问: " size="small">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">注：如关闭，用户则无法通过H5端访问商城</p>
          </div>
        </el-form-item>

        <el-form-item
          label="H5站点地址: "
          prop="baseUrl"
          size="small"
          :rules="[
            { required: true, message: '请输入H5站点地址', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.baseUrl"
            style="width: 550px"
            placeholder="请输入H5站点地址"
          />
          <div class="form-item-help">
            <p class="extra">
              <span>请填写H5端实际的访问地址，以</span>
              <el-tag type="info" size="small" class="mlr-5">https://</el-tag
              >开头： 斜杠
              <el-tag type="info" size="small" class="mlr-5">/</el-tag>
              <span>结尾</span>
            </p>
            <p class="extra">例如：https://www.aaa.com/</p>
          </div>
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
import * as Api from "@/api/client/h5/setting";

export default {
  data() {
    return {
      // 表单数据
      form: {},
      // 正在加载
      loading: false,
      // 当前设置项key
      key: "basic",
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
      this.record = result.data.detail;
      // 设置默认值
      this.setFieldsValue();
      this.loading = false;
    },
    /**
     * 设置默认值
     */
    setFieldsValue() {
      const { record, $nextTick } = this;
      $nextTick(() => {
        const newData = pick(record, ["enabled", "baseUrl"]);
        this.form = newData;
      });
    },
    // 提交
    handleSubmit() {
      this.$refs.ClientH5.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "站点设置",
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

<style scoped>
</style>