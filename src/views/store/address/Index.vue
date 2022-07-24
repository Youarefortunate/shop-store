<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-row>
          <!-- 新增 -->
          <el-col :span="5">
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <!-- 下拉菜单和搜索框 -->
          <el-col :span="11" :offset="10" class="select-search">
            <el-select
              v-model="queryParam.type"
              placeholder="请选择地址类型"
              size="medium"
              clearable
            >
              <el-option label="全部" value="0"></el-option>
              <el-option label="发货地址" value="10"></el-option>
              <el-option label="退货地址" value="20"></el-option>
            </el-select>
            <el-input
              size="medium"
              clearable
              placeholder="请输入姓名/联系电话"
              suffix-icon="el-icon-search"
              v-model="queryParam.search"
              @change="onSearch"
            >
            </el-input>
          </el-col>
        </el-row>
      </div>

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
        </el-table-column>

        <el-table-column prop="type" label="地址类型" width="150">
          <template slot-scope="scope">
            <el-tag type="info" size="medium">{{
              scope.row.type == 10 ? "发货地址" : "退货地址"
            }}</el-tag>
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
            <el-link
              @click="handleDelete(scope.row)"
              type="primary"
              :underline="false"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
      <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/store/address";
import { AddForm, EditForm } from "./modules";

export default {
  name: "Index",
  components: { AddForm, EditForm },
  data() {
    return {
      tableData: [], // table数据
      loading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          prop: "address_id",
          label: "地址ID",
          width: "100",
        },
        {
          prop: "name",
          label: "联系人姓名",
          width: "100",
        },
        {
          prop: "phone",
          label: "联系人电话",
          width: "200",
        },
        {
          prop: "full_address",
          label: "详细地址",
          width: "350",
        },
        // {
        //     prop: 'type',
        //     label: '地址类型',
        //     width: '150'
        // },
        {
          prop: "sort",
          label: "排序",
          width: "100",
        },
        {
          prop: "create_time",
          label: "创建时间",
          width: "250",
        },
      ],
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    // 加载数据方法
    async loadData() {
      const { data } = await Api.list({ page: 1, ...this.queryParam });
      this.tableData = data.data.list.data;
    },
    // 新增
    handleAdd() {
      this.$refs.AddForm.add();
    },
    // 回车搜索
    onSearch() {
      this.handleRefresh();
    },
    // 编辑
    handleEdit(record) {
      this.$refs.EditForm.edit(record);
    },
    // 删除
    handleDelete(record) {
      const that = this;
      this.$confirm(
        "你确定要删除该记录嘛?, 删除后不可恢复是否继续?",
        "删除记录",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const { data } = await Api.deleted({ address_id: record.address_id });
          if (data.status == 200) {
            // 删除成功之后刷新table
            that.handleRefresh();
            that.$notify.success({
              title: "删除记录操作",
              message: data.message,
            });
          }
        })
        .catch(() => {});
    },
    // 刷新table
    handleRefresh() {
      this.loadData();
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(246,246,246);fontWeight: 500; color: black";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-operator {
  margin-bottom: 18px;
  .el-row {
    display: flex;
    align-items: center;
  }
}
.card-title {
  font-size: 14.5px;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.75);
}
.select-search {
  display: flex;
  align-items: center;
  .el-select {
    width: 220px;
    margin-right: 20px;
  }
  .el-input {
    min-width: 150px;
    max-width: 300px;
    margin-left: 10px;
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