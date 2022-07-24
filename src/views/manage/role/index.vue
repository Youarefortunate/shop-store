<template>
  <div id="role-list">
    <el-card shadow="always" class="card-container">
      <!-- 标题 -->
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 新增角色按钮 -->
      <div class="table-operator">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
          >新增</el-button
        >
      </div>
      <el-table
        v-loading="loading"
        :data="roleTableData"
        style="width: 100%"
        :header-cell-style="getRowClass"
      >
        <el-table-column prop="role_id" label="角色ID" width="300">
        </el-table-column>

        <el-table-column prop="role_name" label="角色名称" width="300">
        </el-table-column>

        <el-table-column prop="sort" label="排序" width="200">
        </el-table-column>

        <el-table-column prop="create_time" label="添加时间" width="500">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link
              @click="handleEdit(scope.row)"
              type="primary"
              :underline="false"
              style="margin-right: 10px"
              >编辑</el-link
            >
            <el-link
              @click="handleDelete(scope.row)"
              v-show="!scope.row.is_super"
              type="primary"
              :underline="false"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>

      <add-form 
        ref="AddForm" 
        :menuList="menuList" 
        :roleList="roleTableData"
        @handleSubmit="handleRefresh" 
      />
      <edit-form
        ref="EditForm"
        :menuList="menuList"
        :roleList="roleTableData"
        @handleSubmit="handleRefresh"
      />
    </el-card>
  </div>
</template>

<script>
import * as RoleApi from "@/api/store/role";
import * as MenuApi from "@/api/store/menu";

import AddForm from "./modules/AddForm";
import EditForm from "./modules/EditForm";

export default {
  name: "Index",
  components: {
    AddForm,
    EditForm,
  },
  data() {
    return {
      // 角色列表数据
      roleTableData: [],
      // 加载
      loading: false,
      // 权限列表
      menuList: [],
    };
  },
  mounted() {
    // 获取角色列表
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      this.loading = true;
      const { data } = await RoleApi.list();
      this.loading = false;
      this.roleTableData = data.data.list;
    },
    // 获取菜单列表数据
    async getMenuList() {
      if (!this.menuList.length) {
        const { data } = await MenuApi.list();
        this.menuList = data.data.list;
      }
    },
    // 新增角色
    async handleAdd() {
      // 等待获取完菜单列表数据之后,才会去调用新增组件中的add方法
      await this.getMenuList();
      this.$refs.AddForm.add();
    },
    // 编辑
    async handleEdit(record) {
      // 获取菜单列表数据
      await this.getMenuList()
      // 显示对话框
      this.$refs.EditForm.edit(record)
    },
    // 删除
    handleDelete(record) {
      this.$confirm('你确定要删除该记录嘛, 删除后不可恢复,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data } = await RoleApi.deleted({ roleId: record['role_id'] })
          this.handleRefresh()
          this.$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '删除角色',
            message: data.message,
            showClose: true,
            duration: 1500
          })
        }).catch(() => {})
    },
    // 刷新列表
    handleRefresh() {
      this.getRoleList();
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
.card-container {
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
}
</style>