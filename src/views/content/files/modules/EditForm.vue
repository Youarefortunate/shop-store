<template>
  <div>
    <el-dialog
      width="40%"
      title="编辑文件"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        ref="EditForm"
        label-width="120px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="文件名称: "
          size="small"
          prop="file_name"
          :rules="[
            { required: true, message: '请输入文件名称', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.file_name"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item
          label="上级分组: "
          size="small"
          :label-width="formLabelWidth"
        >
          <tree-select
            style="width: 300px"
            v-model="form.group_id"
            :selectValue="form.group_id"
            :treeData="groupTreeData"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/files";
import _ from "lodash";
import { TreeSelect } from "@/components";

export default {
  components: { TreeSelect },
  props: {
    // 分组列表
    groupList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 移动分组表单数据
      form: {
        // 文件名称
        file_name: "",
        // 上级分组
        group_id: null,
      },
      // modal(对话框)是否可见
      visible: false,
      // 文本宽度
      formLabelWidth: "100px",
      // 当前记录
      record: {},
      // 分组列表 树状结构
      groupTreeData: [],
    };
  },
  methods: {
    /**
     * 显示对话框
     */
    edit(record) {
      // 显示窗口
      this.visible = true;
      // 当前分组记录
      this.record = record;
      // 获取分组列表
      this.getGroupList();
      // 设置默认值
      this.setFieldsValue();
    },
    // 设置默认值
    setFieldsValue() {
      this.$nextTick(() => {
        const newData = _.pick(this.record, ['file_name', 'group_id'])
        this.form = newData
      })
    },
    // 获取分组列表
    getGroupList() {
      if(this.groupTreeData.length <= 0) {
        this.groupTreeData = [{
          label: '未分组',
          key: 0,
          value: 0
        }].concat(this.groupList)
      }
    },
    // 确定提交编辑文件表单
    handleSubmit() {
      this.form.status = this.form.status ? 1 : 0
      this.$refs.EditForm.validate(async (valid) => {
        if(valid) {
          const { data } = await Api.edit({ fileId: this.record['file_id'], form: this.form })
          this.$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '编辑文件',
            message: data.message,
            duration: 1500
          })
          this.$emit('handleSubmit')
          this.handleCancel()
        }
      })
    },
    // 取消提交表单
    handleCancel() {
      this.visible = false;
      this.resetForm("EditForm");
    },
    // 重置表单项
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 点击右上角叉号关闭对话框
    handleClose(done) {
      this.handleCancel();
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>