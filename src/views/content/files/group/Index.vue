<template>
  <div id="article-category-index">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleAdd"
          >新增</el-button
        >
      </div>
      <el-table
        row-key="group_id"
        default-expand-all
        v-loading="loading"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :data="groupList"
        :header-cell-style="getRowClass"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <!-- 操作 -->
            <span v-if="item.text == 'action'">
              <el-link
                type="primary"
                style="margin-right: 10px"
                :underline="false"
                @click="handleEdit(scope.row)"
                >编辑</el-link
              >
              <el-link
                type="primary"
                :underline="false"
                @click="handleDelete(scope.row)"
                >删除</el-link
              >
            </span>
            <!-- 展示其他未满足条件的项 -->
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <AddForm ref="AddForm" :groupList="groupList" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" :groupList="groupList" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as Api from '@/api/files/group'
import AddForm from "./modules/AddForm";
import EditForm from "./modules/EditForm";

// 表头
const columns = [
  {
    label: "分组ID",
    prop: "group_id",
    width: '300'
  },
  {
    label: "分组名称",
    prop: "name",
    width: '350'
  },
  {
    label: "排序",
    prop: "sort",
    width: '250'
  },
  {
    label: "添加时间",
    prop: "create_time",
    width: '350'
  },
  {
    label: "操作",
    text: "action"
  },
];
export default {
  components: { AddForm, EditForm },
  data() {
    return {
      // 表格数据
      groupList: [],
      // 查询参数
      queryParam: {},
      // 加载
      loading: false,
      // 表头
      columns,
    };
  },
  created() {
    // 获取分组列表
    this.getGroupList()
  },
  methods: {
    // 获取分组列表
    async getGroupList() {
      const { data: result } = await Api.list();
      this.groupList = result.data.list;
    },
    // 新增文章分类
    handleAdd() {
      this.$refs.AddForm.add();
    },
    /**
     * 编辑文章分类
     */
    handleEdit(item) {
      this.$refs.EditForm.edit(item);
    },
    // 删除文章分类
    handleDelete(item) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await Api.deleted({
            groupId: item['group_id']
          });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除文章分组",
            message: data.message,
            showClose: true,
            duration: 1500,
          });
          this.handleRefresh();
        })
        .catch(() => {});
    },
    // 刷新table
    async handleRefresh() {
      this.loading = true;
      await this.getGroupList();
      this.loading = false;
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(246,246,246); fontWeight: 500; color: black";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>