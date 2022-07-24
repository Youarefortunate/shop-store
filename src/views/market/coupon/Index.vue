<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <el-alert
        title="注：优惠券只能抵扣商品金额，最多优惠到0.01元，不能抵扣运费"
        type="warning"
        show-icon
        :closable="false"
      />
      <div class="table-operator">
        <el-row>
          <el-col :span="6">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
              >新 增</el-button
            >
          </el-col>
          <el-col :span="8" :offset="10">
            <el-input
              clearable
              size="medium"
              style="max-width: 300px; min-width: 150px; float: right"
              placeholder="请输入优惠券名称"
              suffix-icon="el-icon-search"
              v-model="queryParam.search"
              @change="onSearch"
            />
          </el-col>
        </el-row>
      </div>

      <!-- 列表内容 -->
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
          :label="item.title"
          :prop="item.dataIndex"
          :width="item.width"
        >
          <template slot-scope="scope">
            <!-- 优惠券类型 -->
            <span v-if="item.text == 'coupon_type'">
              <el-tag type="info" size="small">{{ CouponTypeEnum[scope.row.coupon_type].name }}</el-tag>
            </span>
            <!-- 最低消费金额 -->
            <span v-if="item.text == 'min_price'">
              <p class="c-p">{{ scope.row.min_price }}</p>
            </span>
            <!-- 优惠方式 -->
            <span v-if="item.text == 'discount'">
              <template v-if="scope.row.coupon_type == 10">
                <span>立减</span>
                <span class="c-p mlr-2">{{ scope.row.reduce_price }}</span>
                <span>元</span>
              </template>

              <template v-if="scope.row.coupon_type == 20">
                <span>打</span>
                <span class="c-p mlr-2">{{ scope.row.discount }}</span>
                <span>折</span>
              </template>
            </span>
            <!-- 有效期 -->
            <span v-if="item.text == 'duetime'">
              <template v-if="scope.row.expire_type == 10">
                <span>领取</span>
                <span class="c-p mlr-2">{{ scope.row.expire_day }}</span>
                <span>天内有效</span>
              </template>

              <template v-if="scope.row.expire_type == 20">
                <span>{{ scope.row.start_time }} ~ {{ scope.row.end_time }}</span>
              </template>
            </span>
            <!-- 状态 -->
            <span v-if="item.text == 'status'">
              <el-tag :type="scope.row.status ? 'success' : 'info'" size="small">{{ scope.row.status ? '显示' : '隐藏' }}</el-tag>
            </span>
            <!-- 操作 -->
            <span v-if="item.text == 'action'">
              <el-link type="primary" style="margin-right: 10px" :underline="false" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link type="primary" :underline="false" @click="handleDelete(scope.row)">删除</el-link>
            </span>
            <!-- 展示其他项 -->
            <span v-else>{{ scope.row[item.dataIndex]}}</span>
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
import * as Api from "@/api/market/coupon";
import {
  ApplyRangeEnum,
  CouponTypeEnum,
  ExpireTypeEnum,
} from "@/common/enum/coupon";

// 表头
const columns = [
  {
    title: "优惠券ID",
    dataIndex: "coupon_id",
    width: '130'
  },
  {
    title: "优惠券名称",
    dataIndex: "name",
    width: '130'
  },
  {
    title: "优惠券类型",
    text: "coupon_type",
    width: '130'
  },
  {
    title: "最低消费金额 (元)",
    text: "min_price",
    width: '150'
  },
  {
    title: "优惠方式",
    text: 'discount',
    width: '130'
  },
  {
    title: "已发放/领取数量",
    dataIndex: "receive_num",
    width: '140'
  },
  {
    title: "状态",
    text: "status",
    width: '130'
  },
  {
    title: "排序",
    dataIndex: "sort",
    width: '130'
  },
  {
    title: "添加时间",
    dataIndex: "create_time",
    width: '200'
  },
  {
    title: "操作",
    text: 'action'
  },
];
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 查询参数
      queryParam: {},
      // 枚举类
      ApplyRangeEnum,
      CouponTypeEnum,
      ExpireTypeEnum,
      // 正在加载
      loading: false,
      // 表头
      columns,
      // 一页显示多少条数据
      perPage: 15,
      // 当前
      total: 0,
      // 当前表格页码数
      page: 1,
    };
  },
  created() {
    // 加载table数据
    this.loadData()
  },
  methods: {
    // 加载table数据
    async loadData() {
      const page = this.page
      const { data: result } = await Api.list({ page, ...this.queryParam })
      // 记录总条数
      this.total = result.data.list.total
      this.tableData = result.data.list.data
    },
    // 新增优惠券
    handleAdd() {
      this.$router.push('./create')
    },
    // 搜索模块确认搜索
    onSearch() {
      this.handleRefresh()
    },
    // 编辑记录
    handleEdit(item) {
      this.$router.push({ path: './update', query: { couponId: item.coupon_id } })
    },
    // 删除记录
    handleDelete(item) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await Api.deleted({ couponId: item.coupon_id })
        this.$notify({
          type: data.status == 200 ? 'success' : 'error',
          title: '删除优惠券',
          message: data.message,
          duration: 1500
        })
        this.handleRefresh()
      }).catch(() => {});
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage;
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
        return "background: rgb(250,250,250); font-weight: 500; color: black;";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>