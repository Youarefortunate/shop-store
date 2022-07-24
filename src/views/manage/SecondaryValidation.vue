<template>
  <div id="secondary-validation">
    <el-dialog
      width="35%"
      custom-class="secondary-validation"
      title="二次管理员修改密码验证"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form
        :model="form"
        :rules="rules"
        inline
        ref="form"
        label-width="170px"
        label-position="right"
      >
        <el-form-item
          label="请输入二次验证密码: "
          prop="passwd"
          size="small"
          label-width="170px"
        >
          <el-input
            type="password"
            v-model="form.passwd"
            style="width: 250px"
            autocomplete="off"
          ></el-input>
          <el-button
            :loading="loading"
            type="primary"
            @click="handleSubmit('form')"
            class="secondary-validation-btn"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/store/user";

export default {
  name: "SecondaryValidation",
  data() {
    return {
      form: {
        passwd: "",
      },
      formData: {},
      rules: {
        passwd: [
          { required: true, message: "请输入二次验证密码", trigger: "blur" },
        ],
      },
      visible: false,
      loading: false
    };
  },
  methods: {
    // 显示二次验证dialog
    show(formData) {
      this.visible = true;
      this.formData = formData;
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.form.passwd !== 'Youarefortunate') {
            this.visible = false;
            this.$message.error("二次密码错误");
            this.resetForm()
          } else {
            this.visible = false;
            this.loading = true
            const { data } = await Api.renew({ form: this.formData });
            this.loading = false
            if (data.status == 200) {
              this.$notify.success({
                title: "管理员设置",
                message: data.message,
              });
              setTimeout(() => {
                window.location.reload();
              }, 800);
              this.resetForm()
            }
          }
        }
      });
    },
    handleClose(done) {
      this.resetForm()
      done();
    },
    // 重置表单校验
    resetForm() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" >
.secondary-validation {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
    .el-dialog__title {
      font-size: 14.5px;
      margin-bottom: 30px;
      color: rgba(0, 0, 0, 0.75);
    }
    .el-form-item--small .el-form-item__content,
    .el-form-item--small .el-form-item__label {
      font-weight: 500;
    }
  }
  .secondary-validation-btn {
    width: 80px;
    height: 32px;
    line-height: 1px;
    border-radius: 1px;
    margin-left: 30px;
  }
}
</style>