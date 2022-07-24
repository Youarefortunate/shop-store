<template>
  <div id="article-category-index">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <el-table 
        v-loading="loading"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :data="categoryList"
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
            <!-- 状态 -->
            <span v-if="item.text == 'status'">
              <el-tag :type="scope.row.status ? 'success' : 'info'" size="small">{{ scope.row.status ? '显示' : '隐藏' }}</el-tag>
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
import * as Api from '@/api/content/article/category'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'

// 表头
const columns = [
  {
    label: '分类ID',
    prop: 'category_id',
    width: '240'
  },
  {
    label: '分类名称',
    prop: 'name',
    width: '240'
  },
  {
    label: '状态',
    text: 'status',
    width: '240'
  },
  {
    label: '排序',
    prop: 'sort',
    width: '240'
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
      categoryList: [],
      // 查询参数
      queryParam: {},
      // 加载
      loading: false,
      // 表头
      columns,
    }
  },
  created() {
    // 获取分类列表
    this.handleRefresh()
  },
  methods: {
    // 加载表格数据
    async getCategoryList() {
      const { data: result } = await Api.list()
      this.categoryList = result.data.list
    },
    // 新增文章分类
    handleAdd() {
      this.$refs.AddForm.add()
    },
    /**
     * 编辑文章分类
     */
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },
    // 删除文章分类
    handleDelete(item) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await Api.deleted({ categoryId: item['category_id'] })
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
      await this.getCategoryList()
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
</style>