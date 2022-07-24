<template>
  <div id="page-design">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-row>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="8" :offset="10">
            <el-input
              size="medium"
              clearable
              placeholder="请输入页面名称"
              suffix-icon="el-icon-search"
              v-model="queryParam.name"
              @change="onSearch"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 页面类型 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="getRowClass"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span v-if="item.prop == 'page_type'">
              <el-tag
                :type="
                  scope.row.page_type == PageTypeEnum.HOME.value
                    ? 'success'
                    : ''
                "
                size="medium"
                >{{ PageTypeEnum[scope.row.page_type].name }}</el-tag
              >
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
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
            <!-- 如果页面类型为首页则不显示设为首页 -->
            <el-link
              v-if="scope.row.page_type != PageTypeEnum.HOME.value"
              @click="handSetHome(scope.row)"
              type="primary"
              :underline="false"
              style="margin-right: 10px"
              >设为首页</el-link
            >
            <!-- 如果页面类型为首页则不显示删除 -->
            <el-link
              v-if="scope.row.page_type != PageTypeEnum.HOME.value"
              @click="handleDelete(scope.row)"
              type="primary"
              :underline="false"
              style="margin-right: 10px"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/page";
import { PageTypeEnum } from "@/common/enum/page";

export default {
  name: "Index",
  data() {
    const columns = [
      {
        prop: "page_id",
        label: "页面ID",
        width: "200",
      },
      {
        prop: "page_name",
        label: "页面名称",
        width: "200",
      },
      {
        prop: "page_type",
        label: "页面类型",
        width: "200",
      },
      {
        prop: "create_time",
        label: "添加时间",
        width: "300",
      },
      {
        prop: "update_time",
        label: "更新时间",
        width: "300",
      },
    ];
    return {
      tableData: [],
      columns,
      // 查询参数
      queryParam: { name: "" },
      loading: false,
      PageTypeEnum,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { data } = await Api.list({ page: 1, ...this.queryParam });
      this.tableData = data.data.list.data;
    },
    // 新增页面
    handleAdd() {},
    // 编辑页面
    handleEdit() {},
    // 设置为首页
    handSetHome(item) {
      this.$confirm("你确定要设置为首页吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          const { data } = await Api.setHome({ pageId: item.page_id });
          this.loading = false;
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "设置页面首页操作",
            message: data.message,
          });
          this.loadData();
        })
        .catch(() => {});
    },
    // 删除非首页页面
    handleDelete(item) {
      this.$confirm("你确定删除该记录嘛, 删除后不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true;
          const { data } = await Api.deleted({ pageId: item.page_id });
          this.loading = false;
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除页面操作",
            message: data.message,
          });
          this.loadData();
        })
        .catch(() => {});
    },
    // 回车搜索
    onSearch() {
      this.loadData();
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(250,250,250);";
      }
    },
  },
};
</script>

<style lang="scss">
#page-design {
  .card-title {
    font-size: 14.5px;
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.75);
  }
  .table-operator {
    margin-bottom: 18px;
    .el-input {
      min-width: 150px;
      max-width: 300px;
      margin-left: 10px;
    }
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