<template>
  <div id="comment">
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索模板 -->
        <el-row class="row-item-search">
          <el-form :model="searchForm" ref="form" class="search-form" inline>
            <el-form-item label="商品名称: " size="small">
              <el-input
                v-model="searchForm.goodsName"
                placeholder="请输入商品名称/编码"
              />
            </el-form-item>

            <el-form-item label="订单号: " size="small">
              <el-input
                v-model="searchForm.orderNo"
                placeholder="请输入订单号"
              />
            </el-form-item>

            <el-form-item label="会员ID: " size="small">
              <el-input
                v-model="searchForm.userId"
                placeholder="请输入会员ID"
              />
            </el-form-item>

            <el-form-item label="状态: " size="small">
              <el-select v-model="searchForm.status">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="显示" :value="1"></el-option>
                <el-option label="隐藏" :value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="search-btn">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 操作模板 -->
        <div class="row-item-tab clearfix">
          <div class="tab-list fl-l">
            <el-radio-group
              v-model="queryParam.score"
              size="small"
              @change="handleTabs"
            >
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="10">好评</el-radio-button>
              <el-radio-button :label="20">中评</el-radio-button>
              <el-radio-button :label="30">差评</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <!-- table表格 -->
      <el-table
        empty-text="数据都跑空啦~"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        row-key="comment_id"
        :header-cell-style="getRowClass"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        >
          <template slot-scope="scope">
            <!-- 商品信息 -->
            <span v-if="item.text == 'orderGoods'">
              <goods-item
                :data="{
                  image: scope.row.goods_image,
                  imageAlt: '商品图片',
                  title: scope.row.goods_name,
                  goodsProps: scope.row.goods_props,
                }"
              />
            </span>
            <!-- 买家 -->
            <span v-if="item.text == 'user'">
              <p>{{ scope.row.nick_name }}</p>
              <p>
                <span style="font-size: 12px; color: #7b7b7b">(ID: 11649)</span>
              </p>
            </span>
            <!-- 评分 -->
            <span v-if="item.text == 'score'">
              <el-tag
                :type="
                  { 10: 'success', 20: 'info', 30: 'error' }[scope.row.score]
                "
                >{{
                  { 10: "好评", 20: "中评", 30: "差评" }[scope.row.score]
                }}</el-tag
              >
            </span>
            <!-- 评价内容 -->
            <span v-if="item.text == 'content'">
              <p class="twoline-hide" style="width: 270px">
                {{ scope.row.content }}
              </p>
            </span>
            <!-- 图片评价 -->
            <span v-if="item.text == 'is_picture'">
              <el-tag :type="scope.row.is_picture ? 'success' : 'info'">{{
                scope.row.is_picture ? "显示" : "隐藏"
              }}</el-tag>
            </span>
            <!-- 状态 -->
            <span v-if="item.text == 'status'">
              <el-tag :type="scope.row.status ? 'success' : 'info'">{{
                scope.row.status ? "显示" : "隐藏"
              }}</el-tag>
            </span>
            <!-- 操作项 -->
            <span v-if="item.text == 'action'">
              <el-link
                type="primary"
                style="margin-right: 8px"
                @click="handleEdit(scope.row)"
                :underline="false"
                >编辑</el-link
              >
              <el-link
                type="primary"
                @click="handleDelete(scope.row)"
                :underline="false"
                >删除</el-link
              >
            </span>
            <span>{{ scope.row[item] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    </el-card>
  </div>
</template>

<script>
import * as CommentApi from "@/api/goods/comment";
import GoodsItem from "@/components/GoodsItem";
import EditForm from './modules/EditForm'

export default {
  name: "Index",
  components: { GoodsItem, EditForm },
  data() {
    const columns = [
      {
        label: 'ID',
        prop: 'comment_id',
        width: '100px',
        text: 'comment_id'
      },
      {
        label: '商品信息',
        prop: 'orderGoods',
        width: '150px',
        text: 'orderGoods'
      },
      {
        label: '买家',
        prop: 'user',
        width: '150px',
        text: 'user'
      },
      {
        label: '评分',
        prop: 'score',
        width: '100px',
        text: 'score'
      },
      {
        label: '评论内容',
        prop: 'content',
        width: '200px',
        text: 'content'
      },
      {
        label: '图片评价',
        prop: 'is_picture',
        width: '200px',
        text: 'is_picture'
      },
      {
        label: '状态',
        prop: 'status',
        width: '100px',
        text: 'status'
      },
      {
        label: '排序',
        prop: 'sort',
        width: '100px',
        text: 'sort'
      },
      {
        label: '评价时间',
        prop: 'create_time',
        width: '200px',
        text: 'comment_id'
      },
      {
        label: '操作',
        prop: 'action',
        text: 'action'
      },
    ]
    return {
      // 搜索输入框表单
      searchForm: {
        goodsName: "",
        // 订单号
        orderNo: "",
        // 会员ID
        userId: "",
        status: -1,
      },
      // 查询参数
      queryParam: {
        score: 0
      },
      // 表格数据
      tableData: [],
      // 评价分类列表
      categoryListTree: [],
      loading: false,
      columns,
    };
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true;
      const { data: result }= await CommentApi.list({ page: 1, ...this.queryParam })
      this.loading = false;
      this.tableData = result.data.list.data;
    },
    // 回车或者输入框失去焦点触发事件
    handleSearch() {
      this.queryParam = { ...this.queryParam, ...this.searchForm }
      this.handleRefresh(true)
    },
    // 操作模板tabs按钮发生改变,回调参数是点击的tabs绑定的值
    handleTabs(value) {
      this.queryParam.score = value;
      this.handleRefresh(true)
    },
    // 编辑评论
    handleEdit(record) {
      this.$refs.EditForm.edit(record.comment_id)
    },
    // 删除评论
    handleDelete(record) {
      this.$confirm('你确定要删除该记录嘛, 删除后不可恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await CommentApi.deleted({ commentId: record.comment_id })
        this.$notify({
          type: data.status == 200 ? 'success' : 'error',
          title: '删除商品评论',
          message: data.message,
          showClose: true,
          duration: 1000
        })
        this.handleRefresh()
      }).catch(() => {})
    },
    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.loadData();
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(250,250,250); font-weight: 500; color: black";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#comment::v-deep {
  .card-title {
    font-size: 14.5px;
    margin-bottom: 18px;
    color: rgba(0, 0, 0, 0.75);
  }
  .table-operator {
    .row-item-tab {
      .tab-list { 
        .el-radio-group {
          margin-bottom: 20px;
        }
      }
    }
  }
  .row-item-search {
    // 表单
    .search-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 25px;
        .el-button {
          height: 32px;
          border-radius: 2px;
          display: flex;
          align-items: center;
        }
      }
      .el-form-item__label {
        font-weight: 500;
      }
    }
  }
}
</style>