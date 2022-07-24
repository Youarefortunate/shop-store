<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索列输入框 -->
        <el-row class="row-item-search">
          <el-form inline :model="formData" class="search-form" ref="form">
            <el-form-item label="商品名称: " size="small">
              <el-input
                v-model="formData.goodsName"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品编码: " size="small">
              <el-input
                v-model="formData.goodsNo"
                placeholder="请输入商品编码"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类: " size="small">
              <tree-select
                style="width: 220px"
                :defaultExpandAll="false"
                v-model="formData.categoryId"
                :selectValue="formData.categoryId"
                :treeData="categoryListTree"
              />
            </el-form-item>
            <el-form-item class="search-btn">
              <el-button
                type="primary"
                @click="handleSearch('form')"
                icon="el-icon-search"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 操作模板 -->
        <div class="row-item-tab">
          <div class="tab-list">
            <el-radio-group
              v-model="queryParam.listType"
              size="small"
              @change="handleTabs"
            >
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="on_sale">出售中</el-radio-button>
              <el-radio-button label="off_sale">已下架</el-radio-button>
              <el-radio-button label="sold_out">已售馨</el-radio-button>
            </el-radio-group>
          </div>
          <el-button
            type="primary"
            icon="el-icon-plus"
            class="create-btn"
            @click="handleCreate"
            size="small"
            >创建商品</el-button
          >
          <!-- 当选择有table中的某一行或者多行或者全选时显示 -->
          <div class="button-group" v-if="selectedRowKeys.length">
            <el-button
              size="small"
              icon="el-icon-top"
              @click="handleUpdateStatus(selectedRowKeys, true)"
              >上架</el-button
            >
            <el-button
              size="small"
              icon="el-icon-bottom"
              @click="handleUpdateStatus(selectedRowKeys, false)"
              >下架</el-button
            >
            <el-button
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(selectedRowKeys)"
              >删除</el-button
            >
          </div>
        </div>
      </div>
      <!-- table表数据 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :header-cell-style="getRowClass"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              style="cursor: pointer"
              @click="
                handleUpdateStatus([scope.row.goods_id], scope.row.status != 10)
              "
              :type="scope.row.status == 10 ? 'success' : 'danger'"
              size="medium"
              >{{ scope.row.status == 10 ? "上架" : "下架" }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column prop="goods_image" label="商品图片" width="200">
          <template slot-scope="scope">
            <el-image
              alt="商品图片"
              style="width: 80px; height: 50px"
              :src="scope.row.goods_image"
              :preview-src-list="[scope.row.goods_image]"
            >
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link
              class="edit"
              :to="{
                path: '/goods/update',
                query: { goodsId: scope.row.goods_id },
              }"
              >编辑</router-link
            >
            <el-link
              @click="handleDelete([scope.row.goods_id])"
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
import * as GoodsApi from "@/api/goods";
import CategoryModel from "@/common/model/Category";
import { TreeSelect } from "@/components";

export default {
  components: { TreeSelect },
  name: "Index",
  data() {
    const columns = [
      {
        prop: "goods_id",
        label: "商品ID",
        width: "120",
      },
      {
        prop: "goods_name",
        label: "商品名称",
        width: "160",
      },
      {
        prop: "goods_price_min",
        label: "商品价格",
        width: "100",
      },
      {
        prop: "sales_actual",
        label: "总销量",
        width: "100",
      },
      {
        prop: "stock_total",
        label: "库存总量",
        width: "100",
      },
      {
        prop: "sort",
        label: "排序",
        width: "100",
      },
      {
        prop: "create_time",
        label: "添加时间",
        width: "260",
      },
    ];
    return {
      formData: {
        // 商品名称
        goodsName: "",
        // 商品编码
        goodsNo: "",
        categoryId: 0,
      },
      // table表格数据
      tableData: [],
      // 表头
      columns,
      // 查询参数
      queryParam: {
        listType: "all",
      },
      // 选择的元素的商品id
      selectedRowKeys: [],
      // 商品分类列表
      categoryListTree: [],
      loading: false,
    };
  },
  created() {
    // 默认的查询参数
    if (this.$route.query.listType) {
      this.queryParam.listType = this.$route.query.listType;
    }
    // 获取table数据
    this.loadData();
    // 获取商品列表
    this.getCategoryList();
  },
  methods: {
    // 获取table数据
    async loadData() {
      this.loading = true;
      const { data } = await GoodsApi.list({ page: 1, ...this.queryParam });
      this.loading = false;
      this.tableData = data.data.list.data;
    },
    // 切换tabs
    handleTabs(value) {
      this.queryParam.listType = value;
      // 刷新table
      this.handleRefresh();
    },
    // 确认搜索
    handleSearch(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.queryParam = { ...this.queryParam, ...this.formData };
          // 刷新table
          this.handleRefresh();
          // 重置表单搜索框
          this.resetForm("form");
        }
      });
    },
    // 重置搜索表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取分类列表
    async getCategoryList() {
      this.loading = true;
      const selectList = await CategoryModel.getListFromScreen();
      this.loading = false;
      this.categoryListTree = selectList;
    },
    // 修改商品状态(上下架)
    async handleUpdateStatus(goodsIds, state = true) {
      this.loading = true;
      const { data } = await GoodsApi.state({ goodsIds, state });
      this.loading = false;
      this.$notify({
        type: data.status == 200 ? "success" : "error",
        title: "修改商品状态(上下架)操作",
        message: data.message,
        duration: 1000,
      });
      // 刷新table
      this.handleRefresh();
    },
    // 创建商品
    handleCreate() {
      this.$router.push("/goods/create");
    },
    // 选中项发生变化时的回调
    handleSelectionChange(val) {
      const keys = [];
      val.forEach((item) => {
        item.goods_id && keys.push(item.goods_id);
      });
      this.selectedRowKeys = keys;
    },
    // 删除商品
    handleDelete(goodsIds) {
      const that = this;
      this.$confirm("你确定删除该记录嘛, 删除后不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await GoodsApi.deleted({ goodsIds });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除商品操作",
            message: data.message,
            duration: 1000,
          });
          // 刷新table
          this.handleRefresh();
        })
        .catch(() => {});
    },
    // 刷新table
    handleRefresh() {
      this.selectList = [];
      this.loadData();
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
.card-title {
  font-size: 14.5px;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.75);
}
.table-operator {
  margin-bottom: 30px;
  .row-item-search {
    margin-bottom: 5px;
  }
}
.el-form::v-deep {
  .el-button {
    width: 76px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1px;
  }
  .el-form-item .el-form-item__label {
    font-weight: 500;
  }
  .el-input {
    width: 220px;
  }
}
.row-item-tab {
  display: flex;
  // align-items: center;
  .tab-list {
    margin-right: 20px;
  }
  .create-btn {
    border-radius: 1px;
  }
}
.button-group::v-deep {
  margin-left: 20px;
  .el-button {
    margin: 0;
    border-radius: 0;
  }
}
.edit {
  color: #409eff;
  margin-right: 10px;
}
</style>