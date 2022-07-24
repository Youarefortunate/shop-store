<template>
  <div id="user-recharge-index">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form class="search-form" ref="SearchForm" :model="searchForm" inline>
            <el-form-item label="会员昵称/订单号: " size="small">
              <el-input v-model="searchForm.search" placeholder="请输入会员昵称/订单号" style="width: 220px; margin-right: 40px"/>
            </el-form-item>

            <el-form-item label="充值方式: " size="small">
              <el-select v-model="searchForm.recharge_type" style="width: 200px; margin-right: 40px">
                <el-option label="全部" :value="0"/>
                <el-option 
                  v-for="(item, index) in RechargeTypeEnum.data"
                  :key="index"
                  :label="item.name" 
                  :value="item.value"/>
              </el-select>
            </el-form-item>

            <el-form-item label="支付方式: " size="small">
              <el-select v-model="searchForm.pay_status" style="width: 200px; margin-right: 40px">
                <el-option label="全部" :value="0"/>
                <el-option label="待支付" :value="10"/>
                <el-option label="已支付" :value="20"/>
              </el-select>
            </el-form-item>

            <el-form-item label="付款时间:" size="small">
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
              <el-button type="primary" icon="el-icon-search" @click="handleSubmit" style="margin-left: 10px">搜 索</el-button>
            </el-form-item>
          </el-form>
        </el-row>
      </div>

      <!-- 表格 -->
      <el-table 
        v-loading="loading"
        style="width: 100%"
        height="150"
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
            <!-- 套餐名称 -->
            <span v-if="item.text == 'order_plan'">
              <el-tag v-if="scope.row.order_plan" type="info">{{ scope.row.order_plan.plan_name }}</el-tag>
              <span v-else>--</span>
            </span>
            <!-- 充值方式 -->
            <span v-if="item.text == 'recharge_type'">
              <el-tag type="info">{{ RechargeTypeEnum[scope.row.recharge_type].name }}</el-tag>
            </span>
            <!-- 状态 -->
            <span v-if="item.text == 'pay_status'">
              <el-tag :type="scope.row.pay_status == 20 ? 'success' : 'info'">{{ scope.row.pay_status == 20 ? '已支付' : '待支付' }}</el-tag>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as Api from '@/api/user/recharge'
import PayStatusEnum from '@/common/enum/recharge/order/PayStatus'
import RechargeTypeEnum from '@/common/enum/recharge/order/RechargeType'
import UserItem from '@/components/UserItem'

export default {
  components: { UserItem },
  data() {
    // 表头
    const columns = [
      {
        label: 'ID',
        prop: 'order_id',
        width: '140'
      },
      {
        label: '会员信息',
        text: 'user',
        width: '140'
      },
      {
        label: '订单号',
        prop: 'order_no',
        width: '140'
      },
      {
        label: '充值方式',
        text: 'recharge_type',
        width: '140'
      },
      {
        label: '套餐名称',
        text: 'order_plan',
        width: '140'
      },
      {
        label: '支付金额',
        prop: 'pay_price',
        width: '140'
      },
      {
        label: '赠送金额',
        prop: 'gift_money',
        width: '140'
      },
      {
        label: '支付状态',
        text: 'pay_status',
        width: '140'
      },
      {
        label: '付款时间',
        prop: 'pay_time',
        width: '140'
      },
      {
        label: '创建时间',
        prop: 'create_time'
      }
    ]
    return {
      // 表单数据
      searchForm: {
        // 会员昵称/订单号
        search: '',
        // 充值方式
        recharge_type: 0,
        // 支付方式
        pay_status: 0,
        // 付款时间
        betweenTime: [],
      },
      // table数据
      tableData: [],
      // 表头
      columns,
      // 枚举类
      PayStatusEnum,
      RechargeTypeEnum,
      // 查询参数
      queryParam: {},
      // 正在加载
      loading: false,
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async loadData() {
      const { data: result } = await Api.order({ page: 1, ...this.queryParam })
      this.tableData = result.data.list.data
    },
    // 搜索
    handleSubmit() {
      this.$refs.SearchForm.validate((valid) => {
        if(valid) {
          this.queryParam = { ...this.queryParam, ...this.searchForm }
          this.handleRefresh()
        }
      })
    },
    // 刷新table
    async handleRefresh() {
      this.loading = true;
      await this.loadData()
      this.loading = false;
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(246,246,246); fontWeight: 500; color: black";
      }
    },
  }
}
</script>

<style lang="scss" scoped>
</style>