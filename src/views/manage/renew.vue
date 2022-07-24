<template>
  <div id="renew">
    <el-card>
      <el-header> <span></span>管理员设置 </el-header>
      <!-- 表单 -->
      <el-form
        :model="formData"
        :rules="rules"
        ref="form"
        v-loading="loading"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input size="medium" :type="item.type" style="width: 600px" v-model="formData[item.model]"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 修改密码二次验证 -->
      <SecondaryValidation ref="SecondaryValidation"/>
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/store/user";
import SecondaryValidation from './SecondaryValidation'

export default {
  name: "Renew",
  components: { SecondaryValidation },
  data() {
    // 校验密码
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formData.password_confirm !== "") {
          this.$refs.form.validateField("password_confirm");
        }
        callback();
      }
    };
    // 校验两次输入的密码是否一致
    const validateConfirmPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次密码不一致"));
      } else callback();
    };
    return {
      loading: false,
      formData: {
        real_name: "",
        user_name: "",
        password: "",
        password_confirm: "",
      },
      // 表单校验规则
      rules: {
        real_name: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" },
          { min: 2, max: 8, message: "请至少输入2个字符", trigger: "blur" },
        ],
        user_name: [
          { required: true, message: "请输入用户名姓名", trigger: "blur" },
          { min: 4, max: 8, message: "请至少输入4个字符", trigger: "blur" },
        ],
        password: [
          { trigger: "change", validator: validatePass },
          { min: 6, max: 10, message: "密码至少输入六位", trigger: "change" },
        ],
        password_confirm: [
          { trigger: "change", validator: validateConfirmPass },
        ],
      },
      // 循环表单项
      columns: [
        {
          label: "姓名: ",
          prop: "real_name",
          model: "real_name",
        },
        {
          label: "用户名: ",
          prop: "user_name",
          model: "user_name",
        },
        {
          label: "用户密码: ",
          prop: "password",
          model: "password",
          type: 'password'
        },
        {
          label: "确认密码: ",
          prop: "password_confirm",
          model: "password_confirm",
          type: 'password'
        },
      ]
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    // 获取管理员信息
    async getInfo() {
      this.loading = true;
      const {
        data: {
          data: { userInfo },
        },
      } = await Api.getInfo();
      this.loading = false;
      this.formData.real_name = userInfo.real_name;
      this.formData.user_name = userInfo.user_name;
    },
    // 提交表单
    async onSubmit() {
      this.$refs.form.validate((valid) => {
        if(valid) {
          this.$refs.SecondaryValidation.show(this.formData)
        }
      })
    },
    // 重置表单校验
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss">
#renew {
  .el-header {
    span {
      width: 2px;
      height: 18px;
      margin-right: 10px;
      border-left: 5px solid #1890ff;
    }
    /* background-color: #B3C0D1; */
    color: #333;
    line-height: 60px;
    font-size: 14px;
    padding: 5px 0 14px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eef1f5;
  }
  .demo-ruleForm {
    padding: 10px 300px;
    .el-form-item__content {
      margin-bottom: 20px;
    }
  }
  .el-button {
    padding: 10px 20px;
    border-radius: 2px;
  }
  label {
    font-weight: 100;
  }
}
</style>