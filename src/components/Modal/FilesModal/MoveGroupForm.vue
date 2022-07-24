<template>
  <div id="move-group-form">
    <el-dialog
      title="移动到分组"
      width="30%"
      append-to-body
      custom-class="move-group-form-dialog"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <el-tree
        v-if="groupTreeData.length"
        empty-text="暂无分组"
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
      // 当前表单
      form: {},
      // modal(对话框)是否可见
      visible: false,
      loading: false,
      // 配置选项
      defaultProps: {
        // children: 指定子树为节点对象的某个属性值
        children: "children",
        // label: 指定节点标签为节点对象的某个属性值
        label: "label",
      },
      // 文件ID集
      filesIds: {},
      // 分组列表 树状结构
      groupTreeData: [],
      // 选中的分组
      selectedKeys: [],
    };
  },

  methods: {
    /**
     * 新增操作权限
     */
    show(filesIds) {
      // 显示窗口
      this.visible = true;
      this.groupTreeData = [];
      this.filesIds = filesIds;
      // 获取分组列表
      this.getList();
    },

    // 获取分组列表
    getList() {
      if (this.groupTreeData.length <= 0) {
        this.groupTreeData = [
          {
            label: "未分组",
            key: 0,
            value: 0,
          },
        ].concat(this.groupList);
      }
    },
    // 提交表单
    async handleSubmit() {
      const { data } = await Api.moveGroup({
        groupId: this.selectedKeys[0],
        fileIds: this.filesIds,
      });
      this.visible = false;
      this.$notify({
        type: data.status == 200 ? "success" : "error",
        title: "移动分组",
        message: data.message,
        showClose: true,
      });
      this.handleCancel();
      this.$emit("handleSubmit");
    },

    // 记录选中项
    onSelect(selectedKeys) {
      this.selectedKeys = [selectedKeys.key];
    },
    /**
     * 取消按钮
     */
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
