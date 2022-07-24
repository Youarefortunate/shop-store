<template>
  <div>
    <el-dialog
      width="40%"
      title="新增商品分类"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        v-loading="loading"
        ref="CategoryForm"
        label-width="100px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="分类名称: "
          size="small"
          prop="name"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item
          label="状态: "
          size="small"
          prop="status"
          :label-width="formLabelWidth"
          :rules="[
            {
              required: true,
              message: '请至少选择一种状态',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="form.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">用户端是否展示</p>
          </div>
        </el-form-item>

        <el-form-item
          label="排序:"
          size="small"
          prop="sort"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '请输入排序值', trigger: 'blur' },
          ]"
        >
          <el-input-number
            size="small"
            v-model="form.sort"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <div class="form-item-help">
            <p class="extra">数字越小越靠前</p>
          </div>
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
import * as Api from "@/api/content/article/category";

export default {
  data() {
    return {
      // 添加商品分类表单
      form: {
        // 分类名称
        name: "",
        // 状态
        status: 1,
        // 排序
        sort: 100,
      },
      // 加载表单
      loading: false,
      // (对话框)是否可见
      visible: false,
      // 文本宽度
      formLabelWidth: "100px",
    };
  },
  methods: {
    /**
     * 显示对话框
     */
    add() {
      // 显示窗口
      this.visible = true;
    },
    // 提交商品分类表单
    handleSubmit() {
      this.$refs.CategoryForm.validate(async (valid) => {
        if (valid) {
          const { data } = await Api.add({ form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "新增商品分类",
            message: data.message,
            showClose: true,
            duration: 1500,
          });
          this.handleCancel();
          this.$emit("handleSubmit");
        }
      });
    },
    // 取消提交表单
    handleCancel() {
      this.visible = false;
      this.resetForm();
    },
    // 重置表单项
    async resetForm() {
      this.loading = true
      await this.$refs.CategoryForm.resetFields();
      this.loading = false
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