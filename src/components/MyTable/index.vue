<template>
  <div>
    <el-table
      style="width: 100%"
      v-loading="loading"
      empty-text="数据都跑空啦~"
      :row-key="rowKey"
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
        <el-table-column v-if="selection" type="selection" width="55" />
        <template slot-scope="scope">
          <slot name="content" :data="(scope.row, item)"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-if="total > pageSize"
      layout="prev, pager, next"
      background
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 行数据的 Key，用来优化 Table 的渲染
    rowKey: String,
    // 加载
    loading: Boolean,
    // 总条数
    total: Number,
    // 一页显示的条数
    pageSize: {
      type: Number,
      default: 15,
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1,
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => [],
    },
    // 表头
    columns: {
      type: Array,
      default: () => [],
    },
    // 是否显示选中
    selection: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.$emit("handleCurrentChange", newPage);
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