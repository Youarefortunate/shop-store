<template>
  <div>
    <el-dialog
      width="40%"
      title="新增物流公司"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ExpressForm"
        :model="form"
        label-width="120px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="物流公司名称: "
          size="small"
          prop="express_name"
          :rules="[
            { required: true, message: '请输入物流公司名称', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.express_name"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item
          label="物流公司编码: "
          size="small"
          prop="kuaidi100_code"
          :rules="[
            { required: true, message: '请输入物流公司编码', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.kuaidi100_code"
            autocomplete="off"
            style="width: 300px"
          />
          <div class="form-item-help">
            <p class="extra">
              <span>用于快递100API查询物流信息，</span>
              <span>请参照</span>
              <a
                href="https://api.kuaidi100.com/manager/page/document/kdbm"
                target="_blank"
                style="color: dodgerblue"
                >物流公司编码表</a
              >
            </p>
          </div>
        </el-form-item>

        <el-form-item
          label="排序:"
          size="small"
          prop="sort"
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
import * as Api from "@/api/setting/express";

export default {
  data() {
    return {
      // 表单数据
      form: { sort: 100 },
      // dialog是否可见
      visible: false,
      // 当前记录
      record: {}
    };
  },
  methods: {
    /**
     * 显示对话框
     */
    edit(record) {
      // 显示窗口
      this.visible = true;
      // 当前记录
      this.record = record
      // 设置默认值
      this.setFieldsValue()
    },
    /**
     * 设置默认值
     */
    setFieldsValue () {
      this.$nextTick(() => {
        const newData = pick(this.record, ['express_name', 'kuaidi100_code', 'sort'])
        this.form = newData
      })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.ExpressForm.validate(async (valid) => {
        if (valid) {
          const { data } = await Api.add({ form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "新增物流公司",
            message: data.message,
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
    resetForm() {
      this.$refs.ExpressForm.resetFields();
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