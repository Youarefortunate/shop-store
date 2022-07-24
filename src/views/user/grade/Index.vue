<template>
  <div id="user-grade">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
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
            <!-- 升级条件 -->
            <span v-if="item.text == 'upgrade'">消费满{{ scope.row.expend_money }}元</span>
            <!-- 等级权益 -->
            <span v-if="item.text == 'equity'">{{ scope.row.equity.discount }}折</span>
            <!-- 状态 -->
            <span v-if="item.text == 'status'">
              <el-tag :type="scope.row.status ? 'success' : 'info'" size="small">{{ scope.row.status ? '启用' : '禁用' }}</el-tag>
            </span>
            <!-- 操作 -->
            <span v-if="item.text == 'action'">
              <el-link type="primary" style="margin-right: 10px" :underline="false" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link type="primary" :underline="false" @click="handleDelete(scope.row)">删除</el-link>
            </span>
            <!-- 展示其他未满足条件的项 -->
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
      <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as Api from '@/api/user/grade'
import { AddForm, EditForm } from './modules'
// 表头
const columns = [
  {
    label: '等级ID',
    prop: 'grade_id',
    width: '150'
  },
  {
    label: '等级名称',
    prop: 'name',
    width: '150'
  },
  {
    label: '等级权重',
    prop: 'weight',
    width: '150'
  },
  {
    label: '升级条件',
    text: 'upgrade',
    width: '150'
  },
  {
    label: '等级权益',
    text: 'equity',
    width: '150'
  },
  {
    label: '状态',
    text: 'status',
    width: '150'
  },
  {
    label: '添加时间',
    prop: 'create_time',
    width: '300'
  },
  {
    label: '操作',
    text: 'action'
  }
]
export default {
  components: { AddForm, EditForm },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      loading: false,
      // 表头
      columns,
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async loadData() {
      const { data: result } = await Api.list({ page: 1, ...this.queryParam })
      this.tableData = result.data.list.data
    },
    // 新增等级
    handleAdd() {
      this.$refs.AddForm.add()
    },
    /**
     * 编辑记录
     */
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },
    // 删除等级
    handleDelete(item) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await Api.deleted({ gradeId: item.grade_id })
        this.$notify({
          type: data.status == 200 ? 'success' : 'error',
          title: '删除会员等级',
          message: data.message,
          showClose: true,
          duration: 1500
        })
        this.handleRefresh()
      }).catch(() => {})
    },
    // 刷新table
    async handleRefresh() {
      this.loading = true
      await this.loadData()
      this.loading = false
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(246,246,246); fontWeight: 500; color: black";
      }
    },
  }
};
</script>

<style lang="scss" scoped>
#user-grade {
  .table-operator .el-button {
    height: 32px;
    border-radius: 1px;
    padding: 10px 15px;
    margin-bottom: 18px;
  }
}
</style>