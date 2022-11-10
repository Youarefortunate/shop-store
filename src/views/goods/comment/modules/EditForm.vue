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
        v-loading="loading"
        :model="formData"
        label-width="120px"
        style="padding: 10px 100px"
      >
        <el-form-item required label="评分: " size="small">
          <el-radio-group v-model="formData.score">
            <el-radio :label="10">好评</el-radio>
            <el-radio :label="20">中评</el-radio>
            <el-radio :label="30">差评</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="评价内容: " size="small">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入评价内容(300个字符以内)"
            v-model="formData.content"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="评价图片: " size="small">
          <SelectImage
            multiple
            :maxNum="6"
            appendToBody
            :defaultList="record.imageList"
            v-model="formData.imageIds"
          />
          <div class="form-item-help">
            <p class="extra">最多允许6张,可拖拽调整显示顺序</p>
          </div>
        </el-form-item>

        <el-form-item
          label="状态: "
          size="small"
          required
        >
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">用户端是否展示</p>
          </div>
        </el-form-item>

        <el-form-item label="排序: " prop="sort" size="small">
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            :min="0"
          />
          <div class="form-item-help">
            <p class="extra">数字越小越靠前</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pick from "lodash.pick";
import * as Api from "@/api/goods/comment";
import { SelectImage } from "@/components";

export default {
  name: "EditForm",
  components: { SelectImage },
  data() {
    return {
      formData: {
        // 评分
        score: 10,
        // 评价内容
        content: "",
        // 评价图片id
        imageIds: null,
        // 显示的状态
        status: 1,
        // 排序
        sort: 100,
      },
      // 是否可见
      visible: false,
      // 加载
      loading: false,
      // 文本宽度
      labelWidth: "120px",
      // 当前记录ID
      commentId: null,
      // 当前记录
      record: {},
    };
  },
  methods: {
    // 显示对话框
    edit(commentId) {
      this.visible = true;
      // 当前记录
      this.commentId = commentId;
      // 获取当前详情记录
      this.getRecordData();
    },
    // 获取当前详情记录
    async getRecordData() {
      this.loading = true;
      const { data: result } = await Api.detail({ commentId: this.commentId });
      this.loading = false;
      this.record = result.data.detail;
      // 设置默认值
      this.setFieldsValue();
    },
    // 设置默认值
    setFieldsValue() {
      this.$nextTick(() => {
        const newData = pick(this.record, [
          "score",
          "content",
          "status",
          "sort",
          "imageIds",
        ]);
        this.formData = newData;
      });
    },
    // 提交表单
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.edit({
            commentId: this.commentId,
            form: this.formData,
          });
          this.loading = false;
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "编辑商品评价",
            message: data.message,
            showClose: true,
          });
          this.handleCancel();
          this.$emit("handleSubmit");
        }
      });
    },
    /**
     * 关闭对话框事件
     */
    handleCancel() {
      this.visible = false;
      this.record = {};
    },
    // 关闭dialog时重置表单项
    handleClose(done) {
      done();
    },
  },
};
</script>