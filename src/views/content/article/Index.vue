<template>
  <div id="content-article-index">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form class="search-form" ref="SearchForm" :model="searchForm" inline>
            <el-form-item label="文章标题: " size="small">
              <el-input v-model="searchForm.title" placeholder="请输入文章标题" style="width: 200px; margin-right: 40px"/>
            </el-form-item>

            <el-form-item label="文章分类: " size="small">
              <el-select v-model="searchForm.categoryId" style="width: 200px; margin-right: 40px">
                <el-option label="全部" :value="-1"/>
                <el-option 
                  v-for="(item, index) in categoryList"
                  :key="index"
                  :label="item.name" 
                  :value="item.category_id"/>
              </el-select>
            </el-form-item>

            <el-form-item label="状态: " size="small">
              <el-select v-model="searchForm.status" style="width: 200px; margin-right: 40px">
                <el-option label="全部" :value="-1"/>
                <el-option label="显示" :value="1"/>
                <el-option label="隐藏" :value="0"/>
              </el-select>
            </el-form-item>

            <el-form-item class="search-btn" size="small">
              <el-button type="primary" icon="el-icon-search" @click="handleSubmit" style="margin-left: 10px">搜 索</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 操作板块 -->
        <div class="row-item-tab clearfix">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
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
            <!-- 文章封面图 -->
            <span v-if="item.text == 'image_url'">
              <a :href="scope.row.image_url" title="点击查看原图" target="_blank">
                <el-image 
                  fit="contain"
                  class="twoline-hide" 
                  style="width: 60px; height: 60px" 
                  :src="scope.row.image_url" alt="封面图"/>
              </a>
            </span>
            <!-- 文章标题 -->
            <span v-if="item.text == 'stitle'">
              <div class="twoline-hide" >{{ scope.row.title }}</div>
            </span>
            <!-- 所属分类 -->
            <span v-if="item.text == 'category'">{{ scope.row.category.name }}</span>
            <!-- 状态 -->
            <span v-if="item.text == 'status'">
              <el-tag :type="scope.row.status ? 'success' : 'info'">{{ scope.row.status ? '显示' : '隐藏' }}</el-tag>
            </span>
            <!-- 操作 -->
            <span v-if="item.text == 'action'">
              <el-link type="primary" style="margin-right: 10px" :underline="false" @click="handleEdit(scope.row)">编辑</el-link>
              <el-link type="primary" :underline="false" @click="handleDelete(scope.row)">删除</el-link>
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
      <AddForm ref="AddForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
      <EditForm ref="EditForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as ArticleApi from '@/api/content/article'
import * as CategoryApi from '@/api/content/article/category'
import EditForm from './modules/EditForm'
import AddForm from './modules/AddForm'

// 表格表头
const columns = [
  {
    label: 'ID',
    prop: 'article_id',
    width: '100'
  },
  {
    label: '封面图',
    text: 'image_url',
    width: '180'
  },
  {
    label: '文章标题',
    text: 'stitle',
    width: '200'
  },
  {
    label: '所属分类',
    text: 'category',
    width: '120'
  },
  {
    label: '状态',
    text: 'status',
    width: '140'
  },
  {
    label: '排序',
    prop: 'sort',
    width: '140'
  },
  {
    label: '创建时间',
    prop: 'create_time',
    width: '200'
  },
  {
    label: '更新时间',
    prop: 'update_time',
    width: '200'
  },
  {
    label: '操作',
    text: 'action'
  }
]
export default {
  components: { EditForm, AddForm },
  data() {
    return {
      // 表单数据
      searchForm: {
        // 文章标题
        title: '',
        // 文章分类
        categoryId: -1,
        // 支付方式
        status: -1,
      },
      // 表格数据
      tableData: [],
      // 分类列表
      categoryList: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      loading: false,
      // 表头
      columns,
      // 一页显示多少条数据
      perPage: 15,
      // 总条数
      total: 0,
      // 页码
      page: 1,
    }
  },
  created () {
    // 获取表格数据
    this.handleRefresh()
    // 获取分类列表
    this.getCategoryList()
  },
  methods: {
    // 加载数据
    async loadData() {
      const page = this.page
      const { data: result } = await ArticleApi.list({ page, ...this.queryParam })
      // 记录总条数
      this.total = result.data.list.total
      this.tableData = result.data.list.data
    },
    // 获取分类列表
    async getCategoryList() {
      const { data: result } = await CategoryApi.list()
      this.categoryList = result.data.list
    },
    // 提交搜索模块
    handleSubmit() {
      this.$refs.SearchForm.validate((valid) => {
        if(valid) {
          this.queryParam = { ...this.queryParam, ...this.searchForm }
          this.handleRefresh()
        }
      })
    },
    // 新增文章
    handleAdd() {
      this.$refs.AddForm.add()
    },
    // 编辑文章
    handleEdit(item) {
      this.$refs.EditForm.edit(item.article_id)
    },
    // 删除文章
    handleDelete(item) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await ArticleApi.deleted({ articleId: item.article_id })
        this.$notify({
          type: data.status == 200 ? 'success' : 'error',
          title: '删除文章',
          message: data.message,
          showClose: true,
          duration: 1500
        })
        this.handleRefresh()
      }).catch(() => {});
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage
      this.handleRefresh()
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
#content-article-index {
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}

</style>