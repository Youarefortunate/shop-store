<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form
            inline
            class="search-form"
            ref="SearchForm"
            :model="searchForm"
          >
            <el-form-item label="优惠券名称: " size="small">
              <el-input
                v-model="searchForm.couponName"
                placeholder="请输入优惠券名称"
                style="width: 220px; margin-right: 10px"
              />
            </el-form-item>

            <el-form-item label="会员昵称: " size="small">
              <el-input
                v-model="searchForm.nickName"
                placeholder="请输入会员昵称"
                style="width: 220px; margin-right: 10px"
              />
            </el-form-item>

            <el-form-item label="领取时间:" size="small">
              <el-date-picker
                v-model="searchForm.betweenTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item class="search-btn" size="small">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
                style="margin-left: 10px"
                >搜 索</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
      </div>
      <!-- 表格 -->
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
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <!-- 会员信息 -->
            <span v-if="item.text == 'user'">
              <UserItem :user="scope.row" />
            </span>
            <!-- 优惠券类型 -->
            <span v-if="item.text == 'coupon_type'">
              <el-tag type="info" size="small">{{
                CouponTypeEnum[scope.row.coupon_type].name
              }}</el-tag>
            </span>
            <!-- 最低消费金额 -->
            <span v-if="item.text == 'min_price'">
              <div class="c-p">{{ scope.row.min_price }}</div>
            </span>
            <!-- 优惠方式 -->
            <span v-if="item.text == 'discount'">
              <template
                v-if="
                  scope.row.coupon_type == CouponTypeEnum.FULL_DISCOUNT.value
                "
              >
                <span>立减</span>
                <span class="c-p mlr-2">{{ scope.row.reduce_price }}</span>
                <span>元</span>
              </template>
              <template
                v-if="scope.row.coupon_type == CouponTypeEnum.DISCOUNT.value"
              >
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
                <span
                  >{{ scope.row.start_time }} ~ {{ scope.row.end_time }}</span
                >
              </template>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
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
import UserItem from "@/components/UserItem";
import { CouponTypeEnum } from "@/common/enum/coupon";

// 表头
const columns = [
  {
    label: "ID",
    prop: "user_coupon_id",
    width: '120'
  },
  {
    label: "会员信息",
    text: "user",
    width: '160'
  },
  {
    label: "优惠券名称",
    prop: "name",
    width: '200'
  },
  {
    label: "优惠券类型",
    text: "coupon_type",
    width: '200'
  },
  {
    label: "最低消费金额 (元)",
    text: "min_price",
    width: '250'
  },
  {
    label: "优惠方式",
    text: "discount",
    width: '160'
  },
  {
    label: "有效期",
    text: "duetime",
    width: '180'
  },
  {
    label: "领取时间",
    prop: "create_time",
  },
];

export default {
  components: { UserItem },
  data() {
    return {
      // 搜索模块表单
      searchForm: {},
      // 枚举类
      CouponTypeEnum,
      // 查询参数
      queryParam: {},
      // 表格数据
      tableData: [],
      // 一页显示多少条数据
      perPage: 15,
      // 当前
      total: 0,
      // 当前表格页码数
      page: 1,
      // 表头
      columns,
      // 正在加载
      loading: false,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载数据
    async loadData() {
      const page = this.page;
      const { data: result } = await Api.receive({ page, ...this.queryParam });
      // 记录总条数
      this.total = result.data.list.total;
      this.tableData = result.data.list.data;
    },
    // 提交搜索模块表单
    handleSearch() {
      this.queryParam = { ...this.queryParam, ...this.searchForm };
      this.handleRefresh();
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
        return "background: rgb(246,246,246); fontWeight: 500; color: black";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-operator {
  margin-bottom: 20px;
}
</style>