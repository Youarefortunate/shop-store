<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-row>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
              >新 增</el-button
            >
          </el-col>
          <el-col :span="8" :offset="10">
            <el-input
              clearable
              size="medium"
              style="max-width: 300px; min-width: 150px; float: right"
              placeholder="请输入运费模板名称"
              suffix-icon="el-icon-search"
              v-model="queryParam.search"
              @change="onSearch"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 列表内容 -->
      <el-table
        v-loading="loading"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :data="tableData"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <!-- 计费方式 -->
            <span v-if="item.text == 'method'">
              <span>{{ scope.row.method == 10 ? "按件数" : "按重量" }}</span>
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
            <!-- 展示其他项 -->
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
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/setting/delivery";

// 表头
const columns = [
  {
    label: "模板ID",
    prop: "delivery_id",
  },
  {
    label: "模板名称",
    prop: "name",
  },
  {
    label: "计费方式",
    text: "method",
  },
  {
    label: "排序",
    prop: "sort",
  },
  {
    label: "添加时间",
    prop: "create_time",
  },
  {
    label: "操作",
    text: "action",
  },
];
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      loading: false,
      // 表头
      columns,
      // 一页显示多少条数据
      perPage: 15,
      // 当前
      total: 0,
      // 当前表格页码数
      page: 1,
    };
  },
  created() {
    // 加载table数据
    this.loadData();
  },
  methods: {
    // 加载table数据
    async loadData() {
      const page = this.page;
      const { data: result } = await Api.list({ page, ...this.queryParam });
      // 记录总条数
      this.total = result.data.list.total;
      this.tableData = result.data.list.data;
    },
    // 新增运费模板
    handleAdd() {
      this.$router.push("./create");
    },
    // 搜索模块确认搜索
    onSearch() {
      this.handleRefresh();
    },
    // 编辑记录
    handleEdit(item) {
      this.$router.push({
        path: "./update",
        query: { deliveryId: item.delivery_id },
      });
    },
    // 删除记录
    handleDelete(item) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await Api.deleted({
            deliveryId: item["delivery_id"],
          });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除运费模板",
            message: data.message,
            duration: 1500,
          });
          this.handleRefresh();
        })
        .catch(() => {});
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.handleRefresh();
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
        return "background: rgb(250,250,250); font-weight: 500; color: black;";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>