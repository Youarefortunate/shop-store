<template>
  <div id="user-grade-add-form">
    <el-dialog
      width="45%"
      title="新增会员等级"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addGradeForm"
        ref="AddGradeForm"
        label-width="100px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="等级名称: "
          size="small"
          prop="name"
          :rules="[
            { required: true, message: '请输入等级名称', trigger: 'blur' },
            { min: 4, message: '请最少输入4个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="addGradeForm.name"
            autocomplete="off"
            style="width: 300px"
          />
          <div class="form-item-help">
            <p class="extra">例如：大众会员、黄金会员、铂金会员、钻石会员</p>
          </div>
        </el-form-item>

        <el-form-item
          label="等级权重: "
          size="small"
          prop="weight"
          :rules="[
            { required: true, message: '请选择等级权重', trigger: 'change' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="addGradeForm.weight"
            style="width: 300px"
            placeholder="请选择等级权重"
          >
            <el-option
              v-for="(value, index) in weights"
              :key="index"
              :label="value"
              :value="value"
            />
          </el-select>
          <div class="form-item-help">
            <p class="extra">会员等级的权重，数字越大 等级越高</p>
          </div>
        </el-form-item>

        <el-form-item
          label="升级条件: "
          size="small"
          prop="upgrade.expend_money"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '升级条件不能为空', trigger: 'blur' },
          ]"
        >
          <el-input-number
            :min="0"
            :precision="2"
            controls-position="right"
            v-model="addGradeForm.upgrade.expend_money"
          />
          <span style="margin-left: 10px; color: rgba(0, 0, 0, 0.45)"
            >(实际消费金额满{{ addGradeForm.upgrade.expend_money }}元)</span
          >
          <div class="form-item-help">
            <p class="extra">用户的实际消费金额满足后，自动升级</p>
          </div>
        </el-form-item>

        <el-form-item
          label="等级权益: "
          prop="equity.discount"
          size="small"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '等级权益不能为空', trigger: 'blur' },
          ]"
        >
          <el-input-number
            :min="0"
            :max="9.9"
            :precision="1"
            controls-position="right"
            v-model="addGradeForm.equity.discount"
          />
          <span style="margin-left: 10px; color: rgba(0, 0, 0, 0.45)"
            >(折扣率{{ addGradeForm.equity.discount }}折)</span
          >
          <div class="form-item-help">
            <p class="extra">
              折扣率范围0.0-9.9，例如: 9.8代表98折，0代表不折扣
            </p>
          </div>
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
          <el-radio-group v-model="addGradeForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
            v-model="addGradeForm.sort"
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
import * as Api from "@/api/user/grade";

// 生成等级权重
const weights = [];
for (let i = 1; i <= 20; i++) {
  weights.push(i);
}
export default {
  data() {
    return {
      // 表单数据
      addGradeForm: {
        // 等级名称
        name: "",
        // 等级权重
        weight: null,
        // 升级条件
        upgrade: {
          expend_money: null,
        },
        // 等级权益
        equity: {
          // 折扣率
          discount: null,
        },
        // 状态
        status: 1,
        // 排序
        sort: 100,
      },
      // 等级权重
      weights,
      // 显示对话框
      visible: false,
      // 文本宽度
      formLabelWidth: "100px",
    };
  },
  methods: {
    // 显示对话框
    add() {
      // 显示窗口
      this.visible = true;
    },
    // 提交表单
    handleSubmit() {
      this.$refs.AddGradeForm.validate(async (valid) => {
        if (valid) {
          const { data } = await Api.add({ form: this.addGradeForm });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "新增会员等级",
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
    resetForm() {
      this.$refs.AddGradeForm.resetFields();
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