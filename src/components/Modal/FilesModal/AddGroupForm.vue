<template>
  <div class="add-group-form">
    <el-dialog
      title="新增文件分组"
      width="40%"
      append-to-body
      custom-class="add-group-form-dialog"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        class="form"
        label-position="right"
        :label-width="formLabelWidth"
      >
        <el-form-item
          label="分组名称: "
          prop="name"
          size="small"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="上级分组: "
          size="small"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.parent_id">
            <el-option
              v-for="(item, index) in groupListTree"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="排序: "
          prop="sort"
          size="small"
          :label-width="formLabelWidth"
        >
          <el-input-number
            v-model="form.sort"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <div class="form-item-help">
            <div class="extra">数字越小越靠前</div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/files/group";

export default {
  props: {
    // 分组列表
    groupList: { type: Array, required: true },
  },
  data() {
    return {
      // 表单
      form: {
        // 分组名称
        name: "",
        // 上级分组
        parent_id: 0,
        // 排序
        sort: 100,
      },
      rules: {
        name: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { min: 2, message: "请至少输入2个字符", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入至少1个数字", trigger: "change" },
        ],
      },
      // 上级分组列表
      groupListTree: [],
      visible: false,
      formLabelWidth: "100px",
    };
  },
  methods: {
    // 显示对话框
    add() {
      this.visible = true;
      // 获取分组列表
      this.groupGroupList();
    },
    // 获取分组列表
    groupGroupList() {
      const { groupList } = this;
      // 格式化分组列表
      this.groupListTree = [
        {
          label: "顶级分组",
          key: 0,
          value: 0,
        },
      ].concat(this.formatTreeData(groupList));
    },
    // 格式化分组列表
    formatTreeData(list, disabled = false) {
      const data = [];
      list.forEach((item) => {
        const newItem = {
          label: item.name,
          key: item.group_id,
          value: item.group_id,
        };
        if (item.children && item.children.length) {
          newItem["children"] = this.formatTreeData(
            item["children"],
            newItem,
            disabled
          );
        }
        data.push(newItem);
      });
      return data;
    },
    // 提交表单
    handleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await Api.add({ form: this.form });
          this.visible = false;
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "新增分组",
            message: data.message,
            showClose: true,
          });
          this.handleCancel();
          this.$emit("handleSubmit");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单校验
    resetForm() {
      this.$refs.form.resetFields();
    },
    /**
     * 关闭对话框事件
     */
    handleCancel() {
      this.visible = false;
      this.resetForm();
    },
  },
};
</script>

<style lang="scss">
// 标题
.add-group-form-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #eee;
    .el-dialog__title {
      margin: 0;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 14.5px;
      line-height: 22px;
      word-wrap: break-word;
    }
  }
  .dialog-footer {
    border-top: 1px solid #eee;
    .el-button {
      height: 35px;
      line-height: 1px;
      border-radius: 1px;
      margin-top: 10px;
    }
  }
  // 表单
  .form {
    padding: 10px 60px;
    .el-form-item__label {
      font-weight: 500;
    }
    .el-form-item__content {
      .el-select {
        width: 100%;
      }
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 30px;
    }
  }
  .form-item-help {
    font-size: 12px;
    line-height: 1.5;
    padding-top: 4px;
    min-height: 22px;
    a {
      color: #1890ff;
      text-decoration: none;
      background-color: transparent;
      outline: none;
      cursor: pointer;
      margin: 0 3px;
    }
    .extra {
      padding-top: 4px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12.5px;
    }
  }
}
</style>
