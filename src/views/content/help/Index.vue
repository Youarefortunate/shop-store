<template>
  <div>
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
        row-key="help_id"
        default-expand-all
        v-loading="loading"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :data="tableData"
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
            <span v-if="item.text == 'content'">
              <p class="twoline-hide" style="width: 420px">
                {{ scope.row.content }}
              </p>
            </span>
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
      <!-- 分页器 -->
      <el-pagination
        v-if="total > perPage"
        layout="prev, pager, next"
        background
        :total="total"
        :page-size="perPage"
        :current-page="page"
        @current-change="handleCurrentChange"
      />
      <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
      <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/content/help";
import AddForm from "./modules/AddForm";
import EditForm from "./modules/EditForm";

// 表头
const columns = [
  {
    label: "帮助ID",
    prop: "help_id",
    width: '160'
  },
  {
    label: "标题",
    prop: "title",
    width: '160'
  },
  {
    label: "内容",
    text: "content",
    width: '450'
  },
  {
    label: "排序",
    prop: "sort",
    width: '160'
  },
  {
    label: "更新时间",
    prop: "update_time",
    width: '300'
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
      tableData: [],
      // 加载
      loading: false,
      // 查询参数
      queryParam: {},
      // 当前页码
      page: 1,
      // 总条数
      total: 0,
      // 一页显示多少条数据
      perPage: 15,
      // 表头
      columns,
    };
  },
  created() {
    // 获取表格数据
    this.handleRefresh()
  },
  methods: {
    async loadData() {
      const page = this.page
      const { data: { data: response } } = await Api.list({ page, ...this.queryParam })
      // 记录总条数
      this.total = response.list.total
      if(this.total <= 15) {
        this.page = 1
        this.handleRefresh()
      }
      this.tableData = response.list.data
    },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },

    /**
     * 编辑记录
     */
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },
    // 删除
    handleDelete(item) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await Api.deleted({
            helpId: item.help_id
          });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除帮助中心记录",
            message: data.message,
            showClose: true,
            duration: 1500,
          });
          this.handleRefresh();
        })
        .catch(() => {});
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage
      this.handleRefresh()
    },
    // 刷新table
    async handleRefresh() {
      this.loading = true;
      await this.loadData();
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