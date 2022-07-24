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
              placeholder="请输入服务名称"
              suffix-icon="el-icon-search"
              v-model="queryParam.search"
              @change="onSearch"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
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
            <!-- 是否默认 -->
            <span v-if="item.text == 'is_default'">
              <el-tag :type="scope.row.is_default == 1 ? 'success' : 'info'">{{
                scope.row.is_default == 1 ? "是" : "否"
              }}</el-tag>
            </span>
            <!-- 状态 -->
            <span v-if="item.text == 'status'">
              <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">{{
                scope.row.status == 1 ? "显示" : "隐藏"
              }}</el-tag>
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
      <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
      <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/goods/service";
import AddForm from "./modules/AddForm";
import EditForm from "./modules/EditForm";

export default {
  name: "Index",
  components: { AddForm, EditForm },
  data() {
    const columns = [
      {
        label: "服务名称",
        prop: "name",
        width: "200px",
      },
      {
        label: "概述",
        prop: "summary",
        width: "400px",
      },
      {
        label: "是否默认",
        text: "is_default",
        width: "150px",
      },
      {
        label: "状态",
        text: "status",
        width: "150px",
      },
      {
        label: "排序",
        prop: "sort",
        width: "150px",
      },
      {
        label: "更新时间",
        prop: "update_time",
        width: "250px",
      },
      {
        label: "操作",
        text: "action",
      },
    ];
    return {
      // 表格数据
      tableData: [],
      // 查询参数
      queryParam: {},
      // 表头数据
      columns,
      loading: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 获取初始化table数据
    async loadData() {
      const { data: result } = await Api.list({ page: 1, ...this.queryParam });
      this.tableData = result.data.list.data;
    },
    // 新增
    handleAdd() {
      this.$refs.AddForm.add();
    },
    // 编辑
    handleEdit(record) {
      this.$refs.EditForm.edit(record);
    },
    // 删除
    handleDelete(record) {
      this.$confirm("你确定要删除该记录嘛, 删除后不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await Api.deleted({
            serviceId: record["service_id"],
          });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除服务承诺操作",
            message: data.message,
            showClose: true,
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
        return "background: rgb(250,250,250); font-weight: normal; color: black";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 14.5px;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.75);
}
.table-operator {
  margin-bottom: 18px;
  .el-button {
    width: 76px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1px;
  }
}
</style>