<template>
  <div>
    <el-dialog
      width="40%"
      title="新增充值套餐"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="套餐名称: "
          size="small"
          prop="plan_name"
          :rules="[
            { required: true, message: '请输入套餐名称', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.plan_name"
            autocomplete="off"
            style="width: 300px"
          />
          <div class="form-item-help">
            <p class="extra">便于后台查找，例如：充100元送10元</p>
          </div>
        </el-form-item>

        <el-form-item
          label="充值金额: "
          size="small"
          prop="money"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '充值金额不能为空', trigger: 'blur' },
          ]"
        >
          <el-input-number
            :min="0.01"
            :precision="2"
            controls-position="right"
            v-model="form.money"
          />
          <span class="ml-10">元</span>
          <div class="form-item-help">
            <p class="extra">会员充值并支付的金额</p>
          </div>
        </el-form-item>

        <el-form-item
          label="赠送金额: "
          prop="gift_money"
          size="small"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '赠送金额不能为空', trigger: 'blur' },
          ]"
        >
          <el-input-number
            :min="0.01"
            :precision="2"
            controls-position="right"
            v-model="form.gift_money"
          />
          <span class="ml-10">元</span>
          <div class="form-item-help">
            <p class="extra">
              充值成功后赠送的金额，不能大于充值金额
            </p>
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
import * as Api from '@/api/market/recharge/plan'

export default {
  data() {
    return {
      // 表单数据
      form: {
        // 排序
        sort: 100,
      },
      // 显示对话框
      visible: false,
      // 文本宽度
      formLabelWidth: "100px",
    };
  },
  methods: {
    /**
     * 显示对话框
     */
    add () {
      // 显示窗口
      this.visible = true
    },
    // 提交表单
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { data } = await Api.add({ form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "新增充值套餐",
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
      this.$refs.form.resetFields();
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