<template>
  <div id="store-setting">
    <el-card>
      <!-- 页面标题 -->
      <div class="card-title">{{ $route.meta.title }}</div>

      <el-form
        :model="formData"
        :rules="rules"
        ref="form"
        v-loading="loading"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商城名称: " prop="store_name" size="medium">
          <el-input v-model="formData.store_name"></el-input>
        </el-form-item>

        <el-form-item label="商城简介: " size="medium">
          <el-input type="textarea" v-model="formData.describe"></el-input>
        </el-form-item>

        <el-form-item label="商城Logo: ">
          <select-image
            :defaultList="record.logoImage ? [record.logoImage] : []"
            v-model="formData.logo_image_id"
          />
          <div class="form-item-help">
            <p class="extra">因服务器问题，图片加载会存在稍稍缓慢</p>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import pick from "lodash.pick";
import * as Api from "@/api/store";
import { SelectImage } from "@/components";

export default {
  components: { SelectImage },
  data() {
    return {
      loading: false,
      record: {},
      formData: {
        store_name: "",
        describe: "",
        logoImage: 0,
        logo_image_id: 0,
      },
      rules: {
        store_name: [
          { required: true, message: "请输入商城名称", trigger: "blur" },
          { min: 2, max: 8, message: "请至少输入2个字符", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    // 获取当前详情记录
    this.getDetail();
  },
  methods: {
    async getDetail() {
      this.loading = true;
      const { data: result } = await Api.info();
      this.loading = false;
      this.record = result.data.storeInfo;
      // console.log(this.record);
      // 设置默认值
      this.setFieldsValue();
    },
    // 设置表单默认值
    setFieldsValue() {
      const { record } = this;
      // 表单内容
      this.$nextTick(() => {
        const newData = pick(record, [
          "store_name",
          "describe",
          "logo_image_id",
        ]);
        this.formData = newData;
      });
    },
    // 提交表单
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update({ form: this.formData });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "更新店铺操作",
            message: data.message,
            showClose: true,
          });
          this.loading = false;
        }
      });
    },
    // 重置表单校验
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
#store-setting::v-deep {
  .card-title {
    font-size: 14.5px;
    margin-bottom: 18px;
    color: rgba(0, 0, 0, 0.75);
  }
  .el-form {
    padding: 10px 300px;
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-form-item__content {
      margin-bottom: 20px;
    }
  }
  .el-button {
    padding: 10px 20px;
    border-radius: 2px;
  }
  .el-form-item__label {
    font-weight: 500;
  }
}
</style>