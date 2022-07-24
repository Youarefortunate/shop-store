<template>
  <div>
    <el-dialog
      width="50%"
      title="设置会员等级"
      custom-class="grade-dialog"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form :model="form" ref="gradeForm" label-position="right" :label-width="labelWidth">
        <el-form-item label="会员ID: " size="small" :label-width="labelWidth">
          <span>{{ record.user_id }}</span>
        </el-form-item>

        <el-form-item
          label="会员等级: "
          size="small"
          :rules="[{ required: true, trigger: 'change' }]"
          :label-width="labelWidth"
        >
          <el-select
            v-model="form.grade_id"
            style="width: 200px"
            placeholder="请选择会员等级"
          >
            <el-option label="无等级" :value="0" />
            <el-option
              v-for="(item, index) in gradeList"
              :key="index"
              :label="item.name"
              :value="item.grade_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="管理员备注: "
          size="small"
          :rules="[
            { required: true, message: '请输入管理员备注', trigger: 'blur' },
          ]"
          :label-width="labelWidth"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 3 }"
            placeholder="请输入管理员备注"
            v-model="form.remark"
          >
          </el-input>
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
import pick from "lodash.pick";
import * as Api from "@/api/user";

export default {
  props: {
    // 会员等级列表
    gradeList: { type: Array, required: true },
  },
  data() {
    return {
      // 表单数据
      form: {
        // 会员等级
        grade_id: null,
        // 管理员备注
        remark: "",
      },
      // 是否显示对话框
      visible: false,
      // 当前记录
      record: {},
      // 文本宽度
      labelWidth: "100px",
    };
  },
  methods: {
    // 显示对话框
    handle(record) {
      // 显示窗口
      this.visible = true;
      // 当前记录
      this.record = record;
      // 设置默认值
      this.setFieldsValue();
    },
    // 设置默认值
    setFieldsValue() {
      this.$nextTick(() => {
        const newData = pick(this.record, ['grade_id'])
        this.form = newData
      })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.gradeForm.validate(async (valid) => {
        if(valid) {
          const { data } = await Api.grade({ userId: this.record.user_id, form: this.form })
          this.$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '设置会员等级',
            message: data.message,
            showClose: true,
            duration: 1500
          })
          // 关闭对话框
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit')
        }
      })
    },
    // 取消提交表单
    handleCancel() {
      this.visible = false
      this.resetForm()
    },
    // 重置表单项
    resetForm() {
      this.$refs.gradeForm.resetFields()
    },
    // 点击右上角叉号关闭对话框
    handleClose(done) {
      this.handleCancel();
      done();
    }
  },
};
</script>

<style lang="scss" scoped>
</style>