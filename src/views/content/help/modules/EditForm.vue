<template>
  <div>
    <el-dialog
      width="40%"
      title="新增帮助"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        ref="Form"
        label-width="100px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="帮助标题: "
          size="small"
          prop="title"
          :rules="[
            { required: true, message: '请输入帮助标题', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.title"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="帮助内容: "
          size="small"
          prop="content"
          :rules="[
            { required: true, message: '请输入帮助内容', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入帮助内容"
            v-model="form.content"
          />
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
            :min="0"
            size="small"
            v-model="form.sort"
            controls-position="right"
          />
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
import pick from 'lodash.pick'
import * as Api from '@/api/content/help'

export default {
  data() {
    return {
      // 表单
      form: {
        // 排序
        sort: 100
      },
      // 加载表单
      loading: false,
      // (对话框)是否可见
      visible: false,
      // 文本宽度
      formLabelWidth: "100px",
      // 当前记录
      record: {}
    }
  },
  methods: {
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
      // 设置默认值
      this.setFieldsValue()
    },
    // 设置默认值
    setFieldsValue() {
      this.$nextTick(() => {
        const newData = pick(this.record, ['title', 'content', 'sort'])
        this.form = newData
      })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.Form.validate(async (valid) => {
        if(valid) {
          const { data } = await Api.edit({ helpId: this.record.help_id, form: this.form })
          this.$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '新增帮助',
            message: data.message,
            duration: 1500
          })
          this.handleCancel()
          this.$emit('handleSubmit')
        }
      })
    },
    // 取消提交表单
    handleCancel() {
      this.visible = false;
      this.resetForm();
    },
    // 重置表单项
    async resetForm() {
      this.loading = true;
      await this.$refs.Form.resetFields();
      this.loading = false;
    },
    // 点击右上角叉号关闭对话框
    handleClose(done) {
      this.handleCancel();
      done();
    },
  }
};
</script>

<style lang="scss" scoped>
</style>