<template>
  <el-table
    ref="table"
    v-loading="loading"
    style="width: 100%; margin-bottom: 20px"
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
        <span v-if="item.text == 'time'">
          <span>{{ scope.row.start_time }}</span>
          <span class="ml-5 mr-5">到</span>
          <span>{{ scope.row.end_time }}</span>
        </span>
        <!-- 导出状态 -->
        <span v-if="item.text == 'status'">
          <el-tag :type="ExportStatusColorEnum[scope.row.status]">{{ ExportStatusEnum[scope.row.status].name }}</el-tag>
        </span>
        <!-- 操作 -->
        <span v-if="item.text == 'action'">
          <a
            v-if="scope.row.status == ExportStatusEnum.COMPLETED.value"
            :href="scope.row.download_url"
            target="_blank">下载</a>
        </span>
        <span  v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import * as Api from '@/api/order/export'
import { ExportStatusEnum } from '@/common/enum/order/export'

const ExportStatusColorEnum = {
  [ExportStatusEnum.NORMAL.value]: 'info',
  [ExportStatusEnum.COMPLETED.value]: 'success',
  [ExportStatusEnum.FAIL.value]: 'error',
}

  export default {
    name: 'ExportList',
    data() {
      // 表头
      const columns = [
        {
          label: '记录ID',
          prop: 'id',
          width: '300',
        },
        {
          label: '下单时间',
          text: 'time',
          width: '300',
        },
        {
          label: '导出时间',
          prop: 'create_time',
          width: '300',
        },
        {
          label: '导出状态',
          text: 'status',
          width: '300',
        },
        {
          label: '操作',
          text: 'action'
        }
      ]
      return {
        // 表格数据
        tableData: [],
        // 表格加载图标
        loading: false,
        // 表头
        columns,
        // 枚举类
        ExportStatusEnum,
        ExportStatusColorEnum,
      }
    },
    mounted() {
      this.loadData()
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.imgUrl = val
        }
      }
    },
    methods: {
      async loadData() {
        const { data: result } = await Api.list({ page: 1 })
        this.tableData = result.data.list.data
      },
      // 刷新table
      handleRefresh (bool = false) {
        this.loadData()
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