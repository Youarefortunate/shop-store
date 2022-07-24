<template>
  <div>
    <el-dialog
      width="40%"
      title="编辑商品分类"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="GoodsCategoryEditForm"
        :model="formData"
        :rules="rules"
        v-loading="loading"
        label-position="left"
        :label-width="labelWidth"
      >
        <el-form-item
          label="分类名称: "
          prop="name"
          size="small"
          :label-width="labelWidth"
        >
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="上级分类: " size="small" :label-width="labelWidth">
          <el-select v-model="formData.parent_id">
            <el-option
              v-for="(item, index) in categoryListTree"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类图片: " size="small" :label-width="labelWidth">
          <SelectImage
            ref="SelectImage"
            :defaultList="defaultList ? defaultList : []"
            v-model="formData.image_id" appendToBody
          />
        </el-form-item>

        <el-form-item
          label="状态: "
          prop="status"
          size="small"
          :label-width="labelWidth"
          required
        >
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import * as Api from "@/api/category";
import CategoryModel from "@/common/model/Category";
import { SelectImage } from '@/components'

export default {
  name: "EditForm",
  components: { SelectImage },
  props: {
    // 分类列表
    categoryList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: "",
        parent_id: 0,
        image_id: 0,
        status: 1,
        sort: 100,
      },
      rules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, message: "请至少输入2个字符", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入至少1个数字", trigger: "change" },
        ],
      },
      loading: false,
      dialogFormVisible: false,
      // 上级分类列表
      categoryListTree: [],
      imageVisible: false,
      dialogImageUrl: "",
      labelWidth: "100px",
      // 当前记录
      record: {},
      // 设置显示的图片
      defaultList: []
    };
  },
  methods: {
    edit(record) {
      // 显示窗口
      this.dialogFormVisible = true;
      // 当前记录
      this.record = record;
      // 设置显示的图片
      this.defaultList.push(record.image)
      // 获取分类列表
      this.getCategoryList();
      // 设置默认值
      this.setFieldsValue();
    },
    // 获取分类列表
    getCategoryList() {
      const { categoryList } = this;
      // 格式化分类列表
      const selectList = CategoryModel.formatTreeData(categoryList);
      // 顶级分类
      this.categoryListTree = [
        {
          label: "顶级分类",
          key: 0,
          value: 0,
        },
      ].concat(selectList);
    },
    // 设置默认值
    setFieldsValue() {
      const { record } = this;
      // 设置表单内容
      this.$nextTick(() => {
        const defaultData = _.pick(record, [ "name", "parent_id", "image_id", "status", "sort" ])
        this.formData = defaultData;
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await Api.edit({
            categoryId: this.record["category_id"],
            form: this.formData,
          });
          // 关闭dialog并重置表单
          this.cancelSubmit()
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "编辑商品分类操作",
            message: data.message,
            showClose: true,
          });
          this.$emit("handleSubmit");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置表单校验
    resetForm() {
      this.defaultList = []
      // 将选中的图片项数组清空
      this.$refs.SelectImage.clearSelectItem()
      this.$refs.GoodsCategoryEditForm.resetFields();
    },
    // 取消提交表单并重置表单
    cancelSubmit() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
    // 关闭dialog时重置表单项
    handleClose(done) {
      done();
      this.resetForm()
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form::v-deep {
  padding: 10px 60px;
  .el-form-item__label {
    font-weight: 500;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 40px;
  }
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 2px;
  }
  // 上传之后的图片宽高
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
}
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
</style>