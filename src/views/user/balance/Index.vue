<template>
  <div id="user-balance-index">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form class="search-form" ref="SearchForm" :model="searchForm" inline>
            <el-form-item label="会员昵称: " size="small">
              <el-input v-model="searchForm.search" placeholder="请输入会员昵称" style="width: 220px; margin-right: 40px"/>
            </el-form-item>

            <el-form-item label="余额变动场景: " size="small">
              <el-select v-model="searchForm.scene" style="width: 200px; margin-right: 40px">
                <el-option label="全部" :value="0"/>
                <el-option 
                  v-for="(item, index) in SceneEnum.data"
                  :key="index"
                  :label="item.name" 
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="变动时间:" size="small">
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
            <!-- 余额变动场景 -->
            <span v-if="item.text == 'scene'">
              <el-tag type="info">{{ SceneEnum[scope.row.scene].name }}</el-tag>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as Api from '@/api/user/balance'
import SceneEnum from '@/common/enum/user/balance/log/Scene'
import UserItem from '@/components/UserItem'

export default {
  components: { UserItem },
  data() {
    // 表头
    const columns = [
      {
        label: 'ID',
        prop: 'log_id',
        width: '210'
      },
      {
        label: '会员信息',
        text: 'user',
        width: '210'
      },
      {
        label: '余额变动场景',
        text: 'scene',
        width: '210'
      },
      {
        label: '变动金额',
        prop: 'money',
        width: '210'
      },
      {
        label: '描述/说明',
        prop: 'describe',
        width: '210'
      },
      {
        label: '管理员备注',
        prop: 'remark',
        width: '210'
      },
      {
        label: '变动时间',
        prop: 'create_time'
      }
    ]
    return {
      // 表单数据
      searchForm: {
        // 会员昵称/订单号
        search: '',
        // 余额变动场景
        scene: 0,
        // 变动时间
        betweenTime: [],
      },
      // table数据
      tableData: [],
      // 表头
      columns,
      // 枚举类
      SceneEnum,
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
      const { data: result } = await Api.log({ page: 1, ...this.queryParam })
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