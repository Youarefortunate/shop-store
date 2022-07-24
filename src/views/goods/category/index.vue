<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
          >新增</el-button
        >
      </div>
      <el-table
        v-loading="loading"
        default-expand-all
        style="width: 100%"
        row-key="category_id"
        :data="categoryList"
        :header-cell-style="getRowClass"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span v-if="item.text == 'status'">
              <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">{{
                scope.row.status ? "显示" : "隐藏"
              }}</el-tag>
            </span>
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
            <span>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <AddForm
        ref="AddForm"
        :categoryList="categoryList"
        @handleSubmit="handleRefresh"
      />
      <EditForm
        ref="EditForm"
        :categoryList="categoryList"
        @handleSubmit="handleRefresh"
      />
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/category";
import AddForm from "./modules/AddForm";
import EditForm from "./modules/EditForm";

export default {
  name: "Index",
  components: { AddForm, EditForm },
  data() {
    const columns = [
      {
        label: "分类ID",
        prop: "category_id",
        width: "150",
      },
      {
        label: "分类名称",
        prop: "name",
        width: "350",
      },
      {
        label: "状态",
        text: "status",
        width: "150",
      },
      {
        label: "排序",
        prop: "sort",
        width: "150",
      },
      {
        label: "添加时间",
        prop: "create_time",
        width: "400",
      },
      {
        label: "操作",
        text: "action",
      },
    ];
    return {
      // 分类列表
      categoryList: [],
      loading: false,
      // 查询参数
      queryParam: {},
      columns,
    };
  },
  mounted() {
    this.getCategoryList(true);
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      this.loading = true;
      const { data: result } = await Api.list();
      this.loading = false;
      this.categoryList = result.data.list;
    },
    // 新增商品分类
    handleAdd() {
      this.$refs.AddForm.add();
    },
    // 编辑
    handleEdit(record) {
      this.$refs.EditForm.edit(record);
    },
    // 删除
    handleDelete(record) {
      this.$confirm("你确定要删除该记录嘛, 删除后不可恢复", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await Api.deleted({
            categoryId: record["category_id"],
          });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除商品分类记录",
            message: data.message,
            showClose: true,
          });
          this.handleRefresh();
        })
        .catch(() => {});
    },
    // 刷新table
    handleRefresh() {
      this.getCategoryList();
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(250,250,250); font-weight: 500";
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