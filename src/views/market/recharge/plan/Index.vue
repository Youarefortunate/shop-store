<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-row>
          <el-col :span="6">
            <el-button type="primary" @click="handleAdd" icon="el-icon-plus"
              >新增</el-button
            >
          </el-col>
          <el-col :span="8" :offset="10">
            <el-input
              size="medium"
              clearable
              style="max-width: 300px; min-width: 150px; float: right"
              placeholder="请输入套餐名称"
              suffix-icon="el-icon-search"
              v-model="queryParam.search"
              @change="onSearch"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table
        style="width: 100%"
        v-loading="loading"
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
            <!-- 充值金额 -->
            <span v-if="item.text == 'money'">
              <div class="c-p">{{ scope.row.money }}</div>
            </span>
            <!-- 赠送金额 -->
            <span v-if="item.text == 'gift_money'">
              <div class="c-p">{{ scope.row.gift_money }}</div>
            </span>
            <!-- 操作 -->
            <span v-if="item.text == 'action'">
              <el-link
                type="primary"
                style="margin-right: 8px"
                @click="handleEdit(scope.row)"
                :underline="false"
                >编辑</el-link
              >
              <el-link
                type="primary"
                @click="handleDelete(scope.row)"
                :underline="false"
                >删除</el-link
              >
            </span>
            <!-- 显示其他未满足条件的项 -->
            <span>{{ scope.row[item.prop] }}</span>
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
import * as Api from "@/api/market/recharge/plan";
import { AddForm, EditForm } from "./modules";

const columns = [
  {
    label: "套餐ID",
    prop: "plan_id",
  },
  {
    label: "套餐名称",
    prop: "plan_name",
  },
  {
    label: "充值金额 (元)",
    text: "money",
  },
  {
    label: "赠送金额 (元)",
    text: "gift_money",
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
  name: "Index",
  components: { AddForm, EditForm },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 一页显示多少条数据
      perPage: 15,
      // 当前
      total: 0,
      // 当前表格页码数
      page: 1,
      // 查询参数
      queryParam: {},
      // 表头数据
      columns,
      // 正在加载
      loading: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 加载数据
    async loadData() {
      const page = this.page;
      const { data: result } = await Api.list({ page, ...this.queryParam });
      // 记录总条数
      this.total = result.data.list.total;
      this.tableData = result.data.list.data;
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
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.handleRefresh();
    },
    // 删除
    handleDelete(item) {
      this.$confirm("你确定要删除该记录嘛, 删除后不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await Api.deleted({
            planId: item.plan_id
          });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除充值套餐",
            message: data.message,
            duration: 1500
          });
          this.handleRefresh();
        })
        .catch(() => {});
    },
    // 按下回车或者输入框失去焦点时触发
    onSearch() {
      this.handleRefresh();
    },
    // 刷新table
    handleRefresh() {
      this.loading = true;
      this.loadData();
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