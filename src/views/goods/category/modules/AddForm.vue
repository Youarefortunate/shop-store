<template>
  <div>
    <el-dialog
      width="40%"
      title="新增商品分类"
      custom-class="dialog"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="GoodsCategoryAddForm"
        :model="formData"
        v-loading="loading"
        label-position="right"
        class="form"
        :label-width="labelWidth"
      >
        <el-form-item
          label="分类名称: "
          prop="name"
          size="small"
          :label-width="labelWidth"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 2, message: '请至少输入2个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model="formData.name" autocomplete="off" style="width: 300px"/>
        </el-form-item>

        <el-form-item label="上级分类: " size="small" :label-width="labelWidth">
          <el-select v-model="formData.parent_id" placeholder="请选择上级分类" style="width: 300px">
            <el-option
              v-for="(item, index) in categoryListTree"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="分类图片: " size="small" :label-width="labelWidth">
          <SelectImage ref="SelectImage" v-model="formData.image_id" appendToBody/>
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
          :rules="[{ required: true, message: '请输入至少1个数字', trigger: 'blur' }]"
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
        <el-button type="primary" @click="submitForm('GoodsCategoryAddForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/category";
import CategoryModel from "@/common/model/Category";
import { SelectImage } from '@/components'

export default {
  name: "AddForm",
  components: { SelectImage },
  props: {
    // 分类列表
    categoryList: { type: Array, required: true },
  },
  data() {
    return {
      formData: {
        name: "",
        parent_id: null,
        image_id: null,
        status: 1,
        sort: 100,
      },
      loading: false,
      dialogFormVisible: false,
      // 上级分类列表
      categoryListTree: [],
      labelWidth: "100px",
    };
  },
  methods: {
    add() {
      // 显示窗口
      this.dialogFormVisible = true;
      // 获取分类列表
      this.getCategoryList();
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
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await Api.add({ form: this.formData });
          // 重置表单
          this.cancelSubmit()
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "添加商品分类操作",
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
      // 将选中的图片项数组清空
      this.$refs.SelectImage.clearSelectItem()
      this.$refs.GoodsCategoryAddForm.resetFields()
    },
    // 取消提交表单并重置表单
    cancelSubmit() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
    // 关闭dialog时重置表单项
    handleClose(done) {
      this.resetForm();
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog::v-deep {
  .el-dialog__header {
    .el-dialog__title {
      font-size: 14.5px;
    }
  }
}
.form::v-deep {
  padding: 10px 60px;
  .el-form-item__label {
    font-weight: 500;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 40px;
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