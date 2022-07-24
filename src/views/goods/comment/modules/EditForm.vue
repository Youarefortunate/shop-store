<template>
  <div class="comment-edit">
    <el-dialog
      width="40%"
      title="编辑商品评论"
      custom-class="comment-dialog"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        v-loading="loading"
        label-position="right"
        class="comment-form"
        :label-width="labelWidth"
      >
        <el-form-item label="评分: " size="small" :label-width="labelWidth" required>
          <el-radio-group v-model="formData.score">
            <el-radio :label="10">好评</el-radio>
            <el-radio :label="20">中评</el-radio>
            <el-radio :label="30">差评</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="评价内容: " size="small" :label-width="labelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入评价内容(300个字符以内)"
            v-model="formData.content">
          </el-input>
        </el-form-item>

        <el-form-item label="评价图片: " size="small" :label-width="labelWidth">
          <SelectImage
            multiple
            :maxNum="6"
            :defaultList="record.imageList"
            v-model="formData.imageIds"
          />
          <div class="form-item-help">
            <div class="extra">最多允许6张,可拖拽调整显示顺序</div>
          </div>
        </el-form-item>

        <el-form-item label="状态: " size="small" :label-width="labelWidth" required>
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <div class="extra">用户端是否展示</div>
          </div>
        </el-form-item>

        <el-form-item
          label="排序: "
          prop="sort"
          size="small"
          :label-width="labelWidth"
        >
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <div class="form-item-help">
            <div class="extra">数字越小越靠前</div>
          </div>
        </el-form-item>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/goods/comment'
import { SelectImage } from '@/components'


export default {
  name: "EditForm",
  components: { SelectImage },
  data() {
    return {
      formData: {
        // 评分
        score: 10,
        // 评价内容
        content: '',
        // 评价图片id
        imageIds: '',
        // 显示的状态
        status: 1,
        // 排序
        sort: 100
      },
      rules: {},
      visible: false,
      loading: false,
      labelWidth: '100px',
      // 当前记录
      record: {},
    }
  },
  methods: {
    // 显示对话框
    edit() {
      this.visible = true;
      // 当前记录
      this.commentId = commentId;
      // 获取当前详情记录
      this.getRecordData()
    },
    // 获取当前详情记录
    async getRecordData() {
      this.loading = true;
      const { data: result } = await Api.detail({ commentId: this.commentId })
      this.loading = false;
      this.record = result.data.detail
      // 设置默认值
      this.setFieldsValue()
    },
    // 设置默认值
    setFieldsValue() {
      this.$nextTick(() => {
        const newData = pick(this.record, ['score', 'content', 'status', 'sort', 'imageIds'])
        this.formData = newData
      })
    },
    // 提交表单
    async handleSubmit() {
      this.$refs[formName].validate(async (valid) => { 
        if(valid) {
          this.loading = true;
          const { data } = await Api.edit({ commentId: this.commentId, form: this.formData })
          this.loading = false;
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "编辑商品评价",
            message: data.message,
            showClose: true,
          })
          this.handleCancel()
          this.$emit('handleSubmit')
        }
      })
      
      
    },
    /**
     * 关闭对话框事件
     */
    handleCancel () {
      this.visible = false
      this.record = {}
      this.$refs.form.resetForm()
    },
    // 关闭dialog时重置表单项
    handleClose(done) {
      this.resetForm("form");
      done();
    },
  }
}
</script>

<style lang="scss" scoped>
.comment-edit {
  .dialog-footer {
    .el-button {
      height: 32px;
      line-height: 1px;
      border-radius: 1px;
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