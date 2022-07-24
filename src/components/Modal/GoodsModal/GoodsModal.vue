<template>
  <div>
    <el-dialog
      width="50%"
      title="商品库"
      :visible.sync="visible"
      :before-close="handleClose"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <!-- 搜索模块 -->
      <div class="table-operator">
        <el-row class="row-item-form">
          <el-form
            inline
            :model="searchForm"
            v-loading="loading"
            label-width="100px"
          >
            <el-form-item label="商品名称: " size="small">
              <el-input
                v-model="searchForm.goodsName"
                autocomplete="off"
                placeholder="请输入商品名称"
                style="width: 220px"
              />
            </el-form-item>

            <el-form-item label="商品分类: " size="small">
              <TreeSelect
                style="width: 220px"
                :defaultExpandAll="false"
                v-model="searchForm.categoryId"
                :selectValue="searchForm.categoryId"
                :treeData="categoryListTree"
              />
            </el-form-item>

            <el-form-item size="small">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <!-- 列表内容 -->
      <!-- @selection-change: 当选择项发生变化时会触发该事件 -->
      <el-table
        ref="table"
        :row-key="fieldName"
        v-loading="loading"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :data="tableData"
        :header-cell-style="getRowClass"
        :tree-props="{ children: 'children' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span v-if="item.text == 'item'">
              <GoodsItem
                :data="{
                  image: scope.row.goods_image,
                  imageAlt: '商品图片',
                  title: scope.row.goods_name,
                  subtitle: `￥${scope.row.goods_price_min}`,
                }"
                :subTitleColor="true"
              />
            </span>
            <!-- 商品状态 -->
            <span v-if="item.text == 'status'">
              <el-tag
                :type="scope.row.status == 10 ? 'success' : 'danger'"
                size="small"
                >{{ scope.row.status == 10 ? "上架" : "下架" }}</el-tag
              >
            </span>
            <!-- 显示其他项 -->
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import * as GoodsApi from "@/api/goods";
import CategoryModel from "@/common/model/Category";
import TreeSelect from "@/components/TreeSelect";
import GoodsItem from "@/components/GoodsItem";

// table表头
const columns = [
  {
    label: "商品ID",
    prop: "goods_id",
    width: "100",
  },
  {
    label: "商品信息",
    width: "250",
    text: "item",
  },
  {
    label: "商品价格",
    prop: "goods_price_min",
    width: "120",
  },
  {
    label: "库存总量",
    prop: "stock_total",
    width: "120",
  },
  {
    label: "状态",
    text: "status",
  },
];

export default {
  components: {
    GoodsItem,
    TreeSelect,
  },
  name: "GoodsModal",
  props: {
    // 多选模式, 如果false为单选
    multiple: { type: Boolean, default: true },
    // 最大选择的数量限制, multiple模式下有效
    maxNum: { type: Number, default: 100 },
    // 默认选中的列表记录
    defaultList: { type: Array, default: () => [] },
  },
  data() {
    return {
      // table表格数据
      tableData: [],
      // 一页显示多少条数据
      perPage: 15,
      // 当前页码
      total: 0,
      // 当前表格页码数
      page: 1,
      // 搜索模块表单数据
      searchForm: {
        // 商品名称
        goodsName: "",
        // 商品分类(商品id)
        categoryId: 0,
      },
      // modal(对话框)是否可见
      visible: false,
      // loading状态
      loading: false,
      // 查询参数
      queryParam: {},
      // table表头
      columns,
      // 主键ID字段名(row-key)
      fieldName: "goods_id",
      // 已选择的元素
      selectedRowKeys: [],
      // 已选择的列表记录
      selectedItems: [],
      // 商品分类列表
      categoryListTree: [],
    };
  },
  created() {
    // 加载表格数据
    this.loadData();
    // 获取商品分类列表
    this.getCategoryList();
  },
  methods: {
    async loadData() {
      const page = this.page;
      const { data: result } = await GoodsApi.list({
        page,
        ...this.queryParam,
      });
      // 记录总条数
      this.total = result.data.list.total;
      this.tableData = result.data.list.data;
    },
    // 显示对话框
    handle() {
      // 显示窗口
      this.visible = true;
      
      this.$nextTick(() => {
        // 刷新列表数据
        // this.handleRefresh(true)
        // 设置默认数据
        this.setDefaultValue();
      });
    },
    // 设置默认数据
    setDefaultValue() {
      const { fieldName, defaultList } = this;
      if (defaultList.length) {
        this.selectedItems = cloneDeep(defaultList);
        this.selectedRowKeys = defaultList.map((item) => item[fieldName]);
      }
    },
    // 获取商品分类列表
    getCategoryList() {
      this.loading = true;
      CategoryModel.getListFromScreen()
        .then((selectList) => {
          this.categoryListTree = selectList;
        })
        .finally((result) => {
          this.loading = false;
        });
    },
    // 提交搜索模块表单
    handleSearch() {
      this.queryParam = { ...this.queryParam, ...this.searchForm };
      this.handleRefresh();
    },
    // dialog确定按钮
    handleSubmit() {
      const { selectedItems, selectedRowKeys } = this;
      // 通知父组件提交完成
      this.$emit("handleSubmit", {
        selectedItems,
        selectedRowKeys,
      });
      // 关闭对话框
      this.handleCancel();
    },
    // 选中项发生变化时的回调
    handleSelectionChange(newVal) {
      const selectedRowKeys = [];
      newVal.forEach((item) => {
        item.goods_id && selectedRowKeys.push(item.goods_id);
      });
      this.selectedRowKeys = selectedRowKeys;
      this.selectedItems = this.createSelectedItems(
        selectedRowKeys,
        this.selectedItems,
        newVal
      );
    },
    /**
     * 生成已选中的元素列表
     * @param array selectedRowKeys 当前已选中的ID集
     * @param array oldSelectedItems 已选择的列表记录 (change前)
     * @param array newSelectedItems 已选择的列表记录 (change后)
     */
    createSelectedItems(selectedRowKeys, oldSelectedItems, newSelectedItems) {
      const { fieldName } = this;
      const selectedItems = [];
      oldSelectedItems.forEach((item) => {
        // 当前已选择的商品
        if (selectedRowKeys.includes(item[fieldName])) {
          selectedItems.push(item);
        }
      });
      // 触发change之前的已选择商品的id
      const oldSelectedKeys = oldSelectedItems.map((item) => item[fieldName]);
      newSelectedItems.forEach((item) => {
        // change触发之后,change之前选择的商品不在最新选择的商品里面
        if (
          !oldSelectedKeys.includes(item[fieldName]) &&
          selectedRowKeys.includes(item[fieldName])
        ) {
          selectedItems.push(item);
        }
      });
      return selectedItems;
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.handleRefresh();
    },
    // 取消提交表单
    handleCancel() {
      this.visible = false;
      this.queryParam = {};
      this.searchForm = { categoryId: 0 };
      this.selectedItems = [];
      this.selectedRowKeys = [];
    },
    // 刷新table
    async handleRefresh() {
      this.loading = true;
      await this.loadData();
      this.loading = false;
    },
    // 点击右上角叉号关闭对话框
    handleClose(done) {
      this.handleCancel();
      done();
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