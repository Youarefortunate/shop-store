<template>
  <div>
    <el-dialog
      width="30%"
      title="移动到分组"
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-tree
        v-if="groupTreeData.length"
        class="tree"
        node-key="key"
        highlight-current
        :data="groupTreeData"
        :props="defaultProps"
        @node-click="onSelect"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/files";

export default {
  props: {
    // 分组列表
    groupList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 移动分组表单数据
      form: {},
      // modal(对话框)是否可见
      visible: false,
      // 文本宽度
      formLabelWidth: "100px",
      // 文件ID集
      filesIds: {},
      // 分组列表 树状结构
      groupTreeData: [],
      // 选中的分组
      selectedKeys: [],
      // tree属性结构的默认配置项
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    /**
     * 新增操作权限
     */
    show (filesIds) {
      // 显示窗口
      this.visible = true
      this.filesIds = filesIds
      // 获取分组列表
      this.getList()
    },
    // 点击节点时触发
    // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
    onSelect(selectedKeys) {
      this.selectedKeys = [selectedKeys.value]
    },
    // 获取分组列表
    getList() {
      if(this.groupTreeData.length <= 0) {
        this.groupTreeData = [{
          label: '未分组',
          key: 0,
          value: 0
        }].concat(this.groupList)
      }
    },
    // 确定提交编辑文件表单
    async handleSubmit() {
      if(this.selectedKeys.length) {
        const { data } = await Api.moveGroup({ groupId: this.selectedKeys[0], fileIds: this.filesIds })
        this.$notify({
          type: data.status == 200 ? 'success' : 'error',
          title: '移动到分组',
          message: data.message,
          duration: 1500
        })
        this.$emit('handleSubmit')
        this.handleCancel()
      }
    },
    // 取消提交表单
    handleCancel() {
      this.visible = false;
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
.tree {
  padding: 10px 80px;
}
</style>