<template>
  <div id="edit-form-user">
    <el-dialog
      width="40%"
      title="编辑管理员"
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
          v-if="!record.is_super"
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
              :key="item.key"
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
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import * as UserApi from "@/api/store/user";

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
        // 管理员姓名
        real_name: "", 
        // 用户名
        user_name: "", 
        // 密码
        password: "", 
        // 确认密码
        password_confirm: "", 
        // 默认排序100
        sort: 100, 
        // 选择的角色数组,存放角色id
        roles: [], 
      },
      // 对话框是否可见
      dialogFormVisible: false, 
      // 对话框宽度
      formLabelWidth: "100px", 
      // 表单效验规则
      rules: {
        real_name: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" },
          { min: 2, message: "请至少输入两个字符", trigger: "blur" },
        ],
        user_name: [
          { required: true, message: "请输入用户名姓名", trigger: "blur" },
          { min: 4, message: "请至少输入四个字符", trigger: "blur" },
        ],
        roles: [
          { required: true, trigger: "change", validator: validateSelect },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
          { min: 6, message: "密码至少输入六位", trigger: "blur" },
        ],
        password_confirm: [
          { required: true, trigger: "blur", validator: validateConfirmPass },
        ],
      },
      // 角色列表 树状结构
      roleListTreeData: [], 
      // 当前记录
      record: {},
    };
  },
  methods: {
    edit(record) {
      this.dialogFormVisible = true;
      // 当前点击的编辑管理员信息
      this.record = record;
      !record["is_super"] && this.getRoleList(); // 当不是超级管理时才获取角色列表
      // 设置默认值
      this.setFieldsValue();
    },

    // 设置默认值
    setFieldsValue() {
      const { record } = this;
      this.$nextTick(() => {
        const data = _.pick(record, ['user_name', 'real_name', 'sort'])
        data.roles = this.getCheckRoleKeys()
        data.roles = data.roles.map(item => item.value)
        this.formData = data
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await UserApi.edit({
            userId: this.record["store_user_id"],
            form: this.formData,
          });
          if (data.status == 200) {
            // 添加成功关闭dialog并且重置表单
            this.dialogFormVisible = false;
            this.resetForm("form");
            // 通知父组件提交已经完成
            this.$emit("handleSubmit", this.formData);
            this.$notify.success({
              title: "编辑管理员",
              message: data.message,
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 设置默认选中的角色
    getCheckRoleKeys() {
      // roleList角色列表、record点击编辑的table中那一行的所有数据
      const { roleList, record } = this;
      const getCheckKeys = (list) => {
        let keysArr = [];
        list.forEach((item) => {
          if (record["roleIds"].includes(item["role_id"])) {
            keysArr.push({
              label: item["role_name"],
              value: item["role_id"],
            });
          }
          if (item.children && item.children.length) {
            const childrenArr = getCheckKeys(item.children);
            childrenArr.length && (keysArr = keysArr.concat(childrenArr));
          }
        });
        // keysArr = [{ label: xxx, value: xxx }]
        return keysArr;
      };
      return getCheckKeys(roleList);
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
#edit-form-user {
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