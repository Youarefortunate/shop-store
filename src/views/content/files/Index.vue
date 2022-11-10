<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form class="search-form" ref="SearchForm" :model="searchForm" inline>
            <el-form-item label="文件名称: " size="small">
              <el-input v-model="searchForm.fileName" placeholder="请输入文件名称" style="width: 220px" clearable/>
            </el-form-item>

            <el-form-item label="文件分组: " size="small">
              <!-- 封装组件 tree-select 请看: https://zhuanlan.zhihu.com/p/415995268 -->
              <tree-select
                style="width: 220px"
                v-model="searchForm.groupId"
                :selectValue="searchForm.groupId"
                :treeData="groupListTreeSelect"
              />
            </el-form-item>

            <el-form-item label="存储方式: " size="small">
              <el-select v-model="searchForm.storage" style="width: 220px" placeholder="请选择存储方式" clearable>
                <el-option label="全部" value=""/>
                <el-option 
                  v-for="(item, index) in StorageEnum.data"
                  :key="index"
                  :label="item.name" 
                  :value="item.value"/>
              </el-select>
            </el-form-item>

            <el-form-item label="上传来源: " size="small">
              <el-select v-model="searchForm.channel" style="width: 220px" placeholder="请选择上传来源" clearable>
                <el-option label="全部" :value="-1"/>
                <el-option 
                  v-for="(item, index) in ChannelEnum.data"
                  :key="index"
                  :label="item.name" 
                  :value="item.value"/>
              </el-select>
            </el-form-item>

            <el-form-item class="search-btn" size="small">
              <el-button type="primary" icon="el-icon-search" @click="handleSubmit" style="margin-left: 10px">搜 索</el-button>
            </el-form-item>
          </el-form>
        </el-row>

        <!-- 操作板块 -->
        <div class="row-item-tab">
          <div class="tab-list">
            <el-radio-group
              v-model="queryParam.fileType"
              size="small"
              @change="handleTabs"
            >
              <el-radio-button :label="-1">全部</el-radio-button>
              <el-radio-button
                v-for="(item, index) in FileTypeEnum.data"
                :key="index"
                :label="item.value"
              >{{ item.name }}</el-radio-button>
            </el-radio-group>
          </div>
          <div v-if="selectedRowKeys.length" class="button-group">
            <el-button
              size="small"
              icon="el-icon-scissors"
              @click="handleBatchMove"
              >移动</el-button
            >
            <el-button
              size="small"
              icon="el-icon-delete"
              @click="handleBatchDelete"
              >删除</el-button
            >
          </div>
        </div>
      </div>
      <!-- 列表内容 -->
      <el-table 
        v-loading="loading"
        style="width: 100%"
        empty-text="数据都跑空啦~"
        :data="tableData"
        :header-cell-style="getRowClass"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <!-- 文件预览 -->
            <span v-if="item.text == 'preview_url'">
              <a :href="scope.row.external_url" target="_blank">
                <el-image 
                  fit="contain"
                  class="twoline-hide" 
                  style="width: 80px; height: 80px" 
                  :src="scope.row.preview_url"/>
              </a>
            </span>
            <!-- 存储方式 -->
            <span v-if="item.text == 'storage'">
              <el-tag type="info">{{ StorageEnum[scope.row.storage].name }}</el-tag>
            </span>
            <!-- 文件类型 -->
            <span v-if="item.text == 'file_type'">
              <el-tag type="info">{{ FileTypeEnum[scope.row.file_type].name }}</el-tag>
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
      <!-- 移动分组 -->
      <MoveGroupForm ref="MoveGroupForm" :groupList="groupListTree" @handleSubmit="handleRefresh" />
      <!-- 编辑记录 -->
      <EditForm ref="EditForm" :groupList="groupListTree" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as Api from '@/api/files'
import * as GroupApi from '@/api/files/group'
import { TreeSelect }  from '@/components'
import MoveGroupForm from './modules/MoveGroupForm'
import EditForm from './modules/EditForm'
import FileTypeEnum from '@/common/enum/file/FileType'
import StorageEnum from '@/common/enum/file/Storage'
import ChannelEnum from '@/common/enum/file/Channel'

// 表头
const columns = [
  {
    label: '文件ID',
    prop: 'file_id',
    width: '100',
  },
  {
    label: '文件预览',
    text: 'preview_url',
    width: '160',
  },
  {
    label: '文件名称',
    prop: 'file_name',
    width: '280',
  },
  {
    label: '存储方式',
    text: 'storage',
    width: '120',
  },
  {
    label: '文件类型',
    text: 'file_type',
    width: '120',
  },
  {
    label: '文件大小(字节)',
    prop: 'file_size',
    width: '120',
  },
  {
    label: '文件后缀',
    prop: 'file_ext',
    width: '120',
  },
  {
    label: '上传时间',
    prop: 'create_time',
    width: '200',
  },
  {
    label: '操作',
    text: 'action'
  }
]
export default {
  components: { 
    MoveGroupForm,
    EditForm,
    TreeSelect 
  },
  data() {
    return {
      // 枚举数据
      FileTypeEnum,
      StorageEnum,
      ChannelEnum,
      // 搜素表单
      searchForm: {
        // 文件名称
        fileName: '',
        // 文件分组
        groupId: -1,
        // 存储方式
        storage: '',
        // 上传来源
        channel: -1,
      },
      // 加载
      loading: false,
      // 查询参数
      queryParam: { fileType: -1 },
      // 选中的行
      selectedRowKeys: [],
      // 文件分组列表(树状结构)
      groupListTree: [],
      // 文件分组列表(用于筛选组件)
      groupListTreeSelect: [],
      // 表头
      columns,
      // table表格数据
      tableData: [],
      // 一页显示多少条数据
      perPage: 15,
      // 当前
      total: 0,
      // 当前表格页码数
      page: 1,
    }
  },
  created() {
    // 加载table数据
    this.loadData()
    // 获取分组列表
    this.getGroupList()
  },
  methods: {
    // 加载数据
    async loadData() {
      const page = this.page
      const { data: result } = await Api.list({ page, ...this.queryParam })
      // 记录总条数
      this.total = result.data.list.total
      this.tableData = result.data.list.data
    },
    // 获取分组列表
    async getGroupList() {
      this.loading = true
      const { data: result } = await GroupApi.list()
      const { list } = result.data
      // 格式化分组列表
      const groupListTree = this.formatTreeData(list)
      // 记录到data
      this.groupListTree = groupListTree
      this.groupListTreeSelect = [
        {
          label: '全部',
          key: -1,
          value: -1,
        },
        {
          label: '未分组',
          key: 0,
          value: 0,
        }
      ].concat(groupListTree)
      this.loading = false
    },
    // 格式化分组列表
    formatTreeData(list) {
      const data = []
      list.forEach(item => {
        const newItem = {
          label: item.name,
          key: item.group_id,
          value: item.group_id
        }
        // 递归子集
        if(item.children && item.children.length) {
          newItem['children'] = this.formatTreeData(item.children)
        }
        data.push(newItem)
      });
      return data
    },
    // tabs切换
    handleTabs(value) {
      this.queryParam.fileType = value
      this.handleRefresh()
    },
    // 编辑记录
    handleEdit(item) {
      this.$refs.EditForm.edit(item)
    },
    // 批量移动文件
    handleBatchMove() {
      this.$refs.MoveGroupForm.show(this.selectedRowKeys)
    },
    // 删除记录
    handleDelete(item) {
      this.onDelete([item['file_id']])
    },
    // 批量删除选择的文件
    handleBatchDelete() {
      this.onDelete(this.selectedRowKeys)
    },
    // 执行删除操作
    onDelete(fileIds) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await Api.deleted({ fileIds })
        this.$notify({
          type: data.status == 200 ? 'success' : 'error',
          title: '删除文件',
          message: data.message,
          duration: 1500
        })
        this.handleRefresh()
      }).catch(() => {});
    },
    // 选中项发生变化时的回调
    handleSelectionChange(val) { 
      const keys = [];
      val.forEach((item) => {
        item.file_id && keys.push(item.file_id);
      });
      this.selectedRowKeys = keys;
    },
    // 搜索模块确认搜索
    handleSubmit() {
      this.queryParam = { ...this.queryParam, ...this.searchForm }
      this.handleRefresh()
    },
    // 页码发生改变
    handleCurrentChange(newPage) {
      this.page = newPage
      this.handleRefresh()
    }, 
    // 刷新table
    async handleRefresh() {
      this.loading =  true
      this.selectedRowKeys = [];
      await this.loadData();
      this.loading =  false 
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(250,250,250); font-weight: 500; color: black;";
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.row-item-tab {
  display: flex;
  margin-bottom: 30px;
  .tab-list {
    margin-right: 18px;
  }
}
.button-group {
  margin-left: 15px;
  .el-button {
    height: 32px;
    line-height: 2px;
    margin: 0;
    border-radius: 0;
  }
}
</style>