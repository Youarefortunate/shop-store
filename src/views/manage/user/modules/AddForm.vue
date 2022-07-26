<template>
  <div id="add-form-user">
    <el-dialog
      width="40%"
      title="新增管理员"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="left"
      >
        <el-form-item
          label="管理员姓名:"
          prop="real_name"
          :label-width="formLabelWidth"
          size="medium"
        >
          <el-input v-model="formData.real_name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="用户名:"
          prop="user_name"
          :label-width="formLabelWidth"
          size="medium"
        >
          <el-input v-model="formData.user_name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="所属角色:"
          prop="roles"
          :label-width="formLabelWidth"
          size="medium"
        >
          <el-select
            v-model="formData.roles"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in roleListTreeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="用户密码:"
          prop="password"
          label-width="100px"
          size="medium"
        >
          <el-input
            v-model="formData.password"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="确认密码:"
          prop="password_confirm"
          :label-width="formLabelWidth"
          size="medium"
        >
          <el-input
            v-model="formData.password_confirm"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="排序:" :label-width="formLabelWidth" size="medium">
          <el-input-number
            size="small"
            v-model="formData.sort"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="warning" @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/store/user";

export default {
  props: {
    roleList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    // 校验选择角色是否少于一个
    const validateSelect = (rule, value, callback) => {
      if (this.formData.roles.length === 0) {
        callback(new Error("请至少选择一个角色"));
      } else callback();
    };
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
      formData: {
        real_name: "", // 管理员姓名
        user_name: "", // 用户名
        password: "", // 密码
        password_confirm: "", // 确认密码
        sort: 100, // 默认排序100
        roles: [], // 选择的角色数组,存放角色id
      },
      dialogFormVisible: false, // 对话框是否可见
      formLabelWidth: "100px", // 对话框宽度
      roleListTreeData: [], // 角色列表 树状结构
      // 表单效验规则
      rules: {
        real_name: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" },
          { min: 2, max: 8, message: "请至少输入两个字符", trigger: "blur" },
        ],
        user_name: [
          { required: true, message: "请输入用户名姓名", trigger: "blur" },
          { min: 4, max: 8, message: "请至少输入四个字符", trigger: "blur" },
        ],
        roles: [
          { required: true, trigger: "change", validator: validateSelect },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
          { min: 6, max: 10, message: "密码至少输入六位", trigger: "blur" },
        ],
        password_confirm: [
          { required: true, trigger: "blur", validator: validateConfirmPass },
        ],
      },
    };
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
      this.getRoleList();
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await Api.add({ form: this.formData });
          if (data.status == 200) {
            // 添加成功关闭dialog并且重置表单
            this.dialogFormVisible = false;
            this.resetForm("form");
            // 通知父组件提交已经完成
            this.$emit("handleSubmit", this.formData);
            this.$notify.success({
              title: "新增管理员",
              message: data.message,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消提交表单并重置表单
    cancelSubmit() {
      this.dialogFormVisible = false;
      this.resetForm("form");
    },
    // 重置表单校验
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取角色列表
    getRoleList() {
      const { roleList } = this;
      const selectList = this.formatRoleListData(roleList);
      this.roleListTreeData = selectList;
    },
    // 格式化角色列表
    formatRoleListData(list) {
      const data = [];
      list.forEach((item) => {
        const newItem = {
          key: item.role_id,
          label: item.role_name,
          value: item.role_id,
        };
        if (item.children && item.children.length) {
          newItem["children"] = this.formatRoleListData(item["children"]);
        }
        data.push(newItem);
      });
      return data;
    },
    // 关闭dialog时重置表单项
    handleClose(done) {
      this.resetForm("form");
      done();
    },
  },
};
</script>

<style lang="scss">
#add-form-user {
  .el-dialog {
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__body {
      padding: 30px 100px;
    }
    .el-button {
      padding: 10px 20px;
      border-radius: 2px;
    }
  }
  label {
    font-weight: 1;
  }
}
</style>