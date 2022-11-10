<template>
  <div id="user-list">
    <el-card shadow="always" class="card-container">
      <!-- 标题 -->
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 新增和搜索框 -->
      <div class="table-operator">
        <el-row>
          <el-col :span="6" style="color: #fff; font-size: 10px">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="7" :offset="10">
            <el-input
              size="medium"
              clearable
              placeholder="请输入用户名/姓名"
              suffix-icon="el-icon-search"
              v-model="queryParam.search"
              @change="onSearch"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 管理员列表 -->
      <my-table
        :loading="loading"
        :total="total"
        :currentPage="currentPage"
        :tableData="tableData"
        :columns="columns"
        @handleCurrentChange="handleCurrentChange"
      >
        <template slot="content" slot-scope="{ data, item }">
          <span v-if="item.text == 'user_name'">
            <span style="margin-right: 10px">{{ data.user_name }}</span>
            <el-tag v-if="data.is_super" type="success" size="medium"
              >超级管理员</el-tag
            >
          </span>

          <span v-if="item.text == 'action'">
            <el-link
              @click="handleEdit(data)"
              type="primary"
              :underline="false"
              style="margin-right: 10px"
              >编辑</el-link
            >
            <el-link
              @click="handleDelete(data)"
              v-if="!data.is_super"
              type="primary"
              :underline="false"
              >删除</el-link
            >
          </span>

          <span v-else>{{ data[item.prop] }}</span>
        </template>
      </my-table>
      <add-form
        ref="AddForm"
        :roleList="roleList"
        @handleSubmit="handleRefresh"
      />
      <edit-form
        ref="EditForm"
        :roleList="roleList"
        @handleSubmit="handleRefresh"
      />
    </el-card>
  </div>
</template>

<script>
import * as UserApi from "@/api/store/user";
import * as RoleApi from "@/api/store/role";

import MyTable from "@/components/MyTable";
import AddForm from "./modules/AddForm";
import EditForm from "./modules/EditForm";

// 表头
const columns = [
  {
    prop: "store_user_id",
    label: "管理员ID",
    width: "250",
  },
  {
    label: "用户名",
    text: "user_name",
    width: "300",
  },
  {
    prop: "real_name",
    label: "姓名",
    width: "200",
  },
  {
    prop: "sort",
    label: "排序",
    width: "150",
  },
  {
    prop: "create_time",
    label: "添加时间",
    width: "350",
  },
  {
    label: "操作",
    text: "action",
  },
];
export default {
  name: "Index",
  components: {
    MyTable,
    AddForm,
    EditForm,
  },
  data() {
    return {
      // table数据
      tableData: [], 
      // table表头
      columns, 
      // 当前页码
      currentPage: 1,
      // 总条数
      total: 0,
      // 显示加载
      loading: false, 
      // 角色列表
      roleList: [], 
      // 查询参数
      queryParam: {}, 
    };
  },
  created() {
    this.loadData();
    this.getRoleList();
  },
  methods: {
    // 获取列表数据
    async loadData() {
      const page = this.currentPage;
      this.loading = true;
      const { data: { data } } = await UserApi.list({ page, ...this.queryParam });
      this.loading = false
      // 记录总条数
      this.total = data.list.total
      this.tableData = data.list.data || [];
    },
    // 获取角色列表
    async getRoleList() {
      this.loading = true;
      const { data } = await RoleApi.list();
      data.status == 200 ? (this.loading = false) : "";
      this.roleList = data.data.list || [];
    },
    // 新增管理员
    handleAdd() {
      this.$refs.AddForm.add();
    },
    // 编辑管理员
    handleEdit(row) {
      this.$refs.EditForm.edit(row);
    },
    // 删除记录
    handleDelete(row) {
      const that = this;
      this.$confirm("你确定要删除该记录嘛, 删除后不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          that.loading = true;
          const { data } = await UserApi.deleted({
            userId: row["store_user_id"],
          });
          if (data.status == 200) {
            that.loading = false;
            that.loadData();
            that.$notify.success({
              title: "删除记录操作",
              message: data.message,
            });
          }
        })
        .catch(() => {});
    },
    // 刷新列表
    handleRefresh() {
      this.loadData();
    },
    // 用户按下回车搜索触发
    onSearch(value) {
      this.loadData();
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.handleRefresh();
    }
  },
};
</script>

<style lang="scss" scoped>
#user-list {
  // margin: 30px;
}
.card-container {
  .card-title {
    font-size: 14.5px;
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.75);
  }
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