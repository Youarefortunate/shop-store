<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form
            inline
            class="search-form"
            ref="SearchForm"
            :model="searchForm"
          >
            <el-form-item label="会员昵称: " size="small">
              <el-input
                v-model="searchForm.search"
                placeholder="请输入会员昵称"
                style="width: 220px; margin-right: 10px"
              />
            </el-form-item>

            <el-form-item label="变动时间:" size="small">
              <el-date-picker
                v-model="searchForm.betweenTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item class="search-btn" size="small">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSubmit"
                style="margin-left: 10px"
                >搜 索</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <!-- 表格 -->
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
            <!-- 会员信息 -->
            <span v-if="item.text == 'user'">
              <UserItem :user="scope.row" />
            </span>
            <!-- 变动数量 -->
            <!-- 操作 -->
            <span v-if="item.text == 'value'">
              <div class="c-p">{{ scope.row.value > 0 ? "+" : "" }}</div>
            </span>
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
import * as Api from "@/api/market/points";
import UserItem from "@/components/UserItem";
import SceneEnum from "@/common/enum/user/balance/log/Scene";

// 表头
const columns = [
  {
    label: "ID",
    prop: "log_id",
  },
  {
    label: "会员信息",
    text: "user",
  },
  {
    label: "变动数量",
    text: "value",
  },
  {
    label: "描述/说明",
    prop: "describe",
  },
  {
    label: "管理员备注",
    prop: "remark",
  },
  {
    label: "变动时间",
    prop: "create_time",
  },
];

export default {
  components: { UserItem },
  data() {
    return {
      // 枚举类
      SceneEnum,
      // 搜索模块表单
      searchForm: {},
      // 查询参数
      queryParam: {},
      // 表格数据
      tableData: [],
      // 一页显示多少条数据
      perPage: 15,
      // 当前
      total: 0,
      // 当前表格页码数
      page: 1,
      // 表头
      columns,
      // 正在加载
      loading: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载数据
    async loadData() {
      const page = this.page;
      const { data: result } = await Api.log({ page, ...this.queryParam });
      // 记录总条数
      this.total = result.data.list.total;
      this.tableData = result.data.list.data;
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.handleRefresh();
    },
    // 提交搜索模块表单
    handleSubmit() {
      this.queryParam = { ...this.queryParam, ...this.searchForm };
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
        return "background: rgb(246,246,246); fontWeight: 500; color: black";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>