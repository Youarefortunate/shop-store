<template>
  <div>
    <el-dialog
      width="50%"
      title="会员充值"
      custom-class="recharge-dialog"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form :model="rechargeForm" ref="gradeForm" label-position="right" :label-width="labelWidth">
        <el-tabs v-model="activeName" @tab-click="onChangeTabs">

          <el-tab-pane label="余额充值" :name="RECHARGE_TYPE_BALANCE">
            <template v-if="activeName === RECHARGE_TYPE_BALANCE">
              <el-form-item label="会员ID: " size="small" :label-width="labelWidth">
                <span>{{ record.user_id }}</span>
              </el-form-item>

              <el-form-item label="当前余额: " size="small" :label-width="labelWidth">
                <span>{{ record.balance }}</span>
              </el-form-item>

              <el-form-item 
                label="充值方式: " 
                size="small" 
                :label-width="labelWidth"
                :rules="[{ required: true, message: '请至少选择一个充值方式', trigger: 'change' }]"
              >
                <el-radio-group v-model="rechargeForm.balance.mode">
                  <el-radio label="增加" value="inc"/>
                  <el-radio label="减少" value="dec"/>
                  <el-radio label="最总金额" value="final"/>
                </el-radio-group>
              </el-form-item>

              <el-form-item 
                label="变更金额: " 
                size="small" 
                :label-width="labelWidth"
                :rules="[{ required: true, message: '请输入变更的金额', trigger: 'burl' }]"
              >
                <el-input-number
                  :min="0.01"
                  v-model="rechargeForm.balance.money" 
                  controls-position="right" 
                />
              </el-form-item>

              <el-form-item 
                label="管理员备注: "
                size="small" 
                :label-width="labelWidth"
                :rules="[{ required: true, message: '请输入管理员备注', trigger: 'burl' }]"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3}"
                  placeholder="请输入管理员备注"
                  v-model="rechargeForm.balance.remark"/>
              </el-form-item>
            </template>
          </el-tab-pane>


          <el-tab-pane label="充值积分" name="second">
            <template v-if="activeName === RECHARGE_TYPE_POINTS">
              <el-form-item label="会员ID: " size="small" :label-width="labelWidth">
                <span>{{ record.user_id }}</span>
              </el-form-item>

              <el-form-item label="当前积分: " size="small" :label-width="labelWidth">
                <span>{{ record.points }}</span>
              </el-form-item>

              <el-form-item 
                label="充值方式: " 
                size="small" 
                :label-width="labelWidth"
                :rules="[{ required: true, message: '请至少选择一个充值方式', trigger: 'change' }]"
              >
                <el-radio-group v-model="rechargeForm.points.mode">
                  <el-radio label="增加" value="inc"/>
                  <el-radio label="减少" value="dec"/>
                  <el-radio label="最总金额" value="final"/>
                </el-radio-group>
              </el-form-item>

              <el-form-item 
                label="变更数量: " 
                size="small" 
                :label-width="labelWidth"
                :rules="[{ required: true, message: '请输入变更数量', trigger: 'burl' }]"
              >
                <el-input-number
                  :min="0.01"
                  v-model="rechargeForm.points.value" 
                  controls-position="right" 
                />
              </el-form-item>

              <el-form-item 
                label="管理员备注: "
                size="small" 
                :label-width="labelWidth"
                :rules="[{ required: true, message: '请输入管理员备注', trigger: 'burl' }]"
              >
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3}"
                  placeholder="请输入管理员备注"
                  v-model="rechargeForm.points.remark"/>
              </el-form-item>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/user";
// 充值类型枚举: 余额
const RECHARGE_TYPE_BALANCE = "balance";
// 充值类型枚举: 积分
const RECHARGE_TYPE_POINTS = "points";
export default {
  data() {
    return {
      // 表单
      rechargeForm: {
        // 充值余额
        balance: {
          // 充值方式
          mode: 'inc',
          // 变更金额
          money: '',
          // 管理员备注
          remark: ''
        },
        // 充值积分
        points: {
          // 充值方式
          mode: 'inc',
          // 变更数量
          value: '',
          // 管理员备注
          remark: ''
        }
      },
      // 是否显示对话框
      visible: false,
      // 当前tab索引
      activeName: RECHARGE_TYPE_BALANCE,
      // 充值类型
      RECHARGE_TYPE_BALANCE,
      RECHARGE_TYPE_POINTS,
      // 当前记录
      record: {},
      labelWidth: '100px'
    }
  },
  methods: {
    // 显示对话框
    handle (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
    },
    // 点击tabs切换标签
    onChangeTabs(activeTabName, event) {
      this.activeName = activeTabName
    },
    // 提交表单
    handleSubmit() {
      this.$refs.rechargeForm.validate(async (valid) => {
        if(valid) {
          const { data } = await Api.recharge({ userId: this.record.user_id, target: this.activeName, form: this.rechargeForm })
          this.$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '会员充值',
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
      this.$refs.rechargeForm.resetFields()
    },
    // 点击右上角叉号关闭对话框
    handleClose(done) {
      this.handleCancel();
      done();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>