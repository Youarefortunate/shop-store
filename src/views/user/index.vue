<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form class="search-form" ref="SearchForm" :model="searchForm" inline>
            <el-form-item label="昵称/手机号: " size="small">
              <el-input v-model="searchForm.search" placeholder="请输入昵称/手机号" style="width: 220px; margin-right: 10px"/>
            </el-form-item>

            <el-form-item label="会员等级: " size="small">
              <el-select v-model="searchForm.gradeId" style="width: 200px; margin-right: 10px">
                <el-option label="全部" :value="0"/>
                <el-option 
                  v-for="(item, index) in gradeList"
                  :key="index"
                  :label="item.name" 
                  :value="item.grade_id"/>
              </el-select>
            </el-form-item>

            <el-form-item label="注册时间:" size="small">
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
            <!-- 会员头像 -->
            <span v-if="item.text == 'avatar_url'">
              <div class="avatar">
                <el-image v-if="scope.row.avatar_url" style="width: 45px; height: 45px" :src="scope.row.avatar_url" fit="cover" alt="用户头像"/>
                <el-image v-else style="width: 45px; height: 45px" src="~@/assets/img/default-avatar.png" fit="cover" alt="用户头像"/>
              </div>
            </span>
            <!-- 昵称/手机号 -->
            <span v-if="item.text == 'main_info'">
              <div>{{ scope.row.nick_name }}</div>
              <div>{{ scope.row.mobile }}</div>
            </span>
            <!-- 会员等级(grade) -->
            <span v-if="item.text == 'grade'">
              <el-tag v-if="scope.row.name" type="info">{{ scope.row.name }}</el-tag>
              <span v-else>--</span>
            </span>
            <!-- 余额/积分 -->
            <span v-if="item.text == 'balance'">
              <div>
                <span>余额: </span>
                <span>{{ scope.row.balance }}</span>
              </div>
              <div>
                <span>积分: </span>
                <span>{{ scope.row.points }}</span>
              </div>
            </span>
            <!-- 实际消费金额 -->
            <span v-if="item.text == 'expend_money'">
              <span>{{ scope.row.expend_money }}</span>
            </span>
            <!-- 注册来源 -->
            <span v-if="item.text == 'platform'">
              <div v-if="PlatformIcons[scope.row.platform]">
                <el-tooltip class="item" effect="dark" :content="PlatformName[scope.row.platform]" placement="top">
                  <i :class="scope.row.platform" :component="PlatformIcons[scope.row.platform]"></i>
                </el-tooltip>
              </div>
            </span>
            <!-- 操作 -->
            <span v-if="item.text == 'action'">
              <a title="会员充值" @click="handleRecharge(scope.row)">充值</a>
              <a title="会员等级" @click="handleGrade(scope.row)">等级</a>
              <a @click="handleDelete(scope.row)">删除</a>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <GradeForm ref="GradeForm" :gradeList="gradeList" @handleSubmit="handleRefresh" />
      <RechargeForm ref="RechargeForm" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as Api from '@/api/user/index'
import * as GradeApi from '@/api/user/grade'
import { GradeForm, RechargeForm } from './modules'
import { mpweixin, h5, app } from '@/core/icons'

// 注册来源名称
const PlatformName = {
  'MP-WEIXIN': '微信小程序',
  'H5': 'H5',
  'APP': 'APP'
}

// 注册来源图标
const PlatformIcons = {
  'MP-WEIXIN': mpweixin,
  'H5': h5,
  'APP': app
}
// 表头
const columns = [
  {
    label: '会员ID',
    prop: 'user_id',
    width: '160'
  },
  {
    label: '会员头像',
    text: 'avatar_url',
    width: '160'
  },
  {
    label: '昵称/手机号',
    text: 'main_info',
    width: '160'
  },
  {
    label: '会员等级',
    text: 'grade',
    width: '160'
  },
  {
    label: '余额/积分',
    text: 'balance',
    width: '160'
  },
  {
    label: '实际消费金额',
    text: 'expend_money',
    width: '160'
  },
  {
    label: '注册来源',
    text: 'platform',
    width: '160'
  },
  {
    label: '注册时间',
    prop: 'create_time',
    width: '160'
  },
  {
    label: '操作',
    text: 'action'
  }
]

export default {
  components: { GradeForm, RechargeForm }, 
  data() {
    return {
      // 注册来源名称
      PlatformName,
      // 注册来源图标
      PlatformIcons,
      // 搜索模块表单
      searchForm: {
        // 昵称/手机号
        search: '',
        // 会员等级
        gradeId: 0,
        // 注册时间
        betweenTime: []
      },
      // 查询参数
      queryParam: {},
      // 表格数据
      tableData: [],
      // 表头
      columns,
      // 正在加载
      loading: false,
      // 会员等级列表
      gradeList: []
    };
  },
  created() {
    this.loadData()
    // 获取会员等级列表
    this.getGradeList()
  },
  methods: {
    // 加载数据
    async loadData() {
      const { data: result } = await Api.list({ page: 1, ...this.queryParam});
      this.tableData = result.data.list.data
    },
    // 获取会员等级列表
    async getGradeList() {
      const { data: result } = await GradeApi.all()
      this.gradeList = result.data.list
    },
    // 提交搜索模块表单
    handleSubmit() {
      this.$refs.SearchForm.validate((valid) => {
        if(valid) {
          this.queryParam = { ...this.queryParam, ...this.searchForm }
          this.handleRefresh()
        }
      })
    },
    // 会员充值
    handleRecharge(item) {
      this.$refs.RechargeForm.handle(item)
    },
    // 修改会员等级
    handleGrade(item) {
      this.$refs.GradeForm.handle(item)
    },
    // 删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该文件, 删除后不可恢复,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data } = await Api.deleted({ userId: item.user_id })
          this.handleRefresh()
          this.$$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '删除记录',
            message: data.message,
            showClose: true,
            duration: 1500
          })
        }).catch(() => {});
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
  },
};
</script>

<style lang="scss" scoped>
.table-operator {
  margin-bottom: 20px;
}
</style>