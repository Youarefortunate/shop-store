<template>
  <div>
    <el-dialog
      width="40%"
      title="新增文章分组"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        ref="Form"
        label-width="100px"
        style="padding: 10px 100px"
      >
        <el-form-item
          label="分组名称: "
          size="small"
          prop="name"
          :rules="[
            { required: true, message: '请输入分组名称', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item
          label="上级分组:"
          size="small"
          :label-width="formLabelWidth"
        >
          <tree-select
            style="width: 300px"
            v-model="form.parent_id"
            :selectValue="form.parent_id"
            :treeData="groupListTree"
            :defaultExpandAll="false"
          />
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
import { TreeSelect } from '@/components';
import * as Api from '@/api/files/group'

export default {
  components: { TreeSelect },
  props: {
    // 分组列表
    groupList: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      // 新增文章分组表单
      form: {
        // 上级分组
        parent_id: 0,
        // 排序
        sort: 100
      },
      // 加载表单
      loading: false,
      // (对话框)是否可见
      visible: false,
      // 文本宽度
      formLabelWidth: "100px",
      // 上级分组列表
      groupListTree: []
    };
  },
  methods: {
    /**
     * 显示对话框
     */
    add () {
      // 显示窗口
      this.visible = true
      // 获取分组列表
      this.getGroupList()
    },
    // 获取分组列表
    getGroupList() {
      const { groupList } = this
      // 格式化分组列表
      this.groupListTree = [{
        label: '顶级分组',
        key: 0,
        value: 0
      }].concat(this.formatTreeData(groupList))
    },
    // 格式化分组列表
    formatTreeData(list, disabled = false) {
      const data = []
      list.forEach(item => {
        const newItem = {
          label: item.name,
          key: item.group_id,
          value: item.group_id
        }
        // 递归整理子集
        if(item.children && item.children.length) {
          newItem['children'] = this.formatTreeData(item['children'], newItem.disabled)
        }
        data.push(newItem)
      })
      return data
    },
    // 提交表单
    handleSubmit() {
      this.$refs.Form.validate(async (valid) => {
        if(valid) {
          const { data } = await Api.add({ form: this.form })
          this.$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '新增文章分类',
            message: data.message,
            duration: 1500
          })
          this.handleCancel()
          this.$emit('handleSubmit')
        }
      })
    },
    // 取消提交表单
    handleCancel() {
      this.visible = false;
      this.resetForm();
    },
    // 重置表单项
    async resetForm() {
      this.loading = true;
      await this.$refs.Form.resetFields();
      this.loading = false;
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