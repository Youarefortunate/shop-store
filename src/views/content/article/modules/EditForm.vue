<template>
  <div>
    <el-dialog
      width="45%"
      title="编辑文章"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        v-loading="loading"
        :model="addCategoryForm"
        ref="AddCategoryForm"
        label-width="120px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="文章标题: "
          size="small"
          prop="title"
          :rules="[
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="addCategoryForm.title"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item
          label="文章分类: "
          size="small"
          prop="category_id"
          :rules="[
            { required: true, message: '请选择1个文章分类', trigger: 'change' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="addCategoryForm.category_id"
            style="width: 300px"
            placeholder="请选择文章分类"
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.category_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="列表显示方式: "
          size="small"
          prop="show_type"
          :label-width="formLabelWidth"
          :rules="[
            {
              required: true,
              message: '请选择列表显示方式',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="addCategoryForm.show_type">
            <el-radio :label="10">小图模式</el-radio>
            <el-radio :label="20">大图模式</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">小图模式建议封面图尺寸：300 * 188</p>
            <p class="extra">大图模式建议封面图尺寸：750 * 455</p>
          </div>
        </el-form-item>

        <el-form-item
          label="封面图: "
          size="small"
          prop="image_id"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '请选择1个封面图', trigger: 'change' },
          ]"
        >
          <select-image
            ref="SelectImage"
            appendToBody
            v-model="addCategoryForm.image_id"
            :defaultList="defaultList ? defaultList : []"
          />
        </el-form-item>

        <el-form-item
          label="文章内容: "
          size="small"
          prop="content"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '文章内容不能为空', trigger: 'blur' },
          ]"
        >
          <Ueditor v-model="addCategoryForm.content" appendToBody />
        </el-form-item>

        <el-form-item
          label="虚拟阅读量: "
          prop="virtual_views"
          size="small"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '虚拟阅读量不能为空', trigger: 'blur' },
          ]"
        >
          <el-input-number
            :min="0"
            controls-position="right"
            v-model="addCategoryForm.virtual_views"
          />
          <div class="form-item-help">
            <p class="extra">用户看到的阅读量 = 实际阅读量 + 虚拟阅读量</p>
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
          <el-radio-group v-model="addCategoryForm.status">
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
            v-model="addCategoryForm.sort"
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
import pick from "lodash.pick";
import * as Api from "@/api/content/article";
import { SelectImage, Ueditor } from "@/components";

export default {
  components: { SelectImage, Ueditor },
  props: {
    // 分类列表
    categoryList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 添加文章分类表单
      addCategoryForm: {
        // 文章标题
        title: "",
        // 文章分类id
        category_id: null,
        // 列表显示的方式
        show_type: 10,
        // 封面图片
        image_id: null,
        // 文章内容
        content: null,
        // 虚拟阅读量
        virtual_views: 100,
        // 状态
        status: 1,
        // 排序
        sort: 100,
      },
      // modal(对话框)是否可见
      visible: false,
      // 文本的宽度
      formLabelWidth: "120px",
      // 当前记录ID
      articleId: null,
      // 当前记录详情
      record: {},
      // 图片显示
      defaultList: [],
      // 表单加载
      loading: false,
    };
  },
  methods: {
    /**
     * 显示对话框
     */
    async edit(articleId) {
      // 显示窗口
      this.visible = true;
      // 当前记录ID
      this.articleId = articleId;
      this.loading = true;
      // 获取当前详情记录
      await this.getDetail();
      this.loading = false;
    },
    // 获取当前详情记录
    async getDetail() {
      const { data: result } = await Api.detail({ articleId: this.articleId });
      // 当前记录
      this.record = result.data.detail;
      // 显示图片
      this.defaultList.push(this.record.image);
      // 设置默认值
      this.setFieldsValue();
    },
    // 设置默认值
    setFieldsValue() {
      this.$nextTick(() => {
        const newData = pick(this.record, [
          "title",
          "show_type",
          "category_id",
          "image_id",
          "content",
          "sort",
          "status",
          "virtual_views",
        ]);
        this.addCategoryForm = newData;
      });
    },
    // 提交新增文章分类表单
    handleSubmit() {
      this.$refs.AddCategoryForm.validate(async (valid) => {
        if (valid) {
          const { data } = await Api.edit({
            articleId: this.articleId,
            form: this.addCategoryForm,
          });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "编辑文章",
            message: data.message,
            duration: 1500,
          });
          // 关闭对话框
          this.handleCancel();
          // 通知父组件完成了
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
      this.defaultList = [];
      // 将选中的图片项数组清空
      this.$refs.SelectImage.clearSelectItem();
      this.$refs.AddCategoryForm.resetFields();
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